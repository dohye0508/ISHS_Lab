<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: index.php?msg=login_required");
    exit();
}
// Banned users see a blank page
if (isset($_SESSION['role']) && $_SESSION['role'] === 'banned') {
    exit();
}
?>

<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Advanced Math Studio</title>
    <link rel="icon" type="image/jpeg" href="assets/images/advmathicon.jpg">
    <meta property="og:title" content="Advanced Math Studio">
    <meta property="og:description" content="쌍곡선함수·역함수 미적분부터 행렬과 연립일차방정식까지, 고급수학 심화 트레이닝.">
    <meta property="og:image" content="assets/images/advmath.jpg">

    <link rel="stylesheet" href="assets/css/style.css?v=lab_final_v6">
    <script src="https://unpkg.com/mathlive"></script>
    <script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>

    <style>
        .collection-grid {
            max-height: none !important;
            overflow-y: visible !important;
        }
        .problem-preview {
            white-space: nowrap;
            overflow: hidden;
            -webkit-mask-image: linear-gradient(to right, black 85%, transparent 100%);
            mask-image: linear-gradient(to right, black 85%, transparent 100%);
        }
        .problem-preview mjx-container {
            text-align: left !important;
        }
        /* Word-problem statements (see the renderMath override below) split into a
           wrapping prose sentence plus one proper centered display formula for the
           actual "given" data, instead of jamming the whole thing into one unbroken
           $$...$$ block that just overflowed off the edge of the screen. */
        #problem-area {
            max-width: 100%;
            overflow-x: auto;
            flex-direction: column;
        }
        .problem-statement-text {
            text-align: left;
            font-size: 1.6rem;
            line-height: 1.7;
            white-space: normal;
            width: 100%;
        }
        .problem-statement-text mjx-container {
            font-size: 100% !important;
        }
        .problem-statement-formula {
            width: 100%;
            text-align: center;
            margin-top: 18px;
        }
        /* Subject picker inside the single collection modal (고급미적분 / 고급대수).
           .overlay-header uses 30px horizontal padding to stay clear of the modal's own
           rounded corners (overlay-content has border-radius + overflow:hidden) -- this
           row had none, so it sat flush against that edge and got visually clipped by the
           outer rounding. Matched the inset here and made the buttons size-to-content
           instead of flex:1 (which stretched them wider than needed). */
        .subject-tabs {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            padding: 14px 30px 0 30px;
        }
        .subject-tab {
            flex: 0 0 auto;
            padding: 9px 16px;
            border-radius: 9px;
            border: 1px solid var(--border);
            background: var(--surface);
            color: var(--text);
            font-weight: 700;
            font-size: 0.92rem;
            cursor: pointer;
            transition: all 0.15s ease;
        }
        .subject-tab.active {
            background: var(--primary);
            color: #fff;
            border-color: var(--primary);
        }
    </style>

    <!-- ANTI-FOUC SCRIPT: Must be in HEAD and before body renders -->
    <script>
        (function () {
            var theme = localStorage.getItem('theme') || 'light';
            document.documentElement.setAttribute('data-theme', theme);
        })();
    </script>
</head>

<body>
    <!-- Scripts calling body removed from top -->

    <!-- Auth UI Elements (Top-Left) -->
    <div id="auth-header"
        style="position: fixed; top: 20px; left: 20px; z-index: 10000; display: flex; align-items: center; gap: 10px;">
        <a href="index.php"
            style="background: rgba(var(--surface-rgb), 0.85); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); color: var(--text); padding: 8px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border); box-shadow: 0 4px 12px rgba(0,0,0,0.05);"
            title="홈으로">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
        </a>

        <div id="user-profile"
            style="display: none; align-items: center; gap: 12px; background: rgba(var(--surface-rgb), 0.85); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); padding: 5px 15px; border-radius: 25px; border: 1px solid var(--border); box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <span id="user-nickname" style="font-weight: 700; font-size: 0.9rem; color: var(--text);">Nickname</span>
            <button onclick="handleLogout()"
                style="background: none; border: none; font-size: 1rem; color: #ea4335; cursor: pointer; padding: 0; display: flex; align-items: center; gap: 4px;"
                title="로그아웃">
                <span style="font-size: 0.75rem; font-weight: 600;">로그아웃</span>
                <span style="font-size: 1.1rem;">→</span>
            </button>
        </div>
    </div>

    <!-- Theme toggle moved to selection card -->

    <div class="container">
        <div id="loading-view" style="display:none;">
            <div class="landing-header">
                <h1>Generating...</h1>
                <p class="subtitle">적분 문제를 실시간으로 생성하고 있습니다.</p>
                <div class="loader-spinner"></div>
            </div>
        </div>

        <div id="landing-view">
            <div class="landing-main">
                <div class="landing-left">
                    <div class="landing-header">
                        <h1>Advanced Math<br>Studio</h1>
                        <p class="subtitle">고급수학 미적분·대수 심화 트레이닝</p>
                    </div>

                    <div class="selection-card">
                        <div class="selection-container">
                            <button id="btn-toggle-collection" class="btn secondary" onclick="openCollectionModal()"
                                style="width: 100%; display: flex; justify-content: space-between; align-items: center;">
                                <span id="current-collection-name">문제집 선택 (Select Collection)</span>
                                <span class="status-indicator" style="font-size: 0.8em;">→</span>
                            </button>

                            <div class="rules-section">
                                <h3 class="rules-title">💡 이용 가이드</h3>
                                <ul class="rules-list">
                                    <li>본 서비스는 <strong>데스크탑 및 태블릿</strong> 환경에 최적화되어 있습니다.</li>
                                    <li>수식 입력란 클릭 시 <strong>가상 키보드</strong>를 사용하실 수 있습니다.</li>
                                    <li>(중요) <strong>미적분</strong> 문제는 정답 입력 시 <strong>적분상수 C</strong>를 포함해 주세요.</li>
                                    <li>(중요) <strong>대수</strong> 문제에서 정답이 행렬/벡터면 답 입력란 아래 <strong>행렬 입력 버튼</strong>을
                                        사용하세요. 해가 무수히 많으면 자유변수를 <strong>t</strong>로 나타내세요.</li>
                                    <li>(중요) 일정 레벨 이상 문제에는 <strong>"포기"</strong> 버튼이 나타납니다. 초등함수로
                                        <strong>적분이 불가능</strong>하거나, <strong>역행렬이 존재하지 않거나</strong>, <strong>해가 없는</strong>
                                        문제는 직접 입력하지 않고 이 버튼으로 처리할 수 있습니다.</li>
                                    <li><strong>sech, csch, coth</strong>를 입력하실 때 가끔 화면에 <strong>이상하게 보일 수 있습니다</strong>
                                        (MathLive 자체 자동완성 충돌 때문). 그래도 <strong>채점은 정상적으로 동작</strong>하니 안심하고 그대로 제출하세요.</li>
                                    <li><strong>역함수</strong>는 <strong>-1 표기</strong>(예: sin⁻¹(x), sinh⁻¹(x))와 <strong>arc 표기</strong>
                                        (예: arcsin(x), arsinh(x)) <strong>둘 다 정답으로 인정</strong>됩니다. 편한 쪽으로 입력하세요.</li>
                                </ul>
                            </div>
                        </div>

                        <div class="option-section">
                            <div class="option-item">
                                <label class="checkbox-container">
                                    <input type="checkbox" id="chk-strict-c" checked>
                                    <span>적분상수(C) 포함 필수 (미적분 문제에만 적용)</span>
                                </label>
                            </div>
                        </div>

                        <button class="start-btn" onclick="startSelectedGame()">Get Started</button>
                    </div>
                    <input type="hidden" id="sel-collection-value" value="">
                    <input type="hidden" id="sel-collection-value-algebra" value="">
                </div>
            </div>
        </div>


        <div id="collection-modal" class="overlay">
            <div class="overlay-content">
                <div class="overlay-header">
                    <h2>문제집 목록 (Collections)</h2>
                    <button class="btn-close-overlay" onclick="closeCollectionModal()">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="subject-tabs">
                    <button type="button" id="subject-tab-trig" class="subject-tab active" onclick="switchModalSubject('trig')">고급미적분-역삼각함수</button>
                    <button type="button" id="subject-tab-hyp" class="subject-tab" onclick="switchModalSubject('hyp')">고급미적분-쌍곡함수</button>
                    <button type="button" id="subject-tab-polar" class="subject-tab" onclick="switchModalSubject('polar')">고급미적분-극좌표</button>
                    <button type="button" id="subject-tab-algebra" class="subject-tab" onclick="switchModalSubject('algebra')">고급대수</button>
                </div>
                <div style="flex: 1; overflow-y: auto; padding-right: 5px;">
                    <div id="collection-grid" style="display:none;"></div> <!-- logic.js compatibility -->

                    <div id="modal-section-trig">
                        <h3 style="margin-top: 10px; margin-bottom: 15px; color: var(--text); padding-left: 10px;">▶ 역삼각함수 미적분</h3>
                        <div id="collection-grid-trig" class="collection-grid"></div>
                    </div>

                    <div id="modal-section-hyp" class="hidden">
                        <h3 style="margin-top: 10px; margin-bottom: 15px; color: var(--text); padding-left: 10px;">▶ 쌍곡함수 미적분</h3>
                        <div id="collection-grid-hyp" class="collection-grid"></div>
                    </div>

                    <div id="modal-section-polar" class="hidden">
                        <h3 style="margin-top: 10px; margin-bottom: 15px; color: var(--text); padding-left: 10px;">▶ 극좌표와 극곡선</h3>
                        <div id="collection-grid-polar" class="collection-grid"></div>
                    </div>

                    <div id="modal-section-algebra" class="hidden">
                        <h3 style="margin-top: 10px; margin-bottom: 15px; color: var(--text); padding-left: 10px;">▶ 행렬과 연립일차방정식</h3>
                        <div id="collection-grid-algebra" class="collection-grid"></div>
                    </div>

                    <div style="padding: 15px; text-align: center; border-top: 1px solid var(--border); margin-top: 20px;">
                        <p style="font-size: 0.85em; color: var(--text-secondary); margin: 0;">
                            * 각 컬렉션은 여러 문제로 구성되어 있습니다.
                        </p>
                    </div>
                </div>
            </div>
        </div>


        <div id="app-view">
            <div class="header">
                <button class="btn-home" onclick="goHome()" title="메인으로">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                </button>
                <span class="brand">
                    <h2 id="slogan-text">Integrate your skills</h2>
                </span>
                <div class="badges">
                    <span id="level-badge" class="badge">Level 1</span>
                    <span id="progress-badge" class="badge progress">1 / 20</span>
                </div>
            </div>

            <div id="quiz-area">
                <div id="problem-area"></div>
                <math-field id="math-input" placeholder="정답을 입력하세요" virtual-keyboard-mode="onfocus"></math-field>
                <div id="algebra-matrix-tools" class="hidden" style="display:flex; gap:8px; margin: 10px 0; flex-wrap:wrap;">
                    <button type="button" class="btn secondary" onclick="insertMatrixTemplate(2,2)">2×2 행렬</button>
                    <button type="button" class="btn secondary" onclick="insertMatrixTemplate(3,3)">3×3 행렬</button>
                    <button type="button" class="btn secondary" onclick="insertMatrixTemplate(2,1)">2×1 벡터</button>
                    <button type="button" class="btn secondary" onclick="insertMatrixTemplate(3,1)">3×1 벡터</button>
                </div>
                <div class="action-bar">
                    <button id="btn-prev" class="btn secondary hidden" onclick="prevProblem()">← Previous</button>
                    <div style="flex-grow: 1; text-align: center;">
                        <button id="btn-giveup" class="btn secondary hidden" onclick="giveUpProblem()">포기</button>
                    </div>
                    <button id="btn-next" class="btn primary" onclick="nextProblem()">Next →</button>
                    <button id="btn-finish" class="btn success hidden" onclick="finishTest()">Finish Test</button>
                </div>
            </div>

            <div id="result-view" style="display:none;">
                <h2>Test Result</h2>
                <div id="score-area"></div>
                <div id="simple-result-list"></div>
                <div id="analysis-area"></div>
                <div class="detail-control">
                    <button id="btn-toggle-detail" class="btn secondary" onclick="toggleDetails()">자세히 보기 (View
                        Details)</button>
                </div>
                <div id="detail-list"></div>
                <div style="margin-top: 30px;">
                    <button class="btn primary" onclick="location.reload()">Restart</button>
                </div>
            </div>
        </div>

        <div class="footer">
            © 2026 ISHS 32nd - Developed by Dohye Lee. All rights reserved.
        </div>
    </div>

    <script src="data/math/adv_collections_final.js?v=20260813_v7"></script>
    <script src="data/math/algebra_collections.js?v=20260820_v1"></script>
    <script src="scripts/grader.js?v=debug_v7"></script>
    <script src="scripts/logic.js?v=debug_v7"></script>
    <!-- Global Theme Toggle (Top-Right) -->
    <button id="theme-toggle" class="theme-toggle-btn" aria-label="Toggle Dark Mode">
        <svg class="sun-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
        <svg class="moon-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
    </button>
    <style>
        /* Only Keep Page Specific Styles if any - Removing Toggle Button Styles as they are now global */
    </style>

    <script>
        // --- Authentication System Logic ---
        const AUTH_API = 'api/user_system.php';

        async function updateAuthUI() {
            try {
                const res = await fetch(`${AUTH_API}?action=status`);
                const data = await res.json();
                if (data.logged_in) {
                    document.getElementById('user-profile').style.display = 'flex';
                    document.getElementById('user-nickname').textContent = data.user.nickname;
                } else {
                    document.getElementById('user-profile').style.display = 'none';
                }
            } catch (e) { console.error("Auth status error:", e); }
        }

        async function handleLogout() {
            await fetch(`${AUTH_API}?action=logout`, { method: 'POST' });
            location.href = 'index.php';
        }

        document.addEventListener('DOMContentLoaded', updateAuthUI);

        // Global Theme Toggle Script
        (function () {
            const toggleBtn = document.getElementById('theme-toggle');
            if (toggleBtn) {
                toggleBtn.addEventListener('click', function () {
                    const currentTheme = document.documentElement.getAttribute('data-theme');
                    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                    document.documentElement.setAttribute('data-theme', newTheme);
                    localStorage.setItem('theme', newTheme);
                });
            }
        })();
        // Override normalizeLatex to not append \int ... dx for word problems
        function normalizeLatex(l) {
            // 한글이 포함된 경우 문장형 문제로 간주하여 \int 생략
            if (/[가-힣]/.test(l)) {
                return l;
            }
            return `\\int ${l.replace(/^\\int|dx$/g, '').trim()} \\, dx`;
        }

        // 문장형(한글) 문제는 \text{...} 로 감싼 한글 설명과 실제 수식이 번갈아 나오는
        // 구조다. 그 \text{...} 조각만 잘라내고 남는 수식 조각들을 이어붙이면 (이전 시도)
        // 수식 모드에서 공백이 무시돼 서로 달라붙어버리므로, 명시적인 구분자로 이어붙여
        // "설명 텍스트"가 아니라 항상 수식($$...$$)으로만 보이게 만든다.
        function buildMathPreview(latex) {
            if (!/\\text\{/.test(latex)) {
                return `$$ ${normalizeLatex(latex)} $$`;
            }
            const fragments = latex.split(/\\text\{[^}]*\}/g)
                .map(s => s.trim())
                .filter(s => s.length > 0);
            const core = [];
            for (const f of fragments) {
                if (core.includes(f)) continue; // 문장 안에서 같은 식이 두 번 언급되는 경우 방지
                core.push(f);
                if (core.length >= 2) break;
            }
            return `$$ ${core.length > 0 ? core.join(',\\;\\;') : latex} $$`;
        }

        function escapeHtmlText(s) {
            return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }

        // A word problem's whole \text{...}-laced statement was being dropped into a single
        // $$...$$ display-math block; MathJax doesn't line-break inside one, so a long
        // Korean sentence plus a 3x3 matrix just overflowed off the right edge of the screen.
        // First fix pulled out the LAST math fragment as a big centered display formula --
        // but "last" isn't the same as "important": templates like "...로 나타낼 때, f(\theta)
        // 를 구하시오" end with a bare backreference to a symbol already introduced earlier,
        // and that alone got blown up into a giant standalone "f(θ)" while the sentence
        // around it ("...를 구하시오") was left looking broken. The actual signal for "this
        // needs its own line" is whether a fragment contains a LaTeX environment (a matrix
        // or a system of equations via \begin{...}) -- those are genuinely too wide/tall for
        // inline flow. Everything else (bare symbols, short equations like "r=f(\theta)")
        // reads fine inline and stays part of the wrapping sentence. Used by both the live
        // quiz view (renderMath override) and the post-test "자세히 보기" detail list
        // (renderResult override), which had the exact same overflow bug.
        function buildProblemHtml(latex) {
            if (!latex) return '';
            // \text{...} is used two different ways in this data: real Korean instructional
            // prose ("다음을 구하시오: ..."), and upright function-name notation inside pure
            // math (\text{sech}, \text{csch}, \text{coth} have no native LaTeX macro, so the
            // generator wraps them in \text{} just to get non-italic letters -- same trick as
            // \sin, \cos). Only the former should be pulled out of the math and shown as plain
            // HTML text; a \text{sech} block has no Korean in it, so it stays inside the $$...$$
            // and MathJax renders it correctly on its own. Telling them apart by Hangul content
            // instead of "contains \text{ at all" is what fixes sech/csch/coth showing up as
            // inert plain text instead of rendered math.
            const hasKoreanProse = /\\text\{[^}]*[가-힣][^}]*\}/.test(latex);
            if (!hasKoreanProse) {
                return `$$${latex}$$`;
            }
            const parts = latex.split(/(\\text\{[^}]*\})/g).map(p => p.trim()).filter(p => p.length > 0);
            let proseHtml = '';
            let displayParts = [];
            parts.forEach((part) => {
                const m = part.match(/^\\text\{([^}]*)\}$/);
                if (m && /[가-힣]/.test(m[1])) {
                    proseHtml += escapeHtmlText(m[1]);
                } else if (/\\begin\{/.test(part)) {
                    displayParts.push(part);
                } else {
                    proseHtml += ` \\(${part}\\) `;
                }
            });
            let html = `<div class="problem-statement-text">${proseHtml}</div>`;
            displayParts.forEach((d) => {
                html += `<div class="problem-statement-formula">$$${d}$$</div>`;
            });
            return html;
        }

        // Override logic.js's renderMath (only takes effect on THIS page -- integral.php
        // never loads this script, so its calls to the shared renderMath in logic.js are
        // untouched).
        function renderMath(el, latex) {
            if (!el || !latex) return;
            el.innerHTML = buildProblemHtml(latex);
            if (window.MathJax) MathJax.typesetPromise([el]);
        }

        // Override logic.js's renderResult (same "only this page" scoping as renderMath
        // above). The post-test detail list had its own independent `$$${p.latex}$$`
        // rendering for the "문제:" line -- same unbroken-block overflow bug, different
        // code path, so it needed the same buildProblemHtml() fix applied here too.
        function renderResult(res) {
            const score = res.details.filter(d => d.isCorrect).length;
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
                const color = d.isSkipped ? 'orange' : (d.isCorrect ? '#4CAF50' : '#F44336');
                const cLabel = p.solution.includes("적포") || p.latex.includes("\\text{") ? "" : " + C";
                return `<li class="detail-item">
                    <strong style="color:${color}; font-size: 1.2em;">Q${d.id} (${mark})</strong>
                    <div>문제: ${buildProblemHtml(p.latex)}</div>
                    <p>내가 쓴 답: $$${p.userAnswer || "\\text{(비어있음)}"}$$</p>
                    <p style="font-family: monospace; font-size: 0.75rem; opacity: 0.55; word-break: break-all;">(raw: ${escapeHtmlText(p.userAnswer || "")})</p>
                    <p>정답: $$${p.solution}${cLabel}$$</p>
                </li>`;
            }).join("");
            if (window.MathJax) MathJax.typesetPromise([document.getElementById('detail-list')]);
        }

        function readHistory(colId, expectedTotal) {
            const history = localStorage.getItem(`history_${colId}`);
            let score = "Not started";
            if (history) {
                try {
                    let parsed = JSON.parse(history);
                    // If the history was saved against a different collection size (e.g. the
                    // pool got regenerated with a different chunk count), discard it -- compare
                    // against THIS collection's actual problem count, not a hardcoded "/ 20"
                    // (algebra collections are 10 questions, calculus ones are 20).
                    if (!parsed.score.includes(`/ ${expectedTotal}`)) {
                        localStorage.removeItem(`history_${colId}`);
                    } else {
                        score = `Best: ${parsed.score}`;
                    }
                } catch(e) {}
            }
            return score;
        }

        function buildCollectionCard(col, onClick) {
            const score = readHistory(col.id, col.problems.length);
            const card = document.createElement('div');
            card.className = 'collection-card';
            card.dataset.id = col.id;
            card.onclick = onClick;
            let scoreClass = (score.startsWith("Best")) ? "collection-score has-score" : "collection-score";
            let preview = buildMathPreview(col.problems[0].latex);
            card.innerHTML = `<div><h3>${col.name}</h3><span class="${scoreClass}">${score}</span></div>
            <div class="problem-preview">${preview}</div>`;
            return card;
        }

        // Which subject the currently-selected collection belongs to ('calc' | 'algebra').
        // Picking a card in any tab of the (single, shared) collection modal updates this,
        // and the one "Get Started" button dispatches on it. 'calc' covers all three
        // window.generatedCollections tabs (역삼각함수/쌍곡함수/극좌표) -- they all run
        // through the same startGame()/selectCollection() engine; only algebra differs.
        let selectedSubject = 'calc';

        const MODAL_SUBJECTS = ['trig', 'hyp', 'polar', 'algebra'];
        function switchModalSubject(subject) {
            MODAL_SUBJECTS.forEach(s => {
                document.getElementById(`subject-tab-${s}`).classList.toggle('active', s === subject);
                document.getElementById(`modal-section-${s}`).classList.toggle('hidden', s !== subject);
            });
        }

        window.addEventListener('DOMContentLoaded', () => {
            const trigGrid = document.getElementById('collection-grid-trig');
            const hypGrid = document.getElementById('collection-grid-hyp');
            const polGrid = document.getElementById('collection-grid-polar');
            if (trigGrid && hypGrid && polGrid && window.generatedCollections) {
                trigGrid.innerHTML = "";
                hypGrid.innerHTML = "";
                polGrid.innerHTML = "";
                window.generatedCollections.forEach(col => {
                    const card = buildCollectionCard(col, () => { selectedSubject = 'calc'; selectCollection(col.id); });
                    if (col.id.includes('adv_col1a')) {
                        trigGrid.appendChild(card);
                    } else if (col.id.includes('adv_col1b')) {
                        hypGrid.appendChild(card);
                    } else {
                        polGrid.appendChild(card);
                    }
                });
                if (window.MathJax) MathJax.typesetPromise([trigGrid, hypGrid, polGrid]);
            }

            const algGrid = document.getElementById('collection-grid-algebra');
            if (algGrid && window.algebraCollections) {
                algGrid.innerHTML = "";
                window.algebraCollections.forEach(col => {
                    algGrid.appendChild(buildCollectionCard(col, () => { selectedSubject = 'algebra'; selectAlgebraCollection(col.id); }));
                });
                if (window.MathJax) MathJax.typesetPromise([algGrid]);
            }
        });

        // --- Algebra: shares the same collection modal/label/hidden-input pattern as the
        // calculus side (selectCollection()/openCollectionModal()/closeCollectionModal(),
        // untouched, still exactly what integral.php calls with no arguments), just pointed
        // at window.algebraCollections and its own #sel-collection-value-algebra. The rest of
        // the quiz engine (state, grading, results) is subject-agnostic and reused as-is once
        // state.problems is populated.
        function selectAlgebraCollection(id) {
            selectedSubject = 'algebra';
            document.getElementById('sel-collection-value-algebra').value = id;
            document.querySelectorAll('#collection-grid-algebra .collection-card').forEach(c => c.classList.toggle('selected', c.dataset.id === id));
            const col = window.algebraCollections?.find(c => c.id === id);
            if (col) document.getElementById('current-collection-name').innerText = col.name;
            setTimeout(closeCollectionModal, 200);
        }
        // Override logic.js's giveUpProblem (only takes effect on THIS page -- integral.php
        // never loads this script, so its own give-up button still inserts "적포" exactly as
        // before). Renamed to a single generic "포기" that now covers every give-up-style
        // answer in this app: unintegrable calculus problems, no-inverse matrices, and
        // no-solution systems -- grader.js accepts "포기" for all three, so students don't
        // need to remember which exact phrase ("적포" / "역행렬 없음" / "해 없음") applies.
        function giveUpProblem() {
            const input = document.getElementById('math-input');
            input.value = "포기 "; // Trailing space prevents a Korean-input duplication bug
            saveAnswer();
            input.focus();
        }

        // MathLive's default virtual keyboard has no matrix key, so students have no way
        // to produce \begin{pmatrix}...\end{pmatrix} on their own -- these buttons insert
        // an empty template (with placeholder cells) into the focused answer field instead.
        function insertMatrixTemplate(rows, cols) {
            const field = document.getElementById('math-input');
            const rowPattern = Array(cols).fill('#0').join('&');
            const template = '\\begin{pmatrix}' + Array(rows).fill(rowPattern).join('\\\\') + '\\end{pmatrix}';
            field.focus();
            field.executeCommand(['insert', template, { feedback: false, mode: 'math' }]);
        }

        async function startAlgebraGame() {
            const id = document.getElementById('sel-collection-value-algebra').value;
            const colProvider = window.algebraCollections?.find(c => c.id === id);
            if (!colProvider) return alert("문제집을 선택해주세요.");

            state.strictC = false; // 행렬/연립방정식 문제에는 적분상수(C) 개념이 없음
            state.subject = 'algebra';
            const slogan = document.getElementById('slogan-text');
            if (slogan) slogan.innerText = 'Solve your matrices';
            state.problems = colProvider.problems.map((p, idx) => ({
                id: idx + 1, level: p.level, latex: normalizeLatex(p.latex), solution: p.solution, userAnswer: ""
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

        // Single "Get Started" button on the unified landing card dispatches to whichever
        // subject's start flow matches the last collection picked in the modal.
        function startSelectedGame() {
            if (selectedSubject === 'algebra') return startAlgebraGame();
            state.subject = 'calc';
            const slogan = document.getElementById('slogan-text');
            if (slogan) slogan.innerText = 'Integrate your skills';
            return startGame();
        }
    </script>
</body>

</html>