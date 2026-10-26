<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: auth.php?msg=login_required&redirect=adv_math.php");
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

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css">
    <link rel="stylesheet" href="assets/css/style.css?v=lab_final_v7">
    <script src="https://unpkg.com/mathlive"></script>
    <script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>

    <style>
        /* ISHS LAB 공통 톤 — Advanced Math Studio는 바이올렛(핑크+블루) */
        :root{
            --primary:#7C3AED;
            --primary-rgb:124,58,237;
            --mesh-a:rgba(244,114,182,.20);
            --mesh-a2:rgba(244,114,182,.17);
            --mesh-b:rgba(96,165,250,.20);
            --mesh-b2:rgba(96,165,250,.17);
            --mesh-c:rgba(94,234,212,.09);
        }
        html[data-theme="dark"]{
            --primary:#A78BFA;
            --primary-rgb:167,139,250;
            --mesh-a:rgba(244,114,182,.24);
            --mesh-a2:rgba(244,114,182,.21);
            --mesh-b:rgba(96,165,250,.24);
            --mesh-b2:rgba(96,165,250,.21);
            --mesh-c:rgba(94,234,212,.12);
        }
        body{
            justify-content: flex-start;
            background-image:
                radial-gradient(ellipse 70% 62% at 10% 8%, var(--mesh-a) 0%, transparent 72%),
                radial-gradient(ellipse 65% 58% at 88% 14%, var(--mesh-b) 0%, transparent 72%),
                radial-gradient(ellipse 85% 75% at 50% 46%, var(--mesh-c) 0%, transparent 78%),
                radial-gradient(ellipse 68% 60% at 14% 90%, var(--mesh-a2) 0%, transparent 72%),
                radial-gradient(ellipse 68% 62% at 90% 86%, var(--mesh-b2) 0%, transparent 72%);
            background-repeat:no-repeat;
            background-attachment:fixed;
        }
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
        .collection-card--polar .problem-preview {
            white-space: normal;
            overflow-wrap: anywhere;
            -webkit-mask-image: none;
            mask-image: none;
        }
        .polar-session #math-input {
            box-sizing: border-box;
            max-width: 100%;
        }
        .problem-explanation {
            margin-top: 12px;
            line-height: 1.8;
        }
        .problem-explanation summary {
            cursor: pointer;
            font-weight: 600;
            margin-bottom: 12px;
        }
        .problem-explanation .problem-statement-text {
            font-size: 1rem;
            line-height: 1.85;
        }
        @media (max-width: 600px) {
            #proof-view .brand { order: 3; flex-basis: 100%; }
            #proof-view #proof-chapter-title { word-break: keep-all; }
            .polar-session .problem-statement-text,
            #proof-view .problem-statement-text {
                font-size: 1.05rem;
                line-height: 1.9;
                word-break: keep-all;
                overflow-wrap: break-word;
            }
            .polar-session #slogan-text { display: none; }
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
        /* 중간고사/기말고사 -- 과목 탭 위의 한 단계 위 탭. 과목 탭과 같은 색·테두리에
           글자만 더 크고 굵게 해서 위계를 보이고, 좁은 화면에서는 두 버튼이 반반씩 차지한다. */
        .studio-page #collection-modal .exam-tabs {
            display: flex;
            gap: 8px;
            padding: 16px var(--collection-gutter) 0;
            flex-shrink: 0;
        }
        .exam-tab {
            flex: 0 0 auto;
            padding: 10px 22px;
            border-radius: 9px;
            border: 1px solid var(--border);
            background: var(--surface);
            color: var(--text);
            font-weight: 800;
            font-size: 1.02rem;
            cursor: pointer;
            transition: all 0.15s ease;
        }
        .exam-tab.active {
            background: var(--primary);
            color: #fff;
            border-color: var(--primary);
        }
        @media (max-width: 590px) {
            .exam-tab { flex: 1 1 0; }
        }

        /* 증명 감상 (Proof Gallery) -- #proof-view reuses the exact same visual language
           as the real quiz's #app-view (.header/.badges/.action-bar, and the same
           .problem-statement-text/.problem-statement-formula split used for word
           problems), just with its own #proof-problem-area box (a real quiz #problem-area
           can't be reused directly -- IDs must stay unique while both views exist in the
           DOM) and no math-input/give-up/finish at all, since there is nothing to answer. */
        #proof-problem-area {
            font-size: 2rem;
            text-align: center;
            min-height: 150px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin-bottom: 30px;
            background: #ffffff;
            padding: 0 20px;
            box-sizing: border-box;
            overflow-x: auto;
            max-width: 100%;
            font-family: 'KoPubWorld Dotum Pro', 'Pretendard', system-ui, -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
            font-weight: 500;
        }
        [data-theme="dark"] #proof-problem-area {
            background-color: transparent;
        }
        #proof-view .proof-navigation {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            gap: 10px;
        }
        #proof-btn-prev { justify-self: start; }
        #proof-btn-explanation { grid-column: 2; justify-self: center; }
        #proof-btn-next { grid-column: 3; justify-self: end; }
        #proof-explanation {
            margin-top: 24px;
            padding: 20px;
            border: 1px solid var(--border);
            border-radius: 12px;
            background: var(--surface);
            line-height: 1.9;
            overflow-wrap: anywhere;
        }
        #proof-explanation[hidden] { display: none; }
        #proof-explanation h3 { margin: 0 0 16px; font-size: 1.1rem; }
        #proof-explanation p { margin: 0 0 16px; overflow-x: auto; }
        #proof-explanation p:last-child { margin-bottom: 0; }
        .proof-level-summary { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
        .proof-level-summary .badge { font-size: .75rem; }
        .proof-level-guide { margin: 0 0 18px; font-size: .85rem; line-height: 1.8; }
        .proof-level-guide summary { cursor: pointer; font-weight: 600; }
        #proof-level-badge { white-space: nowrap; }
        /* 참고자료(PDF)에 실린 정리: 번호를 강조하고 출처를 작게 붙인다. */
        .proof-ref-num {
            display: inline-block; padding: 0 .4em; border-radius: 6px;
            background: rgba(var(--primary-rgb), .14); color: var(--primary);
            box-shadow: inset 0 0 0 1.5px rgba(var(--primary-rgb), .45);
        }
        .proof-ref-source {
            display: inline-block; margin-top: 6px; padding: 2px 10px; border-radius: 999px;
            font-size: .45em; font-weight: 600; vertical-align: middle;
            background: var(--primary); color: #fff;
        }
        .proof-ref-count { background: rgba(var(--primary-rgb), .14); color: var(--primary); }
        #proof-view .header { flex-wrap: wrap; gap: 12px; }
        #proof-view .brand { flex: 1; width: auto; min-width: 0; }
        #proof-view #proof-chapter-title {
            position: static; transform: none; max-width: none;
            white-space: normal; text-align: center;
        }
        #proof-view .badges { display: flex; flex-wrap: wrap; gap: 6px; }
        #proof-explanation mjx-container,
        #proof-problem-area .problem-statement-text mjx-container {
            max-width: 100%;
            overflow-x: auto;
            overflow-y: hidden;
            padding-bottom: 4px;
        }
        @media (max-width: 600px) {
            #proof-view .proof-navigation { gap: 6px; }
            #proof-view .proof-navigation .btn { padding: 10px 8px; font-size: .85rem; }
            #quiz-area > .action-bar { gap: 6px; }
            #quiz-area > .action-bar .btn { padding: 10px 8px; font-size: .85rem; }
            #proof-explanation { padding: 16px; }
        }
        /* .brand is deliberately width:0 (see style.css) so #slogan-text can center itself
           over the header via position:absolute -- #proof-chapter-title sits in that same
           zero-width box but never got the same absolute-positioning rule, so it was stuck
           rendering inside a 0px-wide flex item and wrapped one character per line. */
        #proof-chapter-title {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            font-size: 1.3rem;
            font-weight: 800;
            margin: 0;
            white-space: nowrap;
            letter-spacing: -0.02em;
            max-width: 60vw;
            overflow: hidden;
            text-overflow: ellipsis;
            pointer-events: none;
        }
        @media (max-width: 768px) {
            #proof-chapter-title {
                font-size: 1.05rem;
                max-width: 50vw;
            }
        }
    </style>
    <link rel="stylesheet" href="assets/css/studio-layout.css?v=20260918_v1">

    <!-- ANTI-FOUC SCRIPT: Must be in HEAD and before body renders -->
    <script>
        (function () {
            var theme = localStorage.getItem('theme') || 'light';
            document.documentElement.setAttribute('data-theme', theme);
        })();
    </script>
</head>

<body class="studio-page">
    <!-- Scripts calling body removed from top -->

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
                                <ul class="rules-list" id="rules-midterm">
                                    <li><strong>미적분</strong> 문제는 정답에 <strong>적분상수 C</strong>를 포함하세요.</li>
                                    <li><strong>대수</strong> 문제의 답이 행렬/벡터면 <strong>행렬 입력 버튼</strong>을 사용하고, 자유변수는 <strong>t</strong>로 나타내세요.</li>
                                    <li><strong>적분 불가능·역행렬 없음·해 없음</strong>인 문제는 <strong>"포기"</strong> 버튼으로 처리하세요.</li>
                                    <li><strong>sech, csch, coth</strong> 입력 시 화면이 이상해 보일 수 있지만 <strong>채점은 정상 동작합니다</strong>.</li>
                                    <li><strong>역함수</strong>는 <strong>-1 표기</strong>와 <strong>arc 표기</strong> 모두 정답으로 인정됩니다.</li>
                                    <li>그 외에는 <strong>Integral Studio</strong>와 동일합니다.</li>
                                </ul>
                                <ul class="rules-list hidden" id="rules-final">
                                    <li><strong>판정</strong> 문제는 입력칸 아래 <strong>절대수렴·조건수렴·수렴·발산</strong> 버튼으로 답하세요.</li>
                                    <li><strong>수렴구간</strong>은 구간 버튼으로 <strong>[a, b)</strong> 꼴로 입력하고, 무한대는 <strong>∞</strong> 버튼을 쓰세요.</li>
                                    <li><strong>미분방정식의 해</strong>는 <strong>y=</strong> 없이 우변만 입력하세요.</li>
                                    <li>값은 소수 대신 <strong>정확한 값</strong>(분수·근호·π·e)으로 입력하세요.</li>
                                </ul>
                            </div>
                        </div>

                        <div class="option-section" id="options-midterm">
                            <div class="option-item">
                                <label class="checkbox-container">
                                    <input type="checkbox" id="chk-strict-c" checked>
                                    <span>적분상수(C) 포함 필수 (미적분 문제에만 적용)</span>
                                </label>
                            </div>
                            <div class="option-item">
                                <label class="checkbox-container">
                                    <input type="checkbox" id="chk-proof-keep-open">
                                    <span>증명 문제 해설 계속 펼치기</span>
                                </label>
                            </div>
                        </div>

                        <button class="start-btn" onclick="startSelectedGame()">Get Started</button>
                    </div>
                    <input type="hidden" id="sel-collection-value" value="">
                    <input type="hidden" id="sel-collection-value-algebra" value="">
                    <input type="hidden" id="sel-collection-value-final" value="">
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
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="exam-tabs">
                    <button type="button" id="exam-tab-midterm" class="exam-tab active" onclick="switchExam('midterm')">중간고사</button>
                    <button type="button" id="exam-tab-final" class="exam-tab" onclick="switchExam('final')">기말고사</button>
                </div>
                <div class="subject-tabs">
                    <button type="button" id="subject-tab-trig" class="subject-tab active" data-exam="midterm" onclick="switchModalSubject('trig')">고급미적분-역삼각함수</button>
                    <button type="button" id="subject-tab-hyp" class="subject-tab" data-exam="midterm" onclick="switchModalSubject('hyp')">고급미적분-쌍곡함수</button>
                    <button type="button" id="subject-tab-polar" class="subject-tab" data-exam="midterm" onclick="switchModalSubject('polar')">고급미적분-극좌표</button>
                    <button type="button" id="subject-tab-apps" class="subject-tab" data-exam="midterm" onclick="switchModalSubject('apps')">정적분의 활용</button>
                    <button type="button" id="subject-tab-algebra" class="subject-tab" data-exam="midterm" onclick="switchModalSubject('algebra')">고급대수</button>
                    <button type="button" id="subject-tab-proof" class="subject-tab" data-exam="midterm" onclick="switchModalSubject('proof')">증명</button>
                    <button type="button" id="subject-tab-series" class="subject-tab hidden" data-exam="final" onclick="switchModalSubject('series')">급수</button>
                    <button type="button" id="subject-tab-ode" class="subject-tab hidden" data-exam="final" onclick="switchModalSubject('ode')">미분방정식</button>
                </div>
                <div class="collection-sections">
                    <div id="collection-grid" style="display:none;"></div> <!-- logic.js compatibility -->

                    <div id="modal-section-trig">
                        <h3>▶ 역삼각함수 미적분</h3>
                        <div id="collection-grid-trig" class="collection-grid"></div>
                    </div>

                    <div id="modal-section-hyp" class="hidden">
                        <h3>▶ 쌍곡함수 미적분</h3>
                        <div id="collection-grid-hyp" class="collection-grid"></div>
                    </div>

                    <div id="modal-section-polar" class="hidden">
                        <h3>▶ 극좌표와 극곡선 · 심화 탐구</h3>
                        <div id="collection-grid-polar" class="collection-grid"></div>
                    </div>

                    <div id="modal-section-apps" class="hidden">
                        <h3>▶ 정적분의 활용 (고난도)</h3>
                        <div id="collection-grid-apps" class="collection-grid"></div>
                    </div>

                    <div id="modal-section-algebra" class="hidden">
                        <h3>▶ 고급대수 · 유형별 심화</h3>
                        <p class="proof-level-guide">연립방정식·역행렬·행렬식·기저 6개 문제집(각 10문항)과 내적·정사영·정규직교기저 6개 문제집(각 5문항), 총 90문항입니다.<br>난이도는 Level 3 응용 · Level 4 심화 · Level 5 종합으로 구성되며, 결과 화면에서 풀이를 확인할 수 있습니다.</p>
                        <div id="collection-grid-algebra" class="collection-grid"></div>
                    </div>

                    <div id="modal-section-proof" class="hidden">
                        <h3>▶ 증명</h3>
                        <details class="proof-level-guide">
                            <summary>Level 1–5 난이도 기준</summary>
                            <div>Level 1 · 정의 확인과 한 단계 계산<br>
                                Level 2 · 기본 성질을 적용하는 짧은 직접 증명<br>
                                Level 3 · 여러 단계 연결, 양방향 증명, 귀납법<br>
                                Level 4 · 보조 아이디어, 경우 분류, 직접 구성<br>
                                Level 5 · 여러 보조정리를 결합하는 종합 논증</div>
                        </details>
                        <div id="collection-grid-proof" class="collection-grid"></div>
                    </div>

                    <div id="modal-section-series" class="hidden">
                        <h3>▶ 급수 · 교과서 III단원 (p.98–155)</h3>
                        <div id="collection-grid-series" class="collection-grid"></div>
                    </div>

                    <div id="modal-section-ode" class="hidden">
                        <h3>▶ 미분방정식 · 교과서 IV단원 (p.156–191)</h3>
                        <div id="collection-grid-ode" class="collection-grid"></div>
                    </div>

                    <div id="collection-footnote" style="padding: 15px; text-align: center; border-top: 1px solid var(--border); margin-top: 20px;">
                        <p style="font-size: 0.85em; color: var(--text-secondary); margin: 0;">
                            * 각 컬렉션은 여러 문제로 구성되어 있습니다.
                        </p>
                    </div>
                </div>
            </div>
        </div>


        <div id="app-view">
            <div class="header">
                <button class="btn-home" onclick="returnToCollections()" title="메인으로">
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
                    <button type="button" class="btn secondary" onclick="insertMatrixTemplate(4,1)">4×1 벡터</button>
                </div>
                <div id="final-answer-tools" class="hidden" style="display:flex; gap:8px; margin: 10px 0; flex-wrap:wrap;"></div>
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
                <div id="score-save-message" aria-live="polite"></div>
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

        <div id="proof-view" style="display:none;">
            <div class="header">
                <button class="btn-home" onclick="returnToCollections()" title="메인으로">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                </button>
                <span class="brand">
                    <h2 id="proof-chapter-title">증명</h2>
                </span>
                <div class="badges">
                    <span id="proof-level-badge" class="badge">Level 1</span>
                    <span id="proof-progress-badge" class="badge progress">1 / 1</span>
                </div>
            </div>

            <div id="proof-problem-area"></div>
            <div class="action-bar proof-navigation">
                <button id="proof-btn-prev" class="btn secondary hidden" onclick="prevProofTheorem()">← Previous</button>
                <button type="button" id="proof-btn-explanation" class="btn secondary" aria-expanded="false" aria-controls="proof-explanation" onclick="toggleProofExplanation()">해설</button>
                <button id="proof-btn-next" class="btn primary" onclick="nextProofTheorem()">Next →</button>
            </div>
            <section id="proof-explanation" aria-labelledby="proof-explanation-title" hidden></section>
        </div>

        <div class="footer">
            © 2026 ISHS 32nd - Developed by Dohye Lee. All rights reserved.
        </div>
    </div>

    <script src="data/math/adv_collections_final.js?v=20260922_audit"></script>
    <script src="data/math/polar_collections.js?v=20260916_v2"></script>
    <script src="data/math/inverse_hyperbolic_collections.js?v=20260922_audit"></script>
    <script src="data/math/lesson_calculus_collections.js?v=20260921_v1"></script>
    <script src="data/math/algebra_collections.js?v=20261006_v5"></script>
    <script src="data/math/algebra_orthogonal.js?v=20260928_v1"></script>
    <script src="data/math/proof_theorems.js?v=20260918_v1"></script>
    <script src="data/math/proof_theorems_extended.js?v=20260918_v1"></script>
    <script src="data/math/proof_explanations.js?v=20260918_v2"></script>
    <script src="data/math/proof_theorems_supplement.js?v=20260917_v1"></script>
    <script src="data/math/proof_theorems_advanced.js?v=20260918_v1"></script>
    <script src="data/math/proof_change_of_basis.js?v=20260918_v1"></script>
    <script src="data/math/proof_levels.js?v=20260918_v1"></script>
    <script src="data/math/proof_orthogonal.js?v=20260928_v1"></script>
    <script src="data/math/proof_sources.js?v=20261006_v1"></script>
    <script src="data/math/final/ode.js?v=20261026_final"></script>
    <script>window.STUDIO_SCORE_CONFIG = { studio: 'advanced_math' };</script>
    <script src="scripts/grader.js?v=20260922_audit"></script>
    <script src="scripts/logic.js?v=20261006_keys"></script>
    <script src="scripts/adv_final_grading.js?v=20261026_final"></script>
    <script src="scripts/adv_final.js?v=20261026_final"></script>
    <script src="scripts/study_scores.js?v=20260922_history"></script>
    <script src="scripts/adv_anim.js?v=debug_v2"></script>
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
        // above). The detail list needs buildProblemHtml() (not a bare `$$${p.latex}$$`)
        // for the same word-problem overflow fix used in the live quiz view.
        function renderResult(res) {
            const score = res.details.filter(d => d.isCorrect).length;
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
                const cLabel = p.solution.includes("적포") || p.latex.includes("\\text{") ? "" : " + C";
                // 기말 정답의 verdict:/interval: 접두어는 채점용 표기라 화면에는 떼고 보여 준다.
                const solutionTex = state.exam === 'final' && window.finalGrading
                    ? window.finalGrading.displaySolution(p.solution) : `${p.solution}${cLabel}`;
                const pageLabel = p.page ? ` · 교과서 p.${p.page}` : '';
                return `<li class="detail-item">
                    <div class="detail-status ${cls}"><span class="detail-status-icon">${icon}</span>Q${d.id} · ${label}</div>
                    <div class="detail-problem">${buildProblemHtml(p.latex)}</div>
                    <div class="detail-answer-row">
                        <span class="detail-answer-label">내가 쓴 답</span>
                        <span>$$${p.userAnswer || "\\text{(비어있음)}"}$$</span>
                    </div>
                    <div class="detail-answer-row">
                        <span class="detail-answer-label">정답</span>
                        <span>$$${solutionTex}$$</span>
                    </div>
                    ${p.explanation ? `<details class="problem-explanation"><summary>풀이 해설 · ${escapeHtmlText(p.title || '핵심 논리')}${pageLabel}</summary>${buildProblemHtml(p.explanation)}</details>` : ''}
                </li>`;
            }).join("");
            document.querySelectorAll('.problem-explanation').forEach(detail => {
                detail.addEventListener('toggle', () => {
                    if (detail.open && window.MathJax) MathJax.typesetPromise([detail]);
                });
            });
            if (window.MathJax) MathJax.typesetPromise([document.getElementById('detail-list')]);
        }

        function readHistory(colId, expectedTotal) {
            return window.studyScores?.historyLabel(colId, expectedTotal) || '불러오는 중…';
        }

        function buildCollectionCard(col, onClick) {
            const score = readHistory(col.id, col.problems.length);
            const card = document.createElement('div');
            card.className = col.description ? 'collection-card collection-card--polar' : 'collection-card';
            card.dataset.id = col.id;
            card.dataset.totalCount = col.problems.length;
            card.onclick = onClick;
            let scoreClass = (score.startsWith("Best")) ? "collection-score has-score" : "collection-score";
            let preview = col.description ? escapeHtmlText(col.problems[0].title) : buildMathPreview(col.problems[0].latex);
            card.innerHTML = `<div><h3>${col.name}</h3>${col.description ? `<p style="font-size: .85rem; line-height: 1.5;">${escapeHtmlText(col.description)} · ${col.problems.length}문항</p>` : ''}<span class="${scoreClass}">${score}</span></div>
            <div class="problem-preview">${preview}</div>`;
            return card;
        }

        // Which subject the currently-selected collection belongs to ('calc' | 'algebra').
        // Picking a card in any tab of the (single, shared) collection modal updates this,
        // and the one "Get Started" button dispatches on it. 'calc' covers all three
        // window.generatedCollections tabs (역삼각함수/쌍곡함수/극좌표) -- they all run
        // through the same startGame()/selectCollection() engine; only algebra differs.
        let selectedSubject = 'calc';

        // 문제집 창은 시험(중간/기말) → 과목 2단이다. 각 과목 탭이 어느 시험 아래 있는지는
        // EXAM_OF 하나로 정하고, 시험 탭을 누르면 그 시험에서 마지막으로 보던 과목이 열린다.
        const MODAL_SUBJECTS = ['trig', 'hyp', 'polar', 'apps', 'algebra', 'proof', 'series', 'ode'];
        const EXAM_OF = {
            trig: 'midterm', hyp: 'midterm', polar: 'midterm', apps: 'midterm', algebra: 'midterm', proof: 'midterm',
            series: 'final', ode: 'final'
        };
        const lastTabByExam = { midterm: 'trig', final: 'series' };
        let lastModalTab = 'trig'; // so the home button can reopen the modal on the same tab
        function switchModalSubject(subject) {
            lastModalTab = subject;
            const exam = EXAM_OF[subject];
            lastTabByExam[exam] = subject;
            ['midterm', 'final'].forEach(e => document.getElementById(`exam-tab-${e}`).classList.toggle('active', e === exam));
            MODAL_SUBJECTS.forEach(s => {
                const tab = document.getElementById(`subject-tab-${s}`);
                tab.classList.toggle('active', s === subject);
                tab.classList.toggle('hidden', EXAM_OF[s] !== exam);
                document.getElementById(`modal-section-${s}`).classList.toggle('hidden', s !== subject);
            });
            // "* 각 컬렉션은 여러 문제로 구성되어 있습니다" only makes sense for the
            // collection tabs -- the proof tab isn't a collection you start a quiz from.
            document.getElementById('collection-footnote')?.classList.toggle('hidden', subject === 'proof');
        }

        function switchExam(exam) {
            switchModalSubject(lastTabByExam[exam]);
        }

        // 시작 카드의 이용 가이드와 옵션은 고른 문제집의 시험을 따른다. 적분상수 C와 증명 해설
        // 옵션은 중간고사 문제에만 의미가 있다.
        function applyExamToLanding(exam) {
            document.getElementById('rules-midterm').classList.toggle('hidden', exam !== 'midterm');
            document.getElementById('rules-final').classList.toggle('hidden', exam !== 'final');
            document.getElementById('options-midterm').classList.toggle('hidden', exam !== 'midterm');
        }

        // 중간고사 미적분 카드: logic.js의 selectCollection()은 그대로 두고 시험 표시만 덧붙인다.
        function selectMidtermCollection(id) {
            selectedSubject = 'calc';
            selectCollection(id);
            const col = window.generatedCollections?.find(c => c.id === id);
            if (col) document.getElementById('current-collection-name').innerText = `중간 · ${col.name}`;
            applyExamToLanding('midterm');
            writeStore('adv_last_exam', 'midterm');
        }

        // 증명 감상 (Proof Gallery) -- read-only, no grading, no math-input. The modal tab
        // uses chapter cards (same .collection-card look as every other tab); picking
        // one jumps straight into #proof-view, which reuses the real quiz's header/badge/
        // action-bar layout so a theorem reads exactly like a normal problem -- just with
        // Previous/Next navigation and an optional proof explanation.
        function buildProofChapterCard(chapter, idx) {
            const card = document.createElement('div');
            card.className = 'collection-card';
            card.onclick = () => startProofChapter(idx);
            const levelCounts = [1, 2, 3, 4, 5].map(level => {
                const count = chapter.theorems.filter(t => t.level === level).length;
                return count ? `<span class="badge" title="${escapeHtmlText(window.proofLevelDescriptions[level])}">Level ${level} · ${count}개</span>` : '';
            }).join('');
            const referenceCount = chapter.theorems.filter(t => t.referenceSource).length;
            card.innerHTML = `<div><h3>${escapeHtmlText(chapter.chapter)}</h3></div>
            <div class="problem-preview">정리 ${chapter.theorems.length}개</div>
            <div class="proof-level-summary">${levelCounts}${referenceCount ? `<span class="badge proof-ref-count" title="참고자료 PDF에 실린 정리">참고자료 · ${referenceCount}개</span>` : ''}</div>`;
            return card;
        }

        const proofState = { theorems: [], index: 0, chapterName: '' };

        function startProofChapter(idx) {
            const chapter = window.proofTheorems?.[idx];
            if (!chapter) return;
            proofState.theorems = chapter.theorems;
            proofState.index = 0;
            proofState.chapterName = chapter.chapter;
            document.getElementById('proof-chapter-title').innerText = chapter.chapter;
            closeCollectionModal();
            document.getElementById('landing-view').style.display = 'none';
            document.getElementById('proof-view').style.display = 'block';
            loadCurrentProofTheorem();
        }

        // Home button (both #app-view and #proof-view) -- not a plain goHome(), which just
        // drops you on the bare landing page. The actual complaint was having to click
        // "문제집 선택" and then re-pick the same tab every time; this instead reopens the
        // collection modal immediately, already on whichever tab (lastModalTab) was last
        // active, so going home is a straight shot back into the picker, not a full reset.
        function returnToCollections() {
            document.getElementById('app-view').style.display = 'none';
            document.getElementById('proof-view').style.display = 'none';
            document.getElementById('landing-view').style.display = 'block';
            switchModalSubject(lastModalTab);
            openCollectionModal();
        }

        function loadCurrentProofTheorem() {
            const t = proofState.theorems[proofState.index];
            if (!t) return;
            const explanation = document.getElementById('proof-explanation');
            if (window.MathJax?.typesetClear) MathJax.typesetClear([explanation]);
            explanation.hidden = true;
            explanation.innerHTML = '';
            const explanationButton = document.getElementById('proof-btn-explanation');
            explanationButton.setAttribute('aria-expanded', 'false');
            explanationButton.textContent = '해설';
            document.getElementById('proof-progress-badge').innerText = `${proofState.index + 1} / ${proofState.theorems.length}`;
            const levelBadge = document.getElementById('proof-level-badge');
            levelBadge.textContent = `Level ${t.level}`;
            levelBadge.title = window.proofLevelDescriptions[t.level];
            const area = document.getElementById('proof-problem-area');
            area.innerHTML = `
                <div class="problem-statement-text">${t.referenceSource ? `<span class="proof-ref-source">참고자료 ${escapeHtmlText(t.referenceSource.unit)} · ${escapeHtmlText(t.referenceSource.label)}</span><br>` : ''}<strong>${t.referenceSource ? `<span class="proof-ref-num" title="참고자료에 실린 정리">정리 ${escapeHtmlText(t.num)}</span>` : `정리 ${escapeHtmlText(t.num)}`}. ${escapeHtmlText(t.title)}</strong><br>${escapeHtmlText(t.hypothesis)}</div>
                ${t.statement ? `<div class="problem-statement-formula">$$${escapeHtmlText(t.statement)}$$</div>` : ''}
            `;
            document.getElementById('proof-btn-prev').classList.toggle('hidden', proofState.index === 0);
            document.getElementById('proof-btn-next').classList.toggle('hidden', proofState.index === proofState.theorems.length - 1);
            if (window.MathJax) MathJax.typesetPromise([area]);
            if (document.getElementById('chk-proof-keep-open').checked) toggleProofExplanation();
        }

        function toggleProofExplanation() {
            const t = proofState.theorems[proofState.index];
            if (!t) return;
            const panel = document.getElementById('proof-explanation');
            const button = document.getElementById('proof-btn-explanation');
            const opening = panel.hidden;
            if (opening && !panel.innerHTML) {
                panel.innerHTML = `<h3 id="proof-explanation-title">정리 ${escapeHtmlText(t.num)} 해설 · ${escapeHtmlText(t.title)}</h3>` +
                    t.explanation.map(paragraph => `<p>${escapeHtmlText(paragraph)}</p>`).join('');
            }
            panel.hidden = !opening;
            button.setAttribute('aria-expanded', String(opening));
            button.textContent = opening ? '해설 접기' : '해설';
            if (opening && window.MathJax?.typesetPromise) MathJax.typesetPromise([panel]);
        }

        function prevProofTheorem() {
            if (proofState.index > 0) { proofState.index--; loadCurrentProofTheorem(); }
        }
        function nextProofTheorem() {
            if (proofState.index < proofState.theorems.length - 1) { proofState.index++; loadCurrentProofTheorem(); }
        }
        // 증명 화면: ←/→로 이전/다음 정리, Enter로 다음 정리. 포커스된 버튼·체크박스의 Enter는 그대로 둔다.
        document.addEventListener('keydown', e => {
            if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
            if (document.getElementById('proof-view')?.style.display !== 'block') return;
            if (document.getElementById('collection-modal')?.classList.contains('visible')) return;
            const tag = e.target?.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
            if (e.key === 'ArrowLeft') { e.preventDefault(); prevProofTheorem(); }
            else if (e.key === 'ArrowRight') { e.preventDefault(); nextProofTheorem(); }
            else if (e.key === 'Enter' && tag !== 'BUTTON' && tag !== 'SUMMARY') { e.preventDefault(); nextProofTheorem(); }
        });

        window.addEventListener('DOMContentLoaded', () => {
            const trigGrid = document.getElementById('collection-grid-trig');
            const hypGrid = document.getElementById('collection-grid-hyp');
            const polGrid = document.getElementById('collection-grid-polar');
            const appsGrid = document.getElementById('collection-grid-apps');
            if (trigGrid && hypGrid && polGrid && appsGrid && window.generatedCollections) {
                trigGrid.innerHTML = "";
                hypGrid.innerHTML = "";
                polGrid.innerHTML = "";
                appsGrid.innerHTML = "";
                window.generatedCollections.forEach(col => {
                    const card = buildCollectionCard(col, () => selectMidtermCollection(col.id));
                    if (col.id.includes('adv_col1a')) {
                        trigGrid.appendChild(card);
                    } else if (col.id.includes('adv_col1b')) {
                        hypGrid.appendChild(card);
                    } else if (col.id.includes('adv_col3')) {
                        appsGrid.appendChild(card);
                    } else {
                        polGrid.appendChild(card);
                    }
                });
                if (window.MathJax) MathJax.typesetPromise([trigGrid, hypGrid, polGrid, appsGrid]);
            }

            const algGrid = document.getElementById('collection-grid-algebra');
            if (algGrid && window.algebraCollections) {
                algGrid.innerHTML = "";
                window.algebraCollections.forEach(col => {
                    algGrid.appendChild(buildCollectionCard(col, () => { selectedSubject = 'algebra'; selectAlgebraCollection(col.id); }));
                });
                if (window.MathJax) MathJax.typesetPromise([algGrid]);
            }

            const proofGrid = document.getElementById('collection-grid-proof');
            if (proofGrid && window.proofTheorems) {
                proofGrid.innerHTML = "";
                window.proofTheorems.forEach((ch, idx) => proofGrid.appendChild(buildProofChapterCard(ch, idx)));
            }

            // 기말 카드는 adv_final.js가 그린다. logic.js가 쿠키의 중간 문제집을 먼저 고른 뒤라서
            // 마지막에 고른 시험(중간/기말)을 여기서 복원해 덮어쓴다.
            renderFinalGrids();
            restoreLastSelection();
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
            if (col) document.getElementById('current-collection-name').innerText = `중간 · ${col.name}`;
            applyExamToLanding('midterm');
            writeStore('adv_last_exam', 'midterm');
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
            try {
                state.studyAttempt = await window.studyScores?.startAttempt({ collectionId: id, totalCount: colProvider.problems.length });
                if (!state.studyAttempt) throw new Error('점수 기록 시스템을 시작할 수 없습니다.');
            } catch (error) {
                alert(`문제집을 시작할 수 없습니다. ${error.message}`);
                return;
            }
            document.getElementById('app-view').classList.remove('polar-session');

            state.strictC = false; // 행렬/연립방정식 문제에는 적분상수(C) 개념이 없음
            state.subject = 'algebra';
            const slogan = document.getElementById('slogan-text');
            if (slogan) slogan.innerText = 'Explore the structure';
            state.problems = colProvider.problems.map((p, idx) => ({
                id: idx + 1,
                level: p.level,
                title: p.title,
                latex: normalizeLatex(p.latex),
                solution: p.solution,
                explanation: p.explanation,
                answerMode: p.answerMode,
                userAnswer: ""
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
            if (selectedSubject === 'final') return startFinalGame();
            state.exam = 'midterm'; // 기말을 푼 뒤 같은 페이지에서 중간으로 돌아와도 기말 채점 래퍼가 꺼지게
            if (selectedSubject === 'algebra') return startAlgebraGame();
            state.subject = 'calc';
            const slogan = document.getElementById('slogan-text');
            const polarSelected = document.getElementById('sel-collection-value').value.startsWith('adv_col2_v2_');
            if (slogan) slogan.innerText = polarSelected ? '극좌표 심화 탐구' : 'Integrate your skills';
            return startGame();
        }
    </script>
</body>

</html>
