<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: auth.php?msg=login_required&redirect=rocks.php');
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
    <title>Rock ID Studio</title>
    <link rel="icon" type="image/svg+xml" href="assets/images/rocks.svg">
    <meta property="og:title" content="Rock ID Studio">
    <meta property="og:description" content="암석 사진을 보고 이름을 맞히는 지구과학 실험 수행평가 대비 스튜디오.">

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css">
    <link rel="stylesheet" href="assets/css/style.css?v=lab_final_v7">
    <style>
        /* ISHS LAB 공통 톤 — Rock ID Studio는 앰버 */
        :root{
            --primary:#B45309;
            --primary-rgb:180,83,9;
            --mesh-a:rgba(245,158,11,.20);
            --mesh-a2:rgba(245,158,11,.16);
            --mesh-b:rgba(94,234,212,.15);
            --mesh-b2:rgba(94,234,212,.13);
            --mesh-c:rgba(244,114,182,.09);
        }
        html[data-theme="dark"]{
            --primary:#F59E0B;
            --primary-rgb:245,158,11;
            --mesh-a:rgba(245,158,11,.22);
            --mesh-a2:rgba(245,158,11,.18);
            --mesh-b:rgba(94,234,212,.19);
            --mesh-b2:rgba(94,234,212,.17);
            --mesh-c:rgba(244,114,182,.12);
        }
        body{
            background-image:
                radial-gradient(ellipse 70% 62% at 10% 8%, var(--mesh-a) 0%, transparent 72%),
                radial-gradient(ellipse 65% 58% at 88% 14%, var(--mesh-b) 0%, transparent 72%),
                radial-gradient(ellipse 85% 75% at 50% 46%, var(--mesh-c) 0%, transparent 78%),
                radial-gradient(ellipse 68% 60% at 14% 90%, var(--mesh-a2) 0%, transparent 72%),
                radial-gradient(ellipse 68% 62% at 90% 86%, var(--mesh-b2) 0%, transparent 72%);
            background-repeat:no-repeat;
            background-attachment:fixed;
        }
    </style>
    <link rel="stylesheet" href="assets/css/studio-layout.css?v=20260918_v1">
    <link rel="stylesheet" href="assets/css/rocks.css?v=20261027_3">
    <!-- ANTI-FOUC SCRIPT: Must be in HEAD and before body renders -->
    <script>
        (function () {
            var theme = localStorage.getItem('theme') || 'light';
            document.documentElement.setAttribute('data-theme', theme);
        })();
    </script>
</head>

<body class="studio-page rocks-page">
    <!-- Auth UI Elements (Top-Left) -->
    <div id="auth-header">
        <a href="modules.php"
            style="display: flex; align-items: center; text-decoration: none; font-weight: 800; font-size: 27px; letter-spacing: -.03em; line-height: 1; filter: drop-shadow(0 1px 3px rgba(0,0,0,.12));"
            title="스튜디오 목록으로">
            <span style="background: linear-gradient(100deg, #F472B6 0%, #60A5FA 55%, #5EEAD4 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">ISHS<span style="font-weight: 400; -webkit-text-fill-color: var(--text); opacity: .6;">LAB</span></span>
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

    <div class="container">
        <div id="landing-view">
            <div class="landing-main">
                <div class="landing-left">
                    <div class="landing-header">
                        <h1>Rock ID<br>Studio</h1>
                        <p class="subtitle">지구과학 실험 · 암석 사진 보고 맞히기</p>
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
                                    <li><strong>실물은 사진과 다르게 보입니다.</strong> 사진 변형을 켜고 연습하세요. 확대는 배경과 번호표를 가려 줍니다.</li>
                                    <li><strong>객관식 · 주관식 · 종류</strong>는 연습 모드로, 한 문제마다 바로 정답과 헷갈리는 돌을 보여 줍니다.</li>
                                    <li><strong>실전</strong>은 수행평가처럼 문제마다 시간 제한이 있고, 끝까지 푼 뒤 채점합니다.</li>
                                    <li>주관식은 <strong>정확한 이름</strong>만 정답입니다. 예: 셰일(○) 세일(✗). 영어 이름도 인정됩니다.</li>
                                </ul>
                            </div>
                        </div>

                        <div class="option-section rock-options">
                            <div class="rock-option-row">
                                <span class="rock-option-label">모드</span>
                                <div class="count-selector" id="mode-selector">
                                    <button type="button" class="cnt-btn" data-mode="choice">객관식</button>
                                    <button type="button" class="cnt-btn" data-mode="type">주관식</button>
                                    <button type="button" class="cnt-btn" data-mode="exam">실전</button>
                                    <button type="button" class="cnt-btn" data-mode="kind">종류</button>
                                </div>
                            </div>
                            <div class="rock-option-row" id="row-count">
                                <span class="rock-option-label">문항 수</span>
                                <div class="count-selector" id="count-selector">
                                    <button type="button" class="cnt-btn" data-count="10">10</button>
                                    <button type="button" class="cnt-btn" data-count="20">20</button>
                                    <button type="button" class="cnt-btn" data-count="all">전체</button>
                                    <button type="button" class="cnt-btn" data-count="0">무한</button>
                                </div>
                            </div>
                            <div class="rock-option-row" id="row-choices">
                                <span class="rock-option-label">보기 수</span>
                                <div class="count-selector" id="choices-selector">
                                    <button type="button" class="cnt-btn" data-choices="4">4지선다</button>
                                    <button type="button" class="cnt-btn" data-choices="5">5지선다</button>
                                    <button type="button" class="cnt-btn" data-choices="6">6지선다</button>
                                </div>
                            </div>
                            <div class="rock-option-row hidden" id="row-timer">
                                <span class="rock-option-label">제한 시간</span>
                                <div class="count-selector" id="timer-selector">
                                    <button type="button" class="cnt-btn" data-timer="10">10초</button>
                                    <button type="button" class="cnt-btn" data-timer="20">20초</button>
                                    <button type="button" class="cnt-btn" data-timer="30">30초</button>
                                    <button type="button" class="cnt-btn" data-timer="60">60초</button>
                                </div>
                            </div>
                            <div class="option-item"><label class="checkbox-container"><input type="checkbox" id="chk-rotate"><span>사진 회전·뒤집기</span></label></div>
                            <div class="option-item"><label class="checkbox-container"><input type="checkbox" id="chk-zoom"><span>사진 확대 (배경·번호표 가리기)</span></label></div>
                            <div class="option-item"><label class="checkbox-container"><input type="checkbox" id="chk-color"><span>색감 흔들기</span></label></div>
                            <div class="option-item"><label class="checkbox-container"><input type="checkbox" id="chk-gray"><span>흑백</span></label></div>
                            <div class="option-item" id="row-tricky"><label class="checkbox-container"><input type="checkbox" id="chk-tricky"><span>헷갈리는 보기 우선 (객관식)</span></label></div>
                        </div>

                        <button class="start-btn" onclick="startSelected()">Get Started</button>
                        <div class="rock-sub-actions">
                            <button type="button" class="btn secondary" onclick="openStudy()">📖 암석 도감</button>
                            <button type="button" class="btn secondary" onclick="openNotes()">📝 오답 노트 <span id="weak-count"></span></button>
                        </div>
                    </div>
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
                <div class="collection-sections">
                    <h3>▶ 암석 종류별</h3>
                    <div id="collection-grid-type" class="collection-grid"></div>
                    <h3>▶ 생김새별 (헷갈리는 돌끼리)</h3>
                    <div id="collection-grid-look" class="collection-grid"></div>
                </div>
            </div>
        </div>

        <div id="app-view">
            <div class="header">
                <button class="btn-home" onclick="returnToLanding()" title="메인으로">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                </button>
                <span class="brand">
                    <h2 id="slogan-text">Identify the rock</h2>
                </span>
                <div class="badges">
                    <span id="mode-badge" class="badge">객관식</span>
                    <span id="progress-badge" class="badge progress">1 / 10</span>
                </div>
            </div>

            <div id="quiz-area">
                <p id="question-text" class="rock-question">이 암석의 이름은?</p>
                <div id="problem-area" class="rock-stage" title="누르면 크게 볼 수 있어요"><img id="rock-photo" alt="암석 사진" draggable="false"></div>
                <div id="timer" class="rock-timer hidden"><div id="timer-bar"></div></div>
                <div id="choice-area" class="rock-options-grid"></div>
                <form id="type-area" class="rock-type-form hidden" autocomplete="off">
                    <input id="answer-input" type="text" placeholder="암석 이름을 입력하세요" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" aria-label="암석 이름">
                </form>
                <div id="hint-box" class="rock-hint-box"></div>
                <div id="feedback"></div>
                <div class="action-bar">
                    <button id="btn-quit" class="btn secondary" onclick="quitQuiz()">그만하기</button>
                    <div style="flex-grow: 1; text-align: center;" id="hint-buttons">
                        <button type="button" class="btn secondary" id="btn-hint-cho" onclick="giveHint('cho')">초성</button>
                        <button type="button" class="btn secondary" id="btn-hint-feat" onclick="giveHint('feat')">특징</button>
                        <button type="button" class="btn secondary" id="btn-giveup" onclick="giveUp()">포기</button>
                    </div>
                    <button id="btn-next" class="btn primary" onclick="onNext()">Next →</button>
                    <button id="btn-finish" class="btn success hidden" onclick="onNext()">Finish Test</button>
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
                <div class="rock-result-actions">
                    <button id="btn-retry-wrong" class="btn primary" onclick="retryWrong()">틀린 문제만 다시</button>
                    <button class="btn secondary" onclick="retrySame()">Restart</button>
                    <button class="btn secondary" onclick="returnToLanding()">메인으로</button>
                </div>
            </div>
        </div>

        <div id="study-view" style="display:none;">
            <div class="header">
                <button class="btn-home" onclick="returnToLanding()" title="메인으로">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                </button>
                <span class="brand"><h2>암석 도감</h2></span>
                <div class="badges"><button type="button" id="btn-hide-names" class="badge rock-badge-btn" onclick="toggleHideNames()">이름 가리기</button></div>
            </div>
            <div id="study-list"></div>
        </div>

        <div id="notes-view" style="display:none;">
            <div class="header">
                <button class="btn-home" onclick="returnToLanding()" title="메인으로">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                </button>
                <span class="brand"><h2>오답 노트</h2></span>
                <div class="badges"><span id="notes-badge" class="badge progress"></span></div>
            </div>
            <div id="notes-list"></div>
        </div>

        <div class="footer">
            © 2026 ISHS 32nd - Developed by Dohye Lee. All rights reserved.
            <div class="rock-credit" id="rock-credit"></div>
        </div>
    </div>

    <div class="rock-lightbox" id="lightbox" hidden><div class="rock-lightbox-stage"><img alt=""></div><p>누르면 닫힘</p></div>

    <script src="data/rocks/rocks.js?v=20261027_3"></script>
    <script src="scripts/rocks.js?v=20261027_3"></script>
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
    </script>
</body>

</html>
