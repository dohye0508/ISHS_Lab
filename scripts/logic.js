const IS_DEBUG = false; 

let state = {
    level: 1,
    problems: [],
    currentIndex: 0,
    totalCount: 20,
    isProcessing: false,
    strictC: true,
    giveUpUnlocked: false // Track if Give Up button is unlocked
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
                    <div style="color:blue;">정답: $$ ${p.solution}${p.solution.includes("적포") ? "" : " + C"} $$</div>
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
            const history = localStorage.getItem(`history_${col.id}`);
            let score = "Not started";
            if (history) try { score = `Best: ${JSON.parse(history).score}`; } catch(e) {}
            const card = document.createElement('div');
            card.className = 'collection-card';
            card.dataset.id = col.id;
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

    state.problems = colProvider.problems.map((p, idx) => ({
        id: idx + 1, level: p.level, latex: normalizeLatex(p.latex), solution: p.solution, userAnswer: ""
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
    field.onkeydown = (e) => {
        if (e.key === "Enter") {
            if (state.currentIndex === state.totalCount - 1) finishTest();
            else nextProblem();
        }
    };
    renderMath(document.getElementById('problem-area'), state.problems[state.currentIndex]?.latex);
    updateNavButtons();
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
                // Use strictC from state
                const gradeRes = await gradeProblem(p.userAnswer, p.solution, state.strictC);
                
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

        // Save History (Local)
        const score = results.filter(r => r.isCorrect).length;
        const skipCount = results.filter(r => r.isSkipped).length;
        try {
            const currentId = document.getElementById('sel-collection-value').value;
            localStorage.setItem(`history_${currentId}`, JSON.stringify({ score: `${score} / ${total}`, date: new Date().toISOString() }));
        } catch(e) {}

        loadingView.style.display = 'none';
        
        // Show App View, Hide Quiz Area, Show Result View
        document.getElementById('app-view').style.display = 'block';
        document.getElementById('quiz-area').style.display = 'none';
        document.getElementById('result-view').style.display = 'block';
        
        renderResult(finalResult);
        
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
        let mark = d.isCorrect ? 'O' : 'X';
        if (d.isSkipped) { cls = 'warning'; mark = 'S'; }
        
        return `<div class="mini-badge" style="border-color:var(--${cls}); color:var(--${cls}); font-weight:bold;">Q${d.id}: ${mark}</div>`;
    }).join("");

    document.getElementById('detail-list').innerHTML = res.details.map(d => {
        const p = state.problems.find(prob => prob.id === d.id);
        const mark = d.isSkipped ? 'SKIP' : (d.isCorrect ? 'O' : 'X');
        const color = d.isSkipped ? 'orange' : (d.isCorrect ? '#4CAF50' : '#F44336'); // Green or Red
        
        return `<li class="detail-item">
            <strong style="color:${color}; font-size: 1.2em;">Q${d.id} (${mark})</strong>
            <p>문제: $$${p.latex}$$</p>
            <p>내가 쓴 답: $$${p.userAnswer || "\\text{(비어있음)}"}$$</p>
            <p>정답: $$${p.solution}${p.solution.includes("적포") ? "" : " + C"}$$</p>
        </li>`;
    }).join("");
    if (window.MathJax) MathJax.typesetPromise([document.getElementById('detail-list')]);
}


function toggleDetails() { document.getElementById('result-view').classList.toggle('expanded'); }
function normalizeLatex(l) { return `\\int ${l.replace(/^\\int|dx$/g, '').trim()} \\, dx`; }
function goHome() { if (confirm("메인 화면으로 이동하시겠습니까? 진행 상황은 저장되지 않습니다.")) location.reload(); }
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
