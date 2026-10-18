/* DOM helpers and dependency-free charts for the KakaoTalk analyzer (SVG + CSS). */
(function (root) {
    'use strict';
    var KT = root.KT = root.KT || {};
    var SVGNS = 'http://www.w3.org/2000/svg';
    var WD = ['일', '월', '화', '수', '목', '금', '토'];

    /* ---------- DOM ---------- */

    function h(tag, props) {
        var el = document.createElement(tag), i, k, v;
        if (props) {
            for (k in props) {
                v = props[k];
                if (v === undefined || v === null || v === false) continue;
                if (k === 'class') el.className = v;
                else if (k === 'style' && typeof v === 'object') setStyle(el, v);
                else if (k === 'dataset') Object.assign(el.dataset, v);
                else if (k.slice(0, 2) === 'on' && typeof v === 'function') el.addEventListener(k.slice(2), v);
                else if (k === 'text') el.textContent = v;
                else if (v === true) el.setAttribute(k, '');
                else el.setAttribute(k, v);
            }
        }
        for (i = 2; i < arguments.length; i++) append(el, arguments[i]);
        return el;
    }
    /** Object.assign(el.style, ...) silently ignores CSS custom properties, so route those through setProperty. */
    function setStyle(el, obj) {
        for (var k in obj) {
            if (k.slice(0, 2) === '--') el.style.setProperty(k, obj[k]);
            else el.style[k] = obj[k];
        }
    }
    function append(el, c) {
        if (c === undefined || c === null || c === false) return;
        if (Array.isArray(c)) c.forEach(function (x) { append(el, x); });
        else el.appendChild(c.nodeType ? c : document.createTextNode(String(c)));
    }
    function s(tag, props) {
        var el = document.createElementNS(SVGNS, tag), k;
        for (k in props || {}) {
            if (k === 'style' && typeof props[k] === 'object') setStyle(el, props[k]);
            else if (k === 'text') el.textContent = props[k];
            else el.setAttribute(k, props[k]);
        }
        for (var i = 2; i < arguments.length; i++) append(el, arguments[i]);
        return el;
    }
    function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); return el; }

    /* ---------- formatting ---------- */

    function num(v) { return Math.round(v).toLocaleString('ko-KR'); }
    function pct(v, d) { return (v * 100).toFixed(d === undefined ? 1 : d) + '%'; }
    function dayStr(k) { return Math.floor(k / 10000) + '.' + pad(Math.floor(k / 100) % 100) + '.' + pad(k % 100); }
    function dayShort(k) { return Math.floor(k / 10000) % 100 + '.' + pad(Math.floor(k / 100) % 100); }
    function monthStr(k) { return Math.floor(k / 100) + '.' + pad(k % 100); }
    function pad(v) { return v < 10 ? '0' + v : '' + v; }
    function dayToDate(k) { return new Date(Math.floor(k / 10000), Math.floor(k / 100) % 100 - 1, k % 100); }
    function dateToDay(d) { return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate(); }
    function dayInput(k) { return Math.floor(k / 10000) + '-' + pad(Math.floor(k / 100) % 100) + '-' + pad(k % 100); }
    function inputDay(v) { return v ? +v.replace(/-/g, '') : null; }
    function hourLabel(hh) { return (hh < 12 ? '오전 ' : '오후 ') + (hh % 12 === 0 ? 12 : hh % 12) + '시'; }
    function timeStr(ts) {
        var d = new Date(ts), hh = d.getHours();
        return (hh < 12 ? '오전 ' : '오후 ') + (hh % 12 === 0 ? 12 : hh % 12) + ':' + pad(d.getMinutes());
    }
    function minutes(v) {
        if (v === null || v === undefined) return '-';
        if (v < 1) return '1분 미만';
        return v.toFixed(v < 10 ? 1 : 0) + '분';
    }
    function dur(ms) {
        var d = Math.round(ms / 86400000);
        if (d >= 365) return (d / 365).toFixed(1) + '년';
        if (d >= 30) return Math.round(d / 30) + '개월';
        return d + '일';
    }

    /* ---------- colors ---------- */

    function color(slot) { return slot >= 0 && slot < 8 ? 'var(--s' + (slot + 1) + ')' : 'var(--s-other)'; }
    function initial(name) { var m = /[A-Za-z0-9가-힣]/.exec(name); return m ? m[0].toUpperCase() : '?'; }
    function avatar(p, size) {
        return h('span', { class: 'avatar' + (size ? ' ' + size : ''), style: { background: color(p.colorSlot) }, 'aria-hidden': 'true' }, initial(p.name));
    }

    /* ---------- tooltip ---------- */

    var tipEl = null;
    var tip = {
        show: function (content, x, y) {
            if (!tipEl) { tipEl = h('div', { class: 'kt-tip', role: 'tooltip' }); document.body.appendChild(tipEl); }
            clear(tipEl); append(tipEl, content);
            tipEl.style.display = 'block';
            var r = tipEl.getBoundingClientRect(), nx = x + 14, ny = y + 14;
            if (nx + r.width > window.innerWidth - 8) nx = x - r.width - 14;
            if (ny + r.height > window.innerHeight - 8) ny = y - r.height - 14;
            tipEl.style.left = Math.max(8, nx) + 'px';
            tipEl.style.top = Math.max(8, ny) + 'px';
        },
        hide: function () { if (tipEl) tipEl.style.display = 'none'; }
    };
    document.addEventListener('pointermove', function (e) {
        var t = e.target && e.target.closest ? e.target.closest('[data-tip]') : null;
        if (t) tip.show(t.getAttribute('data-tip'), e.clientX, e.clientY);
        else if (!(e.target && e.target.closest && e.target.closest('.kt-hover'))) tip.hide();
    });
    document.addEventListener('scroll', function () { tip.hide(); }, true);

    /* ---------- time bucketing ---------- */

    function expandDays(keys, arrays) {
        if (!keys.length) return { keys: [], arrays: arrays.map(function () { return []; }) };
        var out = [], idx = new Map(), d = dayToDate(keys[0]), end = dayToDate(keys[keys.length - 1]), i;
        keys.forEach(function (k, j) { idx.set(k, j); });
        var outArr = arrays.map(function () { return []; });
        while (d <= end) {
            var k = dateToDay(d), j = idx.get(k);
            out.push(k);
            for (i = 0; i < arrays.length; i++) outArr[i].push(j === undefined ? 0 : arrays[i][j]);
            d.setDate(d.getDate() + 1);
        }
        return { keys: out, arrays: outArr };
    }

    function bucketKey(k, bucket) {
        if (bucket === 'day') return k;
        var d = dayToDate(k);
        if (bucket === 'month') return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + 1;
        var back = (d.getDay() + 6) % 7;
        d.setDate(d.getDate() - back);
        return dateToDay(d);
    }

    function bucketize(keys, arrays, bucket) {
        var ex = expandDays(keys, arrays), outKeys = [], outArr = arrays.map(function () { return []; }), last = -1, i, j;
        for (i = 0; i < ex.keys.length; i++) {
            var bk = bucketKey(ex.keys[i], bucket);
            if (bk !== last) { outKeys.push(bk); for (j = 0; j < arrays.length; j++) outArr[j].push(0); last = bk; }
            for (j = 0; j < arrays.length; j++) outArr[j][outKeys.length - 1] += ex.arrays[j][i];
        }
        return { keys: outKeys, arrays: outArr };
    }

    function niceMax(v) {
        if (v <= 0) return 1;
        var p = Math.pow(10, Math.floor(Math.log10(v))), f = v / p;
        return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * p;
    }

    function watch(el, draw) {
        if (el.__ro) el.__ro.disconnect();
        var w = el.clientWidth;
        if (typeof ResizeObserver === 'undefined') return;
        el.__ro = new ResizeObserver(function () { if (el.clientWidth !== w && el.clientWidth > 0) { w = el.clientWidth; draw(); } });
        el.__ro.observe(el);
    }

    /* ---------- area / line chart ---------- */

    /** o: { keys:[dayKey], series:[{name,color,values}], mode:'stack'|'line', label:fn(key), height, total:bool } */
    function areaChart(el, o) {
        function draw() {
            clear(el);
            var W = el.clientWidth || 640, H = o.height || 260, m = { l: 46, r: 12, t: 12, b: 26 };
            var n = o.keys.length, series = o.series, S = series.length, i, k;
            if (!n || !S) { el.appendChild(h('div', { class: 'empty small' }, '표시할 데이터가 없어요')); return; }
            var cum = [], ymax = 0;
            for (i = 0; i < n; i++) {
                var acc = 0;
                for (k = 0; k < S; k++) {
                    cum[k] = cum[k] || [];
                    cum[k][i] = acc;
                    acc += series[k].values[i];
                    if (o.mode !== 'stack') ymax = Math.max(ymax, series[k].values[i]);
                }
                if (o.mode === 'stack') ymax = Math.max(ymax, acc);
            }
            ymax = niceMax(ymax);
            var pw = W - m.l - m.r, ph = H - m.t - m.b;
            function x(i) { return m.l + (n === 1 ? pw / 2 : i * pw / (n - 1)); }
            function y(v) { return m.t + ph - v / ymax * ph; }
            var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, width: W, height: H, role: 'img', 'aria-label': o.aria || '활동 추이 차트', class: 'kt-svg' });
            for (i = 0; i <= 4; i++) {
                var gy = y(ymax * i / 4);
                svg.appendChild(s('line', { x1: m.l, x2: W - m.r, y1: gy, y2: gy, class: 'grid' }));
                svg.appendChild(s('text', { x: m.l - 8, y: gy + 4, class: 'tick', 'text-anchor': 'end', text: num(ymax * i / 4) }));
            }
            var labelN = Math.max(2, Math.min(7, Math.floor(pw / 90)));
            for (i = 0; i < labelN; i++) {
                var li = Math.round(i * (n - 1) / (labelN - 1 || 1));
                svg.appendChild(s('text', { x: x(li), y: H - 7, class: 'tick', 'text-anchor': i === 0 ? 'start' : i === labelN - 1 ? 'end' : 'middle', text: o.label(o.keys[li]) }));
            }
            for (k = S - 1; k >= 0; k--) {
                var sr = series[k];
                if (o.mode === 'stack') {
                    var top = [], bot = [];
                    for (i = 0; i < n; i++) { top.push(x(i) + ',' + y(cum[k][i] + sr.values[i])); bot.push(x(n - 1 - i) + ',' + y(cum[k][n - 1 - i])); }
                    svg.appendChild(s('polygon', { points: top.concat(bot).join(' '), class: 'area', style: { fill: sr.color } }));
                } else {
                    var pts = [];
                    for (i = 0; i < n; i++) pts.push(x(i) + ',' + y(sr.values[i]));
                    svg.appendChild(s('polyline', { points: pts.join(' '), class: 'line', style: { stroke: sr.color } }));
                }
            }
            var cross = s('line', { y1: m.t, y2: m.t + ph, class: 'cross', style: { display: 'none' } });
            var dots = s('g', {});
            svg.appendChild(cross); svg.appendChild(dots);
            var hit = s('rect', { x: m.l, y: m.t, width: pw, height: ph, fill: 'transparent', class: 'kt-hover' });
            hit.addEventListener('pointermove', function (e) {
                var r = svg.getBoundingClientRect(), px = (e.clientX - r.left) * (W / r.width);
                var idx = Math.max(0, Math.min(n - 1, Math.round((px - m.l) / (pw / (n - 1 || 1)))));
                cross.setAttribute('x1', x(idx)); cross.setAttribute('x2', x(idx)); cross.style.display = '';
                clear(dots);
                var rows = [], tot = 0;
                series.forEach(function (sr2, kk) {
                    var v = sr2.values[idx]; tot += v;
                    dots.appendChild(s('circle', { cx: x(idx), cy: y((o.mode === 'stack' ? cum[kk][idx] : 0) + v), r: 4, class: 'dot', style: { fill: sr2.color } }));
                    if (v > 0) rows.push([sr2, v]);
                });
                rows.sort(function (a, b) { return b[1] - a[1]; });
                var box = h('div', { class: 'tip-body' }, h('b', null, o.label(o.keys[idx], true)));
                rows.slice(0, 8).forEach(function (r2) {
                    box.appendChild(h('div', { class: 'tip-row' }, h('i', { style: { background: r2[0].color } }), h('span', null, r2[0].name), h('em', null, num(r2[1]))));
                });
                if (series.length > 1) box.appendChild(h('div', { class: 'tip-row total' }, h('span', null, '합계'), h('em', null, num(tot))));
                tip.show(box, e.clientX, e.clientY);
            });
            hit.addEventListener('pointerleave', function () { cross.style.display = 'none'; clear(dots); tip.hide(); });
            svg.appendChild(hit);
            el.appendChild(svg);
        }
        draw();
        watch(el, draw);
    }

    /* ---------- bars ---------- */

    /** Horizontal bar list. rows: [{label, value, text, color, sub}] */
    function barList(rows, o) {
        o = o || {};
        var max = o.max || Math.max.apply(null, rows.map(function (r) { return r.value; }).concat([1]));
        return h('div', { class: 'bar-list' }, rows.map(function (r) {
            return h('div', { class: 'bar-row', 'data-tip': r.tip || null },
                h('span', { class: 'bar-label' }, r.label),
                h('span', { class: 'bar-track' }, h('span', { class: 'bar-fill', style: { width: Math.max(r.value > 0 ? 1.5 : 0, r.value / max * 100) + '%', background: r.color || 'var(--primary)' } })),
                h('span', { class: 'bar-val' }, r.text !== undefined ? r.text : num(r.value)));
        }));
    }

    /** Vertical mini bars (24 hours / 7 weekdays). */
    function miniBars(values, labels, o) {
        o = o || {};
        var max = Math.max.apply(null, values.concat([1]));
        var wrap = h('div', { class: 'mini-bars', role: 'img', 'aria-label': o.aria || '분포' });
        values.forEach(function (v, i) {
            wrap.appendChild(h('span', { class: 'mb', 'data-tip': (labels[i] || '') + ' · ' + num(v) + (o.unit || '개') },
                h('i', { style: { height: Math.max(v > 0 ? 3 : 0, v / max * 100) + '%', background: o.color || 'var(--primary)' } })));
        });
        return wrap;
    }

    function stackBar(parts, total) {
        var wrap = h('div', { class: 'stack-bar', role: 'img', 'aria-label': '메시지 구성' });
        parts.forEach(function (p) {
            if (!p.value) return;
            wrap.appendChild(h('span', { style: { flex: p.value, background: p.color }, 'data-tip': p.label + ' ' + num(p.value) + ' (' + pct(p.value / total) + ')' }));
        });
        return wrap;
    }

    /* ---------- heatmap ---------- */

    /** rows x cols grid. cell(r,c) -> {v:number, tip:string, text?:string} ; scale 0..max */
    function heatGrid(o) {
        var max = 0, r, c, cells = [];
        for (r = 0; r < o.rows.length; r++) {
            cells[r] = [];
            for (c = 0; c < o.cols.length; c++) { cells[r][c] = o.cell(r, c); if (cells[r][c].v > max) max = cells[r][c].v; }
        }
        var grid = h('div', { class: 'heat' + (o.class ? ' ' + o.class : ''), style: { gridTemplateColumns: (o.rowLabelWidth || '34px') + ' repeat(' + o.cols.length + ', minmax(0,1fr))' }, role: 'img', 'aria-label': o.aria || '히트맵' });
        grid.appendChild(h('span', { class: 'heat-corner' }, o.corner || ''));
        o.cols.forEach(function (cl, i) { grid.appendChild(h('span', { class: 'heat-col' + (o.colEvery && i % o.colEvery ? ' dim' : '') }, o.colEvery && i % o.colEvery ? '' : cl)); });
        for (r = 0; r < o.rows.length; r++) {
            grid.appendChild(h('span', { class: 'heat-row' }, o.rows[r]));
            for (c = 0; c < o.cols.length; c++) {
                var cell = cells[r][c], t = max ? Math.sqrt(cell.v / max) : 0;
                grid.appendChild(h('span', { class: 'heat-cell' + (cell.v ? '' : ' zero'), style: { '--v': (t * 100).toFixed(1) + '%' }, 'data-tip': cell.tip }, cell.text || ''));
            }
        }
        return grid;
    }

    /* ---------- tag cloud ---------- */

    function tagCloud(words, onPick) {
        var max = Math.max.apply(null, words.map(function (w) { return w.c; }).concat([1]));
        var min = Math.min.apply(null, words.map(function (w) { return w.c; }).concat([max]));
        var wrap = h('div', { class: 'cloud' });
        words.forEach(function (w, i) {
            var t = max === min ? 1 : (Math.sqrt(w.c) - Math.sqrt(min)) / (Math.sqrt(max) - Math.sqrt(min));
            wrap.appendChild(h('button', {
                type: 'button', class: 'cloud-word' + (i < 3 ? ' top' : ''), style: { fontSize: (0.82 + t * 1.55).toFixed(2) + 'rem', opacity: (0.62 + t * 0.38).toFixed(2) },
                'data-tip': w.t + ' · ' + num(w.c) + '회', onclick: function () { if (onPick) onPick(w.t); }
            }, w.t));
        });
        return wrap;
    }

    /* ---------- brush timeline (sidebar) ---------- */

    /** o: { keys, counts, from, to, onChange(from,to) } -- weekly bars with a draggable selection. */
    function brushTimeline(el, o) {
        function draw() {
            clear(el);
            var W = el.clientWidth || 260, H = 56, n, i;
            var b = bucketize(o.keys, [o.counts], 'week');
            n = b.keys.length;
            if (!n) return;
            var max = Math.max.apply(null, b.arrays[0].concat([1])), bw = W / n;
            var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, width: W, height: H, class: 'brush', role: 'img', 'aria-label': '기간 선택 타임라인' });
            for (i = 0; i < n; i++) {
                var v = b.arrays[0][i], bh = Math.max(v > 0 ? 1.5 : 0, v / max * (H - 8));
                svg.appendChild(s('rect', { x: i * bw + 0.5, y: H - bh, width: Math.max(1, bw - 1), height: bh, class: 'bar' }));
            }
            var first = b.keys[0], lastKey = b.keys[n - 1];
            var spanA = dayToDate(first).getTime(), spanB = dayToDate(lastKey).getTime() + 7 * 86400000;
            function px(day) { return (dayToDate(day).getTime() - spanA) / (spanB - spanA) * W; }
            function dayAt(p) { var d = new Date(spanA + p / W * (spanB - spanA)); return dateToDay(d); }
            var sel = s('rect', { y: 0, height: H, class: 'sel' });
            var hl = s('rect', { y: 0, width: 6, height: H, class: 'handle' }), hr = s('rect', { y: 0, width: 6, height: H, class: 'handle' });
            svg.appendChild(sel); svg.appendChild(hl); svg.appendChild(hr);
            function place() {
                var a = o.from ? px(o.from) : 0, z = o.to ? px(o.to) + W / ((spanB - spanA) / 86400000) : W;
                a = Math.max(0, Math.min(W, a)); z = Math.max(a + 2, Math.min(W, z));
                sel.setAttribute('x', a); sel.setAttribute('width', z - a);
                hl.setAttribute('x', a - 3); hr.setAttribute('x', z - 3);
                svg.classList.toggle('all', !o.from && !o.to);
            }
            place();
            var drag = null;
            function pos(e) { var r = svg.getBoundingClientRect(); return Math.max(0, Math.min(W, (e.clientX - r.left) * (W / r.width))); }
            svg.addEventListener('pointerdown', function (e) {
                var p = pos(e), a = parseFloat(sel.getAttribute('x')), z = a + parseFloat(sel.getAttribute('width'));
                if (e.target === hl) drag = { t: 'l' };
                else if (e.target === hr) drag = { t: 'r' };
                else if (e.target === sel && (o.from || o.to)) drag = { t: 'm', off: p - a, w: z - a };
                else drag = { t: 'n', start: p };
                svg.setPointerCapture(e.pointerId);
                e.preventDefault();
            });
            svg.addEventListener('pointermove', function (e) {
                if (!drag) return;
                var p = pos(e), a = parseFloat(sel.getAttribute('x')), z = a + parseFloat(sel.getAttribute('width'));
                if (drag.t === 'l') a = Math.min(p, z - 4);
                else if (drag.t === 'r') z = Math.max(p, a + 4);
                else if (drag.t === 'm') { a = Math.max(0, Math.min(W - drag.w, p - drag.off)); z = a + drag.w; }
                else { a = Math.min(drag.start, p); z = Math.max(drag.start, p) + 1; }
                o.from = Math.max(first, dayAt(a)); o.to = Math.min(o.keys[o.keys.length - 1], dayAt(z - 1));
                place();
                drag.moved = true;
            });
            function end(e) {
                if (!drag) return;
                var d = drag; drag = null;
                if (d.t === 'n' && !d.moved) { o.from = null; o.to = null; place(); }
                o.onChange(o.from, o.to);
            }
            svg.addEventListener('pointerup', end);
            svg.addEventListener('pointercancel', end);
            el.appendChild(svg);
        }
        draw();
        watch(el, draw);
        return { set: function (from, to) { o.from = from; o.to = to; draw(); } };
    }

    Object.assign(KT, {
        h: h, s: s, clear: clear, num: num, pct: pct, dayStr: dayStr, dayShort: dayShort, monthStr: monthStr, pad: pad,
        dayToDate: dayToDate, dateToDay: dateToDay, dayInput: dayInput, inputDay: inputDay, hourLabel: hourLabel, timeStr: timeStr, minutes: minutes, dur: dur,
        WD: WD, color: color, avatar: avatar, initial: initial, tip: tip, bucketize: bucketize, expandDays: expandDays,
        areaChart: areaChart, barList: barList, miniBars: miniBars, stackBar: stackBar, heatGrid: heatGrid, tagCloud: tagCloud, brushTimeline: brushTimeline
    });
})(self);
