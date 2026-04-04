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
            gap: 24px;
            height: 100%;
            width: 100%;
            padding: 20px;
            min-width: 400px;
        }

        .practice-card {
            flex: 1;
            background: var(--surface);
            border-radius: 20px;
            padding: 32px;
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
            font-size: 3rem;
            margin-bottom: 16px;
        }

        .practice-title {
            font-size: 1.8rem;
            font-weight: 700;
            margin-bottom: 12px;
            color: var(--text);
        }

        .practice-desc {
            font-size: 1rem;
            color: var(--text-secondary);
            line-height: 1.6;
        }

        .practice-start-btn {
            width: 100%;
            margin-top: 24px;
        }

        /* Make landing-right fill available space */
        .landing-right {
            flex: 1.2;
            min-height: 400px;
            min-width: 320px;
            display: block !important;
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
    </style>

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
                            <!-- Placeholder for Wordbook Selection -->
                            <button id="btn-toggle-collection" class="btn secondary" onclick="openWordbookModal()" style="width: 100%; display: flex; justify-content: space-between; align-items: center;">
                                <span id="current-collection-name">단어장 선택 (Select Wordbook)</span>
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
                                    <input type="checkbox" id="chk-tts" checked>
                                    <span>TTS 발음 듣기 (Auto TTS)</span>
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
                                <p class="practice-desc">플래시카드와 주관식 테스트로<br>단어를 완벽하게 암기하세요.</p>
                            </div>
                            <button class="start-btn practice-start-btn" onclick="alert('단어 연습 기능은 현재 준비 중입니다.')">Start Word Practice</button>
                        </div>
                        
                        <!-- 문장 연습 카드 -->
                        <div class="practice-card sentence-card">
                            <div class="practice-card-content">
                                <div class="practice-icon">💬</div>
                                <h2 class="practice-title">문장 연습</h2>
                                <p class="practice-desc">문맥 속에서 단어를 활용하며<br>실전 영어 감각을 키우세요.</p>
                            </div>
                            <button class="start-btn practice-start-btn" onclick="alert('문장 연습 기능은 현재 준비 중입니다.')">Start Sentence Practice</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="footer">
            © 2026 ISHS 32nd - Developed by Dohye Lee. All rights reserved.
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

    <script>
        // Wordbook Modal Function (placeholder)
        function openWordbookModal() {
            alert('단어장 선택 기능은 현재 준비 중입니다.');
        }

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
