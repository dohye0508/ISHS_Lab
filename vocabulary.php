<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: index.php?msg=login_required");
    exit();
}
?>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vocabulary Studio</title>
    <link rel="icon" type="image/jpeg" href="assets/images/inticon.jpg">
    <meta property="og:image" content="assets/images/int.jpg">
    <link rel="stylesheet" href="assets/css/style.css?v=lab_final_v6">
    
    <style>
        /* (Style overrides kept same) */
        :root {
            --primary: #ea4335;       /* Google Red */
            --primary-rgb: 234, 67, 53;
            --surface-variant: #fdf2f2; /* Very light red tint for alternating rows */
            --accent-blue: #4285f4;
            --accent-green: #34a853;
        }
        [data-theme="dark"] :root {
            --surface-variant: #2d1a1a;
        }
        .btn.primary {
            background: linear-gradient(135deg, #ea4335 0%, #f28b82 100%);
            box-shadow: 0 4px 12px rgba(234, 67, 53, 0.25);
        }
        .btn.primary:hover {
            box-shadow: 0 6px 16px rgba(234, 67, 53, 0.35);
        }
        .loader-spinner {
            border-top-color: var(--primary);
        }
        /* Home Button Style inline */
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
        
        /* Override Start Button Hover to Red */
        .start-btn:hover {
            background: #d32f2f !important; /* Darker Red */
            box-shadow: 0 4px 12px rgba(211, 47, 47, 0.3) !important;
        }

        /* Practice Cards Layout */
        .practice-cards {
            display: flex;
            flex-direction: column;
            gap: 16px; /* Reduced from 24px */
            height: 100%;
            width: 100%;
            padding: 10px; /* Reduced from 20px */
            min-width: 400px;
        }

        .practice-card {
            flex: 1;
            background: var(--surface);
            border-radius: 16px;
            padding: 24px; /* Reduced from 32px */
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            border: 1px solid var(--border);
            transition: all 0.3s ease;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .practice-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
        }

        .practice-card-content {
            text-align: center;
        }

        .practice-icon {
            font-size: 2.4rem; /* Scaled down from 3rem */
            margin-bottom: 12px;
        }

        .practice-title {
            font-size: 1.5rem; /* Scaled down from 1.8rem */
            font-weight: 700;
            margin-bottom: 10px;
            color: var(--text);
        }

        .practice-desc {
            font-size: 0.88rem; /* Scaled down from 1rem */
            color: var(--text-secondary);
            line-height: 1.5;
        }

        .practice-start-btn {
            width: 100%;
            margin-top: 16px; /* Reduced from 24px */
        }

        /* Make landing-right fill available space */
        .landing-right {
            flex: 1.2;
            min-height: 400px;
            min-width: 320px;
            display: block !important;
        }

        /* Tablet layout for vocabulary */
        /* Mode Selector Styles */
        .eng-mode-selector {
            display: flex;
            background: rgba(var(--primary-rgb), 0.05);
            padding: 4px;
            border-radius: 12px;
            margin-top: 15px;
            gap: 4px;
        }

        .mode-btn {
            flex: 1;
            padding: 10px 12px;
            border: none;
            background: transparent;
            color: var(--text);
            opacity: 0.6;
            font-size: 0.85rem;
            font-weight: 700;
            cursor: pointer;
            border-radius: 8px;
            transition: all 0.2s ease;
            z-index: 10;
            white-space: nowrap;
        }

        .mode-btn:hover {
            opacity: 1;
            background: rgba(var(--primary-rgb), 0.1);
        }

        .mode-btn.active {
            background: var(--surface);
            color: var(--primary);
            opacity: 1;
            box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.2);
        }

        /* Hint Toggle Styles */
        .hint-section {
            width: 100%;
            margin-bottom: 25px;
            z-index: 5;
        }

        .hint-btn {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            padding: 14px;
            background: var(--surface);
            border: 2px solid var(--border);
            border-radius: 16px;
            color: var(--text);
            font-size: 1rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .hint-btn:hover {
            transform: translateY(-2px);
            border-color: var(--primary);
            background: rgba(var(--primary-rgb), 0.03);
            box-shadow: 0 6px 15px rgba(0,0,0,0.05);
        }

        .hint-btn svg {
            transition: transform 0.3s;
        }

        .hint-btn.active svg {
            transform: scale(1.2) rotate(180deg);
            color: var(--primary);
        }

        .hint-content {
            max-height: 0;
            overflow: hidden;
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            background: var(--surface);
            border: 1px solid transparent;
            border-radius: 12px;
            margin-top: 10px;
        }

        .hint-content.visible {
            max-height: 200px;
            opacity: 1;
            padding: 12px 20px;
            border-color: var(--border);
            margin-top: 10px;
        }

        .hint-content p {
            margin: 0;
            font-size: 0.95rem;
            line-height: 1.5;
            color: var(--text);
        }

        /* Premium Game View adjustments */
        #english-game-view {
            animation: fadeIn 0.5s ease;
            transition: max-width 0.5s ease;
        }

        #eng-play-area {
            background: rgba(var(--primary-rgb), 0.03);
            border-radius: 24px;
            padding: 25px; /* Reduced side padding slightly to avoid crunching */
            border: 1px solid rgba(var(--primary-rgb), 0.1);
            box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.02);
            width: 100%;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        #eng-passage-badge {
            display: none; /* Controlled by JS */
            background: var(--primary);
            color: white;
            box-shadow: 0 2px 8px rgba(var(--primary-rgb), 0.3);
        }

        /* Blank Input Styling */
        .blank-input-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            width: 100%;
            margin-top: 10px;
        }

        .input-group {
            display: flex;
            gap: 10px;
            width: 100%;
            max-width: 500px;
        }

        #eng-blank-input {
            flex: 1;
            padding: 15px 20px;
            border-radius: 12px;
            border: 2px solid var(--border);
            background: var(--surface);
            color: var(--text);
            font-size: 1.1rem;
            font-weight: 600;
            transition: all 0.3s;
            text-align: center;
        }

        #eng-blank-input:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 4px rgba(var(--primary-rgb), 0.1);
            transform: translateY(-2px);
        }

        #eng-blank-input.error {
            border-color: var(--error);
            animation: shake 0.4s ease-in-out;
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }

        .src-container, .tgt-container {
            width: 100%;
            box-sizing: border-box;
        }

        /* Passage Modal Styles */
        .modal {
            display: none;
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5);
            backdrop-filter: blur(8px);
            z-index: 2000;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        }
        .modal.visible { display: flex; }
        .modal-content {
            background: var(--surface);
            width: 90%;
            max-width: 500px;
            border-radius: 24px;
            padding: 30px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.2);
            border: 1px solid var(--border);
        }
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        .modal-title { font-size: 1.5rem; font-weight: 800; color: var(--primary); }
        .close-modal { cursor: pointer; opacity: 0.5; transition: 0.2s; }
        .close-modal:hover { opacity: 1; }

        .passage-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .passage-item {
            padding: 15px 20px;
            border-radius: 12px;
            border: 1px solid var(--border);
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .passage-item:hover {
            border-color: var(--primary);
            background: rgba(var(--primary-rgb), 0.05);
            transform: translateX(5px);
        }
        .passage-item.active {
            border-color: var(--primary);
            background: rgba(var(--primary-rgb), 0.1);
            font-weight: 700;
        }

        /* Dark Mode Specific Improvements */
        [data-theme="dark"] .eng-mode-selector {
            background: rgba(255, 255, 255, 0.05);
        }
        [data-theme="dark"] .mode-btn.active {
            background: #333;
            color: var(--primary);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
        }
        [data-theme="dark"] .hint-btn {
            background: #1e1e1e;
            border-color: #333;
        }
        [data-theme="dark"] .hint-btn:hover {
            background: #252525;
            border-color: var(--primary);
        }
        [data-theme="dark"] #eng-play-area {
            background: rgba(255, 255, 255, 0.02);
            border-color: rgba(255, 255, 255, 0.05);
        }

        /* Tablet layout for vocabulary */
        @media screen and (max-width: 1199px) {
            .landing-main {
                flex-direction: column !important;
            }
            .landing-right {
                width: 100%;
                max-width: 580px;
                margin: 20px auto 0;
            }
            .practice-cards {
                flex-direction: row !important;
                min-width: auto;
            }
            .practice-card {
                flex: 1;
                min-height: 280px;
            }
        }

        /* Memorize List Enhancements */
        .memorize-list {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            padding: 20px 0;
        }
        .memorize-card {
            background: var(--surface);
            padding: 20px;
            border-radius: 16px;
            border: 1px solid var(--border);
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
            transition: all 0.2s ease;
            border-left: 4px solid var(--primary); /* Accent bar */
        }
        .memorize-card:nth-child(even) {
            background: var(--surface-variant);
        }
        .memorize-card:hover {
            transform: translateY(-3px);
            border-color: var(--primary);
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }
        .memorize-eng {
            font-size: 1.3rem;
            font-weight: 800;
            color: var(--primary);
        }
        .memorize-ko {
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--text);
            opacity: 0.8;
        }

        /* Vocab Highlight & Tooltip */
        .vocab-highlight {
            color: var(--primary);
            font-weight: 700;
            border-bottom: 2px dashed rgba(var(--primary-rgb), 0.4);
            cursor: help;
            position: relative;
            display: inline-block;
            transition: all 0.2s;
        }
        .vocab-highlight:hover {
            background: rgba(var(--primary-rgb), 0.1);
            border-bottom-color: var(--primary);
        }
        .vocab-highlight::after {
            content: attr(data-meaning);
            position: absolute;
            bottom: 110%;
            left: 50%;
            transform: translateX(-50%) translateY(10px);
            background: #333;
            color: #fff;
            padding: 6px 12px;
            border-radius: 8px;
            font-size: 0.85rem;
            font-weight: 500;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            z-index: 1000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            pointer-events: none;
        }
        .vocab-highlight:hover::after {
            opacity: 1;
            visibility: visible;
            transform: translateX(-50%) translateY(0);
        }
        /* Triangle for tooltip */
        .vocab-highlight::before {
            content: '';
            position: absolute;
            bottom: 110%;
            left: 50%;
            transform: translateX(-50%) translateY(10px);
            border-width: 6px 6px 0 6px;
            border-style: solid;
            border-color: #333 transparent transparent transparent;
            opacity: 0;
            visibility: hidden;
            transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            z-index: 1000;
            pointer-events: none;
        }
        .vocab-highlight:hover::before {
            opacity: 1;
            visibility: visible;
            transform: translateX(-50%) translateY(7px);
        }

        [data-theme="dark"] .vocab-highlight::after {
            background: #eee;
            color: #111;
        }
        [data-theme="dark"] .vocab-highlight::before {
            border-top-color: #eee;
        }
    </style>

    <!-- Data and Game Scripts -->
    <script src="data/english/english_3221m.js?v=<?php echo time(); ?>"></script>
    <script src="data/english/english_3221m_vocab.js?v=<?php echo time(); ?>"></script>
    <script defer src="scripts/english_game.js?v=<?php echo time(); ?>"></script>

    <!-- ANTI-FOUC SCRIPT: Must be in HEAD -->
    <script>
        (function() {
            var theme = localStorage.getItem('theme') || 'light';
            document.documentElement.setAttribute('data-theme', theme);
        })();
    </script>
</head>
<body>
    <!-- Go Home Button (Back Arrow) -->
    <a href="index.php" class="home-btn-global" aria-label="Go Home">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
    </a>

    <div class="container">
        <!-- Main Landing View -->
        <div id="landing-view">
            <div class="landing-main">
                <div class="landing-left">
                    <div class="landing-header">
                        <h1>Vocabulary<br>Studio</h1>
                        <p class="subtitle">나만의 영단어 암기 및 테스트 플랫폼</p>
                    </div>
                    
                    <div class="selection-card">
                        <div class="selection-container">
                            <!-- Passage Selection -->
                            <button id="btn-toggle-passage" class="btn secondary" onclick="openPassageModal()" style="width: 100%; display: flex; justify-content: space-between; align-items: center;">
                                <span id="current-passage-name">32기 2-1 중간</span>
                                <span class="status-indicator" style="font-size: 0.8em;">→</span>
                            </button>

                            <div class="rules-section">
                                <h3 class="rules-title">💡 이용 가이드</h3>
                                <ul class="rules-list">
                                    <li>나만의 단어장을 만들고 체계적으로 관리하세요.</li>
                                    <li><strong>플래시카드</strong> 모드와 <strong>주관식 테스트</strong> 모드를 지원합니다.</li>
                                    <li>틀린 단어는 자동으로 <strong>오답노트</strong>에 저장됩니다.</li>
                                    <li>(준비중) 엑셀 파일 가져오기/내보내기 기능이 곧 추가됩니다.</li>
                                </ul>
                            </div>
                        </div>

                        <div class="option-section">
                            <div class="option-item">
                                <label class="checkbox-container">
                                    <input type="checkbox" id="chk-show-passage" checked>
                                    <span>지문 번호 보기 (Show Passage Number)</span>
                                </label>
                            </div>
                        </div>

                    </div>
                </div>

                <div class="landing-right">
                    <div class="practice-cards">
                        <!-- 단어 연습 카드 -->
                        <div class="practice-card word-card">
                            <div class="practice-card-content">
                                <div class="practice-icon">📝</div>
                                <h2 class="practice-title">단어 연습</h2>
                                <p class="practice-desc">지문에 등장하는 어려운 단어들의<br>뜻을 완벽하게 숙지하세요.</p>
                                
                                <div class="eng-mode-selector" style="margin-top: 15px;">
                                    <button class="mode-btn active" id="btn-word-mode-memorize" onclick="setWordPracticeMode('memorize')" style="font-weight: 700;">외우기</button>
                                    <button class="mode-btn" id="btn-word-mode-10" onclick="setWordPracticeMode('quiz', 10)">10개</button>
                                    <button class="mode-btn" id="btn-word-mode-50" onclick="setWordPracticeMode('quiz', 50)">50개</button>
                                </div>
                            </div>
                            <button class="start-btn practice-start-btn" onclick="handleStartWordPractice()">Start Word Practice</button>
                        </div>
                        
                        <!-- 문장 연습 카드 -->
                        <div class="practice-card sentence-card">
                            <div class="practice-card-content">
                                <div class="practice-icon">💬</div>
                                <h2 class="practice-title">문장 연습</h2>
                                <p class="practice-desc">문맥 속에서 단어를 활용하며<br>실전 영어 감각을 키우세요.</p>
                                
                                <div class="eng-mode-selector">
                                    <button class="mode-btn active" data-mode="memorize" onclick="setEngMode('memorize')">외우기</button>
                                    <button class="mode-btn" data-mode="random" onclick="setEngMode('random')">무작위</button>
                                    <button class="mode-btn" data-mode="order" onclick="setEngMode('order')">순서배열</button>
                                    <button class="mode-btn" data-mode="blank_choice" onclick="setEngMode('blank_choice')">단어선택</button>
                                    <button class="mode-btn" data-mode="blank_input" onclick="setEngMode('blank_input')">단어입력</button>
                                </div>
                            </div>
                            <button class="start-btn practice-start-btn" onclick="startEnglishGame()">Start Sentence Practice</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- English Game View -->
        <div id="english-game-view" style="display: none; width: 100%; max-width: 1000px; margin: 0 auto; padding: 10px 20px;">
            <div class="header" style="display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <button class="btn-home" onclick="quitEnglishGame()" title="뒤로가기">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                    </button>
                    <span id="eng-passage-badge" class="badge">#1</span>
                </div>
                <div class="badges">
                    <span id="eng-mode-badge" class="badge">Sentence Ordering</span>
                    <span id="eng-score-badge" class="badge progress">Score: 0</span>
                </div>
            </div>

            <div class="hint-section" style="margin-bottom: 10px;">
                <button id="btn-hint-toggle" class="hint-btn" onclick="toggleHint()">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <span>한글 해석 보기 (Show Hint)</span>
                </button>
                <div id="eng-korean-hint-container" class="hint-content">
                    <p id="eng-korean-hint"></p>
                </div>
            </div>

            <div id="eng-play-area">
                <!-- Dynamically populated by JS based on game mode -->
            </div>

            <div class="hint-section" style="margin-top: 25px;">
                <button id="btn-answer-toggle" class="hint-btn" onclick="toggleAnswer()">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 11l3 3L22 4"></path>
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                    </svg>
                    <span>정답 보기 (Show Answer)</span>
                </button>
                <div id="eng-answer-container" class="hint-content">
                    <p id="eng-answer-text" style="color: var(--primary); font-weight: 700;"></p>
                </div>
            </div>

            <div class="action-bar" style="justify-content: center; margin-top: 30px;">
                <button id="btn-eng-skip" class="btn secondary" onclick="nextEnglishQuestion()">Skip / Next →</button>
            </div>
        </div>

        <div class="footer">
            © 2026 ISHS 32nd - Developed by Dohye Lee. All rights reserved.
        </div>
    </div>
    <!-- Auth UI Elements (Top-Left) -->
    <div id="auth-header" style="position: fixed; top: 20px; left: 20px; z-index: 10000; display: flex; align-items: center; gap: 10px;">
        <a href="index.php" style="background: rgba(255,255,255,0.7); backdrop-filter: blur(10px); color: var(--text); padding: 8px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border);" title="홈으로">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
        </a>
        
        <div id="user-profile" style="display: none; align-items: center; gap: 12px; background: rgba(255,255,255,0.7); backdrop-filter: blur(10px); padding: 5px 15px; border-radius: 25px; border: 1px solid var(--border);">
            <span id="user-nickname" style="font-weight: 700; font-size: 0.9rem; color: var(--text);">Nickname</span>
            <button onclick="handleLogout()" style="background: none; border: none; font-size: 1rem; color: #ea4335; cursor: pointer; padding: 0; display: flex; align-items: center; gap: 4px;" title="로그아웃">
                <span style="font-size: 0.75rem; font-weight: 600;">로그아웃</span>
                <span style="font-size: 1.1rem;">→</span>
            </button>
        </div>
    </div>

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
        /* Page-specific styles only - Theme toggle styles now in global style.css */
    </style>

    <!-- Passage Selection Modal -->
    <div id="passage-modal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">📖 지문 선택</h2>
                <span class="close-modal" onclick="closePassageModal()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </span>
            </div>
            <div class="passage-list">
                <div class="passage-item active" onclick="selectPassage('3221m', '32기 2-1 중간')">
                    <span>32기 2-1 중간</span>
                    <span style="opacity:0.4; font-size:0.8em;">Now Playing</span>
                </div>
                <!-- Future collections go here -->
                <div class="passage-item" style="opacity:0.5; cursor:not-allowed;">
                    <span>(준비 중) 32기 2-1 기말</span>
                </div>
            </div>
        </div>
    </div>

    <script>
        function openPassageModal() {
            document.getElementById('passage-modal').classList.add('visible');
        }
        function closePassageModal() {
            document.getElementById('passage-modal').classList.remove('visible');
        }
        function selectPassage(id, name) {
            if (window.loadPassageCollection) {
                window.loadPassageCollection(id, name);
                closePassageModal();
            }
        }

        // --- Authentication System Logic ---
        const AUTH_API = 'api/user_system.php';

        async function updateAuthUI() {
            try {
                const res = await fetch(`${AUTH_API}?action=status`);
                const data = await res.json();
                const userProfile = document.getElementById('user-profile');
                if (data.logged_in) {
                    if (userProfile) userProfile.style.display = 'flex';
                    document.getElementById('user-nickname').textContent = data.user.nickname;
                } else {
                    if (userProfile) userProfile.style.display = 'none';
                }
            } catch (e) { console.error("Auth status error:", e); }
        }

        async function handleLogout() {
            await fetch(`${AUTH_API}?action=logout`, { method: 'POST' });
            location.href = 'index.php';
        }

        document.addEventListener('DOMContentLoaded', updateAuthUI);

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
