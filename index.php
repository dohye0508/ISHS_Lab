<?php
// Root index - ISHS LAB
$year = date('Y');
?><!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ISHS LAB</title>
    <link rel="icon" type="image/jpeg" href="assets/images/inticon.jpg">
    <meta property="og:image" content="assets/images/int.jpg">
    <link rel="stylesheet" href="assets/css/style.css?v=<?php echo time(); ?>">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
        rel="stylesheet">
    <script>
        (function () {
            var theme = localStorage.getItem('theme') || 'light';
            document.documentElement.setAttribute('data-theme', theme);
        })();
    </script>
    <style>
        :root {
            --bg: #f8f9fc;
            --text: #111827;
            --primary: #1a73e8;
            --primary-rgb: 26, 115, 232;
            --surface: #ffffff;
            --surface-rgb: 255, 255, 255;
            --border: #e5e7eb;
            --dday-color: #ef4444;
            --muted: #6b7280;
        }

        [data-theme="dark"] {
            --bg: #0a0a0f;
            --text: #e2e8f0;
            --primary: #60a5fa;
            --primary-rgb: 96, 165, 250;
            --surface: #13151c;
            --surface-rgb: 19, 21, 28;
            --border: #1f2535;
            --dday-color: #f87171;
            --muted: #9ca3af;
        }

        *,
        *::before,
        *::after {
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', 'Pretendard', sans-serif;
            background: var(--bg);
            color: var(--text);
            margin: 0;
            min-height: 100vh;
            overflow-x: hidden;
            transition: background 0.3s, color 0.3s;
        }

        .mesh-bg {
            position: fixed;
            inset: 0;
            z-index: -2;
            background: var(--bg);
        }

        .mesh-bg::before {
            content: '';
            position: absolute;
            inset: 0;
            background:
                radial-gradient(ellipse 60% 50% at 10% 0%, rgba(139, 92, 246, 0.12) 0%, transparent 60%),
                radial-gradient(ellipse 50% 40% at 90% 0%, rgba(236, 72, 153, 0.08) 0%, transparent 60%),
                radial-gradient(ellipse 40% 50% at 50% 100%, rgba(26, 115, 232, 0.07) 0%, transparent 60%);
        }

        [data-theme="dark"] .mesh-bg::before {
            background:
                radial-gradient(ellipse 60% 50% at 10% 0%, rgba(139, 92, 246, 0.08) 0%, transparent 60%),
                radial-gradient(ellipse 50% 40% at 90% 0%, rgba(236, 72, 153, 0.06) 0%, transparent 60%),
                radial-gradient(ellipse 40% 50% at 50% 100%, rgba(26, 115, 232, 0.06) 0%, transparent 60%);
        }

        .ishs-text {
            background: linear-gradient(135deg, #7c3aed 0%, #c026d3 50%, #e11d48 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .lab-text {
            font-weight: 300;
            color: var(--primary);
            -webkit-text-fill-color: var(--primary);
        }

        /* ---------------- Top Nav ---------------- */
        .topnav {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 14px 24px;
            background: rgba(var(--surface-rgb), 0.72);
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
            border-bottom: 1px solid var(--border);
        }

        .topnav-brand {
            font-size: 1.15rem;
            font-weight: 900;
            letter-spacing: -0.5px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .topnav-actions {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .dday-pill {
            padding: 6px 14px;
            border-radius: 99px;
            font-size: 0.8rem;
            font-weight: 800;
            color: var(--dday-color);
            background: color-mix(in srgb, var(--dday-color) 12%, transparent);
            white-space: nowrap;
        }

        .nav-btn {
            padding: 8px 16px;
            font-size: 0.85rem;
            border-radius: 99px;
            background: var(--surface);
            color: var(--text);
            border: 1px solid var(--border);
            cursor: pointer;
            font-weight: 700;
            font-family: inherit;
            transition: border-color 0.2s, transform 0.2s;
        }

        .nav-btn:hover {
            border-color: var(--primary);
            transform: translateY(-1px);
        }

        .user-pill {
            display: none;
            align-items: center;
            gap: 12px;
            background: var(--surface);
            padding: 6px 8px 6px 16px;
            border-radius: 99px;
            border: 1px solid var(--border);
        }

        .user-pill span.nickname {
            font-weight: 700;
            font-size: 0.85rem;
        }

        .user-pill button {
            background: none;
            border: none;
            color: #ea4335;
            cursor: pointer;
            padding: 6px 10px;
            border-radius: 99px;
            display: flex;
            align-items: center;
            gap: 3px;
            font-family: inherit;
            font-size: 0.78rem;
            font-weight: 700;
            transition: background 0.2s;
        }

        .user-pill button:hover {
            background: rgba(234, 67, 53, 0.1);
        }

        .theme-toggle-btn {
            background: transparent;
            border: 1px solid var(--border);
            color: var(--text);
            cursor: pointer;
            padding: 8px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.3s, transform 0.2s;
        }

        .theme-toggle-btn:hover {
            background-color: rgba(var(--primary-rgb), 0.1);
            transform: rotate(15deg);
        }

        .sun-icon,
        .moon-icon {
            display: none !important;
        }

        html:not([data-theme="dark"]) .sun-icon {
            display: block !important;
        }

        html[data-theme="dark"] .moon-icon {
            display: block !important;
        }

        @media (max-width: 640px) {
            .dday-pill {
                display: none;
            }

            .topnav-brand {
                font-size: 1rem;
            }
        }

        /* ---------------- Page ---------------- */
        .page-wrap {
            width: 100%;
            max-width: 980px;
            margin: 0 auto;
            padding: 118px 24px 60px;
        }

        .hero {
            text-align: center;
            margin-bottom: 56px;
            animation: fadeUp 0.7s cubic-bezier(0.2, 1, 0.3, 1) both;
        }

        .hero-badge {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            padding: 5px 16px;
            border-radius: 99px;
            font-size: 0.78rem;
            font-weight: 700;
            letter-spacing: 0.04em;
            background: rgba(var(--primary-rgb), 0.1);
            color: var(--primary);
            border: 1px solid rgba(var(--primary-rgb), 0.2);
            margin-bottom: 22px;
        }

        .hero-badge .dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: var(--primary);
            animation: blink 2s infinite;
        }

        @keyframes blink {

            0%,
            100% {
                opacity: 1;
            }

            50% {
                opacity: 0.2;
            }
        }

        .hero h1 {
            font-size: clamp(3rem, 8.5vw, 5.5rem);
            font-weight: 900;
            line-height: 1;
            margin: 0 0 18px;
            letter-spacing: -3px;
        }

        .hero p {
            font-size: 1rem;
            color: var(--muted);
            margin: 0 auto;
            max-width: 400px;
            line-height: 1.65;
        }

        /* ---------------- App categories ---------------- */
        .app-category {
            margin-bottom: 40px;
            animation: fadeUp 0.55s cubic-bezier(0.2, 1, 0.3, 1) both;
        }

        .category-head {
            display: flex;
            align-items: baseline;
            gap: 10px;
            margin: 0 0 16px 4px;
        }

        .category-label {
            font-size: 0.78rem;
            font-weight: 800;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: var(--muted);
            margin: 0;
        }

        .category-count {
            font-size: 0.72rem;
            color: var(--muted);
            opacity: 0.6;
        }

        .modules-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
        }

        @media (max-width: 600px) {
            .modules-grid {
                grid-template-columns: 1fr;
            }

            .page-wrap {
                padding-top: 96px;
            }
        }

        /* Card */
        .module-card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 20px;
            padding: 24px 22px;
            cursor: pointer;
            transition: transform 0.25s cubic-bezier(0.2, 1, 0.3, 1), box-shadow 0.25s, border-color 0.25s;
            position: relative;
            overflow: hidden;
        }

        [data-theme="dark"] .module-card {
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
        }

        .module-card::after {
            content: '';
            position: absolute;
            inset: 0;
            opacity: 0;
            transition: opacity 0.3s;
            border-radius: 20px;
            pointer-events: none;
        }

        .module-card:hover {
            transform: translateY(-4px);
        }

        .module-card:hover::after {
            opacity: 1;
        }

        .card-icon {
            width: 46px;
            height: 46px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.35rem;
            font-weight: 700;
            margin-bottom: 14px;
            transition: transform 0.25s;
        }

        .module-card:hover .card-icon {
            transform: scale(1.1) rotate(-4deg);
        }

        .card-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 8px;
        }

        .card-name {
            font-size: 1.05rem;
            font-weight: 800;
            letter-spacing: -0.3px;
            color: var(--text);
        }

        .card-arr {
            font-size: 1.05rem;
            transition: transform 0.25s;
            opacity: 0.35;
        }

        .module-card:hover .card-arr {
            transform: translateX(5px);
            opacity: 1;
        }

        .card-desc {
            font-size: 0.84rem;
            color: var(--muted);
            line-height: 1.55;
        }

        .card-badge {
            display: inline-block;
            font-size: 0.65rem;
            font-weight: 800;
            padding: 2px 8px;
            border-radius: 99px;
            margin-left: 8px;
            vertical-align: middle;
            letter-spacing: 0.02em;
        }

        .card-badge.new {
            background: rgba(22, 163, 74, 0.14);
            color: #16a34a;
        }

        /* Color themes */
        .card-blue .card-icon { background: rgba(26, 115, 232, 0.1); color: #1a73e8; }
        .card-blue .card-arr { color: #1a73e8; }
        .card-blue::after { background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(26, 115, 232, 0.06) 0%, transparent 100%); }
        .card-blue:hover { border-color: rgba(26, 115, 232, 0.4); box-shadow: 0 16px 40px rgba(26, 115, 232, 0.09); }
        [data-theme="dark"] .card-blue:hover { box-shadow: 0 20px 50px rgba(26, 115, 232, 0.16); }

        .card-red .card-icon { background: rgba(234, 67, 53, 0.1); color: #ea4335; }
        .card-red .card-arr { color: #ea4335; }
        .card-red::after { background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(234, 67, 53, 0.06) 0%, transparent 100%); }
        .card-red:hover { border-color: rgba(234, 67, 53, 0.4); box-shadow: 0 16px 40px rgba(234, 67, 53, 0.09); }
        [data-theme="dark"] .card-red:hover { box-shadow: 0 20px 50px rgba(234, 67, 53, 0.16); }

        .card-green .card-icon { background: rgba(22, 163, 74, 0.1); color: #16a34a; }
        .card-green .card-arr { color: #16a34a; }
        .card-green::after { background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(22, 163, 74, 0.06) 0%, transparent 100%); }
        .card-green:hover { border-color: rgba(22, 163, 74, 0.4); box-shadow: 0 16px 40px rgba(22, 163, 74, 0.09); }
        [data-theme="dark"] .card-green:hover { box-shadow: 0 20px 50px rgba(22, 163, 74, 0.16); }

        .card-indigo .card-icon { background: rgba(99, 102, 241, 0.1); color: #6366f1; }
        .card-indigo .card-arr { color: #6366f1; }
        .card-indigo::after { background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99, 102, 241, 0.06) 0%, transparent 100%); }
        .card-indigo:hover { border-color: rgba(99, 102, 241, 0.4); box-shadow: 0 16px 40px rgba(99, 102, 241, 0.09); }
        [data-theme="dark"] .card-indigo:hover { box-shadow: 0 20px 50px rgba(99, 102, 241, 0.16); }

        /* Coming-soon (disabled) card */
        .module-card.card-soon {
            cursor: default;
            border-style: dashed;
            opacity: 0.6;
        }

        .module-card.card-soon:hover {
            transform: none;
        }

        .module-card.card-soon .card-icon {
            background: rgba(var(--primary-rgb), 0.08);
            color: var(--muted);
        }

        .module-card.card-soon:hover .card-icon {
            transform: none;
        }

        .soon-badge {
            font-size: 0.65rem;
            font-weight: 800;
            padding: 2px 9px;
            border-radius: 99px;
            background: var(--border);
            color: var(--muted);
            letter-spacing: 0.02em;
        }

        /* ---------------- Footer ---------------- */
        .site-footer {
            text-align: center;
            font-size: 0.78rem;
            color: var(--muted);
            opacity: 0.55;
            padding: 20px 0 40px;
            animation: fadeUp 0.55s cubic-bezier(0.2, 1, 0.3, 1) 0.5s both;
        }

        @keyframes fadeUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .app-category:nth-of-type(1) { animation-delay: 0.12s; }
        .app-category:nth-of-type(2) { animation-delay: 0.2s; }
        .app-category:nth-of-type(3) { animation-delay: 0.28s; }
    </style>
</head>

<body>
    <div class="mesh-bg"></div>

    <nav class="topnav">
        <div class="topnav-brand"><span class="ishs-text">ISHS</span><span class="lab-text">&nbsp;LAB</span></div>
        <div class="topnav-actions">
            <span id="dday-counter" class="dday-pill"></span>
            <button id="btn-login-open" class="nav-btn" onclick="openAuthModal()">로그인 / 가입</button>
            <div id="user-profile" class="user-pill">
                <span id="user-nickname" class="nickname">-</span>
                <button onclick="handleLogout()" title="로그아웃">
                    <span>로그아웃</span>
                    <span>&rarr;</span>
                </button>
            </div>
            <button id="theme-toggle" class="theme-toggle-btn" aria-label="Toggle Dark Mode">
                <svg class="sun-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
                <svg class="moon-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
            </button>
        </div>
    </nav>

    <div class="page-wrap">
        <section class="hero">
            <div class="hero-badge"><span class="dot"></span> ISHS 32nd &middot; 인천과학고등학교</div>
            <h1><span class="ishs-text">ISHS</span><span class="lab-text"> LAB</span></h1>
            <p>자기주도 학습을 위한 실험 공간.<br>모듈을 선택해 지금 바로 시작하세요.</p>
        </section>

        <section class="app-category">
            <div class="category-head">
                <h2 class="category-label">수학 &middot; Math</h2>
                <span class="category-count">2</span>
            </div>
            <div class="modules-grid">
                <div class="module-card card-blue" onclick="enterModule('integral.php')">
                    <div class="card-icon">&int;</div>
                    <div class="card-row">
                        <div class="card-name">Integral Studio</div>
                        <span class="card-arr">&rarr;</span>
                    </div>
                    <div class="card-desc">부정적분 트레이닝 모듈. 무한 생성 문제와 즉각 피드백으로 실력을 극대화하세요.</div>
                </div>

                <div class="module-card card-indigo" onclick="enterModule('adv_math.php')">
                    <div class="card-icon">&Sigma;</div>
                    <div class="card-row">
                        <div class="card-name">Advanced Math Studio<span class="card-badge new">NEW</span></div>
                        <span class="card-arr">&rarr;</span>
                    </div>
                    <div class="card-desc">쌍곡선함수·역함수 미적분부터 행렬과 연립일차방정식까지, 고급수학 심화 트레이닝.</div>
                </div>
            </div>
        </section>

        <section class="app-category">
            <div class="category-head">
                <h2 class="category-label">어학 &middot; Language</h2>
                <span class="category-count">1</span>
            </div>
            <div class="modules-grid">
                <div class="module-card card-red" onclick="enterModule('vocabulary.php')">
                    <div class="card-icon">Aa</div>
                    <div class="card-row">
                        <div class="card-name">Vocabulary Studio</div>
                        <span class="card-arr">&rarr;</span>
                    </div>
                    <div class="card-desc">나만의 단어장 관리 &amp; 플래시카드 테스트로 영어 어휘를 체계적으로 암기하세요.</div>
                </div>
            </div>
        </section>

        <section class="app-category">
            <div class="category-head">
                <h2 class="category-label">개발 &middot; Development</h2>
                <span class="category-count">2</span>
            </div>
            <div class="modules-grid">
                <div class="module-card card-green" onclick="enterModule('coding_test.php')">
                    <div class="card-icon">&#128187;</div>
                    <div class="card-row">
                        <div class="card-name">Coding Test</div>
                        <span class="card-arr">&rarr;</span>
                    </div>
                    <div class="card-desc">파이썬 알고리즘 템플릿 &amp; 예제 모음. 코딩 테스트 핵심 로직을 한눈에 확인하세요.</div>
                </div>

                <div class="module-card card-soon" title="준비 중입니다">
                    <div class="card-icon">&#9881;&#65039;</div>
                    <div class="card-row">
                        <div class="card-name">Compiler Studio</div>
                        <span class="soon-badge">준비중</span>
                    </div>
                    <div class="card-desc">브라우저에서 바로 실행하는 C/C++ 컴파일 플랫폼. 곧 만나보실 수 있습니다.</div>
                </div>
            </div>
        </section>

        <footer class="site-footer">&copy; <?= $year ?> ISHS 32nd — Developed by Dohye Lee. All rights reserved.
        </footer>
    </div>

    <!-- Auth Modal -->
    <div id="auth-modal"
        style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.65);z-index:999999;align-items:center;justify-content:center;backdrop-filter:blur(6px);">
        <div onclick="event.stopPropagation()"
            style="background:var(--bg);width:95%;max-width:380px;padding:32px;border-radius:24px;border:1px solid var(--border);box-shadow:0 30px 60px rgba(0,0,0,0.35);">
            <div
                style="display:flex;gap:20px;margin-bottom:24px;border-bottom:2px solid var(--border);padding-bottom:12px;">
                <h2 id="tab-login" onclick="switchTab('login')"
                    style="cursor:pointer;font-size:1.1rem;margin:0;font-weight:800;color:var(--text);opacity:1;transition:opacity 0.2s;">
                    로그인</h2>
                <h2 id="tab-signup" onclick="switchTab('signup')"
                    style="cursor:pointer;font-size:1.1rem;margin:0;font-weight:800;color:var(--text);opacity:0.3;transition:opacity 0.2s;">
                    회원가입</h2>
                <span onclick="closeAuthModal()"
                    style="cursor:pointer;opacity:0.5;font-size:1.6rem;line-height:1;align-self:center;margin-left:auto;">&times;</span>
            </div>
            <div id="form-login-container" style="display:block;">
                <form onsubmit="event.preventDefault();submitLogin();"
                    style="display:flex;flex-direction:column;gap:12px;">
                    <input type="text" id="login-nickname" placeholder="닉네임" required
                        style="width:100%;padding:13px 14px;border-radius:12px;border:1px solid var(--border);background:var(--surface);color:var(--text);box-sizing:border-box;font-size:0.95rem;font-family:inherit;">
                    <input type="password" id="login-password" placeholder="비밀번호" required
                        style="width:100%;padding:13px 14px;border-radius:12px;border:1px solid var(--border);background:var(--surface);color:var(--text);box-sizing:border-box;font-size:0.95rem;font-family:inherit;">
                    <button type="submit"
                        style="width:100%;padding:14px;border-radius:12px;background:var(--primary);color:white;border:none;cursor:pointer;font-weight:700;font-size:1rem;font-family:inherit;">로그인</button>
                </form>
            </div>
            <div id="form-signup-container" style="display:none;">
                <form onsubmit="event.preventDefault();submitSignup();"
                    style="display:flex;flex-direction:column;gap:10px;">
                    <div
                        style="background:rgba(234,67,53,0.1);padding:12px;border-radius:10px;font-size:0.8rem;color:#ea4335;border-left:4px solid #ea4335;line-height:1.4;">
                        학번 조회를 위해 리로스쿨 계정이 필요합니다.</div>
                    <input type="text" id="signup-riro-id" placeholder="리로스쿨 ID" required
                        style="width:100%;padding:12px 14px;border-radius:12px;border:1px solid var(--border);background:var(--surface);color:var(--text);box-sizing:border-box;font-size:0.95rem;font-family:inherit;">
                    <input type="password" id="signup-riro-pw" placeholder="리로스쿨 PW" required
                        style="width:100%;padding:12px 14px;border-radius:12px;border:1px solid var(--border);background:var(--surface);color:var(--text);box-sizing:border-box;font-size:0.95rem;font-family:inherit;">
                    <div style="height:1px;background:var(--border);margin:3px 0;"></div>
                    <input type="text" id="signup-nickname" placeholder="사용할 닉네임" required
                        style="width:100%;padding:12px 14px;border-radius:12px;border:1px solid var(--border);background:var(--surface);color:var(--text);box-sizing:border-box;font-size:0.95rem;font-family:inherit;">
                    <input type="password" id="signup-password" placeholder="사용할 비밀번호" required
                        style="width:100%;padding:12px 14px;border-radius:12px;border:1px solid var(--border);background:var(--surface);color:var(--text);box-sizing:border-box;font-size:0.95rem;font-family:inherit;">
                    <button type="submit"
                        style="width:100%;padding:14px;border-radius:12px;background:#16a34a;color:white;border:none;cursor:pointer;font-weight:700;font-size:1rem;font-family:inherit;">인증
                        및 가입하기</button>
                </form>
            </div>
        </div>
    </div>

    <script>
        const AUTH_API = 'api/user_system.php';
        let isUserLoggedIn = false;

        function openAuthModal() { document.getElementById('auth-modal').style.display = 'flex'; }
        function closeAuthModal() { document.getElementById('auth-modal').style.display = 'none'; }
        function switchTab(tab) {
            const isLogin = tab === 'login';
            document.getElementById('tab-login').style.opacity = isLogin ? '1' : '0.3';
            document.getElementById('tab-signup').style.opacity = isLogin ? '0.3' : '1';
            document.getElementById('form-login-container').style.display = isLogin ? 'block' : 'none';
            document.getElementById('form-signup-container').style.display = isLogin ? 'none' : 'block';
        }
        async function updateAuthUI() {
            try {
                const res = await fetch(AUTH_API + '?action=status');
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
            } catch (e) { console.error(e); }
        }
        function enterModule(url) {
            if (isUserLoggedIn) { location.href = url; }
            else { alert('이 모듈을 이용하려면 로그인이 필요합니다.'); openAuthModal(); }
        }
        async function submitLogin() {
            const nickname = document.getElementById('login-nickname').value;
            const password = document.getElementById('login-password').value;
            const res = await fetch(AUTH_API + '?action=login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nickname, password }) });
            const data = await res.json();
            if (data.status === 'success') { closeAuthModal(); updateAuthUI(); }
            else alert(data.message);
        }
        async function submitSignup() {
            const riro_id = document.getElementById('signup-riro-id').value;
            const riro_pw = document.getElementById('signup-riro-pw').value;
            const nickname = document.getElementById('signup-nickname').value;
            const password = document.getElementById('signup-password').value;
            const btn = document.querySelector('#form-signup-container button');
            if (btn) { btn.textContent = '인증 중...'; btn.disabled = true; }
            const res = await fetch(AUTH_API + '?action=signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ riro_id, riro_pw, nickname, password }) });
            const data = await res.json();
            if (btn) { btn.textContent = '인증 및 가입하기'; btn.disabled = false; }
            if (data.status === 'success') {
                alert('회원가입 완료! 환영합니다.');
                const r = await fetch(AUTH_API + '?action=login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nickname, password }) });
                const d = await r.json();
                if (d.status === 'success') { closeAuthModal(); updateAuthUI(); }
            } else alert(data.message);
        }
        async function handleLogout() {
            await fetch(AUTH_API + '?action=logout', { method: 'POST' });
            location.reload();
        }
        document.addEventListener('DOMContentLoaded', () => {
            updateAuthUI();
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('msg') === 'login_required') {
                setTimeout(() => { alert('이 서비스를 이용하려면 먼저 로그인해주세요.'); openAuthModal(); }, 500);
            }
            if (window.location.hash === '#signup') {
                setTimeout(() => { openAuthModal(); switchTab('signup'); }, 300);
            }
            const updateDday = () => {
                const today = new Date();
                const d0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                let target = new Date(d0.getFullYear(), 9, 13);
                if (d0 > target) target.setFullYear(d0.getFullYear() + 1);
                const diff = Math.ceil((target - d0) / 86400000);
                const el = document.getElementById('dday-counter');
                if (el) el.innerText = diff === 0 ? '중간고사까지 D-Day' : '중간고사까지 D-' + diff;
            };
            updateDday();
        });
        document.getElementById('theme-toggle').addEventListener('click', () => {
            const cur = document.documentElement.getAttribute('data-theme');
            const next = cur === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
        });
    </script>
</body>

</html>
