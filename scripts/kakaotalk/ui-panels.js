/* Tab renderers, person detail, report and export helpers.
 * Reads state from KT.S and talks to the core through KT.actions (see ui.js). */
(function (root) {
    'use strict';
    var KT = root.KT, h = KT.h, num = KT.num, pct = KT.pct, S = KT.S = KT.S || {};
    var ui = S.ui = { sort: { key: 'msgs', dir: -1 }, rankQ: '', bucket: null, mode: 'stack', scope: 'top', hidden: {},
        kwScope: 'all', kwMode: 'freq', kwQ: '', kwTrend: null, relNorm: 'row', tr: { q: '', start: 0, total: 0, rows: [], page: 80, seek: null } };

    var KIND_LABEL = { 1: '📷', 2: '이모티콘', 3: '🎞 동영상', 4: '📎 파일', 5: '🔎 검색', 6: '🎙 음성메시지', 7: '삭제된 메시지' };

    /* ---------- small building blocks ---------- */

    function card(title, body, o) {
        o = o || {};
        return h('section', { class: 'card' + (o.class ? ' ' + o.class : '') },
            (title || o.actions) && h('header', { class: 'card-head' }, h('h2', null, title), o.sub && h('p', { class: 'sub' }, o.sub), o.actions && h('div', { class: 'card-actions' }, o.actions)),
            body);
    }
    function seg(options, value, onChange, label) {
        return h('div', { class: 'seg', role: 'group', 'aria-label': label || '' }, options.map(function (o) {
            return h('button', { type: 'button', 'aria-pressed': String(o[0] === value), onclick: function () { onChange(o[0]); } }, o[1]);
        }));
    }
    function empty(msg) { return h('div', { class: 'empty' }, msg || '조건에 맞는 메시지가 없어요. 필터를 조정해 보세요.'); }
    function chip(text, o) { o = o || {}; return h(o.onclick ? 'button' : 'span', { type: o.onclick ? 'button' : null, class: 'chip' + (o.class ? ' ' + o.class : ''), onclick: o.onclick, 'data-tip': o.tip || null }, text); }
    function nameOf(R, id) { var p = R.persons.filter(function (x) { return x.id === id; })[0]; return p ? p.name : '?'; }
    function who(p, o) { o = o || {}; return h('span', { class: 'who' }, KT.avatar(p, o.size), h('span', { class: 'who-name' }, p.name), p.isBot && h('em', { class: 'badge' }, '봇'), (p.left || p.kicked) && h('em', { class: 'badge mute' }, p.kicked ? '강퇴' : '나감')); }
    function slice(p) { return p; }

    function rangeText(R) {
        if (!R.total) return '-';
        return KT.dayStr(KT.dateToDay(new Date(R.range.firstTs))) + ' ~ ' + KT.dayStr(KT.dateToDay(new Date(R.range.lastTs)));
    }

    function topPairs(R, limit) {
        var pairs = [], i, j, a = R.persons, M = R.reply;
        for (i = 0; i < a.length; i++) for (j = i + 1; j < a.length; j++) {
            var ab = M[i][j], ba = M[j][i];
            if (ab + ba > 0) pairs.push({ a: a[i], b: a[j], ab: ab, ba: ba, sum: ab + ba });
        }
        pairs.sort(function (x, y) { return y.sum - x.sum; });
        return pairs.slice(0, limit || 10);
    }

    function narrative(R) {
        var out = [], P = R.persons;
        if (!R.total) return ['조건에 맞는 메시지가 없어요.'];
        var top = P[0], top3 = P.slice(0, 3).reduce(function (s, p) { return s + p.msgs; }, 0);
        var gap = S.f ? S.f.sessionGapMin : 30;
        out.push(rangeText(R) + ' 동안 ' + P.length + '명이 ' + num(R.total) + '개의 메시지를 주고받았어요. 활동한 ' + R.range.activeDays + '일 기준 하루 평균 ' + num(R.total / Math.max(1, R.range.activeDays)) + '개예요.');
        out.push('가장 말이 많은 사람은 ' + top.name + '님으로 전체의 ' + pct(top.share) + '를 차지했고, 상위 ' + Math.min(3, P.length) + '명이 ' + pct(top3 / R.total) + '를 이끌었어요.');
        out.push('대화는 ' + KT.WD[R.peak.wd] + '요일 ' + KT.hourLabel(R.peak.hour) + '에 가장 활발했고, 가장 북적인 날은 ' + KT.dayStr(R.peak.day) + '(' + num(R.peak.dayCount) + '개)이에요.');
        out.push(num(R.sessions) + '번의 대화(' + gap + '분 이상 침묵하면 새 대화로 계산)가 있었고, 한 번에 평균 ' + R.avgSession.toFixed(1) + '개의 메시지가 오갔어요.');
        var g = R.keywords.global.slice(0, 3).map(function (k) { return "'" + k.t + "'"; });
        if (g.length) out.push('가장 많이 등장한 말은 ' + g.join(', ') + ' 순이에요.');
        var pr = topPairs(R, 1)[0];
        if (pr) out.push('가장 많이 주고받은 짝은 ' + pr.a.name + '님과 ' + pr.b.name + '님이에요 (서로 ' + num(pr.sum) + '번 답장).');
        return out;
    }

    function awards(R) {
        var list = [];
        R.persons.forEach(function (p) { (p.titles || []).forEach(function (t) { list.push({ p: p, t: t }); }); });
        return list;
    }

    /* ---------- overview ---------- */

    function kpi(label, value, sub) {
        return h('div', { class: 'kpi' }, h('span', { class: 'kpi-l' }, label), h('strong', { class: 'kpi-v' }, value), sub && h('span', { class: 'kpi-s' }, sub));
    }

    function overview(R) {
        if (!R.total) return empty();
        var P = R.persons, wrap = h('div', { class: 'stack-y' });
        var tot = { text: 0, photo: 0, emo: 0, video: 0, file: 0, other: 0 };
        P.forEach(function (p) { tot.text += p.text; tot.photo += p.photoMsgs; tot.emo += p.emoticons; tot.video += p.videos; tot.file += p.files; tot.other += p.voices + p.searches; });
        var mix = [
            { label: '텍스트', value: tot.text, color: 'var(--s1)' }, { label: '사진', value: tot.photo, color: 'var(--s2)' },
            { label: '이모티콘', value: tot.emo, color: 'var(--s3)' }, { label: '동영상', value: tot.video, color: 'var(--s5)' },
            { label: '파일', value: tot.file, color: 'var(--s7)' }, { label: '음성·검색', value: tot.other, color: 'var(--s4)' }
        ];
        wrap.appendChild(h('div', { class: 'kpis' },
            kpi('총 메시지', num(R.total), '하루 평균 ' + num(R.total / Math.max(1, R.range.activeDays)) + '개'),
            kpi('참여자', P.length + '명', R.excludedIds.length ? '제외 ' + R.excludedIds.length + '명' : '제외 없음'),
            kpi('분석 기간', KT.dur(R.range.lastTs - R.range.firstTs), rangeText(R)),
            kpi('활동 일수', num(R.range.activeDays) + '일', '기간의 ' + pct(R.range.activeDays / Math.max(1, R.range.spanDays), 0)),
            kpi('가장 북적인 날', KT.dayShort(R.peak.day), num(R.peak.dayCount) + '개'),
            kpi('피크 시간', KT.WD[R.peak.wd] + ' ' + KT.hourLabel(R.peak.hour), '대화 ' + num(R.sessions) + '회 · 평균 ' + R.avgSession.toFixed(1) + '개')
        ));

        wrap.appendChild(card('한눈에 보기', h('ul', { class: 'story' }, narrative(R).map(function (t) { return h('li', null, t); }))));

        var legend = h('ul', { class: 'legend' }, mix.filter(function (m) { return m.value; }).map(function (m) {
            return h('li', null, h('i', { style: { background: m.color } }), m.label, h('em', null, pct(m.value / R.total)));
        }));
        var topRows = P.slice(0, 6).map(function (p) { return { label: who(p, { size: 'sm' }), value: p.msgs, text: num(p.msgs) + ' · ' + pct(p.share), color: KT.color(p.colorSlot) }; });
        wrap.appendChild(h('div', { class: 'grid-2' },
            card('메시지 구성', h('div', null, KT.stackBar(mix, R.total), legend)),
            card('참여자 TOP 6', KT.barList(topRows), { actions: h('button', { class: 'link', type: 'button', onclick: function () { KT.actions.setTab('ranking'); } }, '전체 순위 →') })
        ));

        var aw = awards(R).slice(0, 6);
        if (aw.length) wrap.appendChild(card('이번 대화방의 칭호', h('div', { class: 'awards' }, aw.map(awardCard)), { actions: h('button', { class: 'link', type: 'button', onclick: function () { KT.actions.setTab('traits'); } }, '성향 분석 →') }));

        var chartEl = h('div', { class: 'chart' });
        wrap.appendChild(card('활동 추이', chartEl, { sub: '주 단위 메시지 수' }));
        var b = KT.bucketize(R.days.keys, [R.days.total], 'week');
        KT.areaChart(chartEl, { keys: b.keys, series: [{ name: '메시지', color: 'var(--primary)', values: b.arrays[0] }], mode: 'line', height: 210, label: weekLabel, aria: '주별 메시지 수' });

        var hours = [], wdv = [0, 0, 0, 0, 0, 0, 0], i;
        for (i = 0; i < 24; i++) hours.push(0);
        for (i = 0; i < 168; i++) { hours[i % 24] += R.heat[i]; wdv[(i / 24) | 0] += R.heat[i]; }
        wrap.appendChild(h('div', { class: 'grid-2' },
            card('시간대별', [KT.miniBars(hours, hours.map(KT.hourLabel), { aria: '시간대별 메시지' }), hourAxis()]),
            card('요일별', [KT.miniBars(wdv, KT.WD.map(function (d) { return d + '요일'; }), { aria: '요일별 메시지' }), h('div', { class: 'axis wd' }, KT.WD.map(function (d) { return h('span', null, d); }))])
        ));
        return wrap;
    }

    function hourAxis() { return h('div', { class: 'axis hr' }, [0, 6, 12, 18, 23].map(function (x) { return h('span', null, x + '시'); })); }
    function weekLabel(k, long) { return long ? KT.dayStr(k) + ' 주' : KT.dayShort(k); }

    function awardCard(a) {
        return h('div', { class: 'award' }, h('span', { class: 'award-ico' }, a.t.icon),
            h('div', null, h('b', null, a.t.title), h('span', { class: 'award-who' }, who(a.p, { size: 'sm' })), h('span', { class: 'award-m' }, a.t.label + ' ' + a.t.text)));
    }

    /* ---------- ranking ---------- */

    var COLS = [
        { k: 'msgs', t: '메시지', v: function (p) { return p.msgs; } },
        { k: 'chars', t: '글자 수', v: function (p) { return p.chars; }, hide: 'sm' },
        { k: 'avgLen', t: '평균 길이', v: function (p) { return p.avgLen; }, f: function (v) { return v.toFixed(1); }, hide: 'sm' },
        { k: 'photos', t: '사진', v: function (p) { return p.photos; }, hide: 'md' },
        { k: 'emoticons', t: '이모티콘', v: function (p) { return p.emoticons; }, hide: 'md' },
        { k: 'links', t: '링크', v: function (p) { return p.links; }, hide: 'md' },
        { k: 'questions', t: '질문', v: function (p) { return p.questions; }, hide: 'lg' },
        { k: 'activeDays', t: '활동일', v: function (p) { return p.activeDays; }, hide: 'lg' }
    ];

    function ranking(R) {
        if (!R.total) return empty();
        var P = R.persons.slice(), col = COLS.filter(function (c) { return c.k === ui.sort.key; })[0] || COLS[0];
        if (ui.rankQ) { var q = ui.rankQ.toLowerCase(); P = P.filter(function (p) { return p.name.toLowerCase().indexOf(q) >= 0; }); }
        P.sort(function (a, b) { return (col.v(a) - col.v(b)) * ui.sort.dir; });
        var max = Math.max.apply(null, R.persons.map(function (p) { return p.msgs; }).concat([1]));
        var head = h('tr', null, h('th', { class: 'c-rank' }, '#'), h('th', null, '참여자'),
            COLS.map(function (c) {
                var on = ui.sort.key === c.k;
                return h('th', { class: 'num' + (c.hide ? ' hide-' + c.hide : ''), 'aria-sort': on ? (ui.sort.dir < 0 ? 'descending' : 'ascending') : 'none' },
                    h('button', { type: 'button', class: 'th-btn' + (on ? ' on' : ''), onclick: function () { ui.sort = { key: c.k, dir: on ? -ui.sort.dir : -1 }; KT.actions.render(); } }, c.t, on ? (ui.sort.dir < 0 ? ' ↓' : ' ↑') : ''));
            }),
            h('th', { class: 'hide-md' }, '자주 쓴 키워드'));
        var rows = P.map(function (p, i) {
            var kw = (R.keywords.per[p.id] || { freq: [] }).freq.slice(0, 6);
            return h('tr', { tabindex: 0, class: 'click', onclick: function () { KT.actions.openPerson(p.id); }, onkeydown: function (e) { if (e.key === 'Enter') KT.actions.openPerson(p.id); } },
                h('td', { class: 'c-rank' }, String(R.persons.indexOf(p) + 1)),
                h('td', null, who(p), kw.length ? h('span', { class: 'kw-inline' }, kw.slice(0, 3).map(function (k) { return h('span', { class: 'kw' }, k[0]); })) : null, p.titles && p.titles.length ? h('span', { class: 'mini-titles', 'data-tip': p.titles.map(function (t) { return t.title; }).join(' · ') }, p.titles.map(function (t) { return t.icon; }).join('')) : null),
                COLS.map(function (c) {
                    var v = c.v(p), txt = c.f ? c.f(v) : num(v);
                    if (c.k === 'msgs') return h('td', { class: 'num msgcell' }, h('span', { class: 'mc-top' }, h('b', null, txt), h('em', null, pct(p.share))), h('span', { class: 'mc-bar' }, h('i', { style: { width: Math.max(1, p.msgs / max * 100) + '%', background: KT.color(p.colorSlot) } })));
                    return h('td', { class: 'num' + (c.hide ? ' hide-' + c.hide : '') }, txt);
                }),
                h('td', { class: 'hide-md' }, kw.length ? h('span', { class: 'kw-chips' }, kw.map(function (k) { return h('span', { class: 'kw' }, k[0]); })) : h('span', { class: 'muted' }, '-')));
        });
        var tools = h('div', { class: 'tools' },
            h('input', { type: 'search', class: 'input', placeholder: '이름 검색', 'aria-label': '이름 검색', value: ui.rankQ, oninput: function (e) { ui.rankQ = e.target.value; KT.actions.renderKeepFocus('rankSearch'); }, id: 'rankSearch' }),
            h('span', { class: 'grow' }),
            h('button', { class: 'btn ghost', type: 'button', onclick: exportCsv }, 'CSV 저장'),
            h('button', { class: 'btn ghost', type: 'button', onclick: exportPng }, '이미지 저장'));
        return card('참여자 순위', [tools, h('div', { class: 'table-wrap' }, h('table', { class: 'tbl' }, h('thead', null, head), h('tbody', null, rows))),
            !P.length && empty('검색 결과가 없어요.')], { sub: R.persons.length + '명 · 행을 누르면 상세 정보가 열려요' });
    }

    /* ---------- trend ---------- */

    function defaultBucket(R) { return R.days.keys.length <= 100 ? 'day' : R.days.keys.length > 900 ? 'month' : 'week'; }

    function trend(R) {
        if (!R.total) return empty();
        var bucket = ui.bucket || defaultBucket(R), wrap = h('div', { class: 'stack-y' });
        var topN = R.persons.slice(0, 6), rest = R.persons.slice(6), series = [];
        var visible = function (id) { return !ui.hidden[id]; };
        if (ui.scope === 'total') series = [{ id: 'all', name: '전체', color: 'var(--primary)', arr: R.days.total }];
        else {
            topN.forEach(function (p, i) { series.push({ id: p.id, name: p.name, color: KT.color(p.colorSlot), arr: R.days.per[R.persons.indexOf(p)] }); });
            if (rest.length) {
                var o = R.days.total.map(function () { return 0; });
                rest.forEach(function (p) { R.days.per[R.persons.indexOf(p)].forEach(function (v, i) { o[i] += v; }); });
                series.push({ id: 'other', name: '기타 ' + rest.length + '명', color: 'var(--s-other)', arr: o });
            }
        }
        var shown = series.filter(function (s) { return visible(s.id); });
        var b = KT.bucketize(R.days.keys, shown.map(function (s) { return s.arr; }), bucket);
        var chartEl = h('div', { class: 'chart' });
        var ctrl = h('div', { class: 'tools' },
            seg([['day', '일'], ['week', '주'], ['month', '월']], bucket, function (v) { ui.bucket = v; KT.actions.render(); }, '집계 단위'),
            seg([['stack', '누적'], ['line', '선']], ui.mode, function (v) { ui.mode = v; KT.actions.render(); }, '차트 형태'),
            seg([['top', '상위 참여자'], ['total', '전체 합계']], ui.scope, function (v) { ui.scope = v; KT.actions.render(); }, '표시 대상'));
        var legend = h('ul', { class: 'legend toggle' }, series.map(function (s) {
            return h('li', null, h('button', { type: 'button', 'aria-pressed': String(visible(s.id)), onclick: function () { ui.hidden[s.id] = visible(s.id); KT.actions.render(); } },
                h('i', { style: { background: s.color } }), s.name, h('em', null, num(s.arr.reduce(function (a, c) { return a + c; }, 0)))));
        }));
        wrap.appendChild(card('활동 추이', [ctrl, chartEl, ui.scope === 'total' ? null : legend], { sub: bucket === 'day' ? '일 단위' : bucket === 'week' ? '주 단위 (월요일 시작)' : '월 단위' }));
        KT.areaChart(chartEl, {
            keys: b.keys, mode: ui.scope === 'total' ? 'line' : ui.mode, height: 300, aria: '참여자별 메시지 추이',
            series: shown.map(function (s, i) { return { name: s.name, color: s.color, values: b.arrays[i] }; }),
            label: function (k, long) { return bucket === 'month' ? KT.monthStr(Math.floor(k / 100)) : bucket === 'week' ? weekLabel(k, long) : (long ? KT.dayStr(k) : KT.dayShort(k)); }
        });

        var order = [1, 2, 3, 4, 5, 6, 0];
        wrap.appendChild(card('요일 × 시간 히트맵', h('div', { class: 'heat-wrap' }, KT.heatGrid({
            rows: order.map(function (d) { return KT.WD[d]; }), cols: Array.apply(null, Array(24)).map(function (_, i) { return String(i); }), colEvery: 3, aria: '요일과 시간대별 메시지 수',
            cell: function (r, c) { var v = R.heat[order[r] * 24 + c]; return { v: v, tip: KT.WD[order[r]] + '요일 ' + KT.hourLabel(c) + ' · ' + num(v) + '개' }; }
        })), { sub: '진할수록 메시지가 많아요' }));

        wrap.appendChild(card('참여자별 시간대 분포', h('div', { class: 'small-multiples' }, R.persons.slice(0, 12).map(function (p) {
            return h('div', { class: 'sm' }, h('div', { class: 'sm-head' }, who(p, { size: 'sm' }), h('em', null, num(p.msgs))), KT.miniBars(p.hours, p.hours.map(KT.hourLabel), { color: KT.color(p.colorSlot), aria: p.name + ' 시간대' }), hourAxis());
        })), { sub: '메시지가 많은 상위 12명' }));
        return wrap;
    }

    /* ---------- keywords ---------- */

    function hl(text, q) {
        if (!q) return text;
        var out = [], low = text.toLowerCase(), ql = q.toLowerCase(), i = 0, j;
        while ((j = low.indexOf(ql, i)) >= 0) { out.push(text.slice(i, j), h('mark', null, text.slice(j, j + q.length))); i = j + q.length; }
        out.push(text.slice(i));
        return out;
    }

    function keywords(R) {
        if (!R.total) return empty();
        var K = R.keywords, wrap = h('div', { class: 'stack-y' }), per = K.per;
        if (ui.kwScope !== 'all' && !R.persons.some(function (p) { return p.id === ui.kwScope; })) ui.kwScope = 'all';
        var scopePerson = ui.kwScope === 'all' ? null : R.persons.filter(function (p) { return p.id === ui.kwScope; })[0];
        var words;
        if (!scopePerson) words = K.global.slice(0, 60).map(function (k) { return { t: k.t, c: k.c }; });
        else {
            var d = per[scopePerson.id];
            if (!d) words = [];
            else if (ui.kwMode === 'distinct') words = d.distinct.map(function (k) { return { t: k[0], c: k[1] }; });
            else words = d.freq.map(function (k) { return { t: k[0], c: k[1] }; });
        }
        var select = h('select', { class: 'input', 'aria-label': '키워드 대상', onchange: function (e) { ui.kwScope = e.target.value === 'all' ? 'all' : +e.target.value; KT.actions.render(); } },
            h('option', { value: 'all', selected: ui.kwScope === 'all' }, '전체 대화'),
            R.persons.filter(function (p) { return per[p.id]; }).map(function (p) { return h('option', { value: p.id, selected: ui.kwScope === p.id }, p.name + ' (' + num(p.msgs) + ')'); }));
        var tools = h('div', { class: 'tools' }, select,
            scopePerson ? seg([['freq', '자주 쓴 말'], ['distinct', '이 사람다운 말']], ui.kwMode, function (v) { ui.kwMode = v; KT.actions.render(); }, '키워드 기준') : null);
        var maxc = words.length ? words[0].c : 1;
        var left = card(scopePerson ? scopePerson.name + '님의 키워드' : '전체 핵심 키워드', [tools,
            words.length ? [KT.tagCloud(words.slice(0, 50), searchKeyword), KT.barList(words.slice(0, 12).map(function (w) { return { label: w.t, value: w.c, text: num(w.c) + '회' }; }), { max: maxc })] : empty('이 사람은 키워드를 뽑기엔 글이 적어요.')],
            { sub: ui.kwMode === 'distinct' && scopePerson ? '다른 사람보다 유독 많이 쓴 말 (log-odds 기준)' : '조사·어미·불용어를 제거한 빈도 기준' });

        var tr = ui.kwTrend;
        var right = card('키워드 검색', [
            h('form', { class: 'search-form', onsubmit: function (e) { e.preventDefault(); searchKeyword(e.target.q.value); } },
                h('input', { name: 'q', type: 'search', class: 'input', placeholder: '단어를 입력해 누가 언제 썼는지 보기', value: ui.kwQ, 'aria-label': '키워드 검색' }),
                h('button', { class: 'btn primary', type: 'submit' }, '검색')),
            tr ? trendResult(R, tr) : h('p', { class: 'hint' }, '왼쪽 단어를 누르거나 직접 검색해 보세요. 부분 일치로 찾아요.')]);
        wrap.appendChild(h('div', { class: 'grid-2 wide-left' }, left, right));

        wrap.appendChild(card('참여자별 특징 키워드', h('div', { class: 'kw-grid' }, R.persons.filter(function (p) { return per[p.id] && per[p.id].distinct.length; }).slice(0, 12).map(function (p) {
            return h('div', { class: 'kw-card' }, h('div', { class: 'kw-card-head' }, who(p, { size: 'sm' })),
                h('div', { class: 'chips' }, per[p.id].distinct.slice(0, 8).map(function (k) { return chip(k[0], { onclick: function () { searchKeyword(k[0]); }, tip: num(k[1]) + '회 · 특징도 ' + k[2] }); })));
        })), { sub: '그 사람이 다른 사람보다 유독 자주 쓴 말' }));
        return wrap;
    }

    function trendResult(R, tr) {
        if (!tr.total) return h('p', { class: 'hint' }, "'" + tr.q + "'이(가) 들어간 메시지가 없어요.");
        var months = tr.monthly, mv = months.map(function (m) { return m[1]; }), maxP = tr.perPerson[0] ? tr.perPerson[0].count : 1;
        return h('div', { class: 'stack-y tight' },
            h('p', { class: 'trend-total' }, h('b', null, num(tr.total)), "개의 메시지에서 '" + tr.q + "' 발견"),
            KT.barList(tr.perPerson.slice(0, 8).map(function (r) {
                var p = S.peopleById[r.id] || { colorSlot: -1 };
                return { label: r.name, value: r.count, text: num(r.count) + '회', color: KT.color(p.colorSlot) };
            }), { max: maxP }),
            months.length > 1 ? [h('div', { class: 'sub-h' }, '월별 추이'), KT.miniBars(mv, months.map(function (m) { return KT.monthStr(m[0]); }), { aria: '월별 검색 결과', unit: '회' }),
                h('div', { class: 'axis' }, h('span', null, KT.monthStr(months[0][0])), h('span', null, KT.monthStr(months[months.length - 1][0])))] : null,
            h('div', { class: 'sub-h' }, '예시 메시지'),
            h('ul', { class: 'samples' }, tr.samples.map(function (m) {
                return h('li', null, h('span', { class: 'sm-meta' }, KT.dayStr(m.day) + ' · ' + m.name), h('span', null, hl(m.text.length > 140 ? m.text.slice(0, 140) + '…' : m.text, tr.q)));
            })));
    }

    function searchKeyword(q) {
        q = (q || '').trim();
        ui.kwQ = q;
        if (!q) { ui.kwTrend = null; KT.actions.render(); return; }
        KT.rpc('trend', { q: q }).then(function (res) { ui.kwTrend = res.trend; if (S.tab === 'keywords') KT.actions.render(); });
    }

    /* ---------- traits ---------- */

    function traits(R) {
        if (!R.total) return empty();
        var aw = awards(R), wrap = h('div', { class: 'stack-y' });
        wrap.appendChild(card('칭호', aw.length ? h('div', { class: 'awards' }, aw.map(awardCard)) : empty('칭호를 나눌 만큼 참여자가 충분하지 않아요.'),
            { sub: '같은 대화방 참여자들과 비교한 상대 평가예요 (규칙 기반)' }));
        wrap.appendChild(card('참여자 성향', h('div', { class: 'persona-grid' }, R.persons.slice(0, 18).map(function (p) {
            var tr = (p.traits || []).slice(0, 4);
            return h('article', { class: 'persona', tabindex: 0, onclick: function () { KT.actions.openPerson(p.id); }, onkeydown: function (e) { if (e.key === 'Enter') KT.actions.openPerson(p.id); } },
                h('div', { class: 'persona-head' }, who(p), h('em', null, num(p.msgs) + '개')),
                p.titles && p.titles.length ? h('div', { class: 'persona-titles' }, p.titles.map(function (t) { return h('span', { class: 'title-pill' }, t.icon + ' ' + t.title); })) : null,
                tr.length ? h('ul', { class: 'trait-list' }, tr.map(function (t) {
                    return h('li', null, h('span', null, t.icon + ' ' + t.title), h('span', { class: 'trait-bar', 'data-tip': t.label + ' ' + t.text }, h('i', { style: { width: Math.min(100, 30 + t.z * 22) + '%' } })), h('em', null, t.text));
                })) : h('p', { class: 'hint' }, '두드러지는 성향이 아직 없어요. 평범한 균형형!'),
                KT.miniBars(p.hours, p.hours.map(KT.hourLabel), { color: KT.color(p.colorSlot), aria: p.name + ' 시간대' }), hourAxis());
        })), { sub: '상위 18명 · 카드를 누르면 상세 정보가 열려요' }));
        return wrap;
    }

    /* ---------- relations ---------- */

    function relations(R) {
        if (R.persons.length < 2) return empty('관계를 보려면 참여자가 2명 이상 필요해요.');
        var N = Math.min(12, R.persons.length), P = R.persons.slice(0, N), wrap = h('div', { class: 'stack-y' });
        var rowSum = P.map(function (_, i) { return R.reply[i].reduce(function (a, b) { return a + b; }, 0); });
        function short(n) { return n.length > 4 ? n.slice(0, 4) + '…' : n; }
        var ctrl = h('div', { class: 'tools' }, seg([['row', '답장 비율'], ['raw', '답장 횟수']], ui.relNorm, function (v) { ui.relNorm = v; KT.actions.render(); }, '표시 방식'));
        var grid = KT.heatGrid({
            rows: P.map(function (p) { return short(p.name); }), cols: P.map(function (p) { return short(p.name); }), rowLabelWidth: 'minmax(54px, 84px)', class: 'rel', corner: '답장한 쪽 ↓', aria: '누가 누구에게 답장했는지',
            cell: function (r, c) {
                var raw = R.reply[r][c], v = ui.relNorm === 'row' ? (rowSum[r] ? raw / rowSum[r] : 0) : raw;
                return { v: r === c ? 0 : v, tip: P[r].name + ' → ' + P[c].name + ' · ' + num(raw) + '회' + (rowSum[r] ? ' (' + pct(raw / rowSum[r], 0) + ')' : '') };
            }
        });
        wrap.appendChild(card('누가 누구에게 답하나', [ctrl, h('div', { class: 'heat-wrap' }, grid)], { sub: '10분 안에 바로 이어진 메시지를 답장으로 봐요. 행(답장한 사람) → 열(답장받은 사람)' }));
        var pairs = topPairs(R, 10), maxp = pairs.length ? pairs[0].sum : 1;
        wrap.appendChild(card('가장 친한 짝', pairs.length ? KT.barList(pairs.map(function (x) {
            return { label: h('span', { class: 'pair' }, KT.avatar(x.a, 'sm'), x.a.name, h('i', null, '↔'), KT.avatar(x.b, 'sm'), x.b.name), value: x.sum, text: num(x.sum) + '회',
                tip: x.a.name + ' → ' + x.b.name + ' ' + num(x.ab) + '회 · ' + x.b.name + ' → ' + x.a.name + ' ' + num(x.ba) + '회' };
        }), { max: maxp }) : empty('주고받은 답장이 없어요.'), { sub: '서로 답장한 횟수의 합' }));
        return wrap;
    }

    /* ---------- report ---------- */

    function reportText(R) {
        var lines = ['[카카오톡 대화 분석 리포트]', S.roomTitle || ''].concat(narrative(R));
        awards(R).forEach(function (a) { lines.push(a.t.icon + ' ' + a.t.title + ': ' + a.p.name + ' (' + a.t.label + ' ' + a.t.text + ')'); });
        return lines.filter(Boolean).join('\n');
    }

    function report(R) {
        if (!R.total) return empty();
        var wrap = h('div', { class: 'stack-y report' });
        var tools = h('div', { class: 'tools' }, h('span', { class: 'grow' }),
            h('button', { class: 'btn ghost', type: 'button', onclick: function (e) { copyText(reportText(R), e.target); } }, '텍스트 복사'),
            h('button', { class: 'btn ghost', type: 'button', onclick: exportPng }, '이미지 저장'),
            h('button', { class: 'btn ghost', type: 'button', onclick: exportCsv }, 'CSV 저장'),
            h('button', { class: 'btn primary', type: 'button', onclick: function () { window.print(); } }, '인쇄 / PDF'));
        wrap.appendChild(card(null, [tools, h('div', { class: 'report-head' }, h('p', { class: 'eyebrow' }, 'ANALYSIS REPORT'), h('h2', null, S.roomTitle || '카카오톡 대화'), h('p', { class: 'sub' }, rangeText(R) + ' · ' + S.filterSummary))]));
        wrap.appendChild(card('요약', h('ul', { class: 'story big' }, narrative(R).map(function (t) { return h('li', null, t); }))));
        var aw = awards(R);
        if (aw.length) wrap.appendChild(card('칭호', h('div', { class: 'awards' }, aw.map(awardCard))));
        wrap.appendChild(card('참여자 TOP 10', KT.barList(R.persons.slice(0, 10).map(function (p) { return { label: who(p, { size: 'sm' }), value: p.msgs, text: num(p.msgs) + ' · ' + pct(p.share), color: KT.color(p.colorSlot) }; }))));
        wrap.appendChild(card('핵심 키워드', KT.tagCloud(R.keywords.global.slice(0, 40), null)));
        var pr = topPairs(R, 5);
        if (pr.length) wrap.appendChild(card('가장 친한 짝 TOP 5', h('ol', { class: 'plain' }, pr.map(function (x) { return h('li', null, x.a.name + ' ↔ ' + x.b.name + ' · ' + num(x.sum) + '회 (' + x.a.name + '→' + x.b.name + ' ' + num(x.ab) + ', 반대 ' + num(x.ba) + ')'); }))));
        if (R.domains.length) wrap.appendChild(card('자주 공유된 사이트', KT.barList(R.domains.slice(0, 8).map(function (d) { return { label: d[0], value: d[1], text: num(d[1]) + '회' }; }))));
        wrap.appendChild(h('p', { class: 'fine center' }, '※ 성향·칭호는 규칙 기반 통계이며 재미로 봐주세요. 키워드는 형태소 분석기 없이 조사·어미를 휴리스틱으로 제거해 일부 오차가 있어요.'));
        return wrap;
    }

    function copyText(text, btn) {
        var done = function () { var old = btn.textContent; btn.textContent = '복사됨'; setTimeout(function () { btn.textContent = old; }, 1400); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () {});
    }

    /* ---------- transcript ---------- */

    function transcript(R) {
        if (!R.total) return empty();
        var t = ui.tr, wrap = h('div', { class: 'stack-y' });
        var box = h('div', { class: 'chat' }, h('div', { class: 'empty small' }, '불러오는 중…'));
        var pageNo = Math.floor(t.start / t.page) + 1, pages = Math.max(1, Math.ceil(t.total / t.page));
        var first = R.days.keys[0], last = R.days.keys[R.days.keys.length - 1];
        var tools = h('div', { class: 'tools' },
            h('form', { class: 'search-form grow', onsubmit: function (e) { e.preventDefault(); t.q = e.target.q.value.trim(); t.start = 0; t.seek = null; loadTranscript(); } },
                h('input', { name: 'q', type: 'search', class: 'input', placeholder: '대화 내용 검색', 'aria-label': '대화 내용 검색', value: t.q }), h('button', { class: 'btn primary', type: 'submit' }, '검색')),
            h('label', { class: 'date-jump' }, '날짜로 이동', h('input', { type: 'date', class: 'input', min: KT.dayInput(first), max: KT.dayInput(last), onchange: function (e) { if (e.target.value) { t.seek = KT.inputDay(e.target.value); loadTranscript(); } } })));
        var pager = h('div', { class: 'pager' },
            h('button', { class: 'btn', type: 'button', disabled: t.start <= 0, onclick: function () { t.start = Math.max(0, t.start - t.page); t.seek = null; loadTranscript(); } }, '← 이전'),
            h('span', { id: 'trInfo' }, t.total ? num(t.start + 1) + '–' + num(Math.min(t.total, t.start + t.page)) + ' / ' + num(t.total) + '개' : ''),
            h('button', { class: 'btn', type: 'button', disabled: t.start + t.page >= t.total, onclick: function () { t.start += t.page; t.seek = null; loadTranscript(); } }, '다음 →'));
        wrap.appendChild(card('대화 원문', [tools, pager, box], { sub: '현재 필터가 적용된 메시지만 보여줘요' }));
        function loadTranscript() {
            KT.rpc('transcript', { q: t.q, start: t.start, count: t.page, seekDay: t.seek }).then(function (res) {
                t.total = res.total; t.start = res.start; t.rows = res.rows; t.seek = null;
                if (S.tab === 'transcript') KT.actions.render(true);
            });
        }
        if (t.rows.length || t.total) renderRows(box, t);
        if (!t.loaded) { t.loaded = true; loadTranscript(); }
        return wrap;
    }

    function renderRows(box, t) {
        KT.clear(box);
        if (!t.rows.length) { box.appendChild(h('div', { class: 'empty small' }, t.q ? "'" + t.q + "'에 해당하는 메시지가 없어요." : '메시지가 없어요.')); return; }
        var lastDay = 0;
        t.rows.forEach(function (m) {
            if (m.day !== lastDay) { lastDay = m.day; box.appendChild(h('div', { class: 'day-div' }, KT.dayStr(m.day) + ' ' + KT.WD[KT.dayToDate(m.day).getDay()] + '요일')); }
            var p = S.peopleById[m.pid] || { name: m.name, colorSlot: -1 };
            var body;
            if (m.kind === 1) body = h('span', { class: 'media' }, '📷 사진' + (m.num > 1 ? ' ' + m.num + '장' : ''));
            else if (m.kind > 1) body = h('span', { class: 'media' }, KIND_LABEL[m.kind] + (m.kind === 5 || m.kind === 4 ? m.text.replace(/^[^:]*:/, ':') : ''));
            else body = h('span', { class: 'txt' }, hl(m.text, t.q));
            box.appendChild(h('div', { class: 'msg' }, KT.avatar({ name: m.name, colorSlot: p.colorSlot }, 'sm'),
                h('div', { class: 'msg-body' }, h('div', { class: 'msg-meta' }, h('b', null, m.name), h('time', null, KT.timeStr(m.ts))), body)));
        });
    }

    /* ---------- person detail ---------- */

    function stat(label, value, sub) { return h('div', { class: 'stat' }, h('span', null, label), h('b', null, value), sub && h('em', null, sub)); }

    function personDetail(id) {
        var R = S.result, p = R && R.persons.filter(function (x) { return x.id === id; })[0];
        if (!p) return null;
        var d = R.keywords.per[p.id], idx = R.persons.indexOf(p);
        var b = KT.bucketize(R.days.keys, [R.days.per[idx]], 'week'), chartEl = h('div', { class: 'chart' });
        var partners = R.reply[idx].map(function (v, j) { return { p: R.persons[j], v: v }; }).filter(function (x) { return x.v > 0; }).sort(function (a, b) { return b.v - a.v; }).slice(0, 4);
        var wrap = h('div', { class: 'dlg-body' },
            h('header', { class: 'dlg-head' }, KT.avatar(p, 'lg'), h('div', null, h('h2', null, p.name), h('p', { class: 'sub' }, '메시지 ' + num(p.msgs) + '개 · 전체의 ' + pct(p.share) + ' · ' + (R.persons.indexOf(p) + 1) + '위')),
                h('button', { class: 'icon-btn', type: 'button', 'aria-label': '닫기', onclick: function () { S.dlg.close(); } }, '✕')),
            p.titles && p.titles.length ? h('div', { class: 'persona-titles' }, p.titles.map(function (t) { return h('span', { class: 'title-pill', 'data-tip': t.label + ' ' + t.text }, t.icon + ' ' + t.title); })) : null,
            h('div', { class: 'stats' },
                stat('글자 수', num(p.chars), '평균 ' + p.avgLen.toFixed(1) + '자'), stat('활동 일수', num(p.activeDays) + '일', '최다 ' + (p.peakDay ? KT.dayShort(p.peakDay) + ' ' + num(p.peakCount) + '개' : '-')),
                stat('사진', num(p.photos) + '장'), stat('이모티콘', num(p.emoticons)), stat('링크', num(p.links)), stat('질문(?)', num(p.questions), pct(p.text ? p.questions / p.text : 0) + ' of 텍스트'),
                stat('ㅋ·ㅎ', num(p.laugh)), stat('ㅠ·ㅜ', num(p.cry)), stat('대화 시작', num(p.starters) + '회'), stat('평균 답장', KT.minutes(p.avgReply), p.replyN ? num(p.replyN) + '건 기준' : ''),
                stat('연속 발언', p.avgBurst ? p.avgBurst.toFixed(2) + '개' : '-'), stat('심야 비율', pct(p.msgs ? p.night / p.msgs : 0))),
            h('div', { class: 'grid-2' },
                h('div', null, h('div', { class: 'sub-h' }, '시간대'), KT.miniBars(p.hours, p.hours.map(KT.hourLabel), { color: KT.color(p.colorSlot) }), hourAxis()),
                h('div', null, h('div', { class: 'sub-h' }, '요일'), KT.miniBars(p.wd, KT.WD.map(function (x) { return x + '요일'; }), { color: KT.color(p.colorSlot) }), h('div', { class: 'axis wd' }, KT.WD.map(function (x) { return h('span', null, x); })))),
            h('div', { class: 'sub-h' }, '주별 활동'), chartEl,
            d ? [h('div', { class: 'sub-h' }, '자주 쓴 말'), h('div', { class: 'chips' }, d.freq.slice(0, 14).map(function (k) { return chip(k[0] + ' ' + k[1], { onclick: function () { S.dlg.close(); ui.kwScope = p.id; ui.kwMode = 'freq'; KT.actions.setTab('keywords'); } }); })),
                d.distinct.length ? [h('div', { class: 'sub-h' }, '이 사람다운 말'), h('div', { class: 'chips' }, d.distinct.slice(0, 12).map(function (k) { return chip(k[0], { tip: num(k[1]) + '회', class: 'accent' }); }))] : null] : null,
            partners.length ? [h('div', { class: 'sub-h' }, '주로 답하는 상대'), KT.barList(partners.map(function (x) { return { label: who(x.p, { size: 'sm' }), value: x.v, text: num(x.v) + '회', color: KT.color(x.p.colorSlot) }; }))] : null,
            h('footer', { class: 'dlg-foot' }, h('button', { class: 'btn ghost', type: 'button', onclick: function () { S.dlg.close(); KT.actions.excludeName(p.name); } }, '이 사람 제외하고 보기'),
                h('button', { class: 'btn', type: 'button', onclick: function () { S.dlg.close(); } }, '닫기')));
        requestAnimationFrame(function () {
            KT.areaChart(chartEl, { keys: b.keys, series: [{ name: p.name, color: KT.color(p.colorSlot), values: b.arrays[0] }], mode: 'line', height: 150, label: weekLabel, aria: p.name + ' 주별 활동' });
        });
        return wrap;
    }

    /* ---------- exports ---------- */

    function download(name, blob) {
        var a = h('a', { href: URL.createObjectURL(blob), download: name });
        document.body.appendChild(a); a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    }

    function exportCsv() {
        var R = S.result; if (!R) return;
        var head = ['순위', '이름', '메시지', '비율', '글자 수', '평균 길이', '사진', '이모티콘', '동영상', '파일', '링크', '질문', 'ㅋㅎ', 'ㅠㅜ', '활동일', '대화 시작', '평균 답장(분)', '자주 쓴 키워드'];
        var rows = R.persons.map(function (p, i) {
            return [i + 1, p.name, p.msgs, (p.share * 100).toFixed(2) + '%', p.chars, p.avgLen.toFixed(1), p.photos, p.emoticons, p.videos, p.files, p.links, p.questions, p.laugh, p.cry, p.activeDays, p.starters,
                p.avgReply === null ? '' : p.avgReply.toFixed(1), ((R.keywords.per[p.id] || { freq: [] }).freq.slice(0, 7).map(function (k) { return k[0]; })).join(' ')];
        });
        var csv = [head].concat(rows).map(function (r) { return r.map(function (c) { c = String(c); return /[",\n]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c; }).join(','); }).join('\r\n');
        download('kakaotalk_ranking.csv', new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
    }

    function exportPng() {
        var R = S.result; if (!R || !R.total) return;
        var cs = getComputedStyle(document.body), v = function (n) { return cs.getPropertyValue(n).trim(); };
        var N = Math.min(10, R.persons.length), W = 1200, rowH = 58, H = 330 + N * rowH + 70, dpr = 2;
        var c = document.createElement('canvas'); c.width = W * dpr; c.height = H * dpr;
        var g = c.getContext('2d'); g.scale(dpr, dpr);
        var font = "'Pretendard', system-ui, 'Malgun Gothic', sans-serif";
        g.fillStyle = v('--bg'); g.fillRect(0, 0, W, H);
        g.fillStyle = v('--surface'); roundRect(g, 32, 32, W - 64, H - 64, 28); g.fill();
        g.strokeStyle = v('--border'); g.lineWidth = 2; g.stroke();
        g.textBaseline = 'alphabetic';
        g.fillStyle = v('--primary'); g.font = '800 20px ' + font; g.fillText('ISHS LAB · KAKAOTALK ANALYZER', 72, 92);
        g.fillStyle = v('--text'); g.font = '800 44px ' + font; g.fillText(clip(g, S.roomTitle || '카카오톡 대화', W - 144), 72, 150);
        g.fillStyle = v('--muted'); g.font = '500 22px ' + font; g.fillText(rangeText(R) + ' · ' + S.filterSummary, 72, 188);
        var kp = [['총 메시지', num(R.total)], ['참여자', R.persons.length + '명'], ['활동 일수', num(R.range.activeDays) + '일'], ['피크 시간', KT.WD[R.peak.wd] + ' ' + KT.hourLabel(R.peak.hour)]];
        kp.forEach(function (k, i) {
            var x = 72 + i * 270;
            g.fillStyle = v('--muted'); g.font = '600 18px ' + font; g.fillText(k[0], x, 246);
            g.fillStyle = v('--text'); g.font = '800 34px ' + font; g.fillText(k[1], x, 288);
        });
        var max = R.persons[0].msgs;
        R.persons.slice(0, N).forEach(function (p, i) {
            var y = 330 + i * rowH;
            g.fillStyle = v('--muted'); g.font = '700 20px ' + font; g.fillText(String(i + 1), 72, y + 34);
            g.fillStyle = slotColor(cs, p.colorSlot); g.beginPath(); g.arc(128, y + 26, 16, 0, Math.PI * 2); g.fill();
            g.fillStyle = '#fff'; g.font = '800 15px ' + font; g.textAlign = 'center'; g.fillText(KT.initial(p.name), 128, y + 32); g.textAlign = 'left';
            g.fillStyle = v('--text'); g.font = '700 22px ' + font; g.fillText(clip(g, p.name, 190), 158, y + 34);
            var bx = 370, bw = 560, bh = 22;
            g.fillStyle = v('--border'); roundRect(g, bx, y + 15, bw, bh, 11); g.fill();
            g.fillStyle = slotColor(cs, p.colorSlot); roundRect(g, bx, y + 15, Math.max(14, bw * p.msgs / max), bh, 11); g.fill();
            g.fillStyle = v('--text'); g.font = '700 21px ' + font; g.textAlign = 'right'; g.fillText(num(p.msgs) + ' · ' + pct(p.share), W - 72, y + 34); g.textAlign = 'left';
        });
        g.fillStyle = v('--muted'); g.font = '500 17px ' + font; g.fillText('내 기기에서만 분석한 결과예요 · ishslab', 72, H - 52);
        c.toBlob(function (blob) { if (blob) download('kakaotalk_report.png', blob); }, 'image/png');
    }
    function slotColor(cs, slot) { return cs.getPropertyValue(slot >= 0 && slot < 8 ? '--s' + (slot + 1) : '--s-other').trim() || '#888'; }
    function clip(g, text, w) { if (g.measureText(text).width <= w) return text; while (text.length > 1 && g.measureText(text + '…').width > w) text = text.slice(0, -1); return text + '…'; }
    function roundRect(g, x, y, w, hh, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + hh, r); g.arcTo(x + w, y + hh, x, y + hh, r); g.arcTo(x, y + hh, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }

    KT.panels = {
        overview: overview, ranking: ranking, trend: trend, keywords: keywords, traits: traits, relations: relations, report: report, transcript: transcript,
        personDetail: personDetail, renderRows: renderRows, narrative: narrative
    };
})(self);
