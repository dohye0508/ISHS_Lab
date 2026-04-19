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
            --bg: #0a0a0c;
            --text: #e2e2e2;
            --primary: #669df6;
            --surface: #16181d;
            --border: #2d3139;
        }
        body {
            background: var(--bg);
            color: var(--text);
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 40px 20px;
            box-sizing: border-box;
            overflow-x: hidden;
            font-family: 'Pretendard', sans-serif;
        }

        /* Modern Mesh Gradient Background */
        .mesh-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            background-color: var(--bg);
            background-image: 
                radial-gradient(at 0% 0%, rgba(142, 68, 173, 0.15) 0px, transparent 50%),
                radial-gradient(at 100% 0%, rgba(233, 30, 99, 0.1) 0px, transparent 50%),
                radial-gradient(at 100% 100%, rgba(26, 115, 232, 0.1) 0px, transparent 50%),
                radial-gradient(at 0% 100%, rgba(30, 215, 96, 0.05) 0px, transparent 50%);
            filter: blur(80px);
            opacity: 0.8;
            transition: opacity 0.3s ease;
        }
        
        [data-theme="dark"] .mesh-bg {
            opacity: 0.4; /* Reduce opacity in dark mode for deeper blacks */
        }

        /* Decorative Side Orbs */
        .orb {
            position: fixed;
            border-radius: 50%;
            filter: blur(60px);
            z-index: -1;
            opacity: 0.15;
            animation: float 20s infinite alternate ease-in-out;
        }
        .orb-1 { width: 400px; height: 400px; background: #8e44ad; top: 10%; left: -100px; }
        .orb-2 { width: 350px; height: 350px; background: #e91e63; bottom: 10%; right: -100px; animation-delay: -5s; }
        .orb-3 { width: 250px; height: 250px; background: #1a73e8; top: 50%; left: 15%; animation-delay: -10s; opacity: 0.05; }

        @keyframes float {
            0% { transform: translate(0, 0) scale(1); }
            100% { transform: translate(50px, 30px) scale(1.1); }
        }

        /* ... (container styles same) */
        .lab-wrapper {
            width: 100%;
            max-width: 580px;
            padding: 10px 20px; /* Reduced from 20px */
            display: flex;
            flex-direction: column;
            gap: 15px; /* Tighter gap */
            position: relative;
            z-index: 1;
        }

        /* ... (outer card styles same) */
        .lab-outer-card {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 32px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.08);
            border: 1px solid rgba(255, 255, 255, 0.4);
            display: flex;
            flex-direction: column;
            gap: 25px;
        }

        [data-theme="dark"] .lab-outer-card {
            background: rgba(18, 19, 21, 0.85);
            border-color: rgba(255, 255, 255, 0.05);
            box-shadow: 0 20px 80px rgba(0,0,0,0.6);
            backdrop-filter: blur(30px);
        }

        .lab-header {
            text-align: center;
        }
        
        .lab-header h1 {
            font-size: 2.2rem; /* Scaled down from 2.6rem */
            font-weight: 800;
            line-height: 1;
            margin-bottom: 2px;
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
        .module-link .arrow { 
            margin-left: 6px;
            color: #1a73e8;
            opacity: 0.3;
            transition: all 0.3s ease;
        }

        .lab-header .subtitle {
            font-size: 0.85rem; /* Scaled down from 0.95rem */
            color: var(--text);
            opacity: 0.6;
            font-weight: 500;
            margin: 0;
        }

        .lab-intro {
            text-align: center;
            color: var(--text);
            opacity: 0.7;
            font-size: 0.88rem;
            line-height: 1.35; /* Reduced line-height */
            max-width: 440px;
            margin: 0 auto; /* Removed extra margin */
        }

        .lab-selection-card {
            display: flex;
            flex-direction: column;
            gap: 12px; /* Tighter gap */
        }

        .module-link {
            display: block;
            background: rgba(var(--surface-rgb, 255, 255, 255), 0.5);
            border: 1px solid var(--border);
            border-radius: 18px;
            padding: 20px 24px;
            text-decoration: none;
            color: var(--text);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
            overflow: hidden;
        }

        .module-link:hover {
            transform: translateY(-5px) scale(1.02);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
            border-color: var(--primary);
            background: var(--surface);
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
            width: 34px; /* Scaled down from 38px */
            height: 34px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.05rem;
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
            font-size: 1.05rem; /* Scaled down from 1.15rem */
            font-weight: 700;
            flex-grow: 1;
            color: var(--text);
        }

        .module-desc {
            font-size: 0.85rem; /* Scaled down from 0.88rem */
            color: var(--text);
            opacity: 0.7;
            line-height: 1.4;
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
                transform: translateY(15px); /* Reduced from 30px */
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
                <div onclick="enterModule('integral.php')" class="module-link" style="cursor: pointer;">
                    <div class="module-top">
                        <div class="module-icon">∫</div>
                        <div class="module-title">Integral Studio</div>
                        <div class="arrow" style="opacity: 0.3;">→</div>
                    </div>
                    <div class="module-desc">
                        부정적분 계산 능력을 극대화하기 위한 트레이닝 모듈입니다.<br>
                        무한히 생성되는 문제와 즉각적인 피드백을 경험해보세요.
                    </div>
                </div>

                <!-- Vocabulary Studio -->
                <div onclick="enterModule('vocabulary.php')" class="module-link" style="cursor: pointer;">
                    <div class="module-top">
                        <div class="module-icon">Aa</div>
                        <div class="module-title">Vocabulary Studio</div>
                        <div class="arrow">→</div>
                    </div>
                    <div class="module-desc">
                        나만의 단어장을 만들고 체계적으로 관리하세요.<br>
                        플래시카드와 주관식 테스트로 완벽하게 암기할 수 있습니다.
                    </div>
                </div>
                <!-- Coding Test -->
                <div onclick="enterModule('coding_test.php')" class="module-link" style="cursor: pointer;">
                    <div class="module-top">
                        <div class="module-icon">💻</div>
                        <div class="module-title">Coding Test</div>
                        <div class="arrow">→</div>
                    </div>
                    <div class="module-desc">
                        파이썬 주요 알고리즘 템플릿과 예제 모음입니다.<br>
                        코딩 테스트 준비를 위한 핵심 로직을 한눈에 확인하세요.
                    </div>
                </div>
            </div>
            
            <footer class="lab-footer" style="margin-top: 20px; opacity: 0.5; font-size: 0.8rem; text-align: center;">
                © 2026 ISHS 32nd - Developed by Dohye Lee. All rights reserved.
            </footer>
        </div>
    </div>
    
    <div class="mesh-bg"></div>
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>

    <!-- Auth UI Elements (Top-Left) -->
    <div id="auth-header" style="position: fixed; top: 20px; left: 20px; z-index: 10000; display: flex; align-items: center; gap: 10px;">
        <!-- Logged Out State -->
        <button id="btn-login-open" class="btn secondary" onclick="openAuthModal()" style="padding: 8px 16px; font-size: 0.85rem; border-radius: 20px; background: rgba(255,255,255,0.7); backdrop-filter: blur(10px); color: var(--text); border: 1px solid var(--border);">로그인 / 가입</button>
        
        <!-- Logged In State (Hidden by default) -->
        <div id="user-profile" style="display: none; align-items: center; gap: 12px; background: rgba(255,255,255,0.7); backdrop-filter: blur(10px); padding: 5px 15px; border-radius: 25px; border: 1px solid var(--border);">
            <span id="user-nickname" style="font-weight: 700; font-size: 0.9rem; color: var(--text);">Nickname</span>
            <button onclick="handleLogout()" style="background: none; border: none; font-size: 1rem; color: #ea4335; cursor: pointer; padding: 0; display: flex; align-items: center; gap: 4px;" title="로그아웃">
                <span style="font-size: 0.75rem; font-weight: 600;">로그아웃</span>
                <span style="font-size: 1.1rem;">→</span>
            </button>
        </div>
    </div>

    <!-- Auth Modal -->
    <!-- Auth Modal -->
    <div id="auth-modal" class="modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 999999; align-items: center; justify-content: center;">
        <div class="modal-content" onclick="event.stopPropagation()" style="background: var(--bg); width: 95%; max-width: 380px; padding: 30px; border-radius: 20px; border: 1px solid var(--border); box-shadow: 0 25px 50px rgba(0,0,0,0.5); position: relative; pointer-events: auto;">
            <div id="modal-tab-header" style="display: flex; gap: 20px; margin-bottom: 25px; border-bottom: 2px solid var(--border); padding-bottom: 12px; position: relative; z-index: 10;">
                <h2 id="tab-login" class="auth-tab" onclick="switchTab('login')" style="cursor: pointer; font-size: 1.25rem; margin: 0; opacity: 1; transition: 0.2s; color: var(--text); font-weight: 700;">로그인</h2>
                <h2 id="tab-signup" class="auth-tab" onclick="switchTab('signup')" style="cursor: pointer; font-size: 1.25rem; margin: 0; opacity: 0.3; transition: 0.2s; color: var(--text); font-weight: 700;">회원가입</h2>
                <div style="flex-grow: 1;"></div>
                <span onclick="closeAuthModal()" style="cursor: pointer; opacity: 0.6; font-size: 1.6rem; line-height: 1;">×</span>
            </div>

            <!-- Login Form -->
            <div id="form-login-container" style="display: block;">
                <form id="form-login" onsubmit="event.preventDefault(); submitLogin();" style="display: flex; flex-direction: column; gap: 12px;">
                    <input type="text" id="login-nickname" placeholder="닉네임" required style="width: 100%; padding: 14px; border-radius: 10px; border: 1px solid var(--border); background: var(--surface); color: var(--text); box-sizing: border-box; font-size: 1rem; position: relative; z-index: 20; pointer-events: auto;">
                    <input type="password" id="login-password" placeholder="비밀번호" required style="width: 100%; padding: 14px; border-radius: 10px; border: 1px solid var(--border); background: var(--surface); color: var(--text); box-sizing: border-box; font-size: 1rem; position: relative; z-index: 20; pointer-events: auto;">
                    <button type="submit" class="btn primary" style="width: 100%; padding: 14px; border-radius: 10px; margin-top: 5px; cursor: pointer; font-weight: 600; font-size: 1rem; position: relative; z-index: 20;">로그인</button>
                </form>
            </div>

            <!-- Signup Form (Hidden) -->
            <div id="form-signup-container" style="display: none;">
                <form id="form-signup" onsubmit="event.preventDefault(); submitSignup();" style="display: flex; flex-direction: column; gap: 10px;">
                    <div style="background: rgba(234, 67, 53, 0.1); padding: 12px; border-radius: 10px; font-size: 0.8rem; color: #ea4335; margin-bottom: 5px; line-height: 1.4; border-left: 4px solid #ea4335;">
                        학번 조회를 위해 리로스쿨 계정이 필요합니다.
                    </div>
                    <input type="text" id="signup-riro-id" placeholder="리로스쿨 ID" required style="width: 100%; padding: 12px; border-radius: 10px; border: 1px solid var(--border); background: var(--surface); color: var(--text); box-sizing: border-box; font-size: 0.95rem; position: relative; z-index: 20; pointer-events: auto;">
                    <input type="password" id="signup-riro-pw" placeholder="리로스쿨 PW" required style="width: 100%; padding: 12px; border-radius: 10px; border: 1px solid var(--border); background: var(--surface); color: var(--text); box-sizing: border-box; font-size: 0.95rem; position: relative; z-index: 20; pointer-events: auto;">
                    <div style="height: 1px; background: var(--border); margin: 5px 0;"></div>
                    <input type="text" id="signup-nickname" placeholder="사용할 닉네임" required style="width: 100%; padding: 12px; border-radius: 10px; border: 1px solid var(--border); background: var(--surface); color: var(--text); box-sizing: border-box; font-size: 0.95rem; position: relative; z-index: 20; pointer-events: auto;">
                    <input type="password" id="signup-password" placeholder="사용할 비밀번호" required style="width: 100%; padding: 12px; border-radius: 10px; border: 1px solid var(--border); background: var(--surface); color: var(--text); box-sizing: border-box; font-size: 0.95rem; position: relative; z-index: 20; pointer-events: auto;">
                    <button type="submit" class="btn primary" style="width: 100%; padding: 14px; border-radius: 10px; margin-top: 5px; background: #34a853; border: none; color: white; cursor: pointer; font-weight: 600; font-size: 1rem; position: relative; z-index: 20;">인증 및 가입하기</button>
                </form>
            </div>
        </div>
    </div>

    <!-- Theme Toggle and Scripts -->
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
        // --- Authentication System Logic ---
        const AUTH_API = 'api/user_system.php';

        function openAuthModal() {
            document.getElementById('auth-modal').style.display = 'flex';
        }
        function closeAuthModal() {
            document.getElementById('auth-modal').style.display = 'none';
        }
        function switchTab(tab) {
            const isLogin = tab === 'login';
            document.getElementById('tab-login').style.opacity = isLogin ? '1' : '0.3';
            document.getElementById('tab-signup').style.opacity = isLogin ? '0.3' : '1';
            
            const loginSection = document.getElementById('form-login-container');
            const signupSection = document.getElementById('form-signup-container');
            
            if (isLogin) {
                loginSection.style.display = 'block';
                signupSection.style.display = 'none';
                document.getElementById('login-nickname').focus();
            } else {
                loginSection.style.display = 'none';
                signupSection.style.display = 'block';
                document.getElementById('signup-riro-id').focus();
            }
        }

        let isUserLoggedIn = false;

        async function updateAuthUI() {
            try {
                const res = await fetch(`${AUTH_API}?action=status`);
                const data = await res.json();
                if (data.logged_in) {
                    isUserLoggedIn = true;
                    document.getElementById('btn-login-open').style.display = 'none';
                    document.getElementById('user-profile').style.display = 'flex';
                    document.getElementById('user-nickname').textContent = data.user.nickname;
                } else {
                    isUserLoggedIn = false;
                    document.getElementById('btn-login-open').style.display = 'block';
                    document.getElementById('user-profile').style.display = 'none';
                }
            } catch (e) { console.error("Auth status error:", e); }
        }

        function enterModule(url) {
            if (isUserLoggedIn) {
                location.href = url;
            } else {
                alert("이 모듈을 이용하려면 로그인이 필요합니다.");
                openAuthModal();
            }
        }

        async function submitLogin() {
            const nickname = document.getElementById('login-nickname').value;
            const password = document.getElementById('login-password').value;
            try {
                const res = await fetch(`${AUTH_API}?action=login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nickname, password })
                });
                const data = await res.json();
                if (data.status === 'success') {
                    closeAuthModal();
                    updateAuthUI();
                } else {
                    alert(data.message);
                }
            } catch (e) {
                console.error(e);
                alert("로그인 중 오류가 발생했습니다. 서버 상태를 확인해주세요.");
            }
        }

        async function submitSignup() {
            const riro_id = document.getElementById('signup-riro-id').value;
            const riro_pw = document.getElementById('signup-riro-pw').value;
            const nickname = document.getElementById('signup-nickname').value;
            const password = document.getElementById('signup-password').value;
            
            const signBtn = document.querySelector('#form-signup button');
            const originalText = signBtn ? signBtn.textContent : '';
            if(signBtn) {
                signBtn.textContent = '인증 및 가입 중...';
                signBtn.disabled = true;
            }

            try {
                const res = await fetch(`${AUTH_API}?action=signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ riro_id, riro_pw, nickname, password })
                });
                const data = await res.json();
                if (data.status === 'success') {
                    alert("회원가입과 인증이 완료되었습니다! 환영합니다.");
                    // Auto login after signup
                    await submitLoginDirect(nickname, password);
                } else if (data.status === 'special_exception') {
                    alert("죄송합니다. 인천과학고등학교 재학생이 아니므로 회원가입을 마칠 수 없습니다.");
                    alert("하지만... 당신은 이도혜에게 간택되었으므로 회원가입이 성공적으로 완료되었습니다");
                    await submitLoginDirect(nickname, password);
                } else {
                    alert(data.message);
                }
            } catch (e) {
                console.error(e);
                alert("가입 중 오류가 발생했습니다. 입력 정보를 확인하거나 잠시 후 다시 시도해주세요.");
            } finally {
                if(signBtn) {
                    signBtn.textContent = originalText;
                    signBtn.disabled = false;
                }
            }
        }

        async function submitLoginDirect(nickname, password) {
            const res = await fetch(`${AUTH_API}?action=login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nickname, password })
            });
            const data = await res.json();
            if (data.status === 'success') {
                closeAuthModal();
                updateAuthUI();
            }
        }

        async function handleLogout() {
            await fetch(`${AUTH_API}?action=logout`, { method: 'POST' });
            location.reload();
        }

        // Initialize UI
        document.addEventListener('DOMContentLoaded', () => {
            updateAuthUI();
            
            // Check for login_required message from URL
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('msg') === 'login_required') {
                setTimeout(() => {
                    alert("이 서비스를 이용하려면 먼저 로그인해주세요.");
                    openAuthModal();
                }, 500);
            }
        });

        // Global Theme Toggle Script (Preserved)
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
