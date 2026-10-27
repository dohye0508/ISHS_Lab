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
    chartStyle: 'select', chartPrompt: 'photo', chartCount: 10,
};
let settings = { ...DEFAULTS, ...store.get('settings', {}) };
let stats = store.get('stats', {}); // id -> { seen, wrong, mix: { 헷갈린id: 횟수 } }
let best = store.get('best', {});   // mode -> 최고 연속 정답
let quiz = null;
let study = { hide: false, type: 'all' };
let keyPath = []; // 판별 도우미에서 고른 답들 [{ n, t, to | leaf }]

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
        <button type="button" class="rk-tool rk-tool-hot" data-go="chart"><span>🧩</span><b>순서도 게임</b><small>판별 순서를 특징으로 나열</small></button>
        <button type="button" class="rk-tool" data-go="study"><span>📖</span><b>암석 도감</b><small>22종 특징 · 헷갈리는 짝</small></button>
        <button type="button" class="rk-tool" data-go="key"><span>🧭</span><b>판별 도우미</b><small>질문에 답하며 이름 찾기</small></button>
        <button type="button" class="rk-tool" data-go="notes"><span>📝</span><b>오답 노트</b><small>${weak ? `약점 ${weak}종` : '아직 기록 없음'}</small></button>
    </section>`, keepScroll);
}

function changeSetting(key, raw) {
    settings[key] = /^\d+$/.test(raw) ? Number(raw) : raw;
    store.set('settings', settings);
    if (key.startsWith('chart')) return chartHome(true);
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

// ---------- 순서도 공통 ----------
const circ = n => String.fromCharCode(n <= 20 ? 0x245F + n : 0x3250 + n - 20);
const STOP = '판별 끝 — 이제 이름을 말할 수 있다';
const FLOW_PATHS = {}; // 암석 이름 -> 가능한 경로들 [[{ n, t }]]
(function walk(n, acc) {
    for (const a of FLOW[n].a) {
        const p = [...acc, { n, t: a.t }];
        if (a.leaf) (FLOW_PATHS[a.leaf] ||= []).push(p); else walk(a.to, p);
    }
})(1, []);
const ALL_TRAITS = [...new Set(Object.values(FLOW).flatMap(node => node.a.map(a => a.t)))];
const leafRock = name => FLOW_LEAVES[name]?.id ? byId[FLOW_LEAVES[name].id] : null;
const siblingsOf = (n, t) => FLOW[n].a.map(a => a.t).filter(x => x !== t);

function leafCard(name) {
    const r = leafRock(name);
    if (!r) return `<p class="rk-name" style="margin-top:0">${esc(name)} ${typeTag(FLOW_LEAVES[name].type)}</p>
        <p class="rk-muted" style="margin-top:4px">수업 사진이 없는 암석입니다. 순서도에서의 위치를 익혀 두세요.</p>`;
    return `<div class="rk-key-result">
        <button type="button" class="rk-card-photo" data-zoom="${esc(r.images[0])}"><img src="${esc(r.images[0])}" alt=""></button>
        <div><p class="rk-name" style="margin-top:0">${esc(name)} ${typeTag(r.type)} <span class="rk-en">${esc(r.en)}</span></p>
        <p class="rk-feature">${esc(r.feature)}</p><p class="rk-detail">${esc(r.detail)}</p></div></div>`;
}
// 경로를 질문·답으로 보여 준다. mine을 주면 단계별로 맞았는지 표시한다.
const pathHtml = (path, mine) => `<ol class="rk-path">${path.map((s, i) => `<li class="${mine ? (mine[i] === s.t ? 'ok' : 'bad') : ''}">
    <span class="rk-path-q">${circ(s.n)} ${esc(FLOW[s.n].q)}</span><b>${esc(s.t)}</b></li>`).join('')}</ol>`;

// ---------- 판별 도우미 ----------
function keyView() {
    const last = keyPath[keyPath.length - 1];
    const trail = keyPath.length ? `<div class="rk-trail">${keyPath.map(s => `<span>${circ(s.n)} ${esc(s.t)}</span>`).join('')}</div>` : '';
    let body;
    if (last?.leaf) {
        body = `<p class="rk-eyebrow">판별 결과 · ${keyPath.length}단계</p><div style="margin-top:10px">${leafCard(last.leaf)}</div>
            <div class="rk-result-actions" style="justify-content:flex-start">
                <button type="button" class="rk-btn primary" data-action="key-reset">처음부터 다시</button>
                <button type="button" class="rk-btn" data-action="key-back">한 단계 뒤로</button>
            </div>`;
    } else {
        const n = last ? last.to : 1;
        const node = FLOW[n];
        body = `<p class="rk-eyebrow">질문 ${circ(n)}</p>
            <p class="rk-key-q" style="margin-top:8px">${esc(node.q)}</p>
            <div class="rk-key-opts">${node.a.map((a, k) => {
                const r = a.leaf && leafRock(a.leaf);
                return `<button type="button" class="rk-key-opt" data-key="${k}">${r ? `<img src="${esc(r.images[0])}" alt="" loading="lazy">` : ''}<span>${esc(a.t)}</span></button>`;
            }).join('')}</div>
            ${keyPath.length ? '<div class="rk-result-actions" style="justify-content:flex-start"><button type="button" class="rk-btn ghost" data-action="key-back">← 이전 질문</button></div>' : ''}`;
    }
    render(`
    <div class="rk-page-head">${backBtn()}<h1>판별 도우미</h1></div>
    <p class="rk-muted" style="margin-bottom:14px">실험지 「암석 분류 순서도」 ①~㉓을 그대로 따라갑니다. 실물을 보며 답하면 이름을 좁혀 줍니다. 순서도에 없는 부석·스코리아·유문암·혼펠스는 도감을 참고하세요.</p>
    <section class="rk-panel">${trail}${body}</section>`);
}
function keyChoose(k) {
    const last = keyPath[keyPath.length - 1];
    const n = last ? last.to : 1;
    keyPath.push({ n, ...FLOW[n].a[k] });
    keyView();
}

// ---------- 순서도 게임 ----------
const CHART_STYLES = {
    order:  { title: '순서 배열', desc: '필요한 특징만 섞어서 줍니다. 순서도 순서대로 쌓으세요.' },
    select: { title: '골라서 배열', desc: '함정 특징이 섞여 있습니다. 필요한 것만, 필요한 만큼 골라 순서대로 쌓으세요. 몇 개가 필요한지는 알려주지 않아요.' },
    step:   { title: '한 단계씩', desc: '매 단계 다음 특징을 고릅니다. 충분하면 「판별 끝」을 골라야 하고, 한 번이라도 틀리면 그 문제는 끝입니다.' },
    twenty: { title: '스무고개', desc: '특징이 순서도 순서대로 하나씩 공개됩니다. 적은 단서로 맞힐수록 점수가 높고, 기회는 한 번입니다.' },
};
let chart = null;

function chartHome(keepScroll) {
    chart = null;
    const photoOnly = settings.chartPrompt === 'photo' && settings.chartStyle !== 'twenty';
    const n = photoOnly ? Object.values(FLOW_LEAVES).filter(v => v.id).length : Object.keys(FLOW_LEAVES).length;
    const seg = (key, items) => `<div class="rk-seg" role="group">${items.map(([v, label, disabled]) =>
        `<button type="button" class="${String(settings[key]) === String(v) ? 'on' : ''}" data-set="${key}" data-val="${v}" ${disabled ? 'disabled' : ''}>${label}</button>`).join('')}</div>`;
    render(`
    <div class="rk-page-head">${backBtn()}<h1>순서도 게임</h1></div>
    <p class="rk-muted" style="margin-bottom:14px">실험지 「암석 분류 순서도」로 판별 순서를 외우는 게임입니다. 꼭 필요한 특징만, 순서도 순서대로 말해야 정답입니다.</p>
    <section class="rk-panel">
        <div class="rk-field">
            <div class="rk-field-label">방식</div>
            ${seg('chartStyle', Object.entries(CHART_STYLES).map(([k, s]) => [k, s.title]))}
            <p class="rk-mode-desc">${CHART_STYLES[settings.chartStyle].desc}</p>
        </div>
        <div class="rk-field">
            <div class="rk-field-label">문제로 주는 것 ${settings.chartStyle === 'twenty' ? '<span>스무고개는 단서만 줍니다</span>' : ''}</div>
            ${seg('chartPrompt', [['photo', '사진', settings.chartStyle === 'twenty'], ['name', '이름', settings.chartStyle === 'twenty']])}
        </div>
        <div class="rk-field">
            <div class="rk-field-label">문항 수 <span>${n}종에서 출제</span></div>
            ${seg('chartCount', [[5, '5'], [10, '10'], ['all', `전체 ${n}`]])}
        </div>
        <button type="button" class="rk-btn primary rk-start" data-action="chart-start">시작하기 →</button>
    </section>
    <p class="rk-muted" style="margin-top:12px">사진 문제는 수업 사진이 있는 18종, 이름 문제와 스무고개는 순서도의 30종 전체에서 나옵니다.</p>`, keepScroll);
}

function startChart(pool, total) {
    const photoOnly = settings.chartPrompt === 'photo' && settings.chartStyle !== 'twenty';
    pool ||= Object.keys(FLOW_LEAVES).filter(name => !photoOnly || FLOW_LEAVES[name].id);
    if (total === undefined) total = settings.chartCount === 'all' ? pool.length : Number(settings.chartCount);
    chart = { style: settings.chartStyle, photo: photoOnly, pool, total, deck: [], i: 0, results: [], last: null };
    nextChart();
}

function nextChart() {
    if (chart.i >= chart.total) return chartResult();
    if (!chart.deck.length) {
        chart.deck = shuffle(chart.pool);
        if (chart.deck.length > 1 && chart.deck[0] === chart.last) chart.deck.push(chart.deck.shift());
    }
    const name = chart.last = chart.deck.shift();
    const paths = FLOW_PATHS[name];
    const base = pick(paths);
    const rock = leafRock(name);
    const cur = chart.cur = { name, paths, base, seq: [], done: false, revealed: 1, view: chart.photo && rock ? makeView(rock) : null };
    if (chart.style === 'order') cur.chips = shuffle(base.map(s => s.t));
    if (chart.style === 'select') {
        const need = base.map(s => s.t);
        const traps = [...new Set(base.flatMap(s => siblingsOf(s.n, s.t)))].filter(t => !need.includes(t));
        const extra = shuffle(ALL_TRAITS.filter(t => !need.includes(t) && !traps.includes(t))).slice(0, 3);
        cur.chips = shuffle([...need, ...traps, ...extra]);
    }
    if (chart.style === 'step') cur.options = stepOptions();
    if (chart.style === 'twenty') {
        // 경로가 많이 겹치는 암석일수록 먼저 보기로 넣어 초반 단서만으로는 못 맞히게 한다
        const shared = other => Math.max(...FLOW_PATHS[other].map(p => { let k = 0; while (k < p.length && k < base.length && p[k].t === base[k].t) k++; return k; }));
        const others = shuffle(Object.keys(FLOW_LEAVES).filter(x => x !== name)).sort((a, b) => shared(b) - shared(a));
        cur.options = shuffle([name, ...others.slice(0, 5)]);
    }
    chartView();
}

// 지금까지 고른 특징과 맞는 경로들을 기준으로 다음 단계의 정답 집합과 보기를 만든다
function stepOptions() {
    const cur = chart.cur, k = cur.seq.length;
    const alive = cur.paths.filter(p => cur.seq.every((t, i) => p[i]?.t === t));
    const correct = new Set(alive.map(p => p.length === k ? STOP : p[k].t));
    const ref = alive.find(p => p.length > k) || alive[0];
    const near = ref.length > k ? siblingsOf(ref[k].n, ref[k].t) : siblingsOf(ref[k - 1].n, ref[k - 1].t);
    const pool = [...near, ...shuffle(ALL_TRAITS)].filter(t => !correct.has(t) && !cur.seq.includes(t));
    const opts = [...correct].filter(t => t !== STOP);
    for (const t of pool) { if (opts.length >= 5) break; if (!opts.includes(t)) opts.push(t); }
    cur.correct = correct;
    return [...shuffle(opts), STOP];
}

function chartView() {
    const { style, cur } = chart;
    const prompt = style === 'twenty'
        ? '<h2 class="rk-question">이 특징을 가진 암석은?</h2>'
        : cur.view
            ? `<h2 class="rk-question">이 암석의 판별 순서는?</h2>${photo(cur.view, 'rk-stage rk-stage-sm')}`
            : `<div class="rk-name-card"><p class="rk-eyebrow">이 암석의 판별 순서는?</p><p class="rk-big-name">${esc(cur.name)}</p></div>`;
    let body = '';
    if (style === 'order' || style === 'select') {
        body = `
        <div class="rk-seq-box">
            <p class="rk-seq-title">내 판별 순서 <small>${cur.seq.length}개${style === 'order' ? ` / ${cur.chips.length}` : ''}</small></p>
            ${cur.seq.length ? `<ol class="rk-seq">${cur.seq.map((ci, i) => `<li><button type="button" data-seq="${i}" ${cur.done ? 'disabled' : ''}><span>${esc(cur.chips[ci])}</span><i>✕</i></button></li>`).join('')}</ol>`
                : '<p class="rk-muted">아래 특징을 순서도 순서대로 눌러 쌓으세요. 잘못 넣은 건 눌러서 뺄 수 있어요.</p>'}
        </div>
        <div class="rk-chips">${cur.chips.map((t, i) => `<button type="button" class="rk-chip" data-chip="${i}" ${cur.done || cur.seq.includes(i) ? 'disabled' : ''}>${esc(t)}</button>`).join('')}</div>
        ${cur.done ? '' : `<div class="rk-actions">
            <button type="button" class="rk-btn" data-action="chart-undo" ${cur.seq.length ? '' : 'disabled'}>되돌리기</button>
            <button type="button" class="rk-btn primary rk-next" data-action="chart-submit" ${cur.seq.length && (style === 'select' || cur.seq.length === cur.chips.length) ? '' : 'disabled'}>제출</button>
        </div>`}`;
    } else if (style === 'step') {
        body = `
        ${cur.seq.length ? `<ol class="rk-path">${cur.seq.map(t => `<li class="ok"><b>${esc(t)}</b></li>`).join('')}</ol>` : ''}
        ${cur.done ? '' : `<p class="rk-step-q">${cur.seq.length + 1}번째 특징은?</p>
        <div class="rk-key-opts">${cur.options.map((t, i) => `<button type="button" class="rk-key-opt${t === STOP ? ' stop' : ''}" data-stepopt="${i}"><span>${t === STOP ? '🏁 ' : ''}${esc(t)}</span></button>`).join('')}</div>`}`;
    } else {
        const pts = cur.base.length - cur.revealed + 1;
        body = `
        <ol class="rk-path">${cur.base.slice(0, cur.revealed).map(s => `<li><span class="rk-path-q">단서</span><b>${esc(s.t)}</b></li>`).join('')}</ol>
        ${cur.done ? '' : `<div class="rk-twenty-bar">
            <span>단서 ${cur.revealed} / ${cur.base.length} · 지금 맞히면 <b>${pts}점</b></span>
            <button type="button" class="rk-btn" data-action="chart-reveal" ${cur.revealed >= cur.base.length ? 'disabled' : ''}>다음 단서 공개</button>
        </div>
        <div class="rk-opts">${cur.options.map((name, k) => `<button type="button" class="rk-opt" data-guess="${esc(name)}"><kbd>${k + 1}</kbd><span>${esc(name)}</span></button>`).join('')}</div>`}`;
    }
    const score = chart.results.reduce((s, r) => s + r.points, 0);
    render(`
    <section class="rk-quiz">
        <div class="rk-qbar">
            <button type="button" class="rk-btn ghost" data-action="chart-quit">← 그만하기</button>
            <span class="rk-qbar-title">${CHART_STYLES[style].title}</span>
            <span class="rk-qbar-right">${style === 'twenty' ? `<span class="rk-streak">${score}점</span>` : ''}${Math.min(chart.i + 1, chart.total)} / ${chart.total}</span>
        </div>
        <div class="rk-progress"><div style="width:${(chart.i / chart.total) * 100}%"></div></div>
        ${prompt}
        ${body}
        <div id="feedback">${cur.feedback || ''}</div>
        ${cur.done ? `<div class="rk-actions"><button type="button" class="rk-btn primary rk-next" data-action="chart-next">${chart.i >= chart.total ? '결과 보기 →' : '다음 →'}</button></div>` : ''}
    </section>`, true);
}

// 내가 쌓은 순서를 가능한 경로들과 비교한다
function diagnose(mine, paths) {
    let best = paths[0], bestK = -1;
    for (const p of paths) {
        let k = 0;
        while (k < p.length && k < mine.length && p[k].t === mine[k]) k++;
        if (k > bestK || (k === bestK && Math.abs(p.length - mine.length) < Math.abs(best.length - mine.length))) { bestK = k; best = p; }
    }
    const exact = bestK === best.length && mine.length === best.length;
    let msg = '';
    if (!exact) {
        if (bestK === mine.length) msg = `특징이 부족해요. ${best.length - mine.length}단계가 더 있어야 판별됩니다.`;
        else if (bestK === best.length) msg = `필요 없는 특징을 ${mine.length - best.length}개 더 넣었어요. ${best.length}단계면 충분합니다.`;
        else msg = `${bestK + 1}번째 특징부터 순서도와 달라요.`;
    }
    return { exact, best, msg };
}

function finishChart(ok, mine, best, msg, points) {
    const cur = chart.cur;
    cur.done = true;
    chart.results.push({ name: cur.name, ok, points, best, mine });
    chart.i++;
    const other = cur.paths.length > 1 ? `<p class="rk-muted" style="margin-top:8px">${esc(cur.name)}${hasBatchim(cur.name) ? '은' : '는'} 순서도에 경로가 ${cur.paths.length}개 있어서 어느 쪽이든 정답입니다.</p>` : '';
    cur.feedback = `
    <div class="rk-feedback ${ok ? 'ok' : 'bad'}">
        <p class="rk-verdict">${ok ? '정답!' : '아쉬워요'}${chart.style === 'twenty' && ok ? ` <small>+${points}점</small>` : ''}</p>
        ${msg ? `<p class="rk-given">${msg}</p>` : ''}
        <h4>순서도 경로 · ${best.length}단계</h4>
        ${pathHtml(best, mine)}
        ${other}
        <h4>정답 암석</h4>
        ${leafCard(cur.name)}
    </div>`;
    chartView();
    $('#feedback').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function chartSubmit() {
    const cur = chart.cur;
    const mine = cur.seq.map(i => cur.chips[i]);
    const d = diagnose(mine, cur.paths);
    finishChart(d.exact, mine, d.best, d.msg, d.exact ? 1 : 0);
}

function chartStep(i) {
    const cur = chart.cur;
    const t = cur.options[i];
    if (!cur.correct.has(t)) {
        const d = diagnose(cur.seq, cur.paths);
        const msg = t === STOP ? `아직 판별이 끝나지 않았어요. ${d.best.length - cur.seq.length}단계가 더 필요합니다.`
            : cur.correct.has(STOP) ? '이미 판별이 끝났어요. 여기서 「판별 끝」을 골라야 합니다.'
            : `${cur.seq.length + 1}번째 특징이 순서도와 달라요.`;
        return finishChart(false, [...cur.seq, t], d.best, msg, 0);
    }
    if (t === STOP) return finishChart(true, cur.seq, diagnose(cur.seq, cur.paths).best, '', 1);
    cur.seq.push(t);
    cur.options = stepOptions();
    chartView();
}

function chartGuess(name) {
    const cur = chart.cur;
    const ok = name === cur.name;
    const points = ok ? cur.base.length - cur.revealed + 1 : 0;
    const msg = ok ? `단서 ${cur.revealed}개 만에 맞혔어요.` : `「${esc(name)}」${hasBatchim(name) ? '은' : '는'} 아니에요.`;
    finishChart(ok, null, cur.base, msg, points);
}

function chartResult() {
    const { results, style } = chart;
    const ok = results.filter(r => r.ok).length;
    const points = results.reduce((s, r) => s + r.points, 0);
    const max = results.reduce((s, r) => s + (style === 'twenty' ? r.best.length : 1), 0);
    chart.wrong = [...new Set(results.filter(r => !r.ok).map(r => r.name))];
    render(`
    <section class="rk-panel rk-result-top">
        <p class="rk-eyebrow">순서도 게임 · ${CHART_STYLES[style].title}</p>
        <p class="rk-score" style="margin-top:12px">${style === 'twenty' ? points : ok}<small> / ${style === 'twenty' ? `${max}점` : results.length}</small></p>
        <p class="rk-score-msg">${ok === results.length ? '순서도를 완벽하게 외웠어요! 🎉' : ok / results.length >= 0.7 ? '거의 다 왔어요!' : '판별 도우미로 순서도를 한 번 따라가 볼까요?'}</p>
        ${style === 'twenty' ? `<p class="rk-muted rk-score-sub">맞힌 문제 ${ok} / ${results.length}</p>` : ''}
        <div class="rk-result-actions">
            ${chart.wrong.length ? `<button type="button" class="rk-btn primary" data-action="chart-retry-wrong">틀린 ${chart.wrong.length}종만 다시</button>` : ''}
            <button type="button" class="rk-btn" data-action="chart-retry">같은 설정으로 다시</button>
            <button type="button" class="rk-btn ghost" data-go="chart">게임 설정</button>
        </div>
    </section>
    <h3 class="rk-section-title">문제별 경로</h3>
    <ol class="rk-list">${results.map(r => `<li class="${r.ok ? 'ok' : 'bad'}"><div class="rk-list-body">
        <p class="rk-name">${esc(r.name)} ${typeTag(FLOW_LEAVES[r.name].type)}</p>
        <p>${r.ok ? '✓' : '✗'} ${r.best.map(s => circ(s.n)).join(' → ')} <span class="rk-muted">(${r.best.length}단계)</span></p></div></li>`).join('')}</ol>`);
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
const GO = { home: () => homeView(), study: () => studyView(), notes: () => notesView(), key: () => { keyPath = []; keyView(); }, chart: () => chartHome() };

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
    if (d.chip !== undefined) { chart.cur.seq.push(Number(d.chip)); return chartView(); }
    if (d.seq !== undefined) { chart.cur.seq.splice(Number(d.seq), 1); return chartView(); }
    if (d.stepopt !== undefined) return chartStep(Number(d.stepopt));
    if (d.guess !== undefined) return chartGuess(d.guess);
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
        case 'chart-start': return startChart();
        case 'chart-undo': chart.cur.seq.pop(); return chartView();
        case 'chart-submit': return chartSubmit();
        case 'chart-reveal': chart.cur.revealed++; return chartView();
        case 'chart-next': return nextChart();
        case 'chart-quit': return chart.results.length ? chartResult() : chartHome();
        case 'chart-retry': return startChart(chart.pool, chart.total);
        case 'chart-retry-wrong': return startChart(chart.wrong, chart.wrong.length);
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
