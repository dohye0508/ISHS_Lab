const IS_DEBUG = false; 

let state = {
    level: 1,
    problems: [],
    currentIndex: 0,
    totalCount: 20,
    isProcessing: false,
    strictC: true,
    giveUpUnlocked: false, // Track if Give Up button is unlocked
    studyAttempt: null
};

// --- Debug Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const trigger = document.getElementById('debug-trigger');
    if (trigger && !IS_DEBUG) {
        trigger.style.display = 'none'; // Hide if not debug
    }
});

function openDebugView() {
    alert('디버그 모달을 엽니다!'); // 함수 호출 확인용
    
    if (!IS_DEBUG) {
        alert('IS_DEBUG가 false입니다');
        return;
    }
    
    let content = "";
    if (window.generatedCollections) {
        window.generatedCollections.forEach(col => {
            content += `<div class="debug-collection-block">
                <h3>${col.name} (${col.id})</h3>
                <div class="debug-grid">`;
            
            col.problems.forEach((p, idx) => {
                content += `<div class="debug-item">
                    <strong>Q${idx+1} (Lv${p.level})</strong>
                    <div>문제: $$ \\int ${p.latex} \\, dx $$</div>
                    <div style="color:blue;">정답: $$ ${p.solution}${p.solution.includes("적포") || p.latex.includes("\\text{") ? "" : " + C"} $$</div>
                </div>`;
            });
            
            content += `</div></div><hr>`;
        });
    } else {
        content = "<p style='color:red; font-size:2rem;'>컬렉션 데이터를 찾을 수 없습니다.</p>";
    }

    const modal = document.getElementById('debug-modal');
    const contentArea = document.getElementById('debug-content');
    
    if (modal && contentArea) {
        contentArea.innerHTML = content;
        
        // CSS 클래스 무시하고 직접 스타일 적용
        modal.style.display = 'flex';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.background = 'rgba(0, 0, 0, 0.8)';
        modal.style.zIndex = '999999';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.opacity = '1';
        modal.style.visibility = 'visible';
        
        document.body.style.overflow = 'hidden';
        
        if (window.MathJax) {
            MathJax.typesetPromise([contentArea]);
        }
    } else {
        alert('모달 요소를 찾을 수 없습니다! modal=' + modal + ', contentArea=' + contentArea);
    }
}

function closeDebugView() {
    const modal = document.getElementById('debug-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}
// -------------------



function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i=0;i < ca.length;i++) {
        let c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Load Collection
    const grid = document.getElementById('collection-grid');
    if (grid && window.generatedCollections) {
        grid.innerHTML = "";
        window.generatedCollections.forEach((col, idx) => {
            const score = window.studyScores?.historyLabel(col.id, col.problems.length) || '불러오는 중…';
            const card = document.createElement('div');
            card.className = 'collection-card';
            card.dataset.id = col.id;
            card.dataset.totalCount = col.problems.length;
            card.onclick = () => selectCollection(col.id);
            let scoreClass = (score.startsWith("Best")) ? "collection-score has-score" : "collection-score";
            card.innerHTML = `<div><h3>${col.name}</h3><span class="${scoreClass}">${score}</span></div>
            <div class="problem-preview">$$ \\int ${col.problems[0].latex} \\, dx $$</div>`;
            grid.appendChild(card);
        });

        // Load saved collection from cookie or default to first
        const savedColId = getCookie("selected_collection");
        if (savedColId && window.generatedCollections.find(c => c.id === savedColId)) {
            selectCollection(savedColId);
        } else if (window.generatedCollections[0]) {
            selectCollection(window.generatedCollections[0].id);
        }
        
        if (window.MathJax) MathJax.typesetPromise([grid]);
    }

    // 2. Load Strict C Setting
    const strictChk = document.getElementById('chk-strict-c');
    if (strictChk) {
        const savedStrict = getCookie("strict_c_mode");
        if (savedStrict !== null) {
            strictChk.checked = (savedStrict === "true");
        }
        strictChk.addEventListener('change', (e) => setCookie("strict_c_mode", e.target.checked, 365));
    }

    // 3. Dark Mode Sync & Initialize
    const darkChk = document.getElementById('chk-dark-mode');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Apply theme immediately
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    if (darkChk) {
        darkChk.checked = (savedTheme === 'dark');
        darkChk.addEventListener('change', (e) => {
            const newTheme = e.target.checked ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // Initialize Grader Worker
    if (window.initGrader) initGrader();
});

function openCollectionModal() {
    window.studyScores?.refreshHistory();
    document.getElementById('collection-modal')?.classList.add('visible');
    document.body.style.overflow = 'hidden';
}

function closeCollectionModal() {
    document.getElementById('collection-modal')?.classList.remove('visible');
    document.body.style.overflow = '';
}



function selectCollection(id) {
    document.getElementById('sel-collection-value').value = id;
    document.querySelectorAll('.collection-card').forEach(c => c.classList.toggle('selected', c.dataset.id === id));
    const col = window.generatedCollections?.find(c => c.id === id);
    if (col) document.getElementById('current-collection-name').innerText = col.name;
    
    // Save to cookie
    setCookie("selected_collection", id, 365); 
    
    setTimeout(closeCollectionModal, 200);
}

async function startGame() {
    state.strictC = document.getElementById('chk-strict-c')?.checked ?? true;
    const id = document.getElementById('sel-collection-value').value;
    const colProvider = window.generatedCollections?.find(c => c.id === id);
    if (!colProvider) return alert("문제집 오류.");
    if (window.STUDIO_SCORE_CONFIG) {
        try {
            state.studyAttempt = await window.studyScores?.startAttempt({ collectionId: id, totalCount: colProvider.problems.length });
            if (!state.studyAttempt) throw new Error('점수 기록 시스템을 시작할 수 없습니다.');
        } catch (error) {
            alert(`문제집을 시작할 수 없습니다. ${error.message}`);
            return;
        }
    } else {
        state.studyAttempt = null;
    }
    document.getElementById('app-view').classList.toggle('polar-session', colProvider.id.startsWith('adv_col2_v2_'));

    state.problems = colProvider.problems.map((p, idx) => ({
        id: idx + 1, level: p.level, latex: normalizeLatex(p.latex), solution: p.solution,
        title: p.title, explanation: p.explanation, answerMode: p.answerMode, userAnswer: ""
    }));
    state.totalCount = state.problems.length;
    state.currentIndex = 0;
    state.giveUpUnlocked = false; // Reset unlock state

    document.getElementById('landing-view').style.display = 'none';
    document.getElementById('loading-view').style.display = 'block';

    setTimeout(() => {
        document.getElementById('loading-view').style.display = 'none';
        document.getElementById('app-view').style.display = 'block';
        updateHeader();
        loadCurrentProblem();
    }, 500);
}

function updateHeader() {
    const p = state.problems[state.currentIndex];
    document.getElementById('level-badge').innerText = `Level ${p?.level || 1}`;
    document.getElementById('progress-badge').innerText = `${state.currentIndex + 1} / ${state.totalCount}`;
}

function loadCurrentProblem() {
    const field = document.getElementById('math-input');
    field.value = state.problems[state.currentIndex]?.userAnswer || "";
    field.focus();
    renderMath(document.getElementById('problem-area'), state.problems[state.currentIndex]?.latex);
    updateNavButtons();
    // Matrix-insert helper buttons only exist/matter for the algebra subject; harmless
    // no-op (optional chaining) on any page/subject that doesn't have that element.
    document.getElementById('algebra-matrix-tools')?.classList.toggle('hidden', state.subject !== 'algebra');
}

function renderMath(el, latex) {
    if (!el || !latex) return;
    el.innerHTML = `$$${latex}$$`;
    if (window.MathJax) MathJax.typesetPromise([el]);
}

function saveAnswer() {
    const val = document.getElementById('math-input').value;
    if (state.problems[state.currentIndex]) state.problems[state.currentIndex].userAnswer = val;
}

// 문제 화면 키보드 이동. 입력칸의 onkeydown에만 걸면 포커스가 버튼 등으로 옮겨졌을 때나
// 한글 조합 중일 때 첫 Enter가 먹히지 않으므로, 캡처 단계에서 문서 전체의 키를 받는다.
//   Enter: 다음 문제(마지막 문제면 제출)
//   ←/→: 입력칸 밖이거나 커서가 입력칸의 맨 앞/맨 끝일 때 이전/다음 문제
function isQuizScreenActive() {
    const app = document.getElementById('app-view');
    const quiz = document.getElementById('quiz-area');
    const modal = document.getElementById('collection-modal');
    return !!app && app.style.display === 'block' && !!quiz && quiz.style.display !== 'none'
        && document.getElementById('result-view')?.style.display !== 'block'
        && !modal?.classList.contains('visible') && !!state.problems?.length;
}

function handleQuizKeys(e) {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || !isQuizScreenActive()) return;
    const field = document.getElementById('math-input');
    const inField = e.target === field;
    const tag = e.target?.tagName;
    // 다른 입력 요소(검색창 등)나 포커스된 버튼의 Enter는 원래 동작을 그대로 둔다.
    if (!inField && (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target?.isContentEditable)) return;
    if (e.key === 'Enter' || e.keyCode === 13 || (e.keyCode === 229 && e.code === 'Enter')) {
        if (!inField && tag === 'BUTTON') return;
        e.preventDefault();
        e.stopPropagation();
        const go = () => (state.currentIndex === state.totalCount - 1 ? finishTest() : nextProblem());
        // 한글 조합 중이면 조합이 확정된 뒤 값을 저장하고 넘어간다.
        if (e.isComposing || e.keyCode === 229) setTimeout(go, 30); else go();
        return;
    }
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    if (inField) {
        const end = typeof field.lastOffset === 'number' ? field.lastOffset : 0;
        const pos = typeof field.position === 'number' ? field.position : end;
        if (e.key === 'ArrowLeft' && pos > 0) return;
        if (e.key === 'ArrowRight' && pos < end) return;
    }
    e.preventDefault();
    e.stopPropagation();
    if (e.key === 'ArrowLeft') prevProblem(); else nextProblem();
}
document.addEventListener('keydown', handleQuizKeys, true);

function prevProblem() {
    if (state.currentIndex > 0) { saveAnswer(); state.currentIndex--; updateHeader(); loadCurrentProblem(); }
}

function nextProblem() {
    if (state.currentIndex < state.totalCount - 1) { saveAnswer(); state.currentIndex++; updateHeader(); loadCurrentProblem(); }
}

function updateNavButtons() {
    document.getElementById('btn-prev').classList.toggle('hidden', state.currentIndex === 0);
    const last = state.currentIndex === state.totalCount - 1;
    document.getElementById('btn-next').classList.toggle('hidden', last);
    document.getElementById('btn-finish').classList.toggle('hidden', !last);
    
    // Show 'Give Up' button only for Level 3 problems
    const currentProb = state.problems[state.currentIndex];
    const isLevel3 = currentProb && currentProb.level >= 3;
    document.getElementById('btn-giveup').classList.toggle('hidden', !isLevel3);
}

function giveUpProblem() {
    // No confirmation as per user request
    const input = document.getElementById('math-input');
    input.value = "적포 "; // Added space to prevent Korean duplication bug as requested
    saveAnswer();
    input.focus();
}

async function finishTest() {
    saveAnswer();
    if (state.problems.some(p => !p.userAnswer?.trim()) && !confirm("아직 풀지 않은 문제가 있습니다. 정말 제출하시겠습니까?")) return;
    document.getElementById('app-view').style.display = 'none';
    const loadingView = document.getElementById('loading-view');
    loadingView.style.display = 'block';
    
    // Update loading text
    const loadingHeader = loadingView.querySelector('h1');
    const loadingSub = loadingView.querySelector('.subtitle');
    if(loadingHeader) loadingHeader.innerText = "Grading...";
    if(loadingSub) loadingSub.innerText = "채점을 진행하고 있습니다. (Pyodide Local)";

    try {
        const results = [];
        const total = state.problems.length;
        
        for (let i = 0; i < total; i++) {
            if(loadingSub) loadingSub.innerText = `채점을 진행하고 있습니다. (${i+1}/${total})`;
            
            const p = state.problems[i];
            let isCorrect = false;
            let isSkipped = false;
            let feedback = "";
            
            try {
                // Client-side Grading Call
                // Use strictC from state, but never demand "+C" on derivative / word-problem
                // items (anything whose statement contains \text{...}) -- they have no
                // constant of integration to begin with. grade() itself can't tell a
                // derivative solution from an integral one just by looking at the solution
                // string (both contain "x"), so the per-problem exemption has to happen here,
                // matching the same \text{ check the result view already uses to hide "+ C".
                const effectiveStrict = state.strictC && !p.latex.includes("\\text{");
                const gradeRes = await gradeProblem(p.userAnswer, p.solution, effectiveStrict, 30000, p.answerMode === 'exact');
                
                if (gradeRes === "CORRECT") {
                    isCorrect = true;
                    feedback = "정답 (Correct)";
                } else if (gradeRes.includes("SKIP")) {
                    isSkipped = true;
                    isCorrect = false; 
                    feedback = "판정 불가 (SKIP: 복잡한 수식)"; 
                } else {
                    isCorrect = false;
                    feedback = gradeRes; // e.g. "INCORRECT (Missing Constant...)"
                }
            } catch (err) {
                isCorrect = false;
                feedback = "System Error: " + err.message;
            }
            
            results.push({
                id: p.id,
                isCorrect: isCorrect,
                isSkipped: isSkipped,
                feedback: feedback
            });
        }
        
        // Finalize Result Object
        const finalResult = {
            details: results,
            comment: generateComment(results, total)
        };

        // Account history is saved with the completed server attempt below.
        const score = results.filter(r => r.isCorrect).length;
        const skipCount = results.filter(r => r.isSkipped).length;

        loadingView.style.display = 'none';
        
        // Show App View, Hide Quiz Area, Show Result View
        document.getElementById('app-view').style.display = 'block';
        document.getElementById('quiz-area').style.display = 'none';
        document.getElementById('result-view').style.display = 'block';
        
        renderResult(finalResult);
        if (state.studyAttempt) {
            window.studyScores.completeAttempt(state.studyAttempt, {
                total_count: total, correct_count: score, skipped_count: skipCount
            }).catch(() => {});
        }
        
        // Reset loading text
        if(loadingHeader) loadingHeader.innerText = "Generating...";
        if(loadingSub) loadingSub.innerText = "적분 문제를 실시간으로 생성하고 있습니다.";

    } catch (e) { 
        alert("채점 중 오류가 발생했습니다: " + e.message);
        loadingView.style.display = 'none';
        document.getElementById('app-view').style.display = 'block';
    }
}

function generateComment(results, total) {
    const score = results.filter(r => r.isCorrect).length;
    const ratio = score / total;
    if (ratio === 1) return "완벽합니다! (Perfect Score)";
    if (ratio >= 0.8) return "훌륭합니다! (Excellent)";
    if (ratio >= 0.5) return "잘했습니다. (Good Job)";
    return "조금 더 연습해 보세요. (Keep Trying)";
}

function renderResult(res) {
    const score = res.details.filter(d => d.isCorrect).length;
    // const skipCount = res.details.filter(d => d.isSkipped).length; // Hidden per request
    document.getElementById('score-area').innerText = `Score: ${score} / ${state.totalCount}`;
    document.getElementById('analysis-area').innerHTML = `<p>${res.comment}</p>`;
    
    document.getElementById('simple-result-list').innerHTML = res.details.map(d => {
        let cls = d.isCorrect ? 'success' : 'error';
        let icon = d.isCorrect ? '✓' : '✗';
        if (d.isSkipped) { cls = 'warning'; icon = '—'; }

        return `<div class="mini-badge ${cls}">
            <span class="mini-badge-icon">${icon}</span>
            <span class="mini-badge-label">Q${d.id}</span>
        </div>`;
    }).join("");

    document.getElementById('detail-list').innerHTML = res.details.map(d => {
        const p = state.problems.find(prob => prob.id === d.id);
        const cls = d.isSkipped ? 'warning' : (d.isCorrect ? 'success' : 'error');
        const icon = d.isSkipped ? '—' : (d.isCorrect ? '✓' : '✗');
        const label = d.isSkipped ? '건너뜀' : (d.isCorrect ? '정답' : '오답');

        return `<li class="detail-item">
            <div class="detail-status ${cls}"><span class="detail-status-icon">${icon}</span>Q${d.id} · ${label}</div>
            <div class="detail-problem">$$${p.latex}$$</div>
            <div class="detail-answer-row">
                <span class="detail-answer-label">내가 쓴 답</span>
                <span>$$${p.userAnswer || "\\text{(비어있음)}"}$$</span>
            </div>
            <div class="detail-answer-row">
                <span class="detail-answer-label">정답</span>
                <span>$$${p.solution}${p.solution.includes("적포") || p.latex.includes("\\text{") ? "" : " + C"}$$</span>
            </div>
        </li>`;
    }).join("");
    if (window.MathJax) MathJax.typesetPromise([document.getElementById('detail-list')]);
}


function toggleDetails() { document.getElementById('result-view').classList.toggle('expanded'); }
function normalizeLatex(l) { return `\\int ${l.replace(/^\\int|dx$/g, '').trim()} \\, dx`; }
// Used to just location.reload() -- simple, but a full reload is unnecessary (no
// server round-trip involved) and not what adv_math.php's home button uses any more
// (it calls returnToCollections() to reopen the collection modal directly instead).
function goHome() {
    document.getElementById('app-view').style.display = 'none';
    document.getElementById('landing-view').style.display = 'block';
}
function toggleTheme() {
    const darkChk = document.getElementById('chk-dark-mode');
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (darkChk) darkChk.checked = (newTheme === 'dark');
}

// 모바일 키보드 대응: 입력창 포커스 시 화면 중앙으로 스크롤
document.addEventListener('DOMContentLoaded', () => {
    const mathInput = document.getElementById('math-input');
    if (mathInput) {
        mathInput.addEventListener('focus', () => {
            if (window.innerWidth <= 768) {
                // 키보드가 올라오는 시간을 고려해 약간의 지연 후 스크롤
                setTimeout(() => {
                    mathInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            }
        });
    }
});
