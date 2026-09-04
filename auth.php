<?php
session_start();
// Where to send the user after a successful login/signup. Only same-site relative
// paths are honored (no scheme, no leading //) to avoid turning this into an open redirect.
$redirect = isset($_GET['redirect']) ? $_GET['redirect'] : 'modules.php';
if (preg_match('/^https?:\/\//i', $redirect) || str_starts_with($redirect, '//') || str_starts_with($redirect, '\\')) {
    $redirect = 'modules.php';
}
// Already logged in? Nothing to do here -- go straight to the destination.
if (isset($_SESSION['user_id'])) {
    header("Location: " . $redirect);
    exit();
}
$initialTab = (isset($_GET['tab']) && $_GET['tab'] === 'signup') ? 'signup' : 'login';
$showLoginRequiredMsg = isset($_GET['msg']) && $_GET['msg'] === 'login_required';
?><!DOCTYPE html>
<html lang="ko">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>로그인 · 회원가입 — ISHS LAB</title>
<meta name="theme-color" content="#FFFFFF">
<link rel="icon" type="image/jpeg" href="assets/images/inticon.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css">
<script>
    (function () {
        var theme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', theme);
    })();
</script>
<style>
*,*::before,*::after{box-sizing:border-box}

:root{
    --paper:#FFFFFF;--paper-2:#F6F7FB;--patch:#FFFFFF;
    --ink:#17181F;--ink-2:#4A4B57;--ink-3:#8B8C99;
    --rule:#EAEAF1;--rule-2:#DEDFE9;
    --pink:#F472B6;--blue:#60A5FA;--mint:#5EEAD4;
    --blue-soft:rgba(96,165,250,.13);
    --mesh-a:rgba(244,114,182,.13);--mesh-b:rgba(96,165,250,.11);--mesh-c:rgba(94,234,212,.08);
    --sans:'Pretendard',system-ui,-apple-system,'Apple SD Gothic Neo',sans-serif;
}
[data-theme="dark"]{
    --paper:#111219;--paper-2:#181A24;--patch:#1B1D27;
    --ink:#F2F2F6;--ink-2:#C3C4D1;--ink-3:#8A8B9B;
    --rule:#2A2C38;--rule-2:#363847;
    --blue-soft:rgba(96,165,250,.14);
    --mesh-a:rgba(244,114,182,.16);--mesh-b:rgba(96,165,250,.14);--mesh-c:rgba(94,234,212,.10);
}
html,body{margin:0;padding:0}
html{overflow-x:hidden}
body{
    background-color:var(--paper);
    /* Same mesh-gradient language the rest of the site uses (index.php/modules.php),
       so the form side reads as part of the same page instead of a flat card bolted
       onto the dark hero -- both halves now share one continuous background feel. */
    background-image:
        radial-gradient(ellipse 60% 55% at 82% 12%, var(--mesh-b) 0%, transparent 72%),
        radial-gradient(ellipse 70% 62% at 70% 92%, var(--mesh-c) 0%, transparent 75%),
        radial-gradient(ellipse 55% 50% at 96% 55%, var(--mesh-a) 0%, transparent 72%);
    background-repeat:no-repeat;background-attachment:fixed;
    color:var(--ink);
    font:400 16px/1.6 var(--sans);letter-spacing:-.004em;
    -webkit-font-smoothing:antialiased;
    transition:background-color .25s ease,color .25s ease;
}

.auth-topbar{
    position:absolute;top:0;right:0;z-index:5;
    padding:20px clamp(20px,4vw,40px);
}
/* Matches the real site wordmark (.brand in index.php/modules.php) exactly --
   gradient-filled "ISHS" + muted "LAB" -- placed inside the hero panel (rather than
   a full-width topbar) so it's guaranteed to sit on the hero's always-dark
   background instead of risking dark-on-dark in light theme. */
.auth-brand{
    position:relative;z-index:1;display:inline-flex;align-items:center;
    text-decoration:none;font:800 22px/1 var(--sans);letter-spacing:-.03em;
    background:linear-gradient(100deg,var(--pink) 0%,var(--blue) 55%,var(--mint) 100%);
    -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;
    margin-bottom:auto;
}
.auth-brand-sub{font-weight:400;color:rgba(255,255,255,.55);margin-left:4px;-webkit-text-fill-color:rgba(255,255,255,.55)}
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

/* Fixed to exactly the viewport height (not min-height) so the page itself never
   scrolls -- the signup form has more fields than login and would otherwise stretch
   this whole row taller than the screen, dragging the hero's centered content down
   with it. Only .auth-form-side is allowed to scroll internally when its content
   doesn't fit; the hero always stays a stable, fully-visible 100vh. */
.auth-shell{display:flex;align-items:stretch;height:100vh}

/* Left hero: fixed dark "brand moment" panel, independent of light/dark theme,
   reusing the same pink/blue/mint palette as the rest of the site. Content is
   vertically centered (not bottom-pinned) so it lines up with the form side's own
   vertical centering instead of the two halves reading as unrelated compositions. */
.auth-hero{
    position:relative;flex:0 0 44%;min-width:0;overflow:hidden;
    display:flex;flex-direction:column;justify-content:center;
    padding:48px clamp(32px,4vw,64px) 56px;background:#15161E;
}
.auth-hero-bg{
    position:absolute;inset:-20%;z-index:0;
    background-image:
        radial-gradient(ellipse 60% 50% at 20% 15%, rgba(244,114,182,.55) 0%, transparent 72%),
        radial-gradient(ellipse 55% 48% at 85% 20%, rgba(96,165,250,.5) 0%, transparent 72%),
        radial-gradient(ellipse 70% 60% at 45% 90%, rgba(94,234,212,.4) 0%, transparent 75%);
    filter:blur(48px);animation:aurora-drift 14s ease-in-out infinite alternate;
}
@keyframes aurora-drift{
    0%{transform:translate(-3%,-2%) scale(1)}
    100%{transform:translate(3%,3%) scale(1.08)}
}
@media (prefers-reduced-motion:reduce){.auth-hero-bg{animation:none}}
.auth-hero-copy{position:relative;z-index:1;max-width:380px}
.auth-hero-copy h3{margin:0 0 12px;font:800 34px/1.25 var(--sans);color:#fff;letter-spacing:-.02em}
.auth-hero-copy p{margin:0 0 30px;font:400 15px/1.6 var(--sans);color:rgba(255,255,255,.62)}
.auth-steps{position:relative;z-index:1;display:flex;flex-direction:column;gap:10px;max-width:380px}
.auth-step{
    display:flex;align-items:center;gap:12px;padding:13px 16px;border-radius:16px;
    font:600 14px/1.3 var(--sans);color:rgba(255,255,255,.55);
    background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);
    transition:background .3s,color .3s,border-color .3s;
}
.auth-step.is-active{background:#fff;color:#15161E;border-color:#fff}
.auth-step-num{
    flex:0 0 auto;width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;
    font:700 12px/1 var(--sans);background:rgba(255,255,255,.14);color:rgba(255,255,255,.75);
    transition:background .3s,color .3s;
}
.auth-step.is-active .auth-step-num{background:#15161E;color:#fff}

/* Right side: the actual form, theme-aware and vertically centered so switching
   between the (short) login form and the (taller) signup form never resizes a
   container -- the content just recenters, no jarring height jump. Capped to the
   same 100vh as the hero and scrollable ON ITS OWN when the signup form's extra
   fields don't fit a short screen, so the page itself never grows or scrolls --
   "justify-content: safe center" is what keeps the top of the content reachable by
   scrolling instead of getting clipped above the fold the way plain "center" would. */
.auth-form-side{
    flex:1;min-width:0;height:100vh;overflow-y:auto;box-sizing:border-box;
    display:flex;flex-direction:column;justify-content:safe center;align-items:center;
    padding:40px clamp(24px,6vw,72px);
}
.auth-form-inner{width:100%;max-width:480px;flex:0 0 auto}
.auth-tabs{display:flex;align-items:center;gap:22px;border-bottom:1px solid var(--rule);padding-bottom:14px;margin-bottom:26px}
.auth-tab{
    background:none;border:none;cursor:pointer;padding:0;
    font:700 19px/1 var(--sans);color:var(--ink);opacity:.35;transition:opacity .2s;
}
.auth-tab.is-active{opacity:1}
.auth-form{display:flex;flex-direction:column;gap:14px}
.auth-field{display:flex;flex-direction:column;gap:6px}
.auth-field label{font:600 13px/1 var(--sans);color:var(--ink-2)}
.auth-input{
    width:100%;padding:15px 17px;border-radius:12px;border:1.5px solid var(--rule-2);
    background:var(--paper-2);color:var(--ink);box-sizing:border-box;
    font:400 15.5px/1.4 var(--sans);transition:border-color .2s,box-shadow .2s;
}
.auth-input:focus{outline:none;border-color:var(--blue);box-shadow:0 0 0 3px var(--blue-soft)}
.auth-pw-wrap{position:relative}
.auth-pw-wrap .auth-input{padding-right:44px}
.auth-pw-toggle{
    position:absolute;right:11px;top:50%;transform:translateY(-50%);
    background:none;border:none;cursor:pointer;padding:4px;display:flex;color:var(--ink-3);
}
.auth-pw-toggle:hover{color:var(--ink)}
.auth-pw-toggle svg{width:19px;height:19px}
.auth-submit{width:100%;margin-top:8px}
.auth-warn{
    background:var(--blue-soft);padding:13px 14px;border-radius:12px;
    font-size:13.5px;line-height:1.55;color:#2E6FCC;border-left:3px solid var(--blue);
}
[data-theme="dark"] .auth-warn{color:#9CC2FA}
.auth-divider{height:1px;background:var(--rule);margin:4px 0}
.auth-back{margin-top:26px;text-align:center;font:400 13.5px/1 var(--sans);color:var(--ink-3)}
.auth-back a{color:var(--ink-2);text-decoration:underline;text-underline-offset:3px}

.btn{
    display:inline-flex;align-items:center;justify-content:center;
    min-height:48px;padding:12px 22px;
    font:600 15px/1.2 var(--sans);letter-spacing:-.01em;
    text-decoration:none;border:1.5px solid var(--ink);border-radius:99px;
    cursor:pointer;background:transparent;color:var(--ink);
    transition:background-color .16s ease,color .16s ease,box-shadow .2s ease,transform .2s ease;
}
.btn--fill{background:var(--ink);color:var(--paper);border-color:var(--ink)}
.btn--fill:hover{box-shadow:0 8px 22px -6px rgba(96,165,250,.45),0 8px 22px -10px rgba(244,114,182,.4);transform:translateY(-1px)}
.btn--fill:disabled{opacity:.6;cursor:default;transform:none;box-shadow:none}

@media (max-width:760px){
    .auth-hero{display:none}
    .auth-form-side{padding:88px 20px 40px}
}
</style>
</head>

<body>

<div class="auth-topbar">
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

<div class="auth-shell">
    <div class="auth-hero">
        <div class="auth-hero-bg" aria-hidden="true"></div>
        <a class="auth-brand" href="index.php">ISHS<span class="auth-brand-sub">LAB</span></a>
        <div class="auth-hero-copy">
            <h3>함께 성장해요</h3>
            <p>3단계만 거치면 모든 스튜디오를 자유롭게 이용할 수 있어요.</p>
        </div>
        <div class="auth-steps">
            <div class="auth-step" id="hero-step-1"><span class="auth-step-num">1</span>리로스쿨 계정으로 학번 인증</div>
            <div class="auth-step" id="hero-step-2"><span class="auth-step-num">2</span>닉네임 &amp; 비밀번호 설정</div>
            <div class="auth-step" id="hero-step-3"><span class="auth-step-num">3</span>모든 스튜디오 이용 시작</div>
        </div>
    </div>

    <div class="auth-form-side">
        <div class="auth-form-inner">
            <div class="auth-tabs">
                <button type="button" id="tab-login" class="auth-tab" onclick="switchTab('login')">로그인</button>
                <button type="button" id="tab-signup" class="auth-tab" onclick="switchTab('signup')">회원가입</button>
            </div>

            <div id="form-login-container">
                <form onsubmit="event.preventDefault();submitLogin();" class="auth-form">
                    <div class="auth-field">
                        <label for="login-nickname">닉네임</label>
                        <input type="text" id="login-nickname" placeholder="닉네임" required class="auth-input" autocomplete="username">
                    </div>
                    <div class="auth-field">
                        <label for="login-password">비밀번호</label>
                        <div class="auth-pw-wrap">
                            <input type="password" id="login-password" placeholder="비밀번호" required class="auth-input" autocomplete="current-password">
                            <button type="button" class="auth-pw-toggle" onclick="togglePw('login-password', this)" aria-label="비밀번호 표시"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"></path><circle cx="12" cy="12" r="3"></circle></svg></button>
                        </div>
                    </div>
                    <button type="submit" id="login-submit-btn" class="btn btn--fill auth-submit">로그인</button>
                </form>
            </div>

            <div id="form-signup-container" style="display:none;">
                <form onsubmit="event.preventDefault();submitSignup();" class="auth-form">
                    <p class="auth-warn">학번 조회를 위해 리로스쿨 계정이 필요합니다. 비밀번호는 인증에만 쓰이고 저장되지 않아요.</p>
                    <div class="auth-field">
                        <label for="signup-riro-id">리로스쿨 ID</label>
                        <input type="text" id="signup-riro-id" placeholder="리로스쿨 ID" required class="auth-input" autocomplete="off" onfocus="setHeroStep(1)">
                    </div>
                    <div class="auth-field">
                        <label for="signup-riro-pw">리로스쿨 PW</label>
                        <div class="auth-pw-wrap">
                            <input type="password" id="signup-riro-pw" placeholder="리로스쿨 PW" required class="auth-input" autocomplete="off" onfocus="setHeroStep(1)">
                            <button type="button" class="auth-pw-toggle" onclick="togglePw('signup-riro-pw', this)" aria-label="비밀번호 표시"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"></path><circle cx="12" cy="12" r="3"></circle></svg></button>
                        </div>
                    </div>
                    <div class="auth-divider"></div>
                    <div class="auth-field">
                        <label for="signup-nickname">사용할 닉네임</label>
                        <input type="text" id="signup-nickname" placeholder="사용할 닉네임" required class="auth-input" autocomplete="off" onfocus="setHeroStep(2)">
                    </div>
                    <div class="auth-field">
                        <label for="signup-password">사용할 비밀번호</label>
                        <div class="auth-pw-wrap">
                            <input type="password" id="signup-password" placeholder="사용할 비밀번호" required class="auth-input" autocomplete="new-password" onfocus="setHeroStep(2)">
                            <button type="button" class="auth-pw-toggle" onclick="togglePw('signup-password', this)" aria-label="비밀번호 표시"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"></path><circle cx="12" cy="12" r="3"></circle></svg></button>
                        </div>
                    </div>
                    <button type="submit" id="signup-submit-btn" class="btn btn--fill auth-submit">인증 및 가입하기</button>
                </form>
            </div>

            <p class="auth-back"><a href="index.php">&larr; 홈으로 돌아가기</a></p>
        </div>
    </div>
</div>

<script>
    const AUTH_API = 'api/user_system.php';
    const REDIRECT_TARGET = <?= json_encode($redirect) ?>;

    function switchTab(tab) {
        const isLogin = tab === 'login';
        document.getElementById('tab-login').classList.toggle('is-active', isLogin);
        document.getElementById('tab-signup').classList.toggle('is-active', !isLogin);
        document.getElementById('form-login-container').style.display = isLogin ? 'block' : 'none';
        document.getElementById('form-signup-container').style.display = isLogin ? 'none' : 'block';
        setHeroStep(isLogin ? 3 : 1);
        history.replaceState(null, '', isLogin ? 'auth.php' + location.search.replace(/[?&]tab=signup/, '').replace(/^&/, '?') : (location.pathname + (location.search ? location.search + '&' : '?') + 'tab=signup'));
    }
    function setHeroStep(n) {
        for (let i = 1; i <= 3; i++) {
            const el = document.getElementById('hero-step-' + i);
            if (el) el.classList.toggle('is-active', i === n);
        }
    }
    const EYE_OPEN = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"></path><circle cx="12" cy="12" r="3"></circle>';
    const EYE_OFF = '<path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a20.6 20.6 0 0 1 5.06-6.06M9.9 4.24A10.4 10.4 0 0 1 12 4c7 0 11 8 11 8a20.6 20.6 0 0 1-3.22 4.44M14.12 14.12a3 3 0 1 1-4.24-4.24"></path><path d="M1 1l22 22"></path>';
    function togglePw(inputId, btn) {
        const input = document.getElementById(inputId);
        const showing = input.type === 'text';
        input.type = showing ? 'password' : 'text';
        btn.querySelector('svg').innerHTML = showing ? EYE_OPEN : EYE_OFF;
        btn.setAttribute('aria-label', showing ? '비밀번호 표시' : '비밀번호 숨기기');
    }

    async function submitLogin() {
        const nickname = document.getElementById('login-nickname').value;
        const password = document.getElementById('login-password').value;
        const btn = document.getElementById('login-submit-btn');
        btn.disabled = true;
        const res = await fetch(AUTH_API + '?action=login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nickname, password }) });
        const data = await res.json();
        if (data.status === 'success') { location.href = REDIRECT_TARGET; }
        else { btn.disabled = false; alert(data.message); }
    }
    async function submitSignup() {
        const riro_id = document.getElementById('signup-riro-id').value;
        const riro_pw = document.getElementById('signup-riro-pw').value;
        const nickname = document.getElementById('signup-nickname').value;
        const password = document.getElementById('signup-password').value;
        const btn = document.getElementById('signup-submit-btn');
        btn.textContent = '인증 중...'; btn.disabled = true;
        const res = await fetch(AUTH_API + '?action=signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ riro_id, riro_pw, nickname, password }) });
        const data = await res.json();
        if (data.status === 'success') {
            const r = await fetch(AUTH_API + '?action=login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nickname, password }) });
            const d = await r.json();
            if (d.status === 'success') { location.href = REDIRECT_TARGET; return; }
        }
        btn.textContent = '인증 및 가입하기'; btn.disabled = false;
        alert(data.message || '가입에 실패했습니다.');
    }

    document.getElementById('theme-toggle').addEventListener('click', () => {
        const cur = document.documentElement.getAttribute('data-theme');
        const next = cur === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });

    switchTab(<?= json_encode($initialTab) ?>);
    <?php if ($showLoginRequiredMsg): ?>
    alert('이 서비스를 이용하려면 먼저 로그인해주세요.');
    <?php endif; ?>
</script>

</body>
</html>
