<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ISHS LAB</title>
    <link rel="icon" type="image/jpeg" href="assets/images/inticon.jpg">
    <meta property="og:image" content="assets/images/int.jpg">
    <!-- Use lab_final version to ensure proper caching -->
    <link rel="stylesheet" href="assets/css/style.css?v=<?php echo time(); ?>">
    
    <script>
        // Fix for "Cannot read properties of null (reading 'setAttribute')"
        // Wait for DOM content to load before accessing document.body
        // FOUC FIX: Use documentElement immediately
        (function() {
            var theme = localStorage.getItem('theme') || 'light';
            document.documentElement.setAttribute('data-theme', theme);
        })();
    </script>
    
    <style>
        :root {
            --bg: #fcfdfe;
            --text: #1f1f1f;
            --primary: #1a73e8;       
            --surface: #f8f9fa;       
            --border: #dadce0;
        }
        [data-theme="dark"] {
            --bg: #121212;
            --text: #e0e0e0;
            --primary: #669df6;
            --surface: #1e1e1e;
            --border: #333333;
        }
        body {
            background: var(--bg);
            color: var(--text);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            position: relative;
            margin: 0;
            overflow-y: auto;
            transition: background-color 0.3s, color 0.3s;
        }

        /* Side gradients - PURPLE/PINK Theme as requested */
        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            /* Purple & Pink gradients */
            background: linear-gradient(90deg, 
                rgba(142, 68, 173, 0.08) 0%, 
                rgba(233, 30, 99, 0.02) 25%, 
                transparent 50%, 
                rgba(233, 30, 99, 0.02) 75%, 
                rgba(142, 68, 173, 0.08) 100%
            );
            pointer-events: none;
            z-index: 0;
        }

        /* ... (container styles same) */
        .lab-wrapper {
            width: 100%;
            max-width: 680px;
            padding: 40px 20px;
            display: flex;
            flex-direction: column;
            gap: 25px;
            position: relative;
            z-index: 1;
        }

        /* ... (outer card styles same) */
        .lab-outer-card {
            background: #ffffff;
            border-radius: 24px;
            padding: 40px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.06);
            border: 1px solid rgba(0,0,0,0.04);
            display: flex;
            flex-direction: column;
            gap: 25px;
        }
        [data-theme="dark"] .lab-outer-card {
            background: #202124;
            border-color: #3c4043;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }

        .lab-header {
            text-align: center;
        }
        
        .lab-header h1 {
            font-size: 3.2rem;
            font-weight: 800;
            line-height: 1;
            margin-bottom: 0px; /* Reduced to pull icon closer */
            letter-spacing: -1px;
        }

        /* Animation for the Icon */
        .icon-animate {
            animation: bounceIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            opacity: 0;
            transform: scale(0.5); /* Start small */
        }

        @keyframes bounceIn {
            0% {
                opacity: 0;
                transform: scale(0.5);
            }
            60% {
                opacity: 1;
                transform: scale(1.1);
            }
            100% {
                transform: scale(1);
            }
        }
        
        /* ISHS part - PURPLE Gradient */
        .lab-header h1 .ishs-text {
            background: linear-gradient(45deg, #8e44ad, #e91e63);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        /* LAB part */
        .lab-header h1 .lab-text {
            font-weight: 300;
            color: #1a73e8; /* Blue Tone (Integral Blue) always */
        }
        
        /* ... (rest of styles preserved) */
        
        /* Specific Hover Colors for Module Cards */
        /* Note: Cards use .module-link class. We can target them by href or nth-child logic if needed, 
           but inline targeting is safest if structural changes happen. 
           Here we will use href attribute selectors for precision. */
        
        /* Integral: Blue (Default) */
        .module-link[href="integral.php"]:hover {
            border-color: rgba(26, 115, 232, 0.5);
            background: rgba(26, 115, 232, 0.04);
        }
        .module-link[href="integral.php"]:hover .module-icon { color: #1a73e8; }
        .module-link[href="integral.php"]:hover .module-title { color: #1a73e8; }
        .module-link[href="integral.php"]:hover .arrow { color: #1a73e8; transform: translateX(5px); }

        /* Vocabulary: Red */
        .module-link[href="vocabulary.php"]:hover {
            border-color: rgba(234, 67, 53, 0.5);
            background: rgba(234, 67, 53, 0.04);
        }
        .module-link[href="vocabulary.php"]:hover .module-icon { color: #ea4335; }
        .module-link[href="vocabulary.php"]:hover .module-title { color: #ea4335; }
        .module-link[href="vocabulary.php"]:hover .arrow { color: #ea4335; transform: translateX(5px); }

        /* Coding Test: Teal/Cyan */
        .module-link[href="coding_test/index.html"]:hover {
            border-color: rgba(30, 215, 96, 0.5);
            background: rgba(30, 215, 96, 0.04);
        }
        .module-link[href="coding_test/index.html"]:hover .module-icon { color: #1ed760; }
        .module-link[href="coding_test/index.html"]:hover .module-title { color: #1ed760; }
        .module-link[href="coding_test/index.html"]:hover .arrow { color: #1ed760; transform: translateX(5px); }

        /* Remove generic hover styles from style.css effectively for these specific items */
            margin-left: 6px;
            color: #1a73e8;
            opacity: 1;
        }

        .lab-header .subtitle {
            font-size: 1rem;
            color: var(--text);
            opacity: 0.7;
            font-weight: 500;
            margin: 0;
        }

        .lab-intro {
            text-align: center;
            margin-bottom: 5px;
            color: var(--text);
            opacity: 0.8;
            font-size: 0.95rem;
            line-height: 1.5;
            max-width: 480px;
            margin: 0 auto;
        }

        .lab-selection-card {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .module-link {
            display: block;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 24px;
            text-decoration: none;
            color: var(--text);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }

        .module-link:hover::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(26, 115, 232, 0.03) 0%, rgba(66, 133, 244, 0.02) 100%);
            opacity: 1;
            transition: opacity 0.3s ease;
        }

        .module-link:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(26, 115, 232, 0.1);
            border-color: rgba(26, 115, 232, 0.3);
            background: #fff; /* Ensure bg stays bright on hover */
        }
        [data-theme="dark"] .module-link:hover {
            background: var(--surface);
        }

        .module-top {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            position: relative;
            z-index: 1;
        }

        .module-icon {
            width: 44px;
            height: 44px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.3rem;
            margin-right: 15px;
            font-weight: 600;
            background: linear-gradient(135deg, rgba(26, 115, 232, 0.08) 0%, rgba(66, 133, 244, 0.05) 100%);
            color: #1a73e8;
            transition: transform 0.3s ease;
        }

        .module-link:hover .module-icon {
            transform: scale(1.1);
        }

        .module-link:nth-child(2) .module-icon {
            background: linear-gradient(135deg, rgba(234, 67, 53, 0.08) 0%, rgba(251, 188, 5, 0.05) 100%);
            color: #ea4335;
        }
        
        /* Coding Test Icon style */
        .module-link:nth-child(3) .module-icon {
            background: linear-gradient(135deg, rgba(30, 215, 96, 0.08) 0%, rgba(52, 168, 83, 0.05) 100%);
            color: #1ed760;
        }

        .module-title {
            font-size: 1.2rem;
            font-weight: 700;
            flex-grow: 1;
            color: var(--text);
        }

        .module-desc {
            font-size: 0.9rem;
            color: var(--text);
            opacity: 0.7;
            line-height: 1.5;
            position: relative;
            z-index: 1;
        }

        .lab-footer {
            text-align: center;
            margin-top: 10px;
            font-size: 0.8rem;
            opacity: 0.4;
            color: var(--text);
        }

        [data-theme="dark"] .lab-header h1 .ishs-text,
        [data-theme="dark"] .lab-header h1 .lab-text {
            color: #8ab4f8; /* Softer blue for dark mode */
        }

        /* Entrance Animations */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .lab-header {
            opacity: 0; /* Start invisible */
            animation: fadeInUp 0.8s cubic-bezier(0.2, 1, 0.3, 1) forwards;
        }

        .lab-intro {
            opacity: 0;
            animation: fadeInUp 0.8s cubic-bezier(0.2, 1, 0.3, 1) 0.1s forwards;
        }

        /* Staggered animation for list items */
        .module-link {
            opacity: 0;
            animation: fadeInUp 0.8s cubic-bezier(0.2, 1, 0.3, 1) forwards;
        }

        .module-link:nth-child(1) { animation-delay: 0.2s; }
        .module-link:nth-child(2) { animation-delay: 0.3s; }
        .module-link:nth-child(3) { animation-delay: 0.4s; }
    </style>
</head>
<body>
    <div class="lab-wrapper">
        <!-- New Visual Wrapper Card -->
        <div class="lab-outer-card">
            <header class="lab-header">
                <h1><span class="ishs-text">ISHS</span><span class="lab-text">LAB</span></h1>
                <p class="subtitle">Knowledge Archive & Experiments</p>
            </header>



            <!-- Intro Section - No stick, purely text -->
            <div class="lab-intro">
                <p style="margin: 0;">
                    자기주도 학습을 위한 실험 공간에 오신 것을 환영합니다.<br>
                    아래 모듈 중 하나를 선택하여 학습을 시작하세요.
                </p>
            </div>

            <div class="lab-selection-card">
                <!-- Integral Studio -->
                <a href="integral.php" class="module-link">
                    <div class="module-top">
                        <div class="module-icon">∫</div>
                        <div class="module-title">Integral Studio</div>
                        <div class="arrow" style="opacity: 0.3;">→</div>
                    </div>
                    <div class="module-desc">
                        부정적분 계산 능력을 극대화하기 위한 트레이닝 모듈입니다.<br>
                        무한히 생성되는 문제와 즉각적인 피드백을 경험해보세요.
                    </div>
                </a>

                <!-- Vocabulary Studio -->
                <a href="vocabulary.php" class="module-link">
                    <div class="module-top">
                        <div class="module-icon">Aa</div>
                        <div class="module-title">Vocabulary Studio</div>
                        <div class="arrow">→</div>
                    </div>
                    <div class="module-desc">
                        나만의 단어장을 만들고 체계적으로 관리하세요.<br>
                        플래시카드와 주관식 테스트로 완벽하게 암기할 수 있습니다.
                    </div>
                </a>
                <!-- Coding Test -->
                <a href="coding_test.php" class="module-link">
                    <div class="module-top">
                        <div class="module-icon">💻</div>
                        <div class="module-title">Coding Test</div>
                        <div class="arrow">→</div>
                    </div>
                    <div class="module-desc">
                        파이썬 주요 알고리즘 템플릿과 예제 모음입니다.<br>
                        코딩 테스트 준비를 위한 핵심 로직을 한눈에 확인하세요.
                    </div>
                </a>
            </div>
            
        </div>
    </div>
    
    <div class="footer">
        © 2026 ISHS 32nd - Developed by Dohye Lee. All rights reserved.
    </div>

    <!-- Global Theme Toggle (Top-Right) - Using Standard class -->
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
        .theme-toggle-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: transparent;
            border: none;
            color: #9aa0a6;
            cursor: pointer;
            padding: 8px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.3s, color 0.3s;
        }
        .theme-toggle-btn:hover {
            background-color: rgba(0,0,0,0.05);
            color: var(--text);
        }
        [data-theme="dark"] .theme-toggle-btn:hover {
            background-color: rgba(255,255,255,0.1);
        }
        /* Icon Visibility Control: Force only one at a time */
        .sun-icon, .moon-icon { display: none !important; } 
        html:not([data-theme="dark"]) .sun-icon { display: block !important; }
        html[data-theme="dark"] .moon-icon { display: block !important; }
    </style>

    <script>
        // Global Theme Toggle Script
        // Script is placed at end of body to ensure DOM availability
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
