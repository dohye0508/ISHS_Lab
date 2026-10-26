// 기말고사(급수·미분방정식) 화면 -- adv_math.php 전용. 기말 문제집은 window.finalCollections에
// 따로 모여 있어서 중간고사의 window.generatedCollections 탭 분류나 logic.js 초기화와 섞이지 않는다.
// 이 파일은 logic.js 뒤, adv_math.php 인라인 스크립트 앞에 로드된다. selectedSubject,
// buildCollectionCard, applyExamToLanding, switchModalSubject는 인라인 스크립트에 있고
// 호출 시점에는 모두 정의되어 있다.

// 마지막에 고른 시험·문제집은 기기마다의 편의 기능이라 localStorage에 둔다. 사생활 보호 모드처럼
// 저장소가 막혀도 페이지는 기본값으로 동작해야 하므로 읽기·쓰기를 모두 감싼다.
function readStore(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
}
function writeStore(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* 저장하지 못해도 선택은 이번 방문 동안 유지된다 */ }
}

const FINAL_UNIT_TAB = { series: 'series', ode: 'ode' };

function renderFinalGrids() {
    const grids = {};
    Object.keys(FINAL_UNIT_TAB).forEach(unit => {
        grids[unit] = document.getElementById(`collection-grid-${unit}`);
        if (grids[unit]) grids[unit].innerHTML = '';
    });
    (window.finalCollections || []).forEach(col => {
        grids[col.unit]?.appendChild(buildCollectionCard(col, () => selectFinalCollection(col.id)));
    });
    if (window.MathJax?.typesetPromise) MathJax.typesetPromise(Object.values(grids).filter(Boolean));
}

function markFinalSelection(col) {
    selectedSubject = 'final';
    document.getElementById('sel-collection-value-final').value = col.id;
    document.querySelectorAll('.collection-card').forEach(c => c.classList.toggle('selected', c.dataset.id === col.id));
    document.getElementById('current-collection-name').innerText = `기말 · ${col.name}`;
    applyExamToLanding('final');
}

function selectFinalCollection(id) {
    const col = window.finalCollections?.find(c => c.id === id);
    if (!col) return;
    markFinalSelection(col);
    writeStore('adv_last_exam', 'final');
    writeStore('adv_final_selected', id);
    setTimeout(closeCollectionModal, 200);
}

// 처음 방문했거나 저장값이 없어진 문제집(버전 변경)을 가리키면 기말 → 급수가 기본이다.
// 이 경우 logic.js가 쿠키로 골라 둔 중간 문제집 이름은 지워서, 가이드(기말)와 시작 버튼이
// 서로 다른 시험을 가리키지 않게 한다.
function restoreLastSelection() {
    const exam = readStore('adv_last_exam');
    if (exam === 'midterm') {
        const col = window.generatedCollections?.find(c => c.id === document.getElementById('sel-collection-value').value);
        if (col) document.getElementById('current-collection-name').innerText = `중간 · ${col.name}`;
        applyExamToLanding('midterm');
        switchModalSubject('trig');
        return;
    }
    const saved = exam === 'final' && window.finalCollections?.find(c => c.id === readStore('adv_final_selected'));
    if (saved) {
        markFinalSelection(saved);
        switchModalSubject(FINAL_UNIT_TAB[saved.unit]);
        return;
    }
    selectedSubject = 'final';
    document.getElementById('sel-collection-value-final').value = '';
    document.querySelectorAll('.collection-card.selected').forEach(c => c.classList.remove('selected'));
    document.getElementById('current-collection-name').innerText = '문제집 선택 (Select Collection)';
    applyExamToLanding('final');
    switchModalSubject('series');
}

async function startFinalGame() {
    const id = document.getElementById('sel-collection-value-final').value;
    const col = window.finalCollections?.find(c => c.id === id);
    if (!col) return alert("문제집을 선택해주세요.");
    try {
        state.studyAttempt = await window.studyScores?.startAttempt({ collectionId: id, totalCount: col.problems.length });
        if (!state.studyAttempt) throw new Error('점수 기록 시스템을 시작할 수 없습니다.');
    } catch (error) {
        alert(`문제집을 시작할 수 없습니다. ${error.message}`);
        return;
    }
    document.getElementById('app-view').classList.remove('polar-session');

    state.strictC = false; // 기말 문제에는 적분상수가 없다
    state.subject = 'final';
    state.exam = 'final';
    const slogan = document.getElementById('slogan-text');
    if (slogan) slogan.innerText = col.unit === 'ode' ? 'Solve the flow' : 'Converge with confidence';
    state.problems = col.problems.map((p, idx) => ({
        id: idx + 1,
        level: p.level,
        title: p.title,
        latex: normalizeLatex(p.latex),
        solution: p.solution,
        explanation: p.explanation,
        answerMode: p.answerMode,
        page: p.page,
        tools: p.tools,
        userAnswer: ""
    }));
    state.totalCount = state.problems.length;
    state.currentIndex = 0;
    state.giveUpUnlocked = false;

    document.getElementById('landing-view').style.display = 'none';
    document.getElementById('loading-view').style.display = 'block';
    setTimeout(() => {
        document.getElementById('loading-view').style.display = 'none';
        document.getElementById('app-view').style.display = 'block';
        updateHeader();
        loadCurrentProblem();
    }, 500);
}

// 입력칸 아래 도구 줄. 버튼은 정답이 아니라 문제 유형(tools)으로 정해서 답을 흘리지 않는다.
// 값 문제에는 항상 ∞와 발산을 같이 보여 주므로 둘 중 무엇이 답인지 드러나지 않는다.
const FINAL_VERDICTS = ['절대수렴', '조건수렴', '수렴', '발산'];
const FINAL_INTERVAL_TEMPLATES = { '[a,b]': '[#0,#0]', '[a,b)': '[#0,#0)', '(a,b]': '(#0,#0]', '(a,b)': '(#0,#0)' };

function renderFinalTools(tools) {
    const row = document.getElementById('final-answer-tools');
    if (!row) return;
    row.innerHTML = '';
    const field = () => document.getElementById('math-input');
    const add = (label, attr, value, onClick) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn secondary';
        button.textContent = label;
        button.setAttribute(attr, value);
        button.onclick = onClick;
        row.appendChild(button);
    };
    // 판정은 덧붙이지 않고 입력칸 전체를 바꾼다. 포커스를 입력칸으로 돌려 Enter로 바로 넘어갈 수 있게 한다.
    const setVerdict = verdict => { const f = field(); f.value = `\\text{${verdict}}`; saveAnswer(); f.focus(); };
    const insert = latex => { const f = field(); f.focus(); f.executeCommand(['insert', latex, { feedback: false, mode: 'math' }]); saveAnswer(); };
    if (tools === 'verdict') {
        FINAL_VERDICTS.forEach(v => add(v, 'data-verdict', v, () => setVerdict(v)));
    } else if (tools === 'interval') {
        Object.entries(FINAL_INTERVAL_TEMPLATES).forEach(([label, latex]) => add(label, 'data-template', label, () => insert(latex)));
        add('∞', 'data-insert', 'infty', () => insert('\\infty'));
    } else if (tools === 'value') {
        add('∞', 'data-insert', 'infty', () => insert('\\infty'));
        add('발산', 'data-verdict', '발산', () => setVerdict('발산'));
    }
    row.classList.toggle('hidden', !row.children.length);
}

// logic.js·grader.js의 전역 함수를 기말 세션에서만 감싼다. 중간 세션(state.exam이 'final'이
// 아님)에서는 원래 함수를 그대로 부르므로 중간고사 채점과 화면은 바뀌지 않는다.
(function installFinalWrappers() {
    const baseGrade = window.gradeProblem;
    window.gradeProblem = function (userTex, solTex, strictC, timeoutMs = 30000, exactAnswer = false) {
        if (state.exam !== 'final') return baseGrade(userTex, solTex, strictC, timeoutMs, exactAnswer);
        return window.finalGrading.gradeFinal(userTex, solTex, (u, s) => baseGrade(u, s, false, timeoutMs, true));
    };
    const baseLoad = window.loadCurrentProblem;
    window.loadCurrentProblem = function () {
        baseLoad();
        renderFinalTools(state.exam === 'final' ? state.problems[state.currentIndex]?.tools : undefined);
    };
    const baseNav = window.updateNavButtons;
    window.updateNavButtons = function () {
        baseNav();
        if (state.exam === 'final') document.getElementById('btn-giveup').classList.add('hidden');
    };
}());
