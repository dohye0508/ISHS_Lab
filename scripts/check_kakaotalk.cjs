/* Sanity checks for the KakaoTalk analyzer (kakaotalk.php).
 *
 *   node scripts/check_kakaotalk.cjs                 # synthetic fixtures only
 *   node scripts/check_kakaotalk.cjs chat1.txt ...   # also cross-checks real export files
 *
 * Real exports are never committed (see .gitignore); pass their paths as arguments.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const Parser = require('./kakaotalk/parser.js');
const Analyzer = require('./kakaotalk/analyzer.js');

let failed = 0;
function ok(cond, msg) {
    if (cond) console.log('  ok   ' + msg);
    else { failed++; console.log('  FAIL ' + msg); }
}
function eq(a, b, msg) { ok(a === b, msg + (a === b ? '' : ' (got ' + a + ', want ' + b + ')')); }

function load(chats) {
    const ds = Analyzer.buildDataset(chats);
    const pp = Analyzer.makePeople(ds, { mergeNo: true });
    return { ds, pp };
}

function dayKey(ts) { const d = new Date(ts); return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate(); }

/* ---------- synthetic fixtures ---------- */
console.log('synthetic: PC format');
const PC = [
    '테스트방 님과 카카오톡 대화', '저장한 날짜 : 2026-10-18 18:51:29', '',
    '--------------- 2026년 1월 5일 월요일 ---------------',
    '가나다님이 라마바님, 1207 손지율님을 초대했습니다.',
    '[가나다] [오전 12:05] 안녕하세요? https://example.com/a 보세요',
    '[라마바] [오전 12:06] ㅋㅋㅋㅋ 네',
    '[1207 손지율] [오전 12:06] 여러 줄',
    '두번째 줄',
    '',
    '네번째 줄',
    '[가나다] [오후 12:30] 사진',
    '[가나다] [오후 12:31] 사진 3장',
    '메시지가 삭제되었습니다.',
    '[라마바] [오후 11:59] 이모티콘',
    '--------------- 2026년 1월 6일 화요일 ---------------',
    '[손지율] [오전 1:00] @가나다 ㅠㅠ 마히로 마히로 마히로 마히로가 마히로는 마히로를',
    '관리자가 메시지를 가렸습니다.',
    '라마바님이 나갔습니다.',
    '가나다님이 플레이봇을 추가했습니다.',
    '[플레이봇] [오전 9:00] 출석체크'
].join('\n');
{
    const chat = Parser.parseChat(PC, 'pc.txt');
    eq(chat.title, '테스트방', 'title parsed');
    eq(chat.ts.length, 8, 'message count');
    eq(chat.text[2], '여러 줄\n두번째 줄\n\n네번째 줄', 'multi-line message (incl. blank line) kept together');
    eq(new Date(chat.ts[0]).getHours(), 0, '오전 12시 -> 0h');
    eq(new Date(chat.ts[3]).getHours(), 12, '오후 12시 -> 12h');
    eq(chat.kind[3], Parser.KIND.PHOTO, 'photo kind');
    eq(chat.num[4], 3, '사진 3장 -> num 3');
    eq(chat.deleted, 1, 'deleted marker counted');
    eq(chat.hidden, 1, 'hidden marker counted');
    eq(chat.events.filter(e => e.type === 'invite').length, 1, 'invite event');
    eq(chat.events.filter(e => e.type === 'leave').length, 1, 'leave event');
    const { ds, pp } = load([chat]);
    ok(pp.people.some(p => p.name === '손지율'), 'student-number prefix merged');
    eq(pp.people.find(p => p.name === '손지율').total, 2, 'merged person has both raw names');
    ok(pp.people.find(p => p.name === '플레이봇').isBot, 'bot detected');
    ok(pp.people.find(p => p.name === '라마바').left, 'leaver flagged');
    const r = Analyzer.analyze(ds, pp, { excludeBots: false });
    eq(r.total, 8, 'analysis total (bots included)');
    eq(Analyzer.analyze(ds, pp, {}).total, 7, 'bot excluded by default');
    eq(r.persons.find(p => p.name === '가나다').links, 1, 'link counted');
    eq(r.persons.find(p => p.name === '가나다').questions, 1, 'question counted');
    eq(r.persons.find(p => p.name === '라마바').laugh, 4, 'ㅋ counted');
    eq(r.persons.find(p => p.name === '손지율').cry, 2, 'ㅠ counted');
    eq(r.persons.find(p => p.name === '가나다').photos, 4, 'photos summed (1 + 3)');
    ok(r.keywords.global.some(k => k.t === '마히로'), 'proper noun kept intact (마히로, not 마히)');
    ok(!r.keywords.global.some(k => k.t === '마히'), 'no bogus stem');
    eq(Analyzer.analyze(ds, pp, { from: 20260106, to: 20260106, excludeBots: false }).total, 2, 'date range filter');
    eq(Analyzer.analyze(ds, pp, { hourFrom: 0, hourTo: 6, excludeBots: false }).total, 4, 'hour window filter (wraps midnight data)');
    eq(Analyzer.analyze(ds, pp, { excluded: [pp.people.find(p => p.name === '가나다').id], excludeBots: false }).total, 5, 'person exclusion');
    eq(Analyzer.analyze(ds, pp, { minMsgs: 2, excludeBots: false }).persons.length, 3, 'minMsgs drops quiet people');
    eq(Analyzer.analyze(ds, pp, { kinds: { photo: false, emoticon: false }, excludeBots: false }).total, 5, 'kind filter');
}

console.log('synthetic: mobile + csv + merge');
{
    const mobile = [
        '테스트방 님과 카카오톡 대화', '저장한 날짜 : 2026년 1월 7일 오후 3:00', '',
        '2026년 1월 5일 월요일',
        '2026년 1월 5일 오전 12:05, 가나다 : 안녕하세요?',
        '2026년 1월 5일 오전 12:06, 라마바 : 네',
        '이어지는 줄',
        '2026년 1월 5일 오후 12:30: 라마바님이 나갔습니다.'
    ].join('\n');
    const m = Parser.parseChat(mobile, 'mobile.txt');
    eq(m.format, 'mobile', 'mobile format detected');
    eq(m.ts.length, 2, 'mobile messages parsed');
    eq(m.text[1], '네\n이어지는 줄', 'mobile continuation line');
    eq(m.events.length, 1, 'mobile system event');

    const csv = 'Date,User,Message\n"2026-01-05 00:05:09","가나다","안녕하세요?"\n"2026-01-05 00:06:10","라마바","네, 좋아요\n둘째 줄"\n';
    const c = Parser.parseChat(csv, 'x.csv');
    eq(c.format, 'csv', 'csv detected');
    eq(c.text[1], '네, 좋아요\n둘째 줄', 'csv quoted comma/newline');

    const pcA = Parser.parseChat(PC, 'a.txt');
    const pcB = Parser.parseChat(PC.replace('[라마바] [오후 11:59] 이모티콘', '[라마바] [오후 11:59] 이모티콘\n[가나다] [오후 11:59] 새 메시지'), 'b.txt');
    const merged = load([pcA, pcB]);
    eq(merged.ds.rooms.length, 1, 'same title -> one room');
    eq(merged.ds.n, 9, 'overlapping files deduped (8 + 1 new)');
    const other = Parser.parseChat(mobile, 'mobile.txt'); other.title = '다른방';
    eq(load([pcA, other]).ds.rooms.length, 2, 'different titles -> two rooms');

    let threw = false;
    try { Parser.parseChat('이건 카톡 파일이 아님\n그냥 텍스트', 'bad.txt'); } catch (e) { threw = true; }
    ok(threw, 'unknown format throws a readable error');
}

/* ---------- real files ---------- */
function indep(text) {
    // independent line-based counts, no shared code with the parser
    const lines = text.split('\n');
    let msgs = 0, photoLines = 0, day = null; const byDay = {}, bySender = {};
    for (const raw of lines) {
        const line = raw.replace(/\r$/, '');
        let m = /^-+ (\d{4})년 (\d{1,2})월 (\d{1,2})일/.exec(line);
        if (m) { day = +m[1] * 10000 + +m[2] * 100 + +m[3]; continue; }
        m = /^\[([^\]]+)\] \[(오전|오후) \d+:\d+\] (.*)$/.exec(line);
        if (!m) continue;
        msgs++;
        byDay[day] = (byDay[day] || 0) + 1;
        const nm = m[1].replace(/^\d{3,5}\s+(?=\S)/, '');
        bySender[nm] = (bySender[nm] || 0) + 1;
        if (m[3] === '사진' || /^사진 \d+장$/.test(m[3]) || m[3] === '사진을 보냈습니다.') photoLines++;
    }
    return { msgs, byDay, bySender, photoLines };
}

for (const file of process.argv.slice(2)) {
    console.log('\nreal file: ' + path.basename(file));
    const text = fs.readFileSync(file, 'utf8');
    const ref = indep(text);
    let t0 = Date.now();
    const chat = Parser.parseChat(text, path.basename(file));
    const { ds, pp } = load([chat]);
    console.log('  parse+build ' + (Date.now() - t0) + 'ms, ' + ds.n + ' messages, ' + ds.vocab.length + ' terms');
    eq(ds.n, ref.msgs, 'message count equals independent line count');
    for (const p of pp.people) eq(p.total, ref.bySender[p.name], 'sender total: ' + p.name);

    t0 = Date.now();
    const all = Analyzer.analyze(ds, pp, { excludeBots: false });
    console.log('  analyze ' + (Date.now() - t0) + 'ms');
    eq(all.total, ref.msgs, 'unfiltered total');
    eq(all.persons.reduce((s, p) => s + p.msgs, 0), all.total, 'sum of persons == total');
    eq(all.days.total.reduce((a, b) => a + b, 0), all.total, 'sum of daily == total');
    eq(all.heat.reduce((a, b) => a + b, 0), all.total, 'sum of heatmap == total');
    eq(all.persons.reduce((s, p) => s + p.photoMsgs, 0), ref.photoLines, 'photo message count');
    eq(all.persons.reduce((s, p) => s + p.starters, 0), all.sessions, 'every session has exactly one starter');
    eq(all.persons.reduce((s, p) => s + p.enders, 0), all.sessions, 'every session has exactly one ender');
    eq(all.idx.length, all.total, 'transcript index length');

    // date range: pick the middle half of the active days
    const dayKeys = Object.keys(ref.byDay).map(Number).sort((a, b) => a - b);
    const from = dayKeys[Math.floor(dayKeys.length * 0.25)], to = dayKeys[Math.floor(dayKeys.length * 0.75)];
    const want = dayKeys.filter(k => k >= from && k <= to).reduce((s, k) => s + ref.byDay[k], 0);
    eq(Analyzer.analyze(ds, pp, { excludeBots: false, from, to }).total, want, 'date range ' + from + '~' + to);

    // exclusion: removing the top person removes exactly their messages
    const top = all.persons[0];
    const without = Analyzer.analyze(ds, pp, { excludeBots: false, excluded: [top.id] });
    eq(without.total, all.total - top.msgs, 'excluding "' + top.name + '"');
    ok(!without.persons.some(p => p.id === top.id), 'excluded person absent from ranking');

    const bots = pp.people.filter(p => p.isBot);
    console.log('  bots detected: ' + (bots.map(b => b.name + '(' + b.total + ')').join(', ') || '(none)'));
    console.log('  top 5: ' + all.persons.slice(0, 5).map(p => p.name + ' ' + p.msgs).join(' | '));
    console.log('  global keywords: ' + all.keywords.global.slice(0, 15).map(k => k.t + ':' + k.c).join(' '));
    const t5 = all.persons[0];
    if (all.keywords.per[t5.id]) console.log('  distinct for ' + t5.name + ': ' + all.keywords.per[t5.id].distinct.slice(0, 10).map(k => k[0]).join(' '));
    const titled = all.persons.filter(p => p.title);
    eq(new Set(titled.map(p => p.title.key)).size, titled.length, 'each title is held by one person');
    console.log('  titles: ' + titled.map(p => p.name + '=' + p.title.title + ' (' + p.title.desc + ')').join(' | '));
}

console.log(failed ? '\n' + failed + ' check(s) FAILED' : '\nall checks passed');
process.exit(failed ? 1 : 0);
