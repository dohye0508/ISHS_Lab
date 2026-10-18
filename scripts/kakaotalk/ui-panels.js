/* Tab renderers, person detail and exports.
 * Each tab answers one question; details live in the person window (KT.actions.openPerson). */
(function (root) {
    'use strict';
    var KT = root.KT, h = KT.h, num = KT.num, pct = KT.pct, S = KT.S = KT.S || {};
    var ui = S.ui = { sort: { key: 'msgs', dir: -1 }, bucket: null, hidden: {},
        kwScope: 'all', kwMode: 'distinct', kwQ: '', kwTrend: null, tr: { q: '', start: 0, total: 0, rows: [], page: 80, seek: null } };

    var KIND_LABEL = { 2: '이모티콘', 3: '동영상', 4: '파일', 5: '샵검색', 6: '음성메시지', 7: '삭제된 메시지' };

    /* ---------- building blocks ---------- */

    function card(title, body, o) {
        o = o || {};
        return h('section', { class: 'card' + (o.class ? ' ' + o.class : '') },
            (title || o.actions) && h('header', { class: 'card-head' }, h('h2', null, title), o.actions && h('div', { class: 'card-actions' }, o.actions)),
            body);
    }
    function more(label, tab) { return h('button', { class: 'link', type: 'button', onclick: function () { KT.actions.setTab(tab); } }, label + ' →'); }
    function seg(options, value, onChange, label) {
        return h('div', { class: 'seg', role: 'group', 'aria-label': label || '' }, options.map(function (o) {
            return h('button', { type: 'button', 'aria-pressed': String(o[0] === value), onclick: function () { onChange(o[0]); } }, o[1]);
        }));
    }
    function empty(msg) { return h('div', { class: 'empty' }, msg || '조건에 맞는 메시지가 없어요.'); }
    function who(p, size) { return h('span', { class: 'who' }, KT.avatar(p, size), h('span', { class: 'who-name' }, p.name)); }
    function open(id) { return function () { KT.actions.openPerson(id); }; }
    function onEnter(fn) { return function (e) { if (e.key === 'Enter') fn(); }; }

    function rangeText(R) {
        if (!R.total) return '';
        return KT.dayStr(KT.dateToDay(new Date(R.range.firstTs))) + ' – ' + KT.dayStr(KT.dateToDay(new Date(R.range.lastTs)));
    }

    function topPairs(R, limit) {
        var pairs = [], i, j, a = R.persons, M = R.reply;
        for (i = 0; i < a.length; i++) for (j = i + 1; j < a.length; j++) {
            if (M[i][j] + M[j][i] > 0) pairs.push({ a: a[i], b: a[j], sum: M[i][j] + M[j][i] });
        }
        pairs.sort(function (x, y) { return y.sum - x.sum; });
        return pairs.slice(0, limit || 5);
    }

    /** Three sentences at most: who talks, when, and with whom. */
    function headline(R) {
        var P = R.persons, out = [], top = P[0];
        out.push(top.name + '님이 전체 대화의 ' + pct(top.share, 0) + '를 차지해요.');
        out.push('대화는 ' + KT.WD[R.peak.wd] + '요일 ' + KT.hourLabel(R.peak.hour) + '에 가장 활발해요.');
        var pr = topPairs(R, 1)[0];
        if (pr) out.push('가장 많이 주고받은 사이는 ' + pr.a.name + '님과 ' + pr.b.name + '님이에요.');
        return out;
    }

    /* ---------- 요약 ---------- */

    function kpi(label, value) { return h('div', { class: 'kpi' }, h('span', { class: 'kpi-l' }, label), h('strong', { class: 'kpi-v' }, value)); }

    function summary(R) {
        if (!R.total) return empty();
        var P = R.persons, wrap = h('div', { class: 'stack-y' });
        wrap.appendChild(h('div', { class: 'kpis' },
            kpi('메시지', num(R.total)),
            kpi('참여자', P.length + '명'),
            kpi('기간', num(Math.round((KT.dayToDate(R.days.keys[R.days.keys.length - 1]) - KT.dayToDate(R.days.keys[0])) / 86400000) + 1) + '일'),
            kpi('가장 활발한 때', KT.WD[R.peak.wd] + ' ' + KT.hourLabel(R.peak.hour))));
        wrap.appendChild(h('div', { class: 'headline' }, headline(R).map(function (t) { return h('p', null, t); })));

        var max = P[0].msgs;
        var list = h('ol', { class: 'rank-list' }, P.slice(0, 5).map(function (p, i) {
            return h('li', { tabindex: 0, class: 'click', onclick: open(p.id), onkeydown: onEnter(open(p.id)) },
                h('span', { class: 'rank-n' }, String(i + 1)),
                h('span', { class: 'rank-who' }, who(p), p.title && h('span', { class: 'rank-title' }, p.title.title)),
                h('span', { class: 'rank-bar' }, h('i', { style: { width: Math.max(1, p.msgs / max * 100) + '%', background: KT.color(p.colorSlot) } })),
                h('span', { class: 'rank-v' }, num(p.msgs)));
        }));
        var chartEl = h('div', { class: 'chart' });
        wrap.appendChild(h('div', { class: 'grid-2' },
            card('많이 말한 사람', list, { actions: more('전체', 'people') }),
            card('주간 활동', chartEl, { actions: more('자세히', 'time') })));
        var b = KT.bucketize(R.days.keys, [R.days.total], 'week');
        KT.areaChart(chartEl, { keys: b.keys, series: [{ name: '메시지', color: 'var(--primary)', values: b.arrays[0] }], mode: 'line', height: 220, label: weekLabel, aria: '주별 메시지 수' });

        wrap.appendChild(h('div', { class: 'export-row' },
            h('button', { class: 'btn ghost', type: 'button', onclick: exportPng }, '이미지로 저장'),
            h('button', { class: 'btn ghost', type: 'button', onclick: exportCsv }, 'CSV로 저장')));
        return wrap;
    }

    function weekLabel(k, long) { return long ? KT.dayStr(k) + ' 주' : KT.dayShort(k); }

    /* ---------- 사람 ---------- */

    var COLS = [
        { k: 'msgs', t: '메시지', v: function (p) { return p.msgs; } },
        { k: 'chars', t: '글자 수', v: function (p) { return p.chars; }, hide: 'sm' },
        { k: 'avgLen', t: '평균 길이', v: function (p) { return p.avgLen; }, f: function (v) { return v.toFixed(1); }, hide: 'sm' },
        { k: 'activeDays', t: '활동일', v: function (p) { return p.activeDays; }, hide: 'md' }
    ];

    function people(R) {
        if (!R.total) return empty();
        var col = COLS.filter(function (c) { return c.k === ui.sort.key; })[0] || COLS[0];
        var P = R.persons.slice().sort(function (a, b) { return (col.v(a) - col.v(b)) * ui.sort.dir; });
        var max = R.persons[0].msgs, wrap = h('div', { class: 'stack-y' });
        var head = h('tr', null, h('th', { class: 'c-rank' }, '#'), h('th', null, '이름'),
            COLS.map(function (c) {
                var on = ui.sort.key === c.k;
                return h('th', { class: 'num' + (c.hide ? ' hide-' + c.hide : ''), 'aria-sort': on ? (ui.sort.dir < 0 ? 'descending' : 'ascending') : 'none' },
                    h('button', { type: 'button', class: 'th-btn' + (on ? ' on' : ''), onclick: function () { ui.sort = { key: c.k, dir: on ? -ui.sort.dir : -1 }; KT.actions.render(true); } }, c.t, on ? (ui.sort.dir < 0 ? ' ↓' : ' ↑') : ''));
            }));
        var rows = P.map(function (p) {
            return h('tr', { tabindex: 0, class: 'click', onclick: open(p.id), onkeydown: onEnter(open(p.id)) },
                h('td', { class: 'c-rank' }, String(R.persons.indexOf(p) + 1)),
                h('td', null, who(p)),
                COLS.map(function (c) {
                    var v = c.v(p), txt = c.f ? c.f(v) : num(v);
                    if (c.k === 'msgs') return h('td', { class: 'num msgcell' }, h('span', { class: 'mc-top' }, h('b', null, txt), h('em', null, pct(p.share))), h('span', { class: 'mc-bar' }, h('i', { style: { width: Math.max(1, p.msgs / max * 100) + '%', background: KT.color(p.colorSlot) } })));
                    return h('td', { class: 'num' + (c.hide ? ' hide-' + c.hide : '') }, txt);
                }));
        });
        wrap.appendChild(card('순위', h('div', { class: 'table-wrap' }, h('table', { class: 'tbl' }, h('thead', null, head), h('tbody', null, rows)))));

        var titled = R.persons.filter(function (p) { return p.title; });
        if (titled.length) {
            wrap.appendChild(card('칭호', h('ul', { class: 'titles' }, titled.map(function (p) {
                return h('li', { tabindex: 0, class: 'click', onclick: open(p.id), onkeydown: onEnter(open(p.id)) },
                    h('b', { class: 't-name' }, p.title.title), who(p, 'sm'), h('span', { class: 't-desc' }, p.title.desc));
            }))));
        }

        var pairs = topPairs(R, 5);
        if (pairs.length) {
            var pm = pairs[0].sum;
            wrap.appendChild(card('자주 주고받은 사이', h('ol', { class: 'rank-list' }, pairs.map(function (x, i) {
                return h('li', null, h('span', { class: 'rank-n' }, String(i + 1)),
                    h('span', { class: 'rank-who' }, x.a.name + ' · ' + x.b.name),
                    h('span', { class: 'rank-bar' }, h('i', { style: { width: Math.max(1, x.sum / pm * 100) + '%' } })),
                    h('span', { class: 'rank-v' }, num(x.sum)));
            }))));
        }
        return wrap;
    }

    /* ---------- 시간 ---------- */

    function defaultBucket(R) { return R.days.keys.length <= 100 ? 'day' : R.days.keys.length > 900 ? 'month' : 'week'; }

    function time(R) {
        if (!R.total) return empty();
        var bucket = ui.bucket || defaultBucket(R), wrap = h('div', { class: 'stack-y' });
        var topN = R.persons.slice(0, 5), rest = R.persons.slice(5), series = [];
        topN.forEach(function (p) { series.push({ id: p.id, name: p.name, color: KT.color(p.colorSlot), arr: R.days.per[R.persons.indexOf(p)] }); });
        if (rest.length) {
            var o = R.days.total.map(function () { return 0; });
            rest.forEach(function (p) { R.days.per[R.persons.indexOf(p)].forEach(function (v, i) { o[i] += v; }); });
            series.push({ id: 'other', name: '그 외 ' + rest.length + '명', color: 'var(--s-other)', arr: o });
        }
        var visible = function (id) { return !ui.hidden[id]; };
        var shown = series.filter(function (s) { return visible(s.id); });
        var b = KT.bucketize(R.days.keys, shown.map(function (s) { return s.arr; }), bucket);
        var chartEl = h('div', { class: 'chart' });
        var legend = h('ul', { class: 'legend toggle' }, series.map(function (s) {
            return h('li', null, h('button', { type: 'button', 'aria-pressed': String(visible(s.id)), onclick: function () { ui.hidden[s.id] = visible(s.id); KT.actions.render(true); } }, h('i', { style: { background: s.color } }), s.name));
        }));
        wrap.appendChild(card('활동 추이', [chartEl, legend], { actions: seg([['day', '일'], ['week', '주'], ['month', '월']], bucket, function (v) { ui.bucket = v; KT.actions.render(true); }, '집계 단위') }));
        KT.areaChart(chartEl, {
            keys: b.keys, mode: 'stack', height: 300, aria: '참여자별 메시지 추이',
            series: shown.map(function (s, i) { return { name: s.name, color: s.color, values: b.arrays[i] }; }),
            label: function (k, long) { return bucket === 'month' ? KT.monthStr(Math.floor(k / 100)) : bucket === 'week' ? weekLabel(k, long) : (long ? KT.dayStr(k) : KT.dayShort(k)); }
        });

        var order = [1, 2, 3, 4, 5, 6, 0];
        wrap.appendChild(card('요일 · 시간대', h('div', { class: 'heat-wrap' }, KT.heatGrid({
            rows: order.map(function (d) { return KT.WD[d]; }), cols: Array.apply(null, Array(24)).map(function (_, i) { return String(i); }), colEvery: 3, aria: '요일과 시간대별 메시지 수',
            cell: function (r, c) { var v = R.heat[order[r] * 24 + c]; return { v: v, tip: KT.WD[order[r]] + '요일 ' + KT.hourLabel(c) + ' · ' + num(v) + '개' }; }
        }))));
        return wrap;
    }

    /* ---------- 키워드 ---------- */

    function hl(text, q) {
        if (!q) return text;
        var out = [], low = text.toLowerCase(), ql = q.toLowerCase(), i = 0, j;
        while ((j = low.indexOf(ql, i)) >= 0) { out.push(text.slice(i, j), h('mark', null, text.slice(j, j + q.length))); i = j + q.length; }
        out.push(text.slice(i));
        return out;
    }

    function keywords(R) {
        if (!R.total) return empty();
        var K = R.keywords, per = K.per, wrap = h('div', { class: 'stack-y' });
        if (ui.kwScope !== 'all' && !per[ui.kwScope]) ui.kwScope = 'all';
        var person = ui.kwScope === 'all' ? null : R.persons.filter(function (p) { return p.id === ui.kwScope; })[0];
        var words = !person ? K.global.slice(0, 50).map(function (k) { return { t: k.t, c: k.c }; })
            : (ui.kwMode === 'distinct' ? per[person.id].distinct : per[person.id].freq).map(function (k) { return { t: k[0], c: k[1] }; });
        var select = h('select', { class: 'input', 'aria-label': '키워드 대상', onchange: function (e) { ui.kwScope = e.target.value === 'all' ? 'all' : +e.target.value; KT.actions.render(true); } },
            h('option', { value: 'all', selected: ui.kwScope === 'all' }, '전체'),
            R.persons.filter(function (p) { return per[p.id]; }).map(function (p) { return h('option', { value: p.id, selected: ui.kwScope === p.id }, p.name); }));
        var actions = h('div', { class: 'card-actions-row' }, person ? seg([['distinct', '이 사람다운 말'], ['freq', '많이 쓴 말']], ui.kwMode, function (v) { ui.kwMode = v; KT.actions.render(true); }, '기준') : null, select);
        var left = card('키워드', words.length ? KT.tagCloud(words.slice(0, 40), searchKeyword) : empty('키워드를 뽑기엔 글이 적어요.'), { actions: actions });

        var tr = ui.kwTrend;
        var right = card('누가 썼을까', [
            h('form', { class: 'search-form', onsubmit: function (e) { e.preventDefault(); searchKeyword(e.target.q.value); } },
                h('input', { name: 'q', type: 'search', class: 'input', placeholder: '단어 검색', value: ui.kwQ, 'aria-label': '키워드 검색' }),
                h('button', { class: 'btn primary', type: 'submit' }, '검색')),
            tr ? trendResult(tr) : null]);
        wrap.appendChild(h('div', { class: 'grid-2 wide-left' }, left, right));

        var withKw = R.persons.filter(function (p) { return per[p.id] && per[p.id].distinct.length; }).slice(0, 12);
        if (withKw.length) {
            wrap.appendChild(card('사람별 대표 키워드', h('ul', { class: 'kw-rows' }, withKw.map(function (p) {
                return h('li', null, who(p, 'sm'), h('span', { class: 'kw-words' }, per[p.id].distinct.slice(0, 6).map(function (k) {
                    return h('button', { type: 'button', class: 'kw-word', onclick: function () { searchKeyword(k[0]); } }, k[0]);
                })));
            }))));
        }
        return wrap;
    }

    function trendResult(tr) {
        if (!tr.total) return h('p', { class: 'muted' }, "'" + tr.q + "'이(가) 들어간 메시지가 없어요.");
        var maxP = tr.perPerson[0].count;
        return h('div', { class: 'stack-y tight' },
            h('p', { class: 'trend-total' }, h('b', null, num(tr.total)), '개 메시지'),
            KT.barList(tr.perPerson.slice(0, 6).map(function (r) {
                var p = S.peopleById[r.id] || { colorSlot: -1 };
                return { label: r.name, value: r.count, text: num(r.count), color: KT.color(p.colorSlot) };
            }), { max: maxP }),
            h('ul', { class: 'samples' }, tr.samples.slice(0, 4).map(function (m) {
                return h('li', null, h('span', { class: 'sm-meta' }, m.name + ' · ' + KT.dayStr(m.day)), h('span', null, hl(m.text.length > 120 ? m.text.slice(0, 120) + '…' : m.text, tr.q)));
            })));
    }

    function searchKeyword(q) {
        q = (q || '').trim();
        ui.kwQ = q;
        if (!q) { ui.kwTrend = null; KT.actions.render(true); return; }
        KT.rpc('trend', { q: q }).then(function (res) { ui.kwTrend = res.trend; if (S.tab === 'keywords') KT.actions.render(true); });
    }

    /* ---------- 대화 원문 ---------- */

    function transcript(R) {
        if (!R.total) return empty();
        var t = ui.tr;
        var box = h('div', { class: 'chat' }, h('div', { class: 'empty small' }, '불러오는 중…'));
        var first = R.days.keys[0], last = R.days.keys[R.days.keys.length - 1];
        function go(start) { t.start = start; t.seek = null; load(); }
        var tools = h('div', { class: 'tools' },
            h('form', { class: 'search-form grow', onsubmit: function (e) { e.preventDefault(); t.q = e.target.q.value.trim(); go(0); } },
                h('input', { name: 'q', type: 'search', class: 'input', placeholder: '대화 검색', 'aria-label': '대화 검색', value: t.q }), h('button', { class: 'btn primary', type: 'submit' }, '검색')),
            h('input', { type: 'date', class: 'input date', 'aria-label': '날짜로 이동', min: KT.dayInput(first), max: KT.dayInput(last), onchange: function (e) { if (e.target.value) { t.seek = KT.inputDay(e.target.value); load(); } } }));
        function pager() {
            return h('div', { class: 'pager' },
                h('button', { class: 'btn', type: 'button', disabled: t.start <= 0, onclick: function () { go(Math.max(0, t.start - t.page)); } }, '이전'),
                h('span', { class: 'trInfo' }, num(t.start + 1) + '–' + num(Math.min(t.total, t.start + t.page)) + ' / ' + num(t.total)),
                h('button', { class: 'btn', type: 'button', disabled: t.start + t.page >= t.total, onclick: function () { go(t.start + t.page); } }, '다음'));
        }
        function load() {
            KT.rpc('transcript', { q: t.q, start: t.start, count: t.page, seekDay: t.seek }).then(function (res) {
                t.total = res.total; t.start = res.start; t.rows = res.rows; t.seek = null; t.loaded = true;
                if (S.tab === 'transcript') KT.actions.render(true);
            });
        }
        if (t.loaded) renderRows(box, t); else load();
        return card(null, [tools, box, t.total > t.page ? pager() : null]);
    }

    function renderRows(box, t) {
        KT.clear(box);
        if (!t.rows.length) { box.appendChild(h('div', { class: 'empty small' }, t.q ? '검색 결과가 없어요.' : '메시지가 없어요.')); return; }
        var lastDay = 0;
        t.rows.forEach(function (m) {
            if (m.day !== lastDay) { lastDay = m.day; box.appendChild(h('div', { class: 'day-div' }, KT.dayStr(m.day) + ' ' + KT.WD[KT.dayToDate(m.day).getDay()])); }
            var p = S.peopleById[m.pid] || { colorSlot: -1 };
            var body;
            if (m.kind === 1) body = h('span', { class: 'media' }, '사진' + (m.num > 1 ? ' ' + m.num + '장' : ''));
            else if (m.kind > 1) body = h('span', { class: 'media' }, KIND_LABEL[m.kind]);
            else body = h('span', { class: 'txt' }, hl(m.text, t.q));
            box.appendChild(h('div', { class: 'msg' }, KT.avatar({ name: m.name, colorSlot: p.colorSlot }, 'sm'),
                h('div', { class: 'msg-body' }, h('div', { class: 'msg-meta' }, h('b', null, m.name), h('time', null, KT.timeStr(m.ts))), body)));
        });
    }

    /* ---------- person window ---------- */

    function stat(label, value) { return h('div', { class: 'stat' }, h('span', null, label), h('b', null, value)); }

    function personDetail(id) {
        var R = S.result, p = R && R.persons.filter(function (x) { return x.id === id; })[0];
        if (!p) return null;
        var d = R.keywords.per[p.id], idx = R.persons.indexOf(p);
        var partners = R.reply[idx].map(function (v, j) { return { p: R.persons[j], v: v }; }).filter(function (x) { return x.v > 0; }).sort(function (a, b) { return b.v - a.v; }).slice(0, 3);
        var peakHour = p.hours.indexOf(Math.max.apply(null, p.hours));
        return h('div', { class: 'dlg-body' },
            h('header', { class: 'dlg-head' }, KT.avatar(p, 'lg'),
                h('div', null, h('h2', null, p.name), h('p', { class: 'dlg-sub' }, (idx + 1) + '위 · ' + num(p.msgs) + '개 · ' + pct(p.share))),
                h('button', { class: 'icon-btn', type: 'button', 'aria-label': '닫기', onclick: function () { S.dlg.close(); } }, '✕')),
            p.title ? h('div', { class: 'dlg-title' }, h('b', null, p.title.title), h('span', null, p.title.desc)) : null,
            h('div', { class: 'stats' },
                stat('평균 길이', p.avgLen.toFixed(1) + '자'), stat('활동일', num(p.activeDays) + '일'), stat('평균 답장', KT.minutes(p.avgReply)),
                stat('사진', num(p.photos)), stat('이모티콘', num(p.emoticons)), stat('주로 말하는 때', KT.hourLabel(peakHour))),
            h('div', { class: 'sub-h' }, '시간대'), KT.miniBars(p.hours, p.hours.map(KT.hourLabel), { color: KT.color(p.colorSlot) }),
            h('div', { class: 'axis' }, [0, 6, 12, 18, 23].map(function (x) { return h('span', null, x + '시'); })),
            d && d.distinct.length ? [h('div', { class: 'sub-h' }, '이 사람다운 말'), h('p', { class: 'words' }, d.distinct.slice(0, 10).map(function (k) { return k[0]; }).join(' · '))] : null,
            d ? [h('div', { class: 'sub-h' }, '많이 쓴 말'), h('p', { class: 'words' }, d.freq.slice(0, 10).map(function (k) { return k[0]; }).join(' · '))] : null,
            partners.length ? [h('div', { class: 'sub-h' }, '주로 답하는 상대'), h('p', { class: 'words' }, partners.map(function (x) { return x.p.name + ' ' + num(x.v) + '회'; }).join(' · '))] : null,
            h('footer', { class: 'dlg-foot' }, h('button', { class: 'btn ghost', type: 'button', onclick: function () { S.dlg.close(); KT.actions.excludeName(p.name); } }, '이 사람 빼고 보기')));
    }

    /* ---------- exports ---------- */

    function download(name, blob) {
        var a = h('a', { href: URL.createObjectURL(blob), download: name });
        document.body.appendChild(a); a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    }

    function exportCsv() {
        var R = S.result; if (!R) return;
        var head = ['순위', '이름', '칭호', '메시지', '비율', '글자 수', '평균 길이', '사진', '이모티콘', '링크', '질문', '활동일', '평균 답장(분)', '대표 키워드'];
        var rows = R.persons.map(function (p, i) {
            return [i + 1, p.name, p.title ? p.title.title : '', p.msgs, (p.share * 100).toFixed(2) + '%', p.chars, p.avgLen.toFixed(1), p.photos, p.emoticons, p.links, p.questions, p.activeDays,
                p.avgReply === null ? '' : p.avgReply.toFixed(1), ((R.keywords.per[p.id] || { distinct: [] }).distinct.slice(0, 6).map(function (k) { return k[0]; })).join(' ')];
        });
        var csv = [head].concat(rows).map(function (r) { return r.map(function (c) { c = String(c); return /[",\n]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c; }).join(','); }).join('\r\n');
        download('kakaotalk_ranking.csv', new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
    }

    function exportPng() {
        var R = S.result; if (!R || !R.total) return;
        var cs = getComputedStyle(document.body), v = function (n) { return cs.getPropertyValue(n).trim(); };
        var N = Math.min(8, R.persons.length), W = 1080, rowH = 64, H = 300 + N * rowH + 60, dpr = 2;
        var c = document.createElement('canvas'); c.width = W * dpr; c.height = H * dpr;
        var g = c.getContext('2d'); g.scale(dpr, dpr);
        var font = "'Pretendard', system-ui, 'Malgun Gothic', sans-serif";
        g.fillStyle = v('--surface'); g.fillRect(0, 0, W, H);
        g.fillStyle = v('--muted'); g.font = '600 18px ' + font; g.fillText(rangeText(R), 64, 80);
        g.fillStyle = v('--text'); g.font = '800 44px ' + font; g.fillText(clip(g, S.roomTitle || '카카오톡 대화', W - 128), 64, 134);
        var kp = [['메시지', num(R.total)], ['참여자', R.persons.length + '명'], ['가장 활발한 때', KT.WD[R.peak.wd] + ' ' + KT.hourLabel(R.peak.hour)]];
        kp.forEach(function (k, i) {
            var x = 64 + i * 300;
            g.fillStyle = v('--muted'); g.font = '600 17px ' + font; g.fillText(k[0], x, 196);
            g.fillStyle = v('--text'); g.font = '800 32px ' + font; g.fillText(k[1], x, 236);
        });
        var max = R.persons[0].msgs;
        R.persons.slice(0, N).forEach(function (p, i) {
            var y = 290 + i * rowH;
            g.fillStyle = v('--muted'); g.font = '700 18px ' + font; g.fillText(String(i + 1), 64, y + 30);
            g.fillStyle = v('--text'); g.font = '700 21px ' + font; g.fillText(clip(g, p.name, 170), 100, y + 30);
            if (p.title) { g.fillStyle = v('--muted'); g.font = '500 15px ' + font; g.fillText(p.title.title, 100, y + 52); }
            var bx = 300, bw = 560;
            g.fillStyle = v('--surface-2'); roundRect(g, bx, y + 14, bw, 18, 9); g.fill();
            g.fillStyle = slotColor(cs, p.colorSlot); roundRect(g, bx, y + 14, Math.max(12, bw * p.msgs / max), 18, 9); g.fill();
            g.fillStyle = v('--text'); g.font = '700 19px ' + font; g.textAlign = 'right'; g.fillText(num(p.msgs), W - 64, y + 30); g.textAlign = 'left';
        });
        c.toBlob(function (blob) { if (blob) download('kakaotalk_summary.png', blob); }, 'image/png');
    }
    function slotColor(cs, slot) { return cs.getPropertyValue(slot >= 0 && slot < 8 ? '--s' + (slot + 1) : '--s-other').trim() || '#888'; }
    function clip(g, text, w) { if (g.measureText(text).width <= w) return text; while (text.length > 1 && g.measureText(text + '…').width > w) text = text.slice(0, -1); return text + '…'; }
    function roundRect(g, x, y, w, hh, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + hh, r); g.arcTo(x + w, y + hh, x, y + hh, r); g.arcTo(x, y + hh, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }

    KT.panels = { summary: summary, people: people, time: time, keywords: keywords, transcript: transcript, personDetail: personDetail };
})(self);
