'use strict';
// Rock ID Studio: 사진 보고 암석 맞히기. 데이터는 data/rocks/rocks.js.

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

// ---------- 저장 ----------
const store = {
    get(k, d) { try { const v = localStorage.getItem('rocks:' + k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem('rocks:' + k, JSON.stringify(v)); } catch { /* 저장 불가 환경 */ } },
};

const DEFAULTS = {
    collection: 'all', mode: 'choice', count: 10, choices: 4, timer: 20,
    tricky: true, rotate: true, zoom: false, color: false, gray: false,
};
let settings = { ...DEFAULTS, ...store.get('settings', {}) };
let stats = store.get('stats', {}); // id -> { seen, wrong, mix: { 헷갈린id: 횟수 } }
let quiz = null;
let hideNames = false;

const byId = Object.fromEntries(ROCKS.map(r => [r.id, r]));
const MODE_TITLE = { choice: '객관식', type: '주관식', exam: '실전', kind: '종류' };

// 문제집: 종류별 + 생김새별(PDF 분류)
const COLLECTIONS = [
    { id: 'all', name: '전체 22종', desc: '화성암 9 · 퇴적암 7 · 변성암 6', section: 'type', ids: ROCKS.map(r => r.id) },
    ...TYPES.map((t, i) => ({ id: ['igneous', 'sedimentary', 'metamorphic'][i], name: `${t} ${ROCKS.filter(r => r.type === t).length}종`, desc: ROCKS.filter(r => r.type === t).map(r => r.name).join(' · '), section: 'type', ids: ROCKS.filter(r => r.type === t).map(r => r.id) })),
    ...Object.entries(GROUPS).map(([g, info]) => ({ id: `look-${g}`, name: info.title, desc: ROCKS.filter(r => r.group === g).map(r => r.name).join(' · '), section: 'look', ids: ROCKS.filter(r => r.group === g).map(r => r.id) })),
];
const collectionById = id => COLLECTIONS.find(c => c.id === id) || COLLECTIONS[0];

// ---------- 유틸 ----------
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = a => a[Math.random() * a.length | 0];
const rand = (lo, hi) => lo + Math.random() * (hi - lo);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const normalize = s => String(s).normalize('NFC').toLowerCase().replace(/[\s·.\-_()'"]/g, '');
const namesOf = r => [r.name, r.en, ...r.aliases];
const isCorrect = (rock, input) => { const n = normalize(input); return !!n && namesOf(rock).some(a => normalize(a) === n); };
const rockByName = input => { const n = normalize(input); return n ? ROCKS.find(r => namesOf(r).some(a => normalize(a) === n)) : null; };

function levenshtein(a, b) {
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++)
        for (let j = 1; j <= b.length; j++)
            d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[a.length][b.length];
}
const nearMiss = (rock, input) => {
    const n = normalize(input);
    return n.length >= 2 && namesOf(rock).some(a => { const t = normalize(a); return levenshtein(n, t) <= (t.length >= 6 ? 2 : 1); });
};

const CHO = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
const chosung = s => [...s].map(ch => { const c = ch.charCodeAt(0) - 0xAC00; return c >= 0 && c < 11172 ? CHO[Math.floor(c / 588)] : ch; }).join('');
// 받침 유무 (조사 고르기용)
const hasBatchim = w => { const c = w.charCodeAt(w.length - 1) - 0xAC00; return c >= 0 && c < 11172 && c % 28 !== 0; };
// '(으)로': 받침 없음 또는 ㄹ받침이면 '로'
const roOf = w => { const c = w.charCodeAt(w.length - 1) - 0xAC00; return hasBatchim(w) && c % 28 !== 8 ? '으로' : '로'; };

const typeClass = t => ({ 화성암: 'igneous', 퇴적암: 'sedimentary', 변성암: 'metamorphic' }[t]);
const typeTag = t => `<span class="rock-type ${typeClass(t)}">${t}</span>`;

// ---------- 사진 변형 ----------
function makeView(rock) {
    const v = { src: pick(rock.images), rot: 0, flip: false, zoom: 1, tx: 0, ty: 0, filter: 'none' };
    if (settings.rotate) { v.rot = pick([0, 90, 180, 270]); v.flip = Math.random() < 0.5; }
    if (settings.zoom) { v.zoom = rand(1.7, 2.2); v.tx = rand(-8, 8); v.ty = rand(-8, 8); }
    const f = [];
    if (settings.color) f.push(`brightness(${rand(0.8, 1.2).toFixed(2)})`, `contrast(${rand(0.85, 1.2).toFixed(2)})`, `saturate(${rand(0.65, 1.35).toFixed(2)})`, `hue-rotate(${rand(-12, 12).toFixed(0)}deg)`);
    if (settings.gray) f.push('grayscale(1)');
    if (f.length) v.filter = f.join(' ');
    return v;
}
const viewStyle = v => `transform:translate(${v.tx}%,${v.ty}%) scale(${v.zoom}) rotate(${v.rot}deg) scaleX(${v.flip ? -1 : 1});filter:${v.filter}`;
const miniPhoto = v => `<div class="rock-mini" data-zoom="${esc(v.src)}" data-style="${esc(viewStyle(v))}"><img src="${esc(v.src)}" alt="" style="${viewStyle(v)}" loading="lazy"></div>`;
const thumb = (rock, note = '') => `<button type="button" class="rock-thumb" data-zoom="${esc(rock.images[0])}">
    <img src="${esc(rock.images[0])}" alt="${esc(rock.name)}" loading="lazy">
    <span class="rock-thumb-name">${esc(rock.name)} ${note}</span><small>${esc(rock.feature)}</small></button>`;

// ---------- 기록 ----------
function record(id, correct, mixedWith) {
    const s = stats[id] || (stats[id] = { seen: 0, wrong: 0, mix: {} });
    s.seen++;
    if (!correct) s.wrong++;
    if (mixedWith && mixedWith !== id) s.mix[mixedWith] = (s.mix[mixedWith] || 0) + 1;
    store.set('stats', stats);
}
const weakIds = () => ROCKS.filter(r => stats[r.id]?.wrong).map(r => r.id);

// ---------- 화면 전환 ----------
function showView(name) {
    ['landing', 'app', 'study', 'notes'].forEach(v => { $(`#${v}-view`).style.display = v === name ? 'block' : 'none'; });
    window.scrollTo(0, 0);
}

function returnToLanding() {
    clearTimer();
    quiz = null;
    renderLanding();
    showView('landing');
}

// ---------- 메인(랜딩) ----------
function renderCollections() {
    for (const section of ['type', 'look']) {
        $(`#collection-grid-${section}`).innerHTML = COLLECTIONS.filter(c => c.section === section).map(c => {
            return `<div class="collection-card${c.id === settings.collection ? ' selected' : ''}" data-id="${c.id}" onclick="selectCollection('${c.id}')">
                <div><h3>${esc(c.name)}</h3><span class="collection-score">${c.ids.length}문항</span></div>
                <p class="rock-collection-desc">${esc(c.desc)}</p>
                <div class="rock-preview">${c.ids.slice(0, 4).map(id => `<img src="${esc(byId[id].images[0])}" alt="" loading="lazy">`).join('')}</div>
            </div>`;
        }).join('');
    }
}

function renderLanding() {
    const col = collectionById(settings.collection);
    $('#current-collection-name').textContent = `${col.name} (${col.ids.length}문항)`;
    const pairs = [['#mode-selector', 'mode'], ['#count-selector', 'count'], ['#choices-selector', 'choices'], ['#timer-selector', 'timer']];
    for (const [sel, key] of pairs)
        $$(`${sel} .cnt-btn`).forEach(b => b.classList.toggle('selected', String(settings[key]) === b.dataset[key]));
    for (const key of ['rotate', 'zoom', 'color', 'gray', 'tricky']) $(`#chk-${key}`).checked = settings[key];
    $('#row-count').classList.toggle('hidden', settings.mode === 'exam');
    $('#row-timer').classList.toggle('hidden', settings.mode !== 'exam');
    $('#row-choices').classList.toggle('hidden', settings.mode !== 'choice');
    $('#row-tricky').classList.toggle('hidden', settings.mode !== 'choice');
    const weak = weakIds().length;
    $('#weak-count').textContent = weak ? `(${weak})` : '';
}

function saveSettings() { store.set('settings', settings); renderLanding(); }

function openCollectionModal() {
    renderCollections();
    $('#collection-modal').classList.add('visible');
    document.body.style.overflow = 'hidden';
}
function closeCollectionModal() {
    $('#collection-modal').classList.remove('visible');
    document.body.style.overflow = '';
}
function selectCollection(id) {
    settings.collection = id;
    $$('.collection-card').forEach(c => c.classList.toggle('selected', c.dataset.id === id));
    saveSettings();
    setTimeout(closeCollectionModal, 200);
}

function startSelected() {
    const col = collectionById(settings.collection);
    startQuiz(settings.mode, col.ids);
}

// ---------- 퀴즈 ----------
function startQuiz(mode, pool, total) {
    if (!pool.length) return;
    if (total === undefined) total = mode === 'exam' || settings.count === 'all' ? pool.length : Number(settings.count);
    quiz = { mode, pool, total, deck: [], i: 0, answers: [], last: null, timer: null };
    $('#quiz-area').style.display = 'block';
    $('#result-view').style.display = 'none';
    $('#result-view').classList.remove('expanded');
    showView('app');
    nextQuestion();
}

function drawNext() {
    if (!quiz.deck.length) {
        quiz.deck = shuffle(quiz.pool);
        if (quiz.deck.length > 1 && quiz.deck[0] === quiz.last) quiz.deck.push(quiz.deck.shift());
    }
    return (quiz.last = quiz.deck.shift());
}

function optionsFor(rock) {
    if (quiz.mode === 'kind') return TYPES;
    const n = Math.min(settings.choices, ROCKS.length);
    const base = quiz.pool.length >= n ? quiz.pool : ROCKS.map(r => r.id);
    let ordered = shuffle(base.filter(id => id !== rock.id));
    if (settings.tricky) {
        const near = ordered.filter(id => rock.confuse.includes(id) || byId[id].confuse.includes(rock.id) || byId[id].group === rock.group);
        ordered = [...near, ...ordered.filter(id => !near.includes(id))];
    }
    return shuffle([rock.id, ...ordered.slice(0, n - 1)]);
}

const isLast = () => quiz.total && quiz.i + 1 >= quiz.total;

function nextQuestion() {
    clearTimer();
    if (quiz.total && quiz.i >= quiz.total) return showResult();
    const rock = byId[drawNext()];
    quiz.cur = { id: rock.id, view: makeView(rock), answered: false, hints: [] };
    const { mode, cur } = quiz;
    const choiceMode = mode === 'choice' || mode === 'kind';
    const right = quiz.answers.filter(a => a.correct).length;

    $('#mode-badge').textContent = MODE_TITLE[mode];
    $('#progress-badge').textContent = quiz.total ? `${quiz.i + 1} / ${quiz.total}` : `${quiz.i + 1}번째 · 정답 ${right}`;
    $('#question-text').textContent = mode === 'kind' ? '이 암석은 화성암·퇴적암·변성암 중 무엇일까요?' : '이 암석의 이름은?';
    const img = $('#rock-photo');
    img.src = cur.view.src;
    img.setAttribute('style', viewStyle(cur.view));

    const choiceArea = $('#choice-area');
    choiceArea.classList.toggle('hidden', !choiceMode);
    choiceArea.classList.toggle('kind', mode === 'kind');
    if (choiceMode) {
        cur.options = optionsFor(rock);
        choiceArea.innerHTML = cur.options.map((o, k) =>
            `<button type="button" class="btn secondary rock-opt" data-ans="${esc(o)}"><kbd>${k + 1}</kbd><span>${mode === 'kind' ? o : esc(byId[o].name)}</span></button>`).join('');
    }
    $('#type-area').classList.toggle('hidden', choiceMode);
    const input = $('#answer-input');
    input.value = '';
    input.disabled = false;

    $('#hint-buttons').style.visibility = mode === 'type' || mode === 'exam' ? 'visible' : 'hidden';
    $('#btn-hint-cho').classList.toggle('hidden', mode === 'exam');
    $('#btn-hint-feat').classList.toggle('hidden', mode === 'exam');
    $$('#hint-buttons button').forEach(b => { b.disabled = false; });
    $('#btn-giveup').textContent = mode === 'exam' ? '모름' : '포기';
    $('#hint-box').innerHTML = '';
    $('#feedback').innerHTML = '';

    const examLast = mode === 'exam' && isLast();
    $('#btn-finish').classList.toggle('hidden', !examLast);
    $('#btn-next').classList.toggle('hidden', examLast);
    $('#btn-next').textContent = mode === 'exam' ? 'Next →' : mode === 'type' ? '확인' : 'Next →';
    $('#btn-next').disabled = mode === 'choice' || mode === 'kind';
    $('#btn-quit').textContent = quiz.total ? '그만하기' : '끝내고 결과 보기';

    $('#timer').classList.toggle('hidden', mode !== 'exam');
    if (mode === 'exam') startTimer(settings.timer);
    if (!choiceMode) input.focus({ preventScroll: true });
}

function startTimer(sec) {
    const end = Date.now() + sec * 1000;
    const bar = $('#timer-bar');
    quiz.timer = setInterval(() => {
        const left = Math.max(0, end - Date.now());
        bar.style.width = `${(left / (sec * 1000)) * 100}%`;
        bar.classList.toggle('low', left < 5000);
        if (left <= 0) answer($('#answer-input').value); // 시간이 끝나면 입력해 둔 만큼 제출
    }, 100);
}
function clearTimer() { if (quiz?.timer) { clearInterval(quiz.timer); quiz.timer = null; } }

function answer(given) {
    const cur = quiz?.cur;
    if (!cur || cur.answered) return;
    cur.answered = true;
    clearTimer();
    const rock = byId[cur.id];
    let correct, mixed = null;
    if (quiz.mode === 'kind') correct = given === rock.type;
    else if (quiz.mode === 'choice') { correct = given === rock.id; mixed = given; }
    else { correct = isCorrect(rock, given); mixed = rockByName(given)?.id; }
    quiz.answers.push({ id: rock.id, given, correct, view: cur.view, hints: cur.hints.length });
    record(rock.id, correct, correct ? null : mixed);
    quiz.i++;
    if (quiz.mode === 'exam') return nextQuestion();
    showFeedback(rock, given, correct);
}

function showFeedback(rock, given, correct) {
    const mode = quiz.mode;
    $$('.rock-opt').forEach(b => {
        b.disabled = true;
        const v = b.dataset.ans;
        if (mode === 'kind' ? v === rock.type : v === rock.id) b.classList.add('right');
        else if (v === given) b.classList.add('wrong');
    });
    $('#answer-input').disabled = true;
    $$('#hint-buttons button').forEach(b => { b.disabled = true; });

    let given_ = '';
    if (!correct && mode === 'type' && given.trim()) {
        const other = rockByName(given);
        given_ = `<div class="detail-answer-row"><span class="detail-answer-label">내가 쓴 답</span><span>${esc(given)}${other ? ` → 그건 <strong>${esc(other.name)}</strong>${hasBatchim(other.name) ? '이에요' : '예요'}` : nearMiss(rock, given) ? ' → 철자가 조금 달라요. 시험에선 오답!' : ''}</span></div>`;
    }
    const chosen = !correct ? (mode === 'choice' ? byId[given] : mode === 'type' ? rockByName(given) : null) : null;
    const confuse = rock.confuse.map(id => byId[id]).filter(r => r && r !== chosen);
    const status = correct ? 'success' : 'error';
    $('#feedback').innerHTML = `
        <div class="detail-item rock-feedback">
            <div class="detail-status ${status}"><span class="detail-status-icon">${correct ? '✓' : '✗'}</span>${correct ? '정답' : '오답'}${correct && quiz.cur.hints.length ? ' · 힌트 사용' : ''}</div>
            ${given_}
            <div class="rock-answer-name">${esc(rock.name)} ${typeTag(rock.type)} <span class="rock-en">${esc(rock.en)}</span></div>
            <p class="rock-feature">${esc(rock.feature)}</p>
            <p class="rock-detail">${esc(rock.detail)}</p>
            ${chosen ? `<h4>내가 고른 돌과 비교</h4><div class="rock-thumbs">${thumb(rock, '(정답)')}${thumb(chosen, '(선택)')}</div>` : ''}
            ${confuse.length ? `<h4>헷갈리기 쉬운 돌</h4><div class="rock-thumbs">${confuse.map(r => thumb(r)).join('')}</div>` : ''}
        </div>`;
    const next = $('#btn-next');
    next.disabled = false;
    next.textContent = quiz.total && quiz.i >= quiz.total ? '결과 보기 →' : 'Next →';
    next.focus({ preventScroll: true });
    $('#feedback').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function onNext() {
    if (!quiz) return;
    if (quiz.cur.answered) return nextQuestion();
    if (quiz.mode === 'type' || quiz.mode === 'exam') answer($('#answer-input').value);
}

function giveHint(kind) {
    const rock = byId[quiz.cur.id];
    if (!quiz.cur.hints.includes(kind)) quiz.cur.hints.push(kind);
    const parts = [];
    if (quiz.cur.hints.includes('cho')) parts.push(`초성: <strong>${chosung(rock.name)}</strong> (${rock.name.length}글자)`);
    if (quiz.cur.hints.includes('feat')) parts.push(`특징: <strong>${esc(rock.feature)}</strong> · ${rock.type}`);
    $('#hint-box').innerHTML = parts.map(p => `<p>${p}</p>`).join('');
    $('#answer-input').focus({ preventScroll: true });
}
function giveUp() { answer(''); }

function quitQuiz() {
    if (!quiz) return returnToLanding();
    clearTimer();
    if (quiz.answers.length) showResult(); else returnToLanding();
}

// ---------- 결과 ----------
function comment(ratio) {
    if (ratio === 1) return '완벽합니다! (Perfect Score)';
    if (ratio >= 0.8) return '훌륭합니다! (Excellent)';
    if (ratio >= 0.5) return '잘했습니다. (Good Job)';
    return '조금 더 연습해 보세요. 암석 도감부터 훑어보세요. (Keep Trying)';
}

function showResult() {
    clearTimer();
    const { answers, mode } = quiz;
    const ok = answers.filter(a => a.correct).length;
    quiz.wrongIds = [...new Set(answers.filter(a => !a.correct).map(a => a.id))];

    $('#quiz-area').style.display = 'none';
    $('#result-view').style.display = 'block';
    $('#score-area').textContent = `Score: ${ok} / ${answers.length}`;
    $('#analysis-area').innerHTML = `<p>${comment(answers.length ? ok / answers.length : 0)}</p>`;
    $('#simple-result-list').innerHTML = answers.map((a, k) => {
        const blank = !a.correct && !String(a.given).trim();
        const cls = a.correct ? 'success' : blank ? 'warning' : 'error';
        return `<div class="mini-badge ${cls}"><span class="mini-badge-icon">${a.correct ? '✓' : blank ? '—' : '✗'}</span><span class="mini-badge-label">Q${k + 1}</span></div>`;
    }).join('');
    $('#detail-list').innerHTML = `<ul>${answers.map((a, k) => {
        const r = byId[a.id];
        const blank = !a.correct && !String(a.given).trim();
        const cls = a.correct ? 'success' : blank ? 'warning' : 'error';
        const givenText = mode === 'choice' ? byId[a.given]?.name : a.given;
        return `<li class="detail-item rock-detail-item">
            ${miniPhoto(a.view)}
            <div>
                <div class="detail-status ${cls}"><span class="detail-status-icon">${a.correct ? '✓' : blank ? '—' : '✗'}</span>Q${k + 1} · ${a.correct ? '정답' : blank ? '무응답' : '오답'}</div>
                <div class="detail-answer-row"><span class="detail-answer-label">내가 쓴 답</span><span>${blank ? '(비어있음)' : esc(givenText)}</span></div>
                <div class="detail-answer-row"><span class="detail-answer-label">정답</span><span><strong>${esc(r.name)}</strong> ${typeTag(r.type)} · ${esc(r.feature)}</span></div>
            </div>
        </li>`;
    }).join('')}</ul>`;
    // 실전은 채점표를 바로 펼쳐 보여 준다
    $('#result-view').classList.toggle('expanded', mode === 'exam');
    $('#btn-retry-wrong').classList.toggle('hidden', !quiz.wrongIds.length);
    $('#btn-retry-wrong').textContent = `틀린 ${quiz.wrongIds.length}종만 다시`;

    window.scrollTo(0, 0);
}

function toggleDetails() { $('#result-view').classList.toggle('expanded'); }
function retrySame() { startQuiz(quiz.mode, quiz.pool, quiz.total); }
function retryWrong() { startQuiz(quiz.mode === 'exam' ? 'type' : quiz.mode, quiz.wrongIds, quiz.wrongIds.length); }

// ---------- 도감 ----------
function openStudy() { renderStudy(); showView('study'); }
function toggleHideNames() { hideNames = !hideNames; renderStudy(); }
function renderStudy() {
    $('#btn-hide-names').textContent = hideNames ? '이름 보이기' : '이름 가리기';
    $('#btn-hide-names').classList.toggle('progress', hideNames);
    $('#study-list').innerHTML = `<p class="rock-study-guide">${hideNames ? '카드를 누르면 이름이 보입니다. 사진만 보고 먼저 떠올려 보세요.' : '「이름 가리기」로 스스로 테스트할 수 있습니다. 사진을 누르면 크게 볼 수 있습니다.'}</p>` +
        Object.entries(GROUPS).map(([g, info]) => `
        <section class="rock-group">
            <h3>▶ ${esc(info.title)}</h3>
            <div class="rock-cards">${ROCKS.filter(r => r.group === g).map(r => `
                <article class="collection-card rock-card${hideNames ? ' hide' : ''}" data-reveal>
                    <button type="button" class="rock-card-photo" data-zoom="${esc(r.images[0])}"><img src="${esc(r.images[0])}" alt="" loading="lazy"></button>
                    <div class="rock-card-body">
                        <h3>${esc(r.name)} ${typeTag(r.type)}</h3>
                        <p class="rock-feature">${esc(r.feature)}</p>
                        <p class="rock-detail">${esc(r.detail)}</p>
                        <p class="rock-vs">헷갈리는 짝: ${r.confuse.map(id => byId[id].name).join(', ')}</p>
                    </div>
                </article>`).join('')}</div>
        </section>`).join('');
}

// ---------- 오답 노트 ----------
function openNotes() { renderNotes(); showView('notes'); }
function renderNotes() {
    const rows = ROCKS.map(r => ({ r, s: stats[r.id] })).filter(x => x.s?.seen)
        .sort((a, b) => b.s.wrong / b.s.seen - a.s.wrong / a.s.seen || b.s.wrong - a.s.wrong);
    const weak = rows.filter(x => x.s.wrong);
    $('#notes-badge').textContent = `약점 ${weak.length}종`;
    $('#notes-list').innerHTML = rows.length ? `
        <p class="rock-study-guide">푼 기록이 있는 ${rows.length}종을 틀린 비율이 높은 순서로 보여 줍니다. 기록은 이 브라우저에만 저장됩니다.</p>
        ${weak.length ? `<div class="rock-result-actions">
            <button class="btn primary" onclick="startWeak('choice')">약점만 객관식</button>
            <button class="btn primary" onclick="startWeak('type')">약점만 주관식</button>
        </div>` : ''}
        <ul class="rock-note-list">${rows.map(({ r, s }) => {
            const mix = Object.entries(s.mix || {}).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([id]) => byId[id]?.name).filter(Boolean);
            return `<li class="detail-item">
                <button type="button" class="rock-note-photo" data-zoom="${esc(r.images[0])}"><img src="${esc(r.images[0])}" alt="" loading="lazy"></button>
                <div class="rock-note-body">
                    <div class="rock-answer-name">${esc(r.name)} ${typeTag(r.type)}</div>
                    <div class="rock-bar"><div style="width:${(s.wrong / s.seen) * 100}%"></div></div>
                    <small>틀림 ${s.wrong} / 푼 횟수 ${s.seen}${mix.length ? ` · 주로 <strong>${mix.join(', ')}</strong>${roOf(mix[mix.length - 1])} 착각` : ''}</small>
                </div></li>`;
        }).join('')}</ul>
        <button class="btn secondary rock-reset" onclick="resetStats()">기록 초기화</button>`
        : `<p class="rock-study-guide">아직 푼 문제가 없습니다. 퀴즈를 풀면 여기에 약점이 쌓입니다.</p>
           <button class="btn primary" onclick="returnToLanding()">문제 풀러 가기</button>`;
}
function startWeak(mode) { const ids = weakIds(); startQuiz(mode, ids, Math.max(ids.length, 10)); }
function resetStats() {
    if (!confirm('오답 기록을 모두 지울까요?')) return;
    stats = {};
    store.set('stats', stats);
    renderNotes();
}

// ---------- 라이트박스 ----------
const lightbox = $('#lightbox');
function openLightbox(src, style) {
    const img = $('img', lightbox);
    img.src = src;
    img.setAttribute('style', style || '');
    lightbox.hidden = false;
}
lightbox.addEventListener('click', () => { lightbox.hidden = true; });

// ---------- 이벤트 ----------
document.addEventListener('click', e => {
    const hidden = e.target.closest('.rock-card.hide:not(.revealed)');
    if (hidden) { hidden.classList.add('revealed'); return; }
    const zoom = e.target.closest('[data-zoom]');
    if (zoom) return openLightbox(zoom.dataset.zoom, zoom.dataset.style);
    if (e.target.closest('#problem-area')) return openLightbox(quiz.cur.view.src, viewStyle(quiz.cur.view));
    const opt = e.target.closest('.rock-opt');
    if (opt) return answer(opt.dataset.ans);
    const sel = e.target.closest('.cnt-btn');
    if (sel) {
        const [key] = Object.keys(sel.dataset);
        const raw = sel.dataset[key];
        settings[key] = key === 'mode' || raw === 'all' ? raw : Number(raw);
        return saveSettings();
    }
});

for (const key of ['rotate', 'zoom', 'color', 'gray', 'tricky'])
    $(`#chk-${key}`).addEventListener('change', e => { settings[key] = e.target.checked; saveSettings(); });

$('#type-area').addEventListener('submit', e => { e.preventDefault(); onNext(); });

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !lightbox.hidden) { lightbox.hidden = true; return; }
    if (!quiz?.cur || $('#app-view').style.display !== 'block' || $('#quiz-area').style.display === 'none') return;
    if (!quiz.cur.answered && /^[1-9]$/.test(e.key) && e.target.tagName !== 'INPUT') {
        $$('.rock-opt')[Number(e.key) - 1]?.click();
    } else if (quiz.cur.answered && e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
        e.preventDefault();
        nextQuestion();
    }
});

$('#rock-credit').textContent = CREDIT;
renderLanding();
showView('landing');
