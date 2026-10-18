/* KakaoTalk analyzer: dataset building, tokenizing and filtered aggregation.
 * Pure functions (no DOM) so it runs in a Web Worker and in Node. */
(function (root, factory) {
    var parser = (typeof module === 'object' && module.exports) ? require('./parser.js') : root.KakaoParser;
    if (typeof module === 'object' && module.exports) module.exports = factory(parser);
    else root.KakaoAnalyzer = factory(parser);
})(typeof self !== 'undefined' ? self : this, function (Parser) {
    'use strict';

    var KIND = Parser.KIND;
    var KIND_KEYS = ['text', 'photo', 'emoticon', 'video', 'file', 'search', 'voice', 'deleted'];
    var FLAG_Q = 1, FLAG_LINK = 2, FLAG_MENTION = 4, FLAG_EMOJI = 8;
    var BOT_RE = /(봇|\bbot\b|chatgpt|\bgpt\b|오늘학교|다비니|클로바|clova)/i;

    /* ---------- tokenizer ---------- */

    var STOP = new Set(('이거 그거 저거 이게 그게 저게 이건 그건 저건 이걸 그걸 뭐 뭔가 뭔데 그냥 진짜 너무 근데 그런데 그리고 그래서 그러면 그럼 그렇다 아니 아님 이제 지금 일단 약간 완전 좀 많이 다시 계속 아직 벌써 정말 제발 혹시 그니까 어차피 아마 역시 오히려 사실 보통 원래 대충 거의 바로 같이 아무 아주 매우 가끔 자주 항상 오전 오후 나도 나는 있다 모든 것은 것이 것을 것도 거는 건지 거야 이번 다음 저번 나중 처음 이상 이하 정도 때문 그때 이때 여기 저기 거기 우리 저희 제가 내가 니가 네가 하나 그것 이것 저것 누가 누구 어디 언제 어떻게 어떤 무슨 얼마 그렇게 이렇게 저렇게 이런 그런 저런 같은 다른 한번 걍 막상 아무튼 어쨌든 그래도 하지만 그러나 그리 이미 만약 이후 이전 그다음 그러니까 하여튼 암튼 결국 마치 솔직히 혹은 또는 및 등 것 수 때 중 내 제 네 저 나 너 걔 얘 쟤 이젠 요즘 오늘 어제 내일 우선 방금 아까 이따 이따가 그날 요새 맨날 항상 대체 도대체 갑자기 제대로 확실히 아마도 아예 별로 전혀 하도 워낙 엄청 존나 개 좀더 조금 더 덜 가장 제일 최대 최소 하면 하고 하는 해서 해도 했다 해요 합니다 입니다 있습니다 습니다 감사합니다 안녕하세요 안녕 ㅇㅇ').split(/\s+/));
    var STOP_EN = new Set(('the and is are was were be to of in it its that this for on with at by an as or if so not no yes do does did have has had you your we they he she me my our can will just but from what when how why http https www com kr net org html php pdf jpg png').split(/\s+/));
    var SUFFIXES = ['에서는', '에서도', '에게서', '으로는', '으로도', '이라고', '이라는', '이랑', '에서', '에게', '한테', '까지', '부터', '처럼', '보다', '이나', '으로', '라고', '이라', '이다', '이고', '이면', '이든', '마다', '밖에', '조차', '만큼', '에는', '에도', '에만', '이가', '이는', '이도', '이를', '는', '은', '이', '가', '을', '를', '에', '의', '도', '로', '와', '과', '만', '나', '랑', '야'];
    var ENDING_DROP = /(?:습니다|합니다|입니다|했어요|했는데|했어|했다|했음|하고|하는|하면|하자|해서|해요|할게|할까|이에요|예요|세요|어요|아요|네요|군요|는데|은데|인데|잖아|거든|니까|려고|라서|으면|같아|같은|있어|없어|있는|없는|있고|없고|있음|없음|되는|되고|된다|돼요|했지|했네|하네|지만|으니|으며|하며|이며|하니|이란|이라|인가|일까|겠다|겠지)$/;
    var ENDING_SHORT = /[요죠네까냐군]$/;
    var HANGUL_RE = /^[가-힣]+$/;
    var URL_RE = /https?:\/\/\S+|www\.\S+/g;
    var MENTION_RE = /@\S+/g;
    var WORD_RE = /[가-힣]{2,}|[A-Za-z][A-Za-z0-9'_-]*[A-Za-z0-9]/g;
    var EMOJI_RE = /\p{Extended_Pictographic}/u;

    function rawTokens(text) {
        var t = text.replace(URL_RE, ' ').replace(MENTION_RE, ' ');
        return t.match(WORD_RE);
    }

    function dayKeyOf(d) { return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate(); }

    /* ---------- dataset ---------- */

    function mergeRoom(list) {
        if (list.length === 1) return list[0];
        var rows = [], seen = new Set(), events = [], evSeen = new Set(), c, i, key, occ, local, id;
        list.forEach(function (c) {
            local = new Map();
            for (i = 0; i < c.ts.length; i++) {
                key = c.ts[i] + '|' + c.names[c.who[i]] + '|' + c.text[i];
                occ = (local.get(key) || 0) + 1;
                local.set(key, occ);
                id = key + '#' + occ;
                if (seen.has(id)) continue;
                seen.add(id);
                rows.push({ ts: c.ts[i], n: c.names[c.who[i]], k: c.kind[i], u: c.num[i], t: c.text[i] });
            }
            c.events.forEach(function (e) {
                var k = e.ts + '|' + e.type + '|' + e.actor + '|' + e.targets.join(',');
                if (!evSeen.has(k)) { evSeen.add(k); events.push(e); }
            });
        });
        rows.sort(function (a, b) { return a.ts - b.ts; });
        var out = { file: list.map(function (x) { return x.file; }).join(', '), title: list[0].title, savedAt: list[0].savedAt, format: list[0].format,
            names: [], ts: [], who: [], kind: [], num: [], text: [], events: events,
            deleted: Math.max.apply(null, list.map(function (x) { return x.deleted; })),
            hidden: Math.max.apply(null, list.map(function (x) { return x.hidden; })) };
        var idx = Object.create(null);
        rows.forEach(function (r) {
            var w = idx[r.n];
            if (w === undefined) { w = out.names.length; out.names.push(r.n); idx[r.n] = w; }
            out.ts.push(r.ts); out.who.push(w); out.kind.push(r.k); out.num.push(r.u); out.text.push(r.t);
        });
        return out;
    }

    /** Merges parsed chats (same title = same room) into one columnar dataset and tokenizes the text. */
    function buildDataset(chats, onProgress) {
        var order = [], byTitle = Object.create(null);
        chats.forEach(function (c) {
            if (!byTitle[c.title]) { byTitle[c.title] = []; order.push(c.title); }
            byTitle[c.title].push(c);
        });
        var merged = order.map(function (t) { return mergeRoom(byTitle[t]); });
        var n = merged.reduce(function (s, c) { return s + c.ts.length; }, 0);

        var ds = {
            n: n, rooms: [], names: [], events: [],
            ts: new Float64Array(n), who: new Int32Array(n), room: new Uint8Array(n), kind: new Uint8Array(n),
            num: new Uint16Array(n), mod: new Uint16Array(n), wd: new Uint8Array(n), day: new Int32Array(n), dayIdx: new Int32Array(n),
            clen: new Uint16Array(n), laugh: new Uint16Array(n), cry: new Uint16Array(n), flags: new Uint8Array(n),
            text: new Array(n), dayList: [], deleted: 0, hidden: 0
        };
        var nameIdx = Object.create(null), pos = 0, d = new Date(), daySet = new Set();

        merged.forEach(function (c, roomId) {
            var start = pos, i, w, raw, remap = new Int32Array(c.names.length);
            c.names.forEach(function (nm, j) {
                var id = nameIdx[nm];
                if (id === undefined) { id = ds.names.length; ds.names.push(nm); nameIdx[nm] = id; }
                remap[j] = id;
            });
            for (i = 0; i < c.ts.length; i++, pos++) {
                d.setTime(c.ts[i]);
                ds.ts[pos] = c.ts[i];
                ds.who[pos] = remap[c.who[i]];
                ds.room[pos] = roomId;
                ds.kind[pos] = c.kind[i];
                ds.num[pos] = c.num[i];
                ds.mod[pos] = d.getHours() * 60 + d.getMinutes();
                ds.wd[pos] = d.getDay();
                ds.day[pos] = dayKeyOf(d);
                daySet.add(ds.day[pos]);
                raw = c.text[i];
                ds.text[pos] = raw;
                if (c.kind[i] === KIND.TEXT) {
                    var f = 0, lau = 0, cry = 0, j, ch;
                    if (raw.indexOf('?') >= 0 || raw.indexOf('？') >= 0) f |= FLAG_Q;
                    if (raw.indexOf('http') >= 0 && /https?:\/\//.test(raw)) f |= FLAG_LINK;
                    if (raw.indexOf('@') >= 0) f |= FLAG_MENTION;
                    if (EMOJI_RE.test(raw)) f |= FLAG_EMOJI;
                    for (j = 0; j < raw.length; j++) {
                        ch = raw.charCodeAt(j);
                        if (ch === 0x314B || ch === 0x314E) lau++;
                        else if (ch === 0x3160 || ch === 0x315C) cry++;
                    }
                    ds.flags[pos] = f;
                    ds.laugh[pos] = lau > 65535 ? 65535 : lau;
                    ds.cry[pos] = cry > 65535 ? 65535 : cry;
                    ds.clen[pos] = Math.min(65535, raw.replace(/\s+/g, '').length);
                }
            }
            ds.deleted += c.deleted; ds.hidden += c.hidden;
            c.events.forEach(function (e) { e.room = roomId; ds.events.push(e); });
            ds.rooms.push({ id: roomId, title: c.title, file: c.file, format: c.format, savedAt: c.savedAt,
                count: pos - start, start: start, end: pos, firstTs: c.ts[0], lastTs: c.ts[c.ts.length - 1] });
            if (onProgress) onProgress((roomId + 1) / merged.length * 0.5);
        });

        ds.dayList = Array.from(daySet).sort(function (a, b) { return a - b; });
        var dayPos = new Map(); ds.dayList.forEach(function (k, i) { dayPos.set(k, i); });
        for (var i2 = 0; i2 < n; i2++) ds.dayIdx[i2] = dayPos.get(ds.day[i2]);

        buildTokens(ds, onProgress);
        return ds;
    }

    function buildTokens(ds, onProgress) {
        var n = ds.n, i, j, toks, w, counts = new Map(), perMsg = new Array(n);
        for (i = 0; i < n; i++) {
            if (ds.kind[i] !== KIND.TEXT) continue;
            toks = rawTokens(ds.text[i]);
            if (!toks) continue;
            perMsg[i] = toks;
            for (j = 0; j < toks.length; j++) {
                w = toks[j];
                if (HANGUL_RE.test(w)) counts.set(w, (counts.get(w) || 0) + 1);
            }
        }
        if (onProgress) onProgress(0.7);

        var memo = new Map(), vocab = new Map(), vocabStr = [], vocabCount = [], stopFlag = [];
        function normalize(tok) {
            var r = memo.get(tok);
            if (r !== undefined) return r;
            r = null;
            if (HANGUL_RE.test(tok)) {
                if (!ENDING_DROP.test(tok) && !ENDING_SHORT.test(tok) && !(tok.length >= 3 && tok.charAt(tok.length - 1) === '다') && !/(.)\1{2,}/.test(tok)) {
                    r = tok;
                    for (var s = 0; s < SUFFIXES.length; s++) {
                        var suf = SUFFIXES[s];
                        if (tok.length - suf.length >= 2 && tok.lastIndexOf(suf) === tok.length - suf.length) {
                            var rem = tok.slice(0, tok.length - suf.length);
                            if ((counts.get(rem) || 0) >= 3) { r = rem; break; }
                        }
                    }
                }
            } else {
                var lower = tok.toLowerCase();
                if (lower.length >= 2 && lower.length <= 24 && !/[\d_]/.test(lower) && !/^(.)\1{2,}$/.test(lower)) r = lower;
            }
            memo.set(tok, r);
            return r;
        }

        var start = new Int32Array(n + 1), ids = [], id;
        for (i = 0; i < n; i++) {
            start[i] = ids.length;
            toks = perMsg[i];
            if (!toks) continue;
            for (j = 0; j < toks.length; j++) {
                w = normalize(toks[j]);
                if (w === null) continue;
                id = vocab.get(w);
                if (id === undefined) {
                    id = vocabStr.length; vocab.set(w, id); vocabStr.push(w); vocabCount.push(0);
                    stopFlag.push(STOP.has(w) || STOP_EN.has(w) ? 1 : 0);
                }
                vocabCount[id]++;
                ids.push(id);
            }
        }
        start[n] = ids.length;
        ds.tokStart = start;
        ds.tokIds = Int32Array.from(ids);
        ds.vocab = vocabStr;
        ds.vocabCount = Int32Array.from(vocabCount);
        ds.vocabStop = Uint8Array.from(stopFlag);
        if (onProgress) onProgress(1);
    }

    /* ---------- people ---------- */

    function stripNo(name) { return Parser.stripNo(name); }

    /** Groups raw sender names into people. cfg: { mergeNo: bool, aliases: { from: to } } */
    function makePeople(ds, cfg) {
        cfg = cfg || {};
        var aliases = cfg.aliases || {}, canon = [], i;
        function resolve(nm) {
            var seen = 0;
            while (aliases[nm] && aliases[nm] !== nm && seen++ < 5) nm = aliases[nm];
            return nm;
        }
        for (i = 0; i < ds.names.length; i++) {
            var base = cfg.mergeNo === false ? ds.names[i] : stripNo(ds.names[i]);
            canon.push(resolve(base));
        }
        var byName = new Map(), people = [], personOf = new Int32Array(ds.names.length);
        for (i = 0; i < ds.names.length; i++) {
            var p = byName.get(canon[i]);
            if (!p) { p = { id: -1, name: canon[i], raws: [], total: 0, first: 0, last: 0, isBot: false, left: false, kicked: false }; byName.set(canon[i], p); people.push(p); }
            p.raws.push(i);
        }
        var cnt = new Map(); // raw id -> messages
        var first = new Map(), last = new Map();
        for (i = 0; i < ds.n; i++) {
            var w = ds.who[i];
            cnt.set(w, (cnt.get(w) || 0) + 1);
            if (!first.has(w)) first.set(w, ds.ts[i]);
            last.set(w, ds.ts[i]);
        }
        people.forEach(function (p) {
            p.raws.forEach(function (r) {
                p.total += cnt.get(r) || 0;
                var f = first.get(r), l = last.get(r);
                if (f !== undefined && (!p.first || f < p.first)) p.first = f;
                if (l !== undefined && l > p.last) p.last = l;
            });
        });
        var botNames = new Set(), leftNames = new Set(), kickedNames = new Set();
        ds.events.forEach(function (e) {
            if (e.type === 'add') e.targets.forEach(function (t) { botNames.add(resolve(stripNo(t))); });
            if (e.type === 'leave') leftNames.add(resolve(stripNo(e.actor)));
            if (e.type === 'kick') e.targets.forEach(function (t) { kickedNames.add(resolve(stripNo(t))); });
        });
        people.sort(function (a, b) { return b.total - a.total; });
        people.forEach(function (p, idx) {
            p.id = idx;
            p.isBot = BOT_RE.test(p.name) || botNames.has(p.name);
            p.left = leftNames.has(p.name);
            p.kicked = kickedNames.has(p.name);
            p.raws.forEach(function (r) { personOf[r] = idx; });
        });
        // people that are added/removed like bots but also talk a lot are real users who were just invited: keep only name/regex hits
        people.forEach(function (p) { if (p.isBot && !BOT_RE.test(p.name) && p.total > 2000) p.isBot = false; });
        return { people: people, personOf: personOf };
    }

    /* ---------- analysis ---------- */

    function defaultFilter() {
        return {
            rooms: null, from: null, to: null, hourFrom: 0, hourTo: 24, excluded: [], excludeBots: true, excludeLeft: false,
            minMsgs: 0, kinds: { text: true, photo: true, emoticon: true, video: true, file: true, search: true, voice: true, deleted: false },
            stopwords: true, skipNames: true, sessionGapMin: 30, mentionExclude: false
        };
    }

    function inHour(mod, from, to) {
        var h = (mod / 60) | 0;
        if (from === 0 && to === 24) return true;
        return from < to ? (h >= from && h < to) : (h >= from || h < to);
    }

    function median(hist) {
        var total = 0, i, acc = 0;
        for (i = 0; i < hist.length; i++) total += hist[i];
        if (!total) return null;
        for (i = 0; i < hist.length; i++) { acc += hist[i]; if (acc >= total / 2) return i; }
        return hist.length - 1;
    }

    function pickMask(ds, f) {
        var rooms = new Uint8Array(ds.rooms.length);
        ds.rooms.forEach(function (r) { rooms[r.id] = (!f.rooms || f.rooms.indexOf(r.id) >= 0) ? 1 : 0; });
        var kinds = new Uint8Array(8);
        KIND_KEYS.forEach(function (k, i) { kinds[i] = f.kinds[k] ? 1 : 0; });
        return { rooms: rooms, kinds: kinds };
    }

    function analyze(ds, pp, f) {
        f = Object.assign(defaultFilter(), f || {});
        f.kinds = Object.assign(defaultFilter().kinds, f.kinds || {});
        var people = pp.people, personOf = pp.personOf, P = people.length, n = ds.n, i, j, p;
        var masks = pickMask(ds, f);
        var excluded = new Uint8Array(P);
        (f.excluded || []).forEach(function (id) { if (id >= 0 && id < P) excluded[id] = 1; });
        people.forEach(function (q) { if ((f.excludeBots && q.isBot) || (f.excludeLeft && (q.left || q.kicked))) excluded[q.id] = 1; });

        var D = ds.dayList.length;
        var loDay = 0, hiDay = D - 1;
        if (f.from) { loDay = lowerBound(ds.dayList, f.from); }
        if (f.to) { hiDay = upperBound(ds.dayList, f.to) - 1; }

        var excludedMention = [];
        function passes(i) {
            if (!masks.rooms[ds.room[i]] || !masks.kinds[ds.kind[i]]) return false;
            var di = ds.dayIdx[i];
            if (di < loDay || di > hiDay) return false;
            if (!inHour(ds.mod[i], f.hourFrom, f.hourTo)) return false;
            if (excluded[personOf[ds.who[i]]]) return false;
            if (excludedMention.length && (ds.flags[i] & FLAG_MENTION)) {
                for (var k = 0; k < excludedMention.length; k++) if (ds.text[i].indexOf(excludedMention[k]) >= 0) return false;
            }
            return true;
        }
        if (f.mentionExclude) {
            people.forEach(function (q) { if (excluded[q.id]) excludedMention.push('@' + q.name); });
        }

        if (f.minMsgs > 0) {
            var pre = new Int32Array(P);
            for (i = 0; i < n; i++) if (passes(i)) pre[personOf[ds.who[i]]]++;
            for (p = 0; p < P; p++) if (pre[p] > 0 && pre[p] < f.minMsgs) excluded[p] = 1;
        }

        var A = {
            msgs: new Int32Array(P), text: new Int32Array(P), chars: new Float64Array(P), photos: new Int32Array(P), photoMsgs: new Int32Array(P),
            emoticons: new Int32Array(P), videos: new Int32Array(P), files: new Int32Array(P), voices: new Int32Array(P), searches: new Int32Array(P),
            links: new Int32Array(P), questions: new Int32Array(P), mentions: new Int32Array(P), emoji: new Int32Array(P),
            laugh: new Int32Array(P), cry: new Int32Array(P), longMsgs: new Int32Array(P), shortMsgs: new Int32Array(P),
            night: new Int32Array(P), morning: new Int32Array(P), weekend: new Int32Array(P),
            hours: new Int32Array(P * 24), wd: new Int32Array(P * 7), daily: new Int32Array(P * D),
            starters: new Int32Array(P), enders: new Int32Array(P), burstSum: new Int32Array(P), burstCnt: new Int32Array(P),
            replyN: new Int32Array(P), replySum: new Float64Array(P), replyHist: new Int32Array(P * 11), tokens: new Int32Array(P)
        };
        var matrix = new Int32Array(P * P), heat = new Int32Array(168), dailyTotal = new Int32Array(D);
        var kw = new Int32Array(ds.vocab.length), kwPerson = new Array(P), domains = new Map();
        var idxList = [], sessions = 0, sessionMsgs = 0, gapMs = f.sessionGapMin * 60000;
        var prevP = -1, prevTs = 0, prevRoom = -1, run = 0, total = 0, firstTs = 0, lastTs = 0;
        var stopOn = f.stopwords, nameMask = new Uint8Array(ds.vocab.length);
        if (f.skipNames) {
            if (!ds._vmap) { ds._vmap = new Map(); ds.vocab.forEach(function (t, k) { ds._vmap.set(t, k); }); }
            people.forEach(function (q) {
                [q.name, /^[가-힣]{3}$/.test(q.name) ? q.name.slice(1) : null].forEach(function (t) {
                    var k = t && ds._vmap.get(t.toLowerCase());
                    if (k !== undefined && k !== null) nameMask[k] = 1;
                });
            });
        }

        for (i = 0; i < n; i++) {
            if (!passes(i)) continue;
            p = personOf[ds.who[i]];
            var kind = ds.kind[i], ts = ds.ts[i], mod = ds.mod[i], hour = (mod / 60) | 0, flags = ds.flags[i];
            idxList.push(i);
            total++;
            if (!firstTs || ts < firstTs) firstTs = ts;
            if (ts > lastTs) lastTs = ts;
            A.msgs[p]++;
            A.hours[p * 24 + hour]++;
            A.wd[p * 7 + ds.wd[i]]++;
            A.daily[p * D + ds.dayIdx[i]]++;
            dailyTotal[ds.dayIdx[i]]++;
            heat[ds.wd[i] * 24 + hour]++;
            if (hour < 5) A.night[p]++; else if (hour < 10) A.morning[p]++;
            if (ds.wd[i] === 0 || ds.wd[i] === 6) A.weekend[p]++;

            switch (kind) {
                case KIND.TEXT:
                    A.text[p]++;
                    var cl = ds.clen[i];
                    A.chars[p] += cl;
                    if (cl >= 80) A.longMsgs[p]++;
                    if (cl <= 3) A.shortMsgs[p]++;
                    A.laugh[p] += ds.laugh[i];
                    A.cry[p] += ds.cry[i];
                    if (flags & FLAG_Q) A.questions[p]++;
                    if (flags & FLAG_MENTION) A.mentions[p]++;
                    if (flags & FLAG_EMOJI) A.emoji[p]++;
                    if (flags & FLAG_LINK) {
                        A.links[p]++;
                        var um, ure = /https?:\/\/([^\/\s?#:]+)/g;
                        while ((um = ure.exec(ds.text[i]))) {
                            var host = um[1].toLowerCase().replace(/^www\./, '');
                            domains.set(host, (domains.get(host) || 0) + 1);
                        }
                    }
                    for (j = ds.tokStart[i]; j < ds.tokStart[i + 1]; j++) {
                        var tid = ds.tokIds[j];
                        if ((stopOn && ds.vocabStop[tid]) || nameMask[tid]) continue;
                        kw[tid]++;
                        A.tokens[p]++;
                        var m = kwPerson[p] || (kwPerson[p] = new Map());
                        m.set(tid, (m.get(tid) || 0) + 1);
                    }
                    break;
                case KIND.PHOTO: A.photos[p] += ds.num[i]; A.photoMsgs[p]++; break;
                case KIND.EMOTICON: A.emoticons[p]++; break;
                case KIND.VIDEO: A.videos[p]++; break;
                case KIND.FILE: A.files[p]++; break;
                case KIND.SEARCH: A.searches[p]++; break;
                case KIND.VOICE: A.voices[p]++; break;
            }

            var room = ds.room[i];
            var fresh = prevP < 0 || room !== prevRoom || (ts - prevTs) >= gapMs;
            if (fresh) {
                if (prevP >= 0) { A.enders[prevP]++; A.burstSum[prevP] += run; A.burstCnt[prevP]++; }
                sessions++;
                A.starters[p]++;
                run = 1;
            } else if (p === prevP) {
                run++;
            } else {
                A.burstSum[prevP] += run; A.burstCnt[prevP]++;
                run = 1;
                var delta = ts - prevTs;
                if (delta <= 600000) {
                    var mins = Math.round(delta / 60000);
                    A.replyN[p]++; A.replySum[p] += delta / 60000; A.replyHist[p * 11 + Math.min(10, mins)]++;
                    matrix[p * P + prevP]++;
                }
            }
            sessionMsgs++;
            prevP = p; prevTs = ts; prevRoom = room;
        }
        if (prevP >= 0) { A.enders[prevP]++; A.burstSum[prevP] += run; A.burstCnt[prevP]++; }

        /* per-person records */
        var active = [];
        for (p = 0; p < P; p++) if (A.msgs[p] > 0) active.push(p);
        active.sort(function (a, b) { return A.msgs[b] - A.msgs[a]; });
        var rank = new Int32Array(P).fill(-1);
        active.forEach(function (id, r) { rank[id] = r; });

        var persons = active.map(function (id) {
            var base = people[id], days = 0, peakDay = 0, peakCnt = 0, di, v;
            for (di = 0; di < D; di++) { v = A.daily[id * D + di]; if (v > 0) { days++; if (v > peakCnt) { peakCnt = v; peakDay = ds.dayList[di]; } } }
            var t = A.text[id];
            return {
                id: id, name: base.name, isBot: base.isBot, left: base.left, kicked: base.kicked, colorSlot: base.id,
                msgs: A.msgs[id], text: t, chars: A.chars[id], avgLen: t ? A.chars[id] / t : 0, share: total ? A.msgs[id] / total : 0,
                photos: A.photos[id], photoMsgs: A.photoMsgs[id], emoticons: A.emoticons[id], videos: A.videos[id], files: A.files[id],
                voices: A.voices[id], searches: A.searches[id], links: A.links[id], questions: A.questions[id], mentions: A.mentions[id],
                emoji: A.emoji[id], laugh: A.laugh[id], cry: A.cry[id], longMsgs: A.longMsgs[id], shortMsgs: A.shortMsgs[id],
                night: A.night[id], morning: A.morning[id], weekend: A.weekend[id], tokens: A.tokens[id],
                starters: A.starters[id], enders: A.enders[id], avgBurst: A.burstCnt[id] ? A.burstSum[id] / A.burstCnt[id] : 0,
                replyN: A.replyN[id], avgReply: A.replyN[id] ? A.replySum[id] / A.replyN[id] : null,
                medianReply: median(A.replyHist.subarray(id * 11, id * 11 + 11)),
                hours: Array.from(A.hours.subarray(id * 24, id * 24 + 24)), wd: Array.from(A.wd.subarray(id * 7, id * 7 + 7)),
                activeDays: days, peakDay: peakDay, peakCount: peakCnt, first: base.first, last: base.last
            };
        });

        var indexOfPerson = new Int32Array(P).fill(-1);
        persons.forEach(function (q, k) { indexOfPerson[q.id] = k; });

        var keywords = buildKeywords(ds, kw, kwPerson, A.tokens, persons, stopOn);
        attachTraits(persons, total, sessions);

        var peakDayIdx = 0;
        for (i = 0; i < D; i++) if (dailyTotal[i] > dailyTotal[peakDayIdx]) peakDayIdx = i;
        var peakHeat = 0;
        for (i = 1; i < 168; i++) if (heat[i] > heat[peakHeat]) peakHeat = i;
        var activeDays = 0;
        for (i = loDay; i <= hiDay; i++) if (dailyTotal[i] > 0) activeDays++;

        var dayKeys = ds.dayList.slice(loDay, hiDay + 1);
        var perDaily = persons.map(function (q) { return Array.from(A.daily.subarray(q.id * D + loDay, q.id * D + hiDay + 1)); });
        var topDomains = Array.from(domains.entries()).sort(function (a, b) { return b[1] - a[1]; }).slice(0, 12);

        var rep = persons.map(function (a) { return persons.map(function (b) { return matrix[a.id * P + b.id]; }); });

        var result = {
            total: total, sessions: sessions, avgSession: sessions ? total / sessions : 0, persons: persons, rank: Array.from(rank),
            days: { keys: dayKeys, total: Array.from(dailyTotal.subarray(loDay, hiDay + 1)), per: perDaily },
            heat: Array.from(heat), peak: { day: ds.dayList[peakDayIdx], dayCount: dailyTotal[peakDayIdx], hour: peakHeat % 24, wd: (peakHeat / 24) | 0 },
            range: { firstTs: firstTs, lastTs: lastTs, activeDays: activeDays, spanDays: dayKeys.length },
            reply: rep, keywords: keywords, domains: topDomains, excludedIds: Array.from(excluded).map(function (v, k) { return v ? k : -1; }).filter(function (v) { return v >= 0; }),
            counts: { deleted: ds.deleted, hidden: ds.hidden }
        };
        result.idx = Int32Array.from(idxList);
        return result;
    }

    function lowerBound(arr, v) { var lo = 0, hi = arr.length; while (lo < hi) { var m = (lo + hi) >> 1; if (arr[m] < v) lo = m + 1; else hi = m; } return lo; }
    function upperBound(arr, v) { var lo = 0, hi = arr.length; while (lo < hi) { var m = (lo + hi) >> 1; if (arr[m] <= v) lo = m + 1; else hi = m; } return lo; }

    /* ---------- keywords ---------- */

    function buildKeywords(ds, kw, kwPerson, tokens, persons, stopOn) {
        var V = ds.vocab.length, N = 0, i, p;
        for (i = 0; i < V; i++) N += kw[i];
        var all = [];
        for (i = 0; i < V; i++) if (kw[i] >= 2) all.push(i);
        all.sort(function (a, b) { return kw[b] - kw[a]; });
        var global = all.slice(0, 80).map(function (id) { return { t: ds.vocab[id], c: kw[id] }; });
        var per = {};
        var a0 = 600;
        persons.forEach(function (q) {
            var m = kwPerson[q.id];
            if (!m || tokens[q.id] < 40) return;
            var ni = tokens[q.id], nr = N - ni, freq = [], dist = [];
            m.forEach(function (c, tid) {
                freq.push([tid, c]);
                var tot = kw[tid];
                if (c < 4 || tot < 6) return;
                var alpha = a0 * tot / N, yr = tot - c;
                var delta = Math.log((c + alpha) / (ni + a0 - c - alpha)) - Math.log((yr + alpha) / (nr + a0 - yr - alpha));
                var z = delta / Math.sqrt(1 / (c + alpha) + 1 / (yr + alpha));
                dist.push([tid, c, z]);
            });
            freq.sort(function (a, b) { return b[1] - a[1]; });
            dist.sort(function (a, b) { return b[2] - a[2]; });
            per[q.id] = {
                freq: freq.slice(0, 30).map(function (r) { return [ds.vocab[r[0]], r[1]]; }),
                distinct: dist.filter(function (r) { return r[2] > 1.6; }).slice(0, 30).map(function (r) { return [ds.vocab[r[0]], r[1], Math.round(r[2] * 10) / 10]; })
            };
        });
        return { global: global, per: per, totalTokens: N, vocab: V };
    }

    /* ---------- traits ---------- */

    var TRAITS = [
        { key: 'night', icon: '🌙', title: '올빼미', label: '심야(0~5시) 비율', val: function (p) { return p.night / p.msgs; }, fmt: pct },
        { key: 'morning', icon: '🌅', title: '아침형', label: '아침(5~10시) 비율', val: function (p) { return p.morning / p.msgs; }, fmt: pct },
        { key: 'weekend', icon: '🏖️', title: '주말러', label: '주말 비율', val: function (p) { return p.weekend / p.msgs; }, fmt: pct },
        { key: 'starter', icon: '🚀', title: '대화 시작러', label: '1천 메시지당 대화 시작', val: function (p) { return p.starters / p.msgs * 1000; }, fmt: function (v) { return v.toFixed(1) + '회'; } },
        { key: 'ender', icon: '🔚', title: '마무리 담당', label: '1천 메시지당 마지막 발언', val: function (p) { return p.enders / p.msgs * 1000; }, fmt: function (v) { return v.toFixed(1) + '회'; } },
        { key: 'burst', icon: '🔥', title: '연투러', label: '연속 발언 평균', val: function (p) { return p.avgBurst; }, fmt: function (v) { return v.toFixed(2) + '개'; } },
        { key: 'question', icon: '❓', title: '질문러', label: '질문(?) 비율', val: function (p) { return p.text ? p.questions / p.text : 0; }, fmt: pct },
        { key: 'laugh', icon: '😂', title: 'ㅋㅋ 장인', label: '메시지당 ㅋ·ㅎ', val: function (p) { return p.text ? p.laugh / p.text : 0; }, fmt: function (v) { return v.toFixed(2) + '자'; } },
        { key: 'cry', icon: '🥲', title: '감성러', label: '메시지당 ㅠ·ㅜ', val: function (p) { return p.text ? p.cry / p.text : 0; }, fmt: function (v) { return v.toFixed(3) + '자'; } },
        { key: 'link', icon: '🔗', title: '링크 셔틀', label: '링크 공유 비율', val: function (p) { return p.links / p.msgs; }, fmt: pct },
        { key: 'photo', icon: '📸', title: '사진가', label: '사진 메시지 비율', val: function (p) { return p.photoMsgs / p.msgs; }, fmt: pct },
        { key: 'emoticon', icon: '😎', title: '이모티콘러', label: '이모티콘 비율', val: function (p) { return p.emoticons / p.msgs; }, fmt: pct },
        { key: 'long', icon: '📝', title: '장문 작가', label: '평균 글자 수', val: function (p) { return p.avgLen; }, fmt: function (v) { return v.toFixed(1) + '자'; } },
        { key: 'short', icon: '⚡', title: '단답러', label: '3자 이하 메시지 비율', val: function (p) { return p.text ? p.shortMsgs / p.text : 0; }, fmt: pct },
        { key: 'mention', icon: '📣', title: '멘션러', label: '@멘션 비율', val: function (p) { return p.mentions / p.msgs; }, fmt: pct },
        { key: 'speed', icon: '⏱️', title: '번개 답장', label: '평균 답장 시간', min: 30, val: function (p) { return p.avgReply === null ? null : -p.avgReply; }, fmt: function (v) { return (-v).toFixed(1) + '분'; } },
        { key: 'steady', icon: '📆', title: '개근러', label: '활동 일수', val: function (p) { return p.activeDays; }, fmt: function (v) { return v + '일'; } }
    ];

    function pct(v) { return (v * 100).toFixed(1) + '%'; }

    function attachTraits(persons, total, sessions) {
        var minMsgs = Math.max(30, Math.round(total * 0.004));
        var pool = persons.filter(function (p) { return p.msgs >= minMsgs; });
        persons.forEach(function (p) { p.traits = []; p.titles = []; p.metrics = {}; });
        if (pool.length < 3) return;
        TRAITS.forEach(function (t) {
            var qual = pool.filter(function (p) { return (!t.min || p.replyN >= t.min) && t.val(p) !== null; });
            if (qual.length < 3) return;
            var vals = qual.map(t.val), mean = vals.reduce(function (a, b) { return a + b; }, 0) / vals.length;
            var sd = Math.sqrt(vals.reduce(function (a, b) { return a + (b - mean) * (b - mean); }, 0) / vals.length);
            if (!sd) return;
            qual.forEach(function (p, i) {
                var z = (vals[i] - mean) / sd;
                p.metrics[t.key] = { value: vals[i], z: z, text: t.fmt(vals[i]), label: t.label };
                if (z >= 0.9) p.traits.push({ key: t.key, icon: t.icon, title: t.title, label: t.label, text: t.fmt(vals[i]), z: z });
            });
            var best = qual[0], bz = -Infinity;
            qual.forEach(function (p, i) { var z = (vals[i] - mean) / sd; if (z > bz) { bz = z; best = p; } });
            if (bz >= 1.2) best.titles.push({ key: t.key, icon: t.icon, title: t.title, label: t.label, text: t.fmt(t.val(best)) });
        });
        persons.forEach(function (p) { p.traits.sort(function (a, b) { return b.z - a.z; }); });
    }

    /* ---------- search / transcript ---------- */

    function searchMessages(ds, idx, q) {
        q = q.trim().toLowerCase();
        if (!q) return idx;
        var out = [], i;
        for (i = 0; i < idx.length; i++) if (ds.text[idx[i]].toLowerCase().indexOf(q) >= 0) out.push(idx[i]);
        return Int32Array.from(out);
    }

    function keywordTrend(ds, pp, idx, q) {
        var hit = searchMessages(ds, idx, q), per = new Map(), monthly = new Map(), i, d = new Date();
        for (i = 0; i < hit.length; i++) {
            var m = hit[i], p = pp.personOf[ds.who[m]];
            per.set(p, (per.get(p) || 0) + 1);
            var key = Math.floor(ds.day[m] / 100);
            monthly.set(key, (monthly.get(key) || 0) + 1);
        }
        return {
            q: q, total: hit.length,
            perPerson: Array.from(per.entries()).map(function (e) { return { id: e[0], name: pp.people[e[0]].name, count: e[1] }; }).sort(function (a, b) { return b.count - a.count; }),
            monthly: Array.from(monthly.entries()).sort(function (a, b) { return a[0] - b[0]; }),
            hit: hit
        };
    }

    function rows(ds, pp, idx, start, count) {
        var out = [], end = Math.min(idx.length, start + count), i;
        for (i = start; i < end; i++) {
            var m = idx[i], p = pp.personOf[ds.who[m]];
            out.push({ i: m, ts: ds.ts[m], day: ds.day[m], pid: p, name: pp.people[p].name, kind: ds.kind[m], num: ds.num[m], text: ds.text[m], room: ds.room[m] });
        }
        return out;
    }

    /** First position in idx whose message day >= dayKey. */
    function seekDay(ds, idx, dayKey) {
        var lo = 0, hi = idx.length;
        while (lo < hi) { var m = (lo + hi) >> 1; if (ds.day[idx[m]] < dayKey) lo = m + 1; else hi = m; }
        return lo;
    }

    return {
        KIND: KIND, TRAITS: TRAITS, buildDataset: buildDataset, makePeople: makePeople, analyze: analyze, defaultFilter: defaultFilter,
        searchMessages: searchMessages, keywordTrend: keywordTrend, rows: rows, seekDay: seekDay
    };
});
