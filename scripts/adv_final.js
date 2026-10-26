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

const FINAL_UNIT_TAB = { series: 'series', ode: 'ode', mock: 'mock' };

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
