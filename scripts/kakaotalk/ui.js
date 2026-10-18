/* KakaoTalk Analyzer UI core: file loading, worker bridge, filter sidebar, tabs and settings. */
(function (root) {
    'use strict';
    var KT = root.KT, h = KT.h, num = KT.num, S = KT.S = KT.S || {}, ui = S.ui;
    var $ = function (id) { return document.getElementById(id); };
    var VER = document.body.getAttribute('data-ver') || '';
    var SKEY = 'kt_settings_v1';

    var DEFAULTS = {
        excludeBots: true, excludeLeft: false, minMsgs: 0, stopwords: true, skipNames: true, mergeNo: true, mentionExclude: false,
        hourFrom: 0, hourTo: 24, sessionGapMin: 30, aliases: {}, excludedNames: [],
        kinds: { text: true, photo: true, emoticon: true, video: true, file: true, search: true, voice: true, deleted: false }
    };
    var KIND_CHIPS = [['photo', '사진'], ['emoticon', '이모티콘'], ['video', '동영상'], ['file', '파일'], ['voice', '음성'], ['search', '샵검색'], ['deleted', '삭제된 메시지']];
    var TABS = [['summary', '요약'], ['people', '사람'], ['time', '시간'], ['keywords', '키워드'], ['transcript', '대화 원문']];

    function clone(o) { return JSON.parse(JSON.stringify(o)); }
    function loadSettings() {
        var s = clone(DEFAULTS);
        try {
            var raw = JSON.parse(localStorage.getItem(SKEY) || 'null');
            if (raw) { Object.assign(s, raw); s.kinds = Object.assign(clone(DEFAULTS.kinds), raw.kinds || {}); }
        } catch (_) {}
        return s;
    }
    function saveSettings() { try { localStorage.setItem(SKEY, JSON.stringify(S.set)); } catch (_) {} }

    S.set = loadSettings();
    S.tab = 'summary';
    S.from = null; S.to = null; S.roomSel = null;
    S.people = []; S.peopleById = {}; S.rooms = []; S.result = null;
    S.roomTitle = ''; S.filterSummary = '';

    /* ---------- worker bridge ---------- */

    var rpcs = {}, rid = 0, analyzeReq = 0, analyzeTimer = 0, worker = null;

    function startWorker() {
        if (worker) worker.terminate();
        worker = new Worker('scripts/kakaotalk/worker.js' + VER);
        worker.onmessage = onMessage;
        worker.onerror = function (e) { hideLoading(); showError('분석 엔진을 시작하지 못했어요. ' + (e.message || '')); };
        postConfig();
    }
    function postConfig() { worker.postMessage({ type: 'config', mergeNo: S.set.mergeNo, aliases: S.set.aliases }); }

    KT.rpc = function (type, payload) {
        return new Promise(function (resolve, reject) {
            var id = ++rid;
            rpcs[id] = { resolve: resolve, reject: reject };
            worker.postMessage(Object.assign({ type: type, reqId: id }, payload || {}));
        });
    };

    function onMessage(ev) {
        var m = ev.data, r;
        switch (m.type) {
            case 'progress': setLoading(m.stage, m.file, m.value); break;
            case 'loaded': onLoaded(m); break;
            case 'people': r = rpcs[m.reqId]; if (r) { delete rpcs[m.reqId]; r.resolve(m); } break;
            case 'result': if (m.reqId === analyzeReq) onResult(m.result); break;
            case 'transcript': case 'trend': r = rpcs[m.reqId]; if (r) { delete rpcs[m.reqId]; r.resolve(m); } break;
            case 'error':
                r = rpcs[m.reqId];
                if (r) { delete rpcs[m.reqId]; r.reject(new Error(m.message)); }
                else { hideLoading(); showError(m.message); }
                break;
        }
    }

    /* ---------- loading UI ---------- */

    function setLoading(stage, file, v) {
        $('loading').hidden = false;
        $('loadingStage').textContent = stage || '불러오는 중';
        $('loadingFile').textContent = file || '';
        $('loadingBar').style.width = Math.round((v || 0) * 100) + '%';
    }
    function hideLoading() { $('loading').hidden = true; }
    function showError(msg) {
        var box = $('loadError');
        if ($('landing').hidden) toast(msg);
        else { box.textContent = msg; box.hidden = false; }
    }
    var toastTimer = 0;
    function toast(msg) {
        var t = document.querySelector('.toast');
        if (!t) { t = h('div', { class: 'toast', role: 'alert' }); document.body.appendChild(t); }
        t.textContent = msg; t.classList.add('show');
        clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove('show'); }, 5000);
    }

    function loadFiles(list) {
        var files = Array.prototype.filter.call(list, function (f) { return /\.(txt|csv)$/i.test(f.name) || /^text\//.test(f.type); });
        $('loadError').hidden = true;
        if (!files.length) { showError('.txt 또는 .csv 파일만 올릴 수 있어요.'); return; }
        setLoading('읽는 중', files[0].name, 0);
        worker.postMessage({ type: 'load', files: files });
    }

    /* ---------- loaded / result ---------- */

    function onLoaded(m) {
        hideLoading();
        S.rooms = m.rooms; S.timeline = m.timeline; S.total = m.total; S.skipped = { deleted: m.deleted, hidden: m.hidden };
        setPeople(m.people);
        S.roomSel = null; S.from = null; S.to = null;
        S.firstDay = m.timeline.days[0]; S.lastDay = m.timeline.days[m.timeline.days.length - 1];
        S.roomTitle = m.rooms.map(function (r) { return r.title; }).join(' · ');
        $('landing').hidden = true; $('app').hidden = false; $('reload').hidden = false;
        document.title = S.roomTitle + ' · KakaoTalk Analyzer';
        var hash = location.hash.replace('#', '');
        if (TABS.some(function (t) { return t[0] === hash; })) S.tab = hash;
        renderRoomInfo(); buildFilters(); renderTabs();
        runAnalyze();
    }

    function setPeople(list) {
        S.people = list; S.peopleById = {};
        list.forEach(function (p) { S.peopleById[p.id] = { id: p.id, name: p.name, colorSlot: p.id, isBot: p.isBot }; });
    }

    function excludedIds() {
        var set = {};
        S.set.excludedNames.forEach(function (n) { set[n] = 1; });
        return S.people.filter(function (p) { return set[p.name]; }).map(function (p) { return p.id; });
    }

    function buildFilter() {
        var s = S.set;
        return {
            rooms: S.roomSel, from: S.from, to: S.to, hourFrom: s.hourFrom, hourTo: s.hourTo, excluded: excludedIds(), excludeBots: s.excludeBots, excludeLeft: s.excludeLeft,
            minMsgs: s.minMsgs, kinds: s.kinds, stopwords: s.stopwords, skipNames: s.skipNames, sessionGapMin: s.sessionGapMin, mentionExclude: s.mentionExclude
        };
    }

    function scheduleAnalyze(delay) { clearTimeout(analyzeTimer); analyzeTimer = setTimeout(runAnalyze, delay === undefined ? 160 : delay); }
    function runAnalyze() {
        S.f = buildFilter();
        analyzeReq = ++rid;
        $('panel').classList.add('busy');
        worker.postMessage({ type: 'analyze', reqId: analyzeReq, filter: S.f });
    }

    function onResult(R) {
        S.result = R;
        ui.kwTrend = null;
        ui.tr = { q: ui.tr.q, start: 0, total: 0, rows: [], page: 80, seek: null, loaded: false };
        $('panel').classList.remove('busy');
        S.filterSummary = summaryText();
        renderActive(); syncPeopleRows(); renderPanel();
    }

    /* ---------- header info ---------- */

    function renderRoomInfo() {
        var el = $('roomInfo'); KT.clear(el);
        el.appendChild(h('h1', { class: 'room-title' }, S.roomTitle));
        el.appendChild(h('p', { class: 'room-meta' }, KT.dayStr(S.firstDay) + ' – ' + KT.dayStr(S.lastDay)));
    }

    /* ---------- filter sidebar ---------- */

    function section(title, body, open, badge) {
        return h('details', { class: 'fsec', open: open !== false }, h('summary', null, h('span', null, title), badge ? h('em', { class: 'fbadge', id: badge.id }, badge.text || '') : null), h('div', { class: 'fbody' }, body));
    }

    function toggle(label, key, onChange) {
        return h('label', { class: 'switch' }, h('input', { type: 'checkbox', checked: !!S.set[key], onchange: function (e) { S.set[key] = e.target.checked; saveSettings(); if (onChange) onChange(); else scheduleAnalyze(60); } }),
            h('b', null), h('span', null, label));
    }

    var brush = null;

    function buildFilters() {
        var el = $('filters'), s = S.set; KT.clear(el);

        if (S.rooms.length > 1) {
            var roomBox = S.rooms.map(function (r) {
                return h('label', { class: 'check' }, h('input', { type: 'checkbox', checked: !S.roomSel || S.roomSel.indexOf(r.id) >= 0, onchange: function () {
                    var on = Array.prototype.map.call(roomBox_inputs(), function (i, k) { return i.checked ? S.rooms[k].id : -1; }).filter(function (v) { return v >= 0; });
                    S.roomSel = on.length === S.rooms.length ? null : on.length ? on : [r.id]; scheduleAnalyze(60);
                } }), h('span', null, r.title));
            });
            el.appendChild(section('대화방', h('div', { id: 'roomBox', class: 'checks' }, roomBox)));
        }

        /* period */
        var fromIn = h('input', { type: 'date', class: 'input', id: 'dFrom', 'aria-label': '시작일', min: KT.dayInput(S.firstDay), max: KT.dayInput(S.lastDay), onchange: function (e) { S.from = KT.inputDay(e.target.value); if (S.from === S.firstDay) S.from = null; syncPeriod(true); } });
        var toIn = h('input', { type: 'date', class: 'input', id: 'dTo', 'aria-label': '종료일', min: KT.dayInput(S.firstDay), max: KT.dayInput(S.lastDay), onchange: function (e) { S.to = KT.inputDay(e.target.value); if (S.to === S.lastDay) S.to = null; syncPeriod(true); } });
        var brushEl = h('div', { class: 'brush-wrap', title: '드래그해서 기간 선택' });
        var presets = [['전체', null], ['1개월', 1], ['3개월', 3], ['1년', 12]].map(function (p) {
            return h('button', { type: 'button', class: 'chip btn-chip', onclick: function () { applyPreset(p[1]); } }, p[0]);
        });
        el.appendChild(section('기간', [brushEl, h('div', { class: 'date-row' }, fromIn, h('span', null, '–'), toIn), h('div', { class: 'chips' }, presets)]));
        brush = KT.brushTimeline(brushEl, { keys: S.timeline.days, counts: S.timeline.counts, from: S.from, to: S.to, onChange: function (a, b) { S.from = a; S.to = b; syncPeriod(false, true); } });

        /* people */
        var search = h('input', { type: 'search', class: 'input', placeholder: '이름 검색', 'aria-label': '인물 검색', oninput: function (e) { filterPeopleRows(e.target.value); } });
        var list = h('ul', { class: 'people', id: 'peopleList' }, S.people.map(function (p) {
            return h('li', { dataset: { name: p.name.toLowerCase() } }, h('label', { class: 'prow' }, h('input', { type: 'checkbox', dataset: { id: p.id }, onchange: function (e) { setExcluded(p.name, !e.target.checked); } }),
                h('span', { class: 'prow-name' }, p.name, p.isBot && h('em', { class: 'badge' }, '봇')),
                h('span', { class: 'prow-n' }, num(p.total))));
        }));
        el.appendChild(section('사람', [search, list,
            h('div', { class: 'mini-actions' }, h('button', { type: 'button', class: 'link', onclick: function () { S.set.excludedNames = []; saveSettings(); syncPeopleRows(); scheduleAnalyze(60); } }, '모두 선택'),
                h('button', { type: 'button', class: 'link', onclick: function () { S.set.excludedNames = S.people.map(function (p) { return p.name; }); saveSettings(); syncPeopleRows(); scheduleAnalyze(60); } }, '모두 해제')),
            toggle('봇 제외', 'excludeBots', function () { syncPeopleRows(); scheduleAnalyze(60); })], true, { id: 'peopleBadge' }));

        /* advanced: everything else, collapsed */
        var hf = h('select', { class: 'input', 'aria-label': '시작 시각', onchange: function (e) { S.set.hourFrom = +e.target.value; saveSettings(); scheduleAnalyze(60); } }, hourOptions(0, 23, s.hourFrom));
        var ht = h('select', { class: 'input', 'aria-label': '종료 시각', onchange: function (e) { S.set.hourTo = +e.target.value; saveSettings(); scheduleAnalyze(60); } }, hourOptions(1, 24, s.hourTo));
        var gap = h('select', { class: 'input', 'aria-label': '새 대화로 보는 침묵 시간', onchange: function (e) { S.set.sessionGapMin = +e.target.value; saveSettings(); scheduleAnalyze(60); } },
            [10, 30, 60, 180].map(function (m) { return h('option', { value: m, selected: s.sessionGapMin === m }, m + '분'); }));
        el.appendChild(section('고급 설정', [
            h('div', { class: 'sub-h' }, '메시지 종류'),
            h('div', { class: 'chips' }, KIND_CHIPS.map(function (k) {
                return h('button', { type: 'button', class: 'chip btn-chip', 'aria-pressed': String(!!s.kinds[k[0]]), onclick: function (e) { S.set.kinds[k[0]] = !S.set.kinds[k[0]]; e.currentTarget.setAttribute('aria-pressed', String(S.set.kinds[k[0]])); saveSettings(); scheduleAnalyze(60); } }, k[1]);
            })),
            h('div', { class: 'sub-h' }, '시간대'), h('div', { class: 'date-row' }, hf, h('span', null, '–'), ht),
            h('div', { class: 'sub-h' }, '사람'),
            toggle('나간·강퇴된 사람 제외', 'excludeLeft', function () { syncPeopleRows(); scheduleAnalyze(60); }),
            toggle('뺀 사람을 멘션한 메시지도 제외', 'mentionExclude'),
            toggle('학번 붙은 이름 합치기', 'mergeNo', function () { reconfigure(); }),
            h('label', { class: 'field' }, '최소 메시지 수', h('input', { type: 'number', class: 'input', min: 0, step: 5, value: s.minMsgs, onchange: function (e) { S.set.minMsgs = Math.max(0, +e.target.value || 0); saveSettings(); scheduleAnalyze(60); } })),
            h('div', { class: 'sub-h' }, '키워드'),
            toggle('흔한 말 제외', 'stopwords'), toggle('사람 이름 제외', 'skipNames'),
            h('label', { class: 'field' }, '새 대화로 보는 침묵', gap),
            h('div', { class: 'sub-h' }, '이름 합치기')].concat(aliasUi(),
            [h('button', { type: 'button', class: 'btn ghost wide', onclick: resetAll }, '설정 초기화')]), false));
        syncPeriod(false, true); syncPeopleRows();
    }

    function roomBox_inputs() { return document.querySelectorAll('#roomBox input'); }
    function hourOptions(a, b, val) { var o = []; for (var i = a; i <= b; i++) o.push(h('option', { value: i, selected: i === val }, i === 24 ? '24시' : i + '시')); return o; }

    function aliasUi() {
        var a = h('select', { class: 'input', id: 'aliasA', 'aria-label': '합칠 이름' }, S.people.map(function (p) { return h('option', { value: p.name }, p.name); }));
        var b = h('select', { class: 'input', id: 'aliasB', 'aria-label': '합쳐질 대상' }, S.people.map(function (p) { return h('option', { value: p.name }, p.name); }));
        var list = h('ul', { class: 'alias-list', id: 'aliasList' });
        function draw() {
            KT.clear(list);
            Object.keys(S.set.aliases).forEach(function (k) {
                list.appendChild(h('li', null, h('span', null, k + ' → ' + S.set.aliases[k]), h('button', { type: 'button', class: 'link', onclick: function () { delete S.set.aliases[k]; saveSettings(); reconfigure(); } }, '되돌리기')));
            });
        }
        setTimeout(draw, 0);
        return [h('div', { class: 'stack-y tight' }, a, h('div', { class: 'center muted' }, '↓'), b,
            h('button', { type: 'button', class: 'btn wide', onclick: function () {
                if (a.value === b.value) return;
                S.set.aliases[a.value] = b.value; saveSettings(); reconfigure();
            } }, '합치기')), list];
    }

    function reconfigure() {
        KT.rpc('config', { mergeNo: S.set.mergeNo, aliases: S.set.aliases }).then(function (m) {
            setPeople(m.people); buildFilters(); scheduleAnalyze(0);
        });
    }

    function setExcluded(name, ex) {
        var i = S.set.excludedNames.indexOf(name);
        if (ex && i < 0) S.set.excludedNames.push(name);
        if (!ex && i >= 0) S.set.excludedNames.splice(i, 1);
        saveSettings(); updateBadge(); scheduleAnalyze(80);
    }

    function isAutoExcluded(p) { return (S.set.excludeBots && p.isBot) || (S.set.excludeLeft && (p.left || p.kicked)); }

    function syncPeopleRows() {
        var list = $('peopleList'); if (!list) return;
        var ex = {}; S.set.excludedNames.forEach(function (n) { ex[n] = 1; });
        Array.prototype.forEach.call(list.querySelectorAll('input[type=checkbox]'), function (inp) {
            var p = S.people[+inp.dataset.id], auto = isAutoExcluded(p);
            inp.checked = !ex[p.name] && !auto; inp.disabled = auto;
            inp.closest('li').classList.toggle('auto', auto);
            inp.closest('label').title = auto ? '봇 제외가 켜져 있어요' : '';
        });
        updateBadge();
    }
    function updateBadge() {
        var b = $('peopleBadge'); if (!b) return;
        var total = S.people.length, off = S.people.filter(function (p) { return S.set.excludedNames.indexOf(p.name) >= 0 || isAutoExcluded(p); }).length;
        b.textContent = (total - off) + '/' + total;
    }
    function filterPeopleRows(q) {
        q = q.trim().toLowerCase();
        Array.prototype.forEach.call($('peopleList').children, function (li) { li.style.display = !q || li.dataset.name.indexOf(q) >= 0 ? '' : 'none'; });
    }

    function applyPreset(p) {
        if (p === null) { S.from = null; S.to = null; }
        else if (p === 'year') { S.from = Math.floor(S.lastDay / 10000) * 10000 + 101; S.to = null; }
        else { var d = KT.dayToDate(S.lastDay); d.setMonth(d.getMonth() - p); d.setDate(d.getDate() + 1); S.from = Math.max(S.firstDay, KT.dateToDay(d)); S.to = null; }
        syncPeriod(false, false, true);
    }

    function syncPeriod(fromInput, fromBrush, push) {
        if (S.from && S.to && S.from > S.to) { var t = S.from; S.from = S.to; S.to = t; }
        var a = $('dFrom'), b = $('dTo');
        if (a) a.value = KT.dayInput(S.from || S.firstDay);
        if (b) b.value = KT.dayInput(S.to || S.lastDay);
        if (brush && (fromInput || push)) brush.set(S.from, S.to);
        scheduleAnalyze(fromBrush ? 220 : 60);
    }

    function resetAll() {
        var keepAliases = S.set.aliases;
        S.set = clone(DEFAULTS); S.set.aliases = keepAliases; saveSettings();
        S.from = null; S.to = null; S.roomSel = null;
        buildFilters(); scheduleAnalyze(0);
    }

    /* ---------- active filter chips ---------- */

    function summaryText() {
        var parts = [], s = S.set;
        if (S.from || S.to) parts.push((S.from ? KT.dayStr(S.from) : '처음') + '~' + (S.to ? KT.dayStr(S.to) : '끝'));
        var ex = S.result ? S.result.excludedIds.length : 0;
        if (ex) parts.push('제외 ' + ex + '명');
        if (s.hourFrom !== 0 || s.hourTo !== 24) parts.push(s.hourFrom + '~' + s.hourTo + '시');
        return parts.length ? parts.join(' · ') : '필터 없음';
    }

    function renderActive() {
        var el = $('activeFilters'), s = S.set, chips = [], R = S.result;
        KT.clear(el);
        function add(label, clear) { chips.push(h('button', { type: 'button', class: 'chip active', onclick: clear, 'aria-label': label + ' 필터 해제' }, label, h('i', null, '✕'))); }
        if (S.from || S.to) add('기간 ' + (S.from ? KT.dayShort(S.from) : '처음') + ' ~ ' + (S.to ? KT.dayShort(S.to) : '끝'), function () { S.from = null; S.to = null; syncPeriod(false, false, true); });
        var manual = s.excludedNames.length;
        if (manual) add(manual + '명 제외', function () { S.set.excludedNames = []; saveSettings(); syncPeopleRows(); scheduleAnalyze(60); });
        if (s.hourFrom !== 0 || s.hourTo !== 24) add('시간대 ' + s.hourFrom + '~' + s.hourTo + '시', function () { S.set.hourFrom = 0; S.set.hourTo = 24; saveSettings(); buildFilters(); scheduleAnalyze(60); });
        if (S.roomSel) add('대화방 ' + S.roomSel.length + '/' + S.rooms.length, function () { S.roomSel = null; buildFilters(); scheduleAnalyze(60); });
        var offKinds = KIND_CHIPS.filter(function (k) { return k[0] !== 'deleted' && !s.kinds[k[0]]; });
        if (offKinds.length) add(offKinds.map(function (k) { return k[1]; }).join('·') + ' 제외', function () { offKinds.forEach(function (k) { S.set.kinds[k[0]] = true; }); saveSettings(); buildFilters(); scheduleAnalyze(60); });
        if (!chips.length) { el.hidden = true; return; }
        el.hidden = false;
        chips.forEach(function (c) { el.appendChild(c); });
    }

    /* ---------- tabs & panel ---------- */

    function renderTabs() {
        var el = $('tabs'); KT.clear(el);
        TABS.forEach(function (t, i) {
            var on = S.tab === t[0];
            el.appendChild(h('button', { type: 'button', role: 'tab', id: 'tab-' + t[0], 'aria-selected': String(on), tabindex: on ? '0' : '-1', class: 'tab', onclick: function () { setTab(t[0]); },
                onkeydown: function (e) {
                    var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
                    if (!d) return;
                    var n = TABS[(i + d + TABS.length) % TABS.length][0]; setTab(n); $('tab-' + n).focus(); e.preventDefault();
                } }, t[1]));
        });
        $('panel').setAttribute('aria-labelledby', 'tab-' + S.tab);
    }

    function setTab(name) {
        S.tab = name;
        try { history.replaceState(null, '', '#' + name); } catch (_) {}
        renderTabs(); renderPanel();
        var top = $('tabs').getBoundingClientRect().top;
        if (top < 0) window.scrollTo({ top: window.scrollY + top - 70 });
    }

    function renderPanel(keepScroll) {
        var panel = $('panel');
        if (!S.result) return;
        var y = window.scrollY;
        KT.clear(panel);
        var node = KT.panels[S.tab](S.result);
        panel.appendChild(node);
        if (keepScroll) window.scrollTo(0, y);
    }

    function renderKeepFocus(id) {
        var el = $(id), pos = el ? el.selectionStart : 0;
        renderPanel(true);
        var n = $(id); if (n) { n.focus(); try { n.setSelectionRange(pos, pos); } catch (_) {} }
    }

    function openPerson(id) {
        var node = KT.panels.personDetail(id);
        if (!node) return;
        KT.clear(S.dlg); S.dlg.appendChild(node);
        if (!S.dlg.open) S.dlg.showModal();
    }

    KT.actions = {
        render: renderPanel, renderKeepFocus: renderKeepFocus, setTab: setTab, openPerson: openPerson,
        excludeName: function (name) { setExcluded(name, true); syncPeopleRows(); }
    };

    /* ---------- init ---------- */

    function init() {
        S.dlg = $('personDlg');
        S.dlg.addEventListener('click', function (e) { if (e.target === S.dlg) S.dlg.close(); });
        startWorker();

        var input = $('file'), drop = $('drop');
        input.addEventListener('change', function () { if (input.files.length) loadFiles(input.files); input.value = ''; });
        ['dragenter', 'dragover'].forEach(function (t) { document.addEventListener(t, function (e) { if (e.dataTransfer && Array.prototype.indexOf.call(e.dataTransfer.types || [], 'Files') >= 0) { e.preventDefault(); drop.classList.add('over'); document.body.classList.add('dragging'); } }); });
        ['dragleave', 'drop'].forEach(function (t) { document.addEventListener(t, function (e) { if (t === 'drop' || e.target === document.documentElement || !e.relatedTarget) { drop.classList.remove('over'); document.body.classList.remove('dragging'); } }); });
        document.addEventListener('drop', function (e) { if (e.dataTransfer && e.dataTransfer.files.length) { e.preventDefault(); loadFiles(e.dataTransfer.files); } });
        drop.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); } });
        $('reload').addEventListener('click', function () { input.click(); });
        $('filterToggle').addEventListener('click', function (e) {
            var open = $('filters').classList.toggle('open');
            e.currentTarget.setAttribute('aria-expanded', String(open));
        });
        $('theme-toggle').addEventListener('click', function () {
            var next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
            document.documentElement.dataset.theme = next;
            try { localStorage.setItem('theme', next); } catch (_) {}
            if (S.result) renderPanel(true);
        });
    }
    init();
})(self);
