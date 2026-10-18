/* Web Worker: holds the parsed chat in memory so the UI thread never blocks.
 * Messages in:  load | config | analyze | transcript | trend | unload
 * Messages out: progress | loaded | people | result | transcript | trend | error
 * Chat content never leaves the browser. */
'use strict';
var ver = (self.location.search || '');
importScripts('parser.js' + ver, 'analyzer.js' + ver);

var ds = null, pp = null, cfg = { mergeNo: true, aliases: {} };
var lastIdx = null, view = { q: null, idx: null };

function decode(buf, name) {
    try {
        return new TextDecoder('utf-8', { fatal: true }).decode(buf);
    } catch (e) {
        try { return new TextDecoder('euc-kr').decode(buf); } catch (e2) { throw new Error('파일 인코딩을 읽지 못했어요: ' + name); }
    }
}

function peopleSummary() {
    return pp.people.map(function (p) {
        return { id: p.id, name: p.name, total: p.total, isBot: p.isBot, left: p.left, kicked: p.kicked, first: p.first, last: p.last, raws: p.raws.length };
    });
}

function timeline() {
    var counts = new Array(ds.dayList.length).fill(0), i;
    for (i = 0; i < ds.n; i++) counts[ds.dayIdx[i]]++;
    return { days: ds.dayList, counts: counts };
}

function parseOne(text, name, idx, total) {
    return KakaoParser.parseChat(text, name, function (v) {
        post({ type: 'progress', stage: '해석하는 중', file: name, value: (idx + v) / total * 0.6 });
    });
}

function post(msg) { self.postMessage(msg); }

self.onmessage = async function (ev) {
    var m = ev.data;
    try {
        if (m.type === 'load') {
            var chats = [], i;
            for (i = 0; i < m.files.length; i++) {
                var f = m.files[i];
                post({ type: 'progress', stage: '읽는 중', file: f.name, value: i / m.files.length });
                var text = decode(await f.arrayBuffer(), f.name);
                chats.push(parseOne(text, f.name, i, m.files.length));
            }
            post({ type: 'progress', stage: '키워드 추출 중', value: 0.65 });
            ds = KakaoAnalyzer.buildDataset(chats, function (v) { post({ type: 'progress', stage: '키워드 추출 중', value: 0.6 + v * 0.4 }); });
            pp = KakaoAnalyzer.makePeople(ds, cfg);
            lastIdx = null; view = { q: null, idx: null };
            post({ type: 'loaded', rooms: ds.rooms, people: peopleSummary(), timeline: timeline(), total: ds.n, deleted: ds.deleted, hidden: ds.hidden });
        } else if (m.type === 'config') {
            cfg = { mergeNo: m.mergeNo !== false, aliases: m.aliases || {} };
            if (ds) { pp = KakaoAnalyzer.makePeople(ds, cfg); post({ type: 'people', reqId: m.reqId, people: peopleSummary() }); }
        } else if (m.type === 'analyze') {
            if (!ds) return;
            var res = KakaoAnalyzer.analyze(ds, pp, m.filter);
            lastIdx = res.idx; delete res.idx;
            view = { q: null, idx: null };
            post({ type: 'result', reqId: m.reqId, result: res });
        } else if (m.type === 'transcript') {
            if (!ds || !lastIdx) return;
            if (view.q !== m.q || !view.idx) { view = { q: m.q, idx: m.q ? KakaoAnalyzer.searchMessages(ds, lastIdx, m.q) : lastIdx }; }
            var start = m.seekDay ? KakaoAnalyzer.seekDay(ds, view.idx, m.seekDay) : m.start;
            start = Math.max(0, Math.min(start, Math.max(0, view.idx.length - 1)));
            post({ type: 'transcript', reqId: m.reqId, total: view.idx.length, start: start, rows: KakaoAnalyzer.rows(ds, pp, view.idx, start, m.count), q: m.q });
        } else if (m.type === 'trend') {
            if (!ds || !lastIdx) return;
            var t = KakaoAnalyzer.keywordTrend(ds, pp, lastIdx, m.q);
            var samples = KakaoAnalyzer.rows(ds, pp, t.hit, 0, 6);
            delete t.hit;
            t.samples = samples;
            post({ type: 'trend', reqId: m.reqId, trend: t });
        } else if (m.type === 'unload') {
            ds = null; pp = null; lastIdx = null; view = { q: null, idx: null };
        }
    } catch (err) {
        post({ type: 'error', reqId: m.reqId, message: err && err.message ? err.message : String(err) });
    }
};
