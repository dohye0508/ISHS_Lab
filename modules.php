<?php
// Modules launcher - ISHS LAB
$year = date('Y');
?><!DOCTYPE html>
<html lang="ko">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>스튜디오 &middot; ISHS LAB</title>
<meta name="description" content="ISHS LAB의 학습 스튜디오를 한눈에 둘러보고 바로 시작하세요.">
<meta name="theme-color" content="#FFFFFF">
<link rel="icon" type="image/jpeg" href="assets/images/inticon.jpg">
<meta property="og:title" content="스튜디오 · ISHS LAB">
<meta property="og:description" content="원하는 과목을 골라 바로 시작하세요.">
<meta property="og:image" content="assets/images/int.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css">
<script>
    (function () {
        var theme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.classList.add('js');
    })();
</script>
<style>
/* ───────────────────────────────────────────────
   ISHS LAB — 모듈 (화이트 톤 + 핑크·블루·민트 메시 그라데이션)
   ─────────────────────────────────────────────── */

*,*::before,*::after{box-sizing:border-box}

:root{
    --paper:#FFFFFF;
    --paper-2:#F6F7FB;
    --patch:#FFFFFF;
    --ink:#17181F;
    --ink-2:#4A4B57;
    --ink-3:#8B8C99;
    --rule:#EAEAF1;
    --rule-2:#DEDFE9;

    --pink:#F472B6;
    --blue:#60A5FA;
    --mint:#5EEAD4;
    --pink-soft:rgba(244,114,182,.13);
    --blue-soft:rgba(96,165,250,.13);
    --mint-soft:rgba(94,234,212,.13);
    --accent:#DB4C8C;
    --accent-soft:rgba(219,76,140,.11);

    --mesh-a:rgba(244,114,182,.22);
    --mesh-a2:rgba(244,114,182,.18);
    --mesh-b:rgba(96,165,250,.19);
    --mesh-b2:rgba(96,165,250,.17);
    --mesh-c:rgba(94,234,212,.13);

    --sans:'Pretendard',system-ui,-apple-system,'Apple SD Gothic Neo',sans-serif;

    --wrap:1180px;
}

[data-theme="dark"]{
    --paper:#111219;
    --paper-2:#181A24;
    --patch:#1B1D27;
    --ink:#F2F2F6;
    --ink-2:#C3C4D1;
    --ink-3:#8A8B9B;
    --rule:#2A2C38;
    --rule-2:#363847;

    --pink-soft:rgba(244,114,182,.14);
    --blue-soft:rgba(96,165,250,.14);
    --mint-soft:rgba(94,234,212,.13);
    --accent:#F48FBF;
    --accent-soft:rgba(244,143,191,.16);

    --mesh-a:rgba(244,114,182,.26);
    --mesh-a2:rgba(244,114,182,.22);
    --mesh-b:rgba(96,165,250,.23);
    --mesh-b2:rgba(96,165,250,.20);
    --mesh-c:rgba(94,234,212,.16);
}

html{scroll-behavior:smooth;overflow-x:hidden}
html,body{margin:0;padding:0}

body{
    background-color:var(--paper);
    background-image:
        radial-gradient(ellipse 70% 62% at 10% 8%, var(--mesh-a) 0%, transparent 72%),
        radial-gradient(ellipse 65% 58% at 88% 14%, var(--mesh-b) 0%, transparent 72%),
        radial-gradient(ellipse 85% 75% at 50% 46%, var(--mesh-c) 0%, transparent 78%),
        radial-gradient(ellipse 68% 60% at 14% 90%, var(--mesh-a2) 0%, transparent 72%),
        radial-gradient(ellipse 68% 62% at 90% 86%, var(--mesh-b2) 0%, transparent 72%);
    background-repeat:no-repeat;
    background-attachment:fixed;
    color:var(--ink);
    font:400 17px/1.7 var(--sans);
    letter-spacing:-.004em;
    -webkit-font-smoothing:antialiased;
    transition:background-color .25s ease,color .25s ease;
}

body,p,li,h1,h2,h3,h4,dt,dd{word-break:keep-all;overflow-wrap:break-word}
h1,h2,h3,h4{margin:0;font-weight:700;letter-spacing:-.022em;line-height:1.28}
p{margin:0 0 1.05em}
p:last-child{margin-bottom:0}
ul,ol{margin:0;padding:0;list-style:none}
img{max-width:100%;display:block}
a{color:var(--ink)}
button{font-family:inherit}

.wrap{max-width:var(--wrap);margin:0 auto;padding:0 24px}
.sec{padding:clamp(40px,5vw,60px) 0 clamp(60px,6vw,84px)}

/* ── 타입 유틸 ─────────────────────────────── */
.label{
    font:600 13px/1.5 var(--sans);
    letter-spacing:.07em;text-transform:uppercase;color:var(--ink-3);
}
.h2{font-size:clamp(28px,3.6vw,42px);line-height:1.22}

/* ── 헤더 ──────────────────────────────────── */
.masthead{
    position:sticky;top:0;z-index:20;
    background-color:color-mix(in srgb, var(--paper) 82%, transparent);
    backdrop-filter:saturate(140%) blur(10px);
    border-bottom:1px solid var(--rule);
}
.masthead .wrap{display:flex;align-items:center;gap:22px;min-height:64px}
.brand{
    font-weight:800;font-size:27px;letter-spacing:-.03em;
    text-decoration:none;display:flex;align-items:center;min-height:44px;
    background:linear-gradient(100deg,var(--pink) 0%,var(--blue) 55%,var(--mint) 100%);
    -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;
}
.brand-sub{font-weight:400;color:var(--ink-3);margin-left:4px;-webkit-text-fill-color:var(--ink-3)}
.nav-left{display:flex;align-items:center;gap:4px}
.nav-left a{
    text-decoration:none;color:var(--ink-2);font-size:14px;font-weight:500;
    padding:10px 11px;min-height:44px;display:inline-flex;align-items:center;border-radius:2px;
}
.nav-left a:hover{color:var(--ink);background:var(--paper-2)}
.nav-right{margin-left:auto;display:flex;align-items:center;gap:10px}

.dday-pill{
    display:inline-flex;align-items:center;
    padding:6px 13px;margin:0 2px;
    border:1px solid transparent;border-radius:99px;
    background:linear-gradient(var(--paper),var(--paper)) padding-box,
               linear-gradient(100deg,var(--pink),var(--blue),var(--mint)) border-box;
    font:700 12.5px/1 var(--sans);letter-spacing:.01em;
    color:var(--accent);white-space:nowrap;
}

/* ── 버튼 ──────────────────────────────────── */
.btn{
    display:inline-flex;align-items:center;justify-content:center;
    min-height:46px;padding:11px 22px;
    font:600 15px/1.2 var(--sans);letter-spacing:-.01em;
    text-decoration:none;border:1.5px solid var(--ink);border-radius:99px;
    cursor:pointer;background:transparent;color:var(--ink);
    transition:background-color .16s ease,color .16s ease,box-shadow .2s ease,transform .2s ease;
}
.btn--fill{background:var(--ink);color:var(--paper);border-color:var(--ink)}
.btn--fill:hover{box-shadow:0 8px 22px -6px rgba(96,165,250,.45),0 8px 22px -10px rgba(244,114,182,.4);transform:translateY(-1px)}

.nav-btn{
    min-height:40px;padding:8px 18px;
    border-radius:99px;background:transparent;color:var(--ink);
    border:1.5px solid var(--ink);cursor:pointer;font-weight:600;font-size:14px;
    transition:background-color .16s ease,color .16s ease;
}
.nav-btn:hover{background:var(--ink);color:var(--paper)}
.btn-label-short{display:none}

.user-pill{
    display:none;align-items:center;gap:10px;
    border:1px solid var(--rule-2);border-radius:99px;
    padding:5px 6px 5px 14px;
}
.user-pill .nickname{font-weight:700;font-size:13.5px}
.user-pill button{
    background:none;border:none;color:var(--accent);cursor:pointer;
    padding:6px 10px;border-radius:99px;display:flex;align-items:center;gap:3px;
    font-family:inherit;font-size:12.5px;font-weight:700;transition:background .2s;
}
.user-pill button:hover{background:var(--accent-soft)}

.theme-toggle-btn{
    background:transparent;border:1px solid var(--rule-2);color:var(--ink);
    cursor:pointer;padding:8px;border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    transition:background-color .3s,transform .2s;
}
.theme-toggle-btn:hover{background-color:var(--paper-2);transform:rotate(15deg)}
.sun-icon,.moon-icon{display:none!important}
html:not([data-theme="dark"]) .sun-icon{display:block!important}
html[data-theme="dark"] .moon-icon{display:block!important}

/* ── 섹션 헤더 ─────────────────────────────── */
.sec-head{display:flex;align-items:baseline;gap:14px;margin-bottom:clamp(20px,2.6vw,30px);flex-wrap:wrap}
.sec-head .h2{flex:1 1 auto;min-width:0}

/* ── 모듈 (실제 런처, 앱스토어 타일) ─────────── */
.modules-note{color:var(--ink-3);font-size:15px;margin-bottom:clamp(28px,3vw,38px)}
.mod-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:18px}

.mod-card{
    background:var(--patch);border:1px solid var(--rule);border-radius:24px;
    padding:26px;cursor:pointer;position:relative;
    display:flex;flex-direction:column;
    box-shadow:0 20px 44px -30px rgba(23,24,31,.2);
    transition:transform .22s cubic-bezier(.2,1,.3,1),box-shadow .22s ease,border-color .22s ease;
}
.mod-card:hover,.mod-card:focus-visible{
    transform:translateY(-5px);
    border-color:var(--rule-2);
    box-shadow:0 28px 56px -22px rgba(96,165,250,.32),0 20px 40px -24px rgba(244,114,182,.26);
}
.mod-card:focus-visible{outline:2px solid var(--blue);outline-offset:2px}
.mod-card__head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:18px}
.mod-icon{
    width:56px;height:56px;flex:0 0 auto;
    border-radius:18px;padding:8px;
    display:flex;align-items:center;justify-content:center;
    font:700 24px/1 var(--sans);color:#fff;
    transition:transform .22s cubic-bezier(.2,1,.3,1);
}
.mod-icon img{width:100%;height:100%;object-fit:contain;border-radius:11px;background:#fff}
.mod-card:hover .mod-icon{transform:scale(1.06) rotate(-3deg)}
.mod-icon--pb{background:linear-gradient(135deg,var(--pink),var(--blue));box-shadow:0 12px 22px -10px rgba(244,114,182,.55)}
.mod-icon--bm{background:linear-gradient(135deg,var(--blue),var(--mint));box-shadow:0 12px 22px -10px rgba(96,165,250,.5)}
.mod-icon--pm{background:linear-gradient(135deg,var(--pink),var(--mint));box-shadow:0 12px 22px -10px rgba(94,234,212,.5)}
.mod-icon--soon{background:var(--rule);color:var(--ink-3);box-shadow:none}
.mod-name{font-size:18.5px;margin-bottom:4px}
.mod-name-ko{font-size:14px;color:var(--ink-3);margin-bottom:8px}
.mod-desc{font-size:13.5px;color:var(--ink-3);opacity:.85}
.mod-cta{
    display:flex;align-items:center;gap:6px;
    margin-top:auto;padding-top:16px;border-top:1px solid var(--rule);
    font:700 14.5px/1 var(--sans);color:var(--ink);
}
.mod-arr{margin-left:auto;font-size:16px;color:var(--ink-3);transition:transform .18s ease,color .18s ease}
.mod-card:hover .mod-arr{transform:translate(4px,-4px);color:var(--blue)}
.mod-badge{
    font:700 10.5px/1 var(--sans);letter-spacing:.03em;
    padding:5px 9px;border-radius:99px;flex:0 0 auto;
}
.mod-badge--new{background:var(--accent-soft);color:var(--accent)}
.mod-badge--soon{background:var(--rule);color:var(--ink-3)}

.mod-card--soon{cursor:default;opacity:.72}
.mod-card--soon:hover{transform:none;border-color:var(--rule);box-shadow:0 20px 44px -30px rgba(23,24,31,.2)}
.mod-card--soon:hover .mod-icon{transform:none}
.mod-card--soon .mod-cta{color:var(--ink-3)}

/* ── 푸터 ──────────────────────────────────── */
.foot{border-top:1px solid var(--rule);padding:7px 0 9px}
.foot .wrap{display:flex;flex-wrap:wrap;gap:10px 24px;align-items:baseline}
.foot .brand{font-size:15px}
.foot nav{display:flex;flex-wrap:wrap;gap:2px 16px}
.foot a{font-size:14px;color:var(--ink-2);text-decoration:none;text-underline-offset:3px;cursor:pointer}
.foot a:hover{text-decoration:underline}
.foot nav a{display:inline-flex;align-items:center;min-height:38px;padding:0 2px}
.colophon{
    margin-left:48px;margin-right:auto;
    font:400 12.5px/1.7 var(--sans);letter-spacing:.005em;color:var(--ink-3);
    white-space:nowrap;
}

/* 등장 애니메이션 */
html.js .rv{
    opacity:0;transform:translateY(22px);
    transition:opacity .45s ease,transform .6s cubic-bezier(.34,1.55,.55,1);
    transition-delay:calc(var(--i,0)*70ms);
}
html.js .rv.is-in{opacity:1;transform:none}
html.js .rv-drop{
    opacity:0;transform:translateY(26px) scale(.97);
    transition:opacity .5s ease,transform .62s cubic-bezier(.3,1.42,.46,1);
    transition-delay:calc(var(--i,0)*55ms);
}
html.js .rv-drop.is-in{opacity:1;transform:none}

/* ── 반응형 ────────────────────────────────── */
@media (max-width:640px){
    body{font-size:16px}
    .nav-left a{display:none}
    .brand{font-size:22px}
    .colophon{white-space:normal;margin-left:0}
    .dday-pill{display:none}
    .foot nav{margin-left:0;width:100%}
}
@media (max-width:359px){
    .btn-label-full{display:none}
    .btn-label-short{display:inline}
}
@media (prefers-reduced-motion:reduce){
    html{scroll-behavior:auto}
    *{transition-duration:.001ms!important;animation-duration:.001ms!important}
    html.js .rv,html.js .rv-drop{opacity:1;transform:none}
}
</style>
</head>

<body>

<header class="masthead">
    <div class="wrap">
        <a class="brand" href="index.php">ISHS<span class="brand-sub">LAB</span></a>
        <nav class="nav-left">
            <a href="index.php#features">기능</a>
            <a href="modules.php">스튜디오</a>
            <a href="index.php#guide">이용 안내</a>
            <span id="dday-counter" class="dday-pill"></span>
        </nav>
        <div class="nav-right">
            <button id="btn-login-open" class="nav-btn" onclick="location.href='auth.php?redirect=modules.php'"><span class="btn-label-full">로그인 · 가입</span><span class="btn-label-short">로그인</span></button>
            <div id="user-profile" class="user-pill">
                <span id="user-nickname" class="nickname">-</span>
                <button onclick="handleLogout()" title="로그아웃">
                    <span>로그아웃</span><span>&rarr;</span>
                </button>
            </div>
            <button id="theme-toggle" class="theme-toggle-btn" aria-label="다크모드 전환">
                <svg class="sun-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
                <svg class="moon-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
            </button>
        </div>
    </div>
</header>

<main>

    <!-- ─────────── 모듈 (실제 런처) ─────────── -->
    <section class="sec" id="modules">
        <div class="wrap">
            <div class="sec-head">
                <p class="label">스튜디오</p>
                <h2 class="h2">원하는 과목을 골라 시작하세요</h2>
            </div>
            <p class="modules-note">로그인하면 바로 시작할 수 있어요.</p>

            <div class="mod-grid">
                <article class="mod-card rv-drop" tabindex="0" role="button" onclick="enterModule('integral.php')">
                    <div class="mod-card__head">
                        <span class="mod-icon mod-icon--pb"><img src="assets/images/inticon.jpg" alt="Integral Studio"></span>
                    </div>
                    <h4 class="mod-name">Integral Studio</h4>
                    <p class="mod-name-ko">적분 스튜디오</p>
                    <p class="mod-desc">다양한 부정적분 문제로 실력을 다져보세요.</p>
                    <div class="mod-cta">시작하기<span class="mod-arr">&rarr;</span></div>
                </article>

                <article class="mod-card rv-drop" tabindex="0" role="button" onclick="enterModule('adv_math.php')">
                    <div class="mod-card__head">
                        <span class="mod-icon mod-icon--bm"><img src="assets/images/advmathicon.jpg" alt="Advanced Math Studio"></span>
                        <span class="mod-badge mod-badge--new">NEW</span>
                    </div>
                    <h4 class="mod-name">Advanced Math Studio</h4>
                    <p class="mod-name-ko">고급수학 스튜디오</p>
                    <p class="mod-desc">쌍곡선함수부터 행렬까지 심화 학습.</p>
                    <div class="mod-cta">시작하기<span class="mod-arr">&rarr;</span></div>
                </article>

                <article class="mod-card rv-drop" tabindex="0" role="button" onclick="enterModule('vocabulary.php')">
                    <div class="mod-card__head">
                        <span class="mod-icon mod-icon--pm"><img src="assets/images/vocabicon.jpg" alt="Vocabulary Studio"></span>
                    </div>
                    <h4 class="mod-name">Vocabulary Studio</h4>
                    <p class="mod-name-ko">영단어/지문 스튜디오</p>
                    <p class="mod-desc">플래시카드로 나만의 단어장을 암기하세요.</p>
                    <div class="mod-cta">시작하기<span class="mod-arr">&rarr;</span></div>
                </article>

                <article class="mod-card rv-drop" tabindex="0" role="button" onclick="enterModule('coding_test.php')">
                    <div class="mod-card__head">
                        <span class="mod-icon mod-icon--bm"><img src="assets/images/codingtesticon.jpg" alt="Coding Test"></span>
                    </div>
                    <h4 class="mod-name">Coding Test</h4>
                    <p class="mod-name-ko">코테 스튜디오</p>
                    <p class="mod-desc">알고리즘 템플릿과 예제를 확인하세요.</p>
                    <div class="mod-cta">시작하기<span class="mod-arr">&rarr;</span></div>
                </article>
            </div>
        </div>
    </section>

</main>

<footer class="foot">
    <div class="wrap">
        <a class="brand" href="index.php">ISHS<span class="brand-sub">LAB</span></a>
        <p class="colophon">&copy; <?= $year ?> ISHS 32nd — Developed by Dohye Lee. All rights reserved.</p>
        <nav>
            <a href="index.php#features">기능</a>
            <a href="modules.php">스튜디오</a>
            <a href="index.php#guide">이용 안내</a>
            <a href="auth.php?redirect=modules.php">로그인 · 가입</a>
        </nav>
    </div>
</footer>

<script>
    const AUTH_API = 'api/user_system.php';
    let isUserLoggedIn = false;

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
                document.getElementById('btn-login-open').style.display = '';
                document.getElementById('user-profile').style.display = 'none';
            }
        } catch (e) { console.error(e); }
    }
    function enterModule(url) {
        if (isUserLoggedIn) { location.href = url; }
        else { location.href = 'auth.php?redirect=' + encodeURIComponent(url); }
    }
    async function handleLogout() {
        await fetch(AUTH_API + '?action=logout', { method: 'POST' });
        location.reload();
    }
    document.addEventListener('DOMContentLoaded', () => {
        updateAuthUI();
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('msg') === 'login_required') {
            location.href = 'auth.php?msg=login_required&redirect=modules.php';
        }
        if (window.location.hash === '#signup') {
            location.href = 'auth.php?tab=signup&redirect=modules.php';
        }
        const updateDday = () => {
            const today = new Date();
            const d0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            let target = new Date(d0.getFullYear(), 9, 13);
            if (d0 > target) target.setFullYear(d0.getFullYear() + 1);
            const diff = Math.ceil((target - d0) / 86400000);
            const label = diff === 0 ? '중간고사까지 D-Day' : '중간고사까지 D-' + diff;
            const pill = document.getElementById('dday-counter');
            if (pill) pill.innerText = label;
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

<script>
(function(){
    var q=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s));};
    if(!('IntersectionObserver' in window))return;

    var items=[];
    function mark(el,cls,i){
        el.classList.add(cls);
        if(i)el.style.setProperty('--i',i);
        items.push(el);
    }
    q('.sec-head').forEach(function(scope){
        Array.prototype.slice.call(scope.children).forEach(function(el,i){mark(el,'rv',i);});
    });
    q('main .mod-card').forEach(function(el,i){mark(el,'rv-drop',i%4);});

    var io=new IntersectionObserver(function(entries){
        for(var i=0;i<entries.length;i++){
            var e=entries[i];
            if(e.isIntersecting||e.boundingClientRect.bottom<=0){
                e.target.classList.add('is-in');
                io.unobserve(e.target);
            }
        }
    },{rootMargin:'0px 0px -6% 0px',threshold:0.04});
    items.forEach(function(el){io.observe(el);});
})();
</script>

</body>
</html>
