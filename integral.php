<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Indefinite Integral Studio</title>
    <link rel="icon" type="image/jpeg" href="assets/images/inticon.jpg">
    <!-- ... (meta tags omitted for brevity if unchanged) ... -->
    
    <link rel="stylesheet" href="assets/css/style.css?v=lab_final_v6">
    <script src="https://unpkg.com/mathlive"></script>
    <script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>

    <!-- ANTI-FOUC SCRIPT: Must be in HEAD and before body renders -->
    <script>
        (function() {
            var theme = localStorage.getItem('theme') || 'light';
            document.documentElement.setAttribute('data-theme', theme);
        })();
    </script>
</head>
<body>
    <!-- Scripts calling body removed from top -->

    <!-- Go Home Button (Back Arrow) -->
    <a href="index.php" class="home-btn-global" aria-label="Go Home">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
    </a>
    <style>
        .home-btn-global {
            position: fixed;
            top: 20px;
            left: 20px;
            background: transparent;
            color: var(--text);
            opacity: 0.6;
            transition: all 0.2s;
            padding: 10px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        .home-btn-global:hover {
            opacity: 1;
            background: var(--surface);
            transform: scale(1.1);
        }
    </style>

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
                            <h1>Indefinite<br>Integral Studio</h1>
                            <p class="subtitle">컬렉션 기반 실전 부정적분 트레이닝</p>
                        </div>
                        
                        <div class="selection-card">
                            <div class="selection-container">
                                <button id="btn-toggle-collection" class="btn secondary" onclick="openCollectionModal()" style="width: 100%; display: flex; justify-content: space-between; align-items: center;">
                                    <span id="current-collection-name">문제집 선택 (Select Collection)</span>
                                    <span class="status-indicator" style="font-size: 0.8em;">→</span>
                                </button>

                                <div class="rules-section">
                                    <h3 class="rules-title">💡 이용 가이드</h3>
                                    <ul class="rules-list">
                                        <li>본 서비스는 <strong>데스크탑 및 태블릿</strong> 환경에 최적화되어 있습니다.</li>
                                        <li>수식 입력란 클릭 시 <strong>가상 키보드</strong>를 사용하실 수 있습니다.</li>
                                        <li>데스크탑 환경의 오른쪽 정적분 애니메이션은 실제 부정적분 문제와 관계가 없습니다.</li>
                                        <li>(중요) 정답 입력 시 <strong>적분상수 C</strong>를 포함해 주세요.</li>
                                        <li>(중요) 간간히 초등함수로 적분불가능한 문제가 나옵니다. 이때는 <strong>적포</strong>(적분 포기)라고 쓰셔야 합니다. 마지막에 띄어쓰기를 한번 누르셔야 한글 중복 버그를 막을 수 있습니다.</li>
                                    </ul>
                                </div>
                            </div>

                            <div class="option-section">
                                <div class="option-item">
                                    <label class="checkbox-container">
                                        <input type="checkbox" id="chk-strict-c" checked>
                                        <span>적분상수(C) 포함 필수</span>
                                    </label>
                                </div>
                            </div>

                            <button class="start-btn" onclick="startGame()">Get Started</button>
                        </div>
                        <input type="hidden" id="sel-collection-value" value="">
                    </div>

                    <div class="landing-right">
                        <div class="hero-visual">
                            <canvas id="hero-canvas"></canvas>
                        </div>
                    </div>
                </div>
            </div>


            <div id="collection-modal" class="overlay">
                <div class="overlay-content">
                    <div class="overlay-header">
                        <h2>문제집 목록 (Collections)</h2>
                        <button class="btn-close-overlay" onclick="closeCollectionModal()">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                    <div id="collection-grid" class="collection-grid"></div>
                    <div style="padding: 15px; text-align: center; border-top: 1px solid var(--border);">
                         <p style="font-size: 0.85em; color: var(--text-secondary); margin: 0;">
                            * 각 컬렉션은 약 20문제로 구성되어 있습니다.
                        </p>
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
                <span class="brand"><h2 id="slogan-text">Integrate your skills</h2></span>
                <div class="badges">
                    <span id="level-badge" class="badge">Level 1</span>
                    <span id="progress-badge" class="badge progress">1 / 20</span>
                </div>
            </div>

            <div id="quiz-area">
                <div id="problem-area"></div>
                <math-field id="math-input" placeholder="정답을 입력하세요" virtual-keyboard-mode="onfocus"></math-field>
                <div class="action-bar">
                    <button id="btn-prev" class="btn secondary hidden" onclick="prevProblem()">← Previous</button>
                    <div style="flex-grow: 1; text-align: center;">
                        <button id="btn-giveup" class="btn secondary hidden" onclick="giveUpProblem()">적포(적분 포기)</button>
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
                    <button id="btn-toggle-detail" class="btn secondary" onclick="toggleDetails()">자세히 보기 (View Details)</button>
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

    <script src="data/math/collections.js?v=<?php echo time(); ?>"></script>
    <script src="scripts/grader.js?v=debug_v7"></script>
    <script src="scripts/logic.js?v=debug_v7"></script>
    <script src="scripts/bg_funcs.js?v=debug_v7"></script>
    <script src="scripts/bg_anim.js?v=debug_v7"></script>
    <!-- Global Theme Toggle (Top-Right) -->
    <button id="theme-toggle" class="theme-toggle-btn" aria-label="Toggle Dark Mode">
        <svg class="sun-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
        <svg class="moon-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
    </button>
    <style>
        /* Only Keep Page Specific Styles if any - Removing Toggle Button Styles as they are now global */
    </style>

    <script>
        // Global Theme Toggle Script
        (function() {
            const toggleBtn = document.getElementById('theme-toggle');
            if(toggleBtn) {
                toggleBtn.addEventListener('click', function() {
                    const currentTheme = document.documentElement.getAttribute('data-theme');
                    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                    document.documentElement.setAttribute('data-theme', newTheme);
                    localStorage.setItem('theme', newTheme);
                });
            }
        })();
    </script>
</body>
</html>
