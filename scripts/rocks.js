'use strict';
// Rock ID Studio: 사진 보고 암석 맞히기. 데이터는 data/rocks/rocks.js.

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const app = $('#app');

// ---------- 저장 ----------
const store = {
    get(k, d) { try { const v = localStorage.getItem('rocks:' + k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem('rocks:' + k, JSON.stringify(v)); } catch { /* 저장 불가 환경 */ } },
};

const DEFAULTS = {
    mode: 'choice', range: 'all', count: 10, choices: 4, timer: 20,
    tricky: true, rotate: true, zoom: false, color: false, gray: false,
};
let settings = { ...DEFAULTS, ...store.get('settings', {}) };
let stats = store.get('stats', {}); // id -> { seen, wrong, mix: { 헷갈린id: 횟수 } }
let best = store.get('best', {});   // mode -> 최고 연속 정답
let quiz = null;
let study = { hide: false, type: 'all' };
let keyPath = [];

const byId = Object.fromEntries(ROCKS.map(r => [r.id, r]));

const MODES = {
    choice: { title: '객관식', desc: '사진을 보고 보기에서 이름을 고릅니다. 헷갈리는 돌이 보기로 먼저 나와요.' },
    type:   { title: '주관식', desc: '사진을 보고 이름을 직접 씁니다. 초성·특징 힌트를 쓸 수 있어요.' },
    pick:   { title: '사진 찾기', desc: '이름을 보고 사진 4장 중에서 그 암석을 찾습니다.' },
    kind:   { title: '종류', desc: '화성암·퇴적암·변성암 중 무엇인지만 맞힙니다.' },
    exam:   { title: '실전', desc: '수행평가처럼 시간 안에 이름을 쓰고, 끝까지 푼 뒤 한 번에 채점합니다.' },
};
const RANGE_KEYS = ['all', ...TYPES, 'weak'];

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
const typeTag = t => `<span class="rk-type ${typeClass(t)}">${t}</span>`;
const backBtn = (label = '홈') => `<button type="button" class="rk-btn ghost" data-go="home" aria-label="처음으로">← ${label}</button>`;

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
const photo = (v, cls) => `<div class="${cls}" data-zoom="${esc(v.src)}" data-style="${esc(viewStyle(v))}"><img src="${esc(v.src)}" alt="암석 사진" style="${viewStyle(v)}" draggable="false"></div>`;
const thumb = (rock, note = '') => `<button type="button" class="rk-thumb" data-zoom="${esc(rock.images[0])}">
    <img src="${esc(rock.images[0])}" alt="${esc(rock.name)}" loading="lazy"><b>${esc(rock.name)} ${note}</b><small>${esc(rock.feature)}</small></button>`;

// ---------- 기록 ----------
function record(id, correct, mixedWith) {
    const s = stats[id] || (stats[id] = { seen: 0, wrong: 0, mix: {} });
    s.seen++;
    if (!correct) s.wrong++;
    if (mixedWith && mixedWith !== id) s.mix[mixedWith] = (s.mix[mixedWith] || 0) + 1;
    store.set('stats', stats);
}
const weakIds = () => ROCKS.filter(r => stats[r.id]?.wrong).map(r => r.id);
const poolOf = range => range === 'all' ? ROCKS.map(r => r.id) : range === 'weak' ? weakIds() : ROCKS.filter(r => r.type === range).map(r => r.id);

function render(html, keepScroll) {
    app.innerHTML = html;
    if (!keepScroll) window.scrollTo(0, 0);
}

// ---------- 홈 ----------
function homeView(keepScroll) {
    clearTimer();
    quiz = null;
    if (settings.range === 'weak' && !weakIds().length) settings.range = 'all';
    const n = poolOf(settings.range).length;
    const seg = (key, items) => `<div class="rk-seg" role="group">${items.map(([v, label, sub, disabled]) =>
        `<button type="button" class="${String(settings[key]) === String(v) ? 'on' : ''}" data-set="${key}" data-val="${v}" ${disabled ? 'disabled' : ''}>${label}${sub !== undefined ? `<small>${sub}</small>` : ''}</button>`).join('')}</div>`;
    const toggle = (key, label) => `<label class="rk-toggle"><input type="checkbox" data-toggle="${key}" ${settings[key] ? 'checked' : ''}>${label}</label>`;
    const photoOn = ['rotate', 'zoom', 'color', 'gray'].filter(k => settings[k]).map(k => ({ rotate: '회전', zoom: '확대', color: '색감', gray: '흑백' }[k]));
    const weak = weakIds().length;

    render(`
    <section class="rk-hero">
        <p class="rk-eyebrow">ROCK ID STUDIO · 지구과학 실험</p>
        <h1>사진 보고,<br><em>암석 맞히기.</em></h1>
        <p>실물은 사진과 색·각도·크기가 다릅니다. 사진을 돌리고 확대해 가며 돌 자체를 보는 눈을 기르세요.</p>
    </section>

    <section class="rk-panel">
        <div class="rk-field">
            <div class="rk-field-label">모드</div>
            ${seg('mode', Object.entries(MODES).map(([k, m]) => [k, m.title]))}
            <p class="rk-mode-desc">${MODES[settings.mode].desc}</p>
        </div>
        <div class="rk-field">
            <div class="rk-field-label">범위</div>
            ${seg('range', RANGE_KEYS.map(k => [k, k === 'all' ? '전체' : k === 'weak' ? '약점' : k, poolOf(k).length, k === 'weak' && !weak]))}
        </div>
        ${settings.mode === 'exam' ? `
        <div class="rk-field">
            <div class="rk-field-label">문항당 제한 시간 <span>${n}문항 모두 출제</span></div>
            ${seg('timer', [10, 20, 30, 60].map(v => [v, `${v}초`]))}
        </div>` : `
        <div class="rk-field">
            <div class="rk-field-label">문항 수</div>
            ${seg('count', [[10, '10'], [20, '20'], ['all', `전체 ${n}`], [0, '무한']])}
        </div>`}
        <details class="rk-more">
            <summary><span>사진 변형 · 보기 설정<small>${photoOn.length ? photoOn.join(' · ') : '변형 없음'}</small></span></summary>
            <div class="rk-toggles">
                ${toggle('rotate', '회전·뒤집기')}
                ${toggle('zoom', '확대 (배경·번호표 가리기)')}
                ${toggle('color', '색감 흔들기')}
                ${toggle('gray', '흑백')}
                ${toggle('tricky', '헷갈리는 보기 우선')}
            </div>
            ${settings.mode === 'choice' ? `<div class="rk-field" style="margin-top:14px">
                <div class="rk-field-label">객관식 보기 수</div>
                ${seg('choices', [4, 5, 6].map(v => [v, `${v}지선다`]))}
            </div>` : ''}
        </details>
        <button type="button" class="rk-btn primary rk-start" data-action="start">시작하기 →</button>
    </section>

    <section class="rk-tools">
        <button type="button" class="rk-tool" data-go="study"><span>📖</span><b>암석 도감</b><small>22종 특징 · 헷갈리는 짝</small></button>
        <button type="button" class="rk-tool" data-go="key"><span>🧭</span><b>판별 도우미</b><small>질문에 답하며 이름 찾기</small></button>
        <button type="button" class="rk-tool" data-go="notes"><span>📝</span><b>오답 노트</b><small>${weak ? `약점 ${weak}종` : '아직 기록 없음'}</small></button>
    </section>`, keepScroll);
}

function changeSetting(key, raw) {
    settings[key] = key === 'mode' || key === 'range' || raw === 'all' ? raw : Number(raw);
    store.set('settings', settings);
    const open = $('.rk-more')?.open;
    homeView(true);
    if (open) $('.rk-more').open = true;
}

// ---------- 퀴즈 ----------
function startQuiz(mode, pool, total) {
    if (!pool.length) return;
    if (total === undefined) total = mode === 'exam' || settings.count === 'all' ? pool.length : Number(settings.count);
    quiz = { mode, pool, total, deck: [], i: 0, answers: [], last: null, timer: null, streak: 0, bestRun: 0 };
    nextQuestion();
}

function drawNext() {
    if (!quiz.deck.length) {
        quiz.deck = shuffle(quiz.pool);
        if (quiz.deck.length > 1 && quiz.deck[0] === quiz.last) quiz.deck.push(quiz.deck.shift());
    }
    return (quiz.last = quiz.deck.shift());
}

function optionsFor(rock, n) {
    if (quiz.mode === 'kind') return TYPES;
    const base = quiz.pool.length >= n ? quiz.pool : ROCKS.map(r => r.id);
    let ordered = shuffle(base.filter(id => id !== rock.id));
    if (settings.tricky) {
        const near = ordered.filter(id => rock.confuse.includes(id) || byId[id].confuse.includes(rock.id) || byId[id].group === rock.group);
        ordered = [...near, ...ordered.filter(id => !near.includes(id))];
    }
    return shuffle([rock.id, ...ordered.slice(0, n - 1)]);
}

function nextQuestion() {
    clearTimer();
    if (quiz.total && quiz.i >= quiz.total) return resultView();
    const rock = byId[drawNext()];
    const { mode } = quiz;
    const cur = quiz.cur = { id: rock.id, view: makeView(rock), answered: false, hints: [] };
    if (mode === 'choice') cur.options = optionsFor(rock, Math.min(settings.choices, ROCKS.length));
    if (mode === 'kind') cur.options = TYPES;
    if (mode === 'pick') { cur.options = optionsFor(rock, 4); cur.views = cur.options.map(id => makeView(byId[id])); }

    const progress = quiz.total ? `${quiz.i + 1} / ${quiz.total}` : `${quiz.i + 1}번째`;
    let body;
    if (mode === 'pick') {
        body = `<h2 class="rk-question"><em>${esc(rock.name)}</em>${hasBatchim(rock.name) ? '은' : '는'} 어느 것일까요?</h2>
            <div class="rk-picks">${cur.options.map((id, k) => `<button type="button" class="rk-pick" data-ans="${id}"><kbd>${k + 1}</kbd><img src="${esc(cur.views[k].src)}" alt="" style="${viewStyle(cur.views[k])}" draggable="false"></button>`).join('')}</div>`;
    } else {
        const answerArea = mode === 'choice' || mode === 'kind'
            ? `<div class="rk-opts ${mode === 'kind' ? 'kind' : ''}">${cur.options.map((o, k) =>
                `<button type="button" class="rk-opt" data-ans="${esc(o)}"><kbd>${k + 1}</kbd><span>${mode === 'kind' ? o : esc(byId[o].name)}</span></button>`).join('')}</div>`
            : `<form class="rk-type-form" id="type-form" autocomplete="off">
                    <input id="answer" type="text" placeholder="암석 이름" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" aria-label="암석 이름">
                    <button type="submit" class="rk-btn primary">확인</button>
               </form>
               ${mode === 'type' ? `<div class="rk-hints">
                    <button type="button" class="rk-btn" data-action="hint-cho">초성 힌트</button>
                    <button type="button" class="rk-btn" data-action="hint-feat">특징 힌트</button>
                    <button type="button" class="rk-btn ghost" data-action="giveup">모르겠어요</button>
               </div><div class="rk-hint-box" id="hint-box"></div>` : `<div class="rk-hints"><button type="button" class="rk-btn ghost" data-action="giveup">모름 · 넘기기</button></div>`}`;
        body = `<h2 class="rk-question">${mode === 'kind' ? '화성암·퇴적암·변성암 중 무엇일까요?' : '이 암석의 이름은?'}</h2>
            ${photo(cur.view, 'rk-stage')}
            ${mode === 'exam' ? '<div class="rk-timer"><div id="timer-bar"></div></div>' : '<p class="rk-cap">사진을 누르면 크게 볼 수 있어요</p>'}
            ${answerArea}`;
    }

    render(`
    <section class="rk-quiz">
        <div class="rk-qbar">
            <button type="button" class="rk-btn ghost" data-action="quit">${quiz.total ? '← 그만하기' : '← 끝내기'}</button>
            <span class="rk-qbar-title">${MODES[mode].title}</span>
            <span class="rk-qbar-right">${mode !== 'exam' && quiz.streak >= 2 ? `<span class="rk-streak">🔥 ${quiz.streak}연속</span>` : ''}${progress}</span>
        </div>
        ${quiz.total ? `<div class="rk-progress"><div style="width:${(quiz.i / quiz.total) * 100}%"></div></div>` : '<div class="rk-progress"></div>'}
        ${body}
        <div id="feedback"></div>
        <div class="rk-actions" id="actions" hidden><button type="button" class="rk-btn primary rk-next" data-action="next">다음 →</button></div>
    </section>`);

    if (mode === 'type' || mode === 'exam') $('#answer').focus({ preventScroll: true });
    if (mode === 'exam') startTimer(settings.timer);
}

function startTimer(sec) {
    const end = Date.now() + sec * 1000;
    const bar = $('#timer-bar');
    quiz.timer = setInterval(() => {
        const left = Math.max(0, end - Date.now());
        bar.style.width = `${(left / (sec * 1000)) * 100}%`;
        bar.classList.toggle('low', left < 5000);
        if (left <= 0) answer($('#answer').value); // 시간이 끝나면 입력해 둔 만큼 제출
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
    else if (quiz.mode === 'choice' || quiz.mode === 'pick') { correct = given === rock.id; mixed = given; }
    else { correct = isCorrect(rock, given); mixed = rockByName(given)?.id; }
    quiz.answers.push({ id: rock.id, given, correct, view: cur.view });
    record(rock.id, correct, correct ? null : mixed);
    quiz.streak = correct ? quiz.streak + 1 : 0;
    quiz.bestRun = Math.max(quiz.bestRun, quiz.streak);
    if (quiz.mode !== 'exam' && quiz.streak > (best[quiz.mode] || 0)) { best[quiz.mode] = quiz.streak; store.set('best', best); }
    quiz.i++;
    if (quiz.mode === 'exam') return nextQuestion();
    showFeedback(rock, given, correct);
}

function showFeedback(rock, given, correct) {
    const mode = quiz.mode;
    $$('.rk-opt, .rk-pick').forEach((b, k) => {
        b.disabled = true;
        const v = b.dataset.ans;
        if (mode === 'kind' ? v === rock.type : v === rock.id) b.classList.add('right');
        else if (v === given) b.classList.add('wrong');
        if (mode === 'pick') b.insertAdjacentHTML('beforeend', `<span class="rk-pick-name">${esc(byId[v].name)}</span>`);
    });
    $$('#type-form input, #type-form button, .rk-hints button').forEach(el => { el.disabled = true; });

    let givenLine = '';
    if (!correct && mode === 'type' && given.trim()) {
        const other = rockByName(given);
        givenLine = `<p class="rk-given">입력: <b>${esc(given)}</b>${other ? ` → 그건 <b>${esc(other.name)}</b>${hasBatchim(other.name) ? '이에요' : '예요'}` : nearMiss(rock, given) ? ' → 철자가 조금 달라요. 시험에선 오답!' : ''}</p>`;
    }
    const chosen = correct ? null : mode === 'choice' || mode === 'pick' ? byId[given] : mode === 'type' ? rockByName(given) : null;
    const confuse = rock.confuse.map(id => byId[id]).filter(r => r && r !== chosen);
    const last = quiz.total && quiz.i >= quiz.total;
    const streakNote = correct && quiz.streak >= 3 ? ` <small>🔥 ${quiz.streak}연속</small>` : correct && quiz.cur.hints.length ? ' <small>힌트 사용</small>' : '';
    $('#feedback').innerHTML = `
        <div class="rk-feedback ${correct ? 'ok' : 'bad'}">
            <p class="rk-verdict">${correct ? '정답!' : '아쉬워요'}${streakNote}</p>
            ${givenLine}
            <p class="rk-name">${esc(rock.name)} ${typeTag(rock.type)} <span class="rk-en">${esc(rock.en)}</span></p>
            <p class="rk-feature">${esc(rock.feature)}</p>
            <p class="rk-detail">${esc(rock.detail)}</p>
            ${chosen ? `<h4>내가 고른 돌과 비교</h4><div class="rk-thumbs">${thumb(rock, '(정답)')}${thumb(chosen, '(선택)')}</div>` : ''}
            ${confuse.length ? `<h4>헷갈리기 쉬운 돌</h4><div class="rk-thumbs">${confuse.map(r => thumb(r)).join('')}</div>` : ''}
        </div>`;
    const actions = $('#actions');
    actions.hidden = false;
    const next = $('.rk-next', actions);
    next.textContent = last ? '결과 보기 →' : '다음 →';
    next.focus({ preventScroll: true });
    $('#feedback').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function giveHint(kind) {
    const rock = byId[quiz.cur.id];
    if (!quiz.cur.hints.includes(kind)) quiz.cur.hints.push(kind);
    const parts = [];
    if (quiz.cur.hints.includes('cho')) parts.push(`초성: <b>${chosung(rock.name)}</b> (${rock.name.length}글자)`);
    if (quiz.cur.hints.includes('feat')) parts.push(`특징: <b>${esc(rock.feature)}</b> · ${rock.type}`);
    $('#hint-box').innerHTML = parts.map(p => `<p>${p}</p>`).join('');
    $('#answer').focus({ preventScroll: true });
}

// ---------- 결과 ----------
function resultView() {
    clearTimer();
    const { answers, mode } = quiz;
    const ok = answers.filter(a => a.correct).length;
    const pct = answers.length ? Math.round((ok / answers.length) * 100) : 0;
    const msg = pct === 100 ? '완벽해요! 🎉' : pct >= 80 ? '거의 다 왔어요!' : pct >= 50 ? '조금만 더!' : '도감부터 한 번 훑어볼까요?';
    quiz.wrongIds = [...new Set(answers.filter(a => !a.correct).map(a => a.id))];
    const list = mode === 'exam' ? answers : answers.filter(a => !a.correct);
    const answerText = a => mode === 'choice' || mode === 'pick' ? byId[a.given]?.name : a.given;
    render(`
    <section class="rk-panel rk-result-top">
        <p class="rk-eyebrow">${MODES[mode].title} 결과</p>
        <p class="rk-score" style="margin-top:12px">${ok}<small> / ${answers.length}</small></p>
        <p class="rk-score-msg">${msg}</p>
        <p class="rk-muted rk-score-sub">정답률 ${pct}%${mode !== 'exam' ? ` · 이번 최고 ${quiz.bestRun}연속 · 역대 최고 ${best[mode] || 0}연속` : ''}</p>
        <div class="rk-result-actions">
            ${quiz.wrongIds.length ? `<button type="button" class="rk-btn primary" data-action="retry-wrong">틀린 ${quiz.wrongIds.length}종만 다시</button>` : ''}
            <button type="button" class="rk-btn" data-action="retry">같은 설정으로 다시</button>
            <button type="button" class="rk-btn ghost" data-go="home">처음으로</button>
        </div>
    </section>
    ${list.length ? `<h3 class="rk-section-title">${mode === 'exam' ? '채점표' : '틀린 문제'}</h3>
    <ol class="rk-list">${list.map(a => {
        const r = byId[a.id];
        const blank = !String(a.given).trim();
        return `<li class="${a.correct ? 'ok' : 'bad'}">${photo(a.view, 'rk-mini')}
            <div class="rk-list-body"><p class="rk-name">${esc(r.name)} ${typeTag(r.type)}</p>
            <p>${a.correct ? '✓ 정답' : blank ? '— 무응답' : `✗ 내 답: ${esc(answerText(a))}`} · ${esc(r.feature)}</p></div></li>`;
    }).join('')}</ol>` : ''}`);
}

// ---------- 도감 ----------
function studyView(keepScroll) {
    const filt = r => study.type === 'all' || r.type === study.type;
    render(`
    <div class="rk-page-head">${backBtn()}<h1>암석 도감</h1>
        <button type="button" class="rk-btn rk-head-right" data-action="toggle-hide">${study.hide ? '이름 보이기' : '이름 가리기'}</button></div>
    <div class="rk-seg">${['all', ...TYPES].map(t => `<button type="button" class="${study.type === t ? 'on' : ''}" data-study-type="${t}">${t === 'all' ? '전체' : t}</button>`).join('')}</div>
    <p class="rk-muted" style="margin-top:10px">${study.hide ? '카드를 누르면 이름이 보여요. 사진만 보고 먼저 떠올려 보세요.' : '「이름 가리기」로 스스로 테스트할 수 있어요.'}</p>
    ${Object.entries(GROUPS).map(([g, info]) => {
        const rocks = ROCKS.filter(r => r.group === g && filt(r));
        if (!rocks.length) return '';
        return `<h2 class="rk-group-title">${esc(info.title)}</h2><div class="rk-cards">${rocks.map(r => `
            <article class="rk-card${study.hide ? ' hide' : ''}">
                <button type="button" class="rk-card-photo" data-zoom="${esc(r.images[0])}"><img src="${esc(r.images[0])}" alt="" loading="lazy"></button>
                <div class="rk-card-body">
                    <h3>${esc(r.name)} ${typeTag(r.type)}</h3>
                    <p class="rk-feature">${esc(r.feature)}</p>
                    <p class="rk-detail">${esc(r.detail)}</p>
                    <p class="rk-vs">헷갈리는 짝: ${r.confuse.map(id => byId[id].name).join(', ')}</p>
                </div>
            </article>`).join('')}</div>`;
    }).join('')}`, keepScroll);
}

// ---------- 판별 도우미 ----------
function keyView() {
    const nodeId = keyPath.length ? keyPath[keyPath.length - 1].next : 'start';
    const done = keyPath.length && keyPath[keyPath.length - 1].rock;
    const trail = keyPath.length ? `<div class="rk-trail">${keyPath.map(s => `<span>${esc(s.label)}</span>`).join('')}</div>` : '';
    let body;
    if (done) {
        const r = byId[done];
        body = `<p class="rk-eyebrow">판별 결과</p>
            <div class="rk-key-result" style="margin-top:10px">
                <button type="button" class="rk-card-photo" data-zoom="${esc(r.images[0])}"><img src="${esc(r.images[0])}" alt=""></button>
                <div><p class="rk-name" style="margin-top:0">${esc(r.name)} ${typeTag(r.type)} <span class="rk-en">${esc(r.en)}</span></p>
                <p class="rk-feature">${esc(r.feature)}</p><p class="rk-detail">${esc(r.detail)}</p>
                <p class="rk-vs">헷갈리는 짝: ${r.confuse.map(id => byId[id].name).join(', ')}</p></div>
            </div>
            <div class="rk-result-actions" style="justify-content:flex-start">
                <button type="button" class="rk-btn primary" data-action="key-reset">처음부터 다시</button>
                <button type="button" class="rk-btn" data-action="key-back">한 단계 뒤로</button>
            </div>`;
    } else {
        const node = ROCK_KEY[nodeId];
        body = `<p class="rk-eyebrow">질문 ${keyPath.length + 1}</p>
            <p class="rk-key-q" style="margin-top:8px">${esc(node.q)}</p>
            ${node.hint ? `<p class="rk-muted rk-key-hint">${esc(node.hint)}</p>` : ''}
            <div class="rk-key-opts">${node.options.map((o, k) => `<button type="button" class="rk-key-opt" data-key="${k}">${o.rock ? `<img src="${esc(byId[o.rock].images[0])}" alt="" loading="lazy">` : ''}<span>${esc(o.label)}</span></button>`).join('')}</div>
            ${keyPath.length ? '<div class="rk-result-actions" style="justify-content:flex-start"><button type="button" class="rk-btn ghost" data-action="key-back">← 이전 질문</button></div>' : ''}`;
    }
    render(`
    <div class="rk-page-head">${backBtn()}<h1>판별 도우미</h1></div>
    <p class="rk-muted" style="margin-bottom:14px">실험지 「탐구 과정」처럼 실물 암석을 보며 질문에 답하면 이름을 좁혀 줍니다. 수행평가 때 떠올릴 순서를 연습해 보세요.</p>
    <section class="rk-panel">${trail}${body}</section>`);
}
function keyChoose(k) {
    const nodeId = keyPath.length ? keyPath[keyPath.length - 1].next : 'start';
    keyPath.push(ROCK_KEY[nodeId].options[k]);
    keyView();
}

// ---------- 오답 노트 ----------
function notesView() {
    const rows = ROCKS.map(r => ({ r, s: stats[r.id] })).filter(x => x.s?.seen)
        .sort((a, b) => b.s.wrong / b.s.seen - a.s.wrong / a.s.seen || b.s.wrong - a.s.wrong);
    const weak = rows.filter(x => x.s.wrong);
    render(`
    <div class="rk-page-head">${backBtn()}<h1>오답 노트</h1></div>
    ${rows.length ? `
        <p class="rk-muted">푼 기록이 있는 ${rows.length}종 중 틀린 적 있는 돌 ${weak.length}종. 틀린 비율이 높은 순서예요. 기록은 이 브라우저에만 남습니다.</p>
        ${weak.length ? `<div class="rk-result-actions" style="justify-content:flex-start">
            <button type="button" class="rk-btn primary" data-action="weak" data-mode="choice">약점만 객관식</button>
            <button type="button" class="rk-btn primary" data-action="weak" data-mode="type">약점만 주관식</button>
            <button type="button" class="rk-btn" data-action="weak" data-mode="pick">약점만 사진 찾기</button>
        </div>` : ''}
        <ul class="rk-list" style="margin-top:16px">${rows.map(({ r, s }) => {
            const mix = Object.entries(s.mix || {}).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([id]) => byId[id]?.name).filter(Boolean);
            return `<li class="${s.wrong ? 'bad' : 'ok'}">
                <button type="button" class="rk-mini cover" data-zoom="${esc(r.images[0])}"><img src="${esc(r.images[0])}" alt="" loading="lazy"></button>
                <div class="rk-list-body"><p class="rk-name">${esc(r.name)} ${typeTag(r.type)}</p>
                <div class="rk-bar"><div style="width:${(s.wrong / s.seen) * 100}%"></div></div>
                <p>틀림 ${s.wrong} / 푼 횟수 ${s.seen}${mix.length ? ` · 주로 <b>${mix.join(', ')}</b>${roOf(mix[mix.length - 1])} 착각` : ''}</p></div></li>`;
        }).join('')}</ul>
        <div class="rk-result-actions" style="justify-content:flex-start"><button type="button" class="rk-btn ghost" data-action="reset">기록 초기화</button></div>`
    : `<p class="rk-muted">아직 푼 문제가 없어요. 퀴즈를 풀면 여기에 약점이 쌓여요.</p>
       <div class="rk-result-actions" style="justify-content:flex-start"><button type="button" class="rk-btn primary" data-go="home">문제 풀러 가기</button></div>`}`);
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
const GO = { home: () => homeView(), study: () => studyView(), notes: () => notesView(), key: () => { keyPath = []; keyView(); } };

app.addEventListener('click', e => {
    const hidden = e.target.closest('.rk-card.hide:not(.revealed)');
    if (hidden) { hidden.classList.add('revealed'); return; }
    const t = e.target.closest('button, [data-zoom]');
    if (!t) return;
    const d = t.dataset;
    if (d.ans !== undefined) return answer(d.ans);
    if (d.zoom !== undefined) return openLightbox(d.zoom, d.style);
    if (d.go) return GO[d.go]();
    if (d.set) return changeSetting(d.set, d.val);
    if (d.studyType) { study.type = d.studyType; return studyView(true); }
    if (d.key !== undefined) return keyChoose(Number(d.key));
    switch (d.action) {
        case 'start': return startQuiz(settings.mode, poolOf(settings.range));
        case 'next': return nextQuestion();
        case 'quit': clearTimer(); return quiz.answers.length ? resultView() : homeView();
        case 'hint-cho': return giveHint('cho');
        case 'hint-feat': return giveHint('feat');
        case 'giveup': return answer('');
        case 'retry': return startQuiz(quiz.mode, quiz.pool, quiz.total);
        case 'retry-wrong': return startQuiz(quiz.mode === 'exam' ? 'type' : quiz.mode, quiz.wrongIds, quiz.wrongIds.length);
        case 'toggle-hide': study.hide = !study.hide; return studyView(true);
        case 'weak': { const ids = weakIds(); return startQuiz(d.mode, ids, Math.max(ids.length, 10)); }
        case 'key-back': keyPath.pop(); return keyView();
        case 'key-reset': keyPath = []; return keyView();
        case 'reset':
            if (confirm('오답 기록을 모두 지울까요?')) { stats = {}; store.set('stats', stats); notesView(); }
    }
});

app.addEventListener('change', e => {
    const key = e.target.dataset.toggle;
    if (!key) return;
    settings[key] = e.target.checked;
    store.set('settings', settings);
    const summary = $('.rk-more summary small');
    if (summary) summary.textContent = ['rotate', 'zoom', 'color', 'gray'].filter(k => settings[k]).map(k => ({ rotate: '회전', zoom: '확대', color: '색감', gray: '흑백' }[k])).join(' · ') || '변형 없음';
});

app.addEventListener('submit', e => {
    if (e.target.id !== 'type-form') return;
    e.preventDefault();
    answer($('#answer').value);
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !lightbox.hidden) { lightbox.hidden = true; return; }
    if (!quiz?.cur || !$('.rk-quiz')) return;
    if (!quiz.cur.answered && /^[1-9]$/.test(e.key) && e.target.tagName !== 'INPUT') {
        $$('.rk-opt, .rk-pick')[Number(e.key) - 1]?.click();
    } else if (quiz.cur.answered && e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
        e.preventDefault();
        nextQuestion();
    }
});

$('#rock-credit').textContent = CREDIT;
homeView();
