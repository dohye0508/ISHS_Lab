<?php
// Root index - ISHS LAB
$year = date('Y');
?><!DOCTYPE html>
<html lang="ko">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ISHS LAB</title>
<meta name="description" content="인천과학고등학교 32기 자기주도 학습 플랫폼. 적분, 고급수학, 어휘, 알고리즘까지 한 곳에서.">
<meta name="theme-color" content="#FFFFFF">
<link rel="icon" type="image/jpeg" href="assets/images/inticon.jpg">
<meta property="og:title" content="ISHS LAB">
<meta property="og:description" content="자기주도 학습을 위한 실험 공간.">
<meta property="og:image" content="assets/images/int.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css">
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js"></script>
<script>
    (function () {
        var theme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.classList.add('js');
    })();
</script>
<style>
/* ───────────────────────────────────────────────
   ISHS LAB — 화이트 톤 + 핑크·블루·민트 메시 그라데이션
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

    --mesh-a:rgba(244,114,182,.13);
    --mesh-a2:rgba(244,114,182,.11);
    --mesh-b:rgba(96,165,250,.11);
    --mesh-b2:rgba(96,165,250,.10);
    --mesh-c:rgba(94,234,212,.08);

    --sans:'Pretendard',system-ui,-apple-system,'Apple SD Gothic Neo',sans-serif;
    --pen:'Nanum Pen Script',cursive;

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

    --mesh-a:rgba(244,114,182,.16);
    --mesh-a2:rgba(244,114,182,.13);
    --mesh-b:rgba(96,165,250,.14);
    --mesh-b2:rgba(96,165,250,.12);
    --mesh-c:rgba(94,234,212,.10);
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

body,p,li,h1,h2,h3,h4,dt,dd,figcaption{word-break:keep-all;overflow-wrap:break-word}
h1,h2,h3,h4{margin:0;font-weight:700;letter-spacing:-.022em;line-height:1.28}
p{margin:0 0 1.05em}
p:last-child{margin-bottom:0}
ul,ol{margin:0;padding:0;list-style:none}
img{max-width:100%;display:block}
a{color:var(--ink)}
button{font-family:inherit}

.wrap{max-width:var(--wrap);margin:0 auto;padding:0 24px}
.sec{padding:clamp(48px,5.4vw,68px) 0}
.rule-top{border-top:1px solid var(--rule)}

/* ── 타입 유틸 ─────────────────────────────── */
.label{
    font:600 13px/1.5 var(--sans);
    letter-spacing:.07em;text-transform:uppercase;color:var(--ink-3);
}
.label--dark{color:var(--ink-3)}
.lead{font-size:19px;line-height:1.62;color:var(--ink-2)}
.nb{display:inline-block}
.h2{font-size:clamp(28px,3.6vw,42px);line-height:1.22}
.h3{font-size:clamp(21px,2.5vw,25px);line-height:1.28}

.note{
    font:400 30px/1.35 var(--pen);
    color:var(--ink-3);
    display:flex;align-items:flex-start;gap:10px;
    margin-top:14px;
}
.arw{flex:0 0 auto;width:48px;height:30px;margin-top:4px;transform:translateY(-2px)}

.ul{position:relative;display:inline-block;white-space:nowrap}
.ul svg{position:absolute;left:-1%;width:102%;height:.2em;bottom:-.2em;color:var(--ink);overflow:visible}

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
.btn--line{background:transparent;color:var(--ink)}
.btn--line:hover{background:var(--paper-2);border-color:var(--ink)}
.btn--sm{min-height:40px;padding:8px 16px;font-size:13.5px}

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

.cta{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
.cta-tip{margin-top:26px !important;font:400 14px/1.5 var(--sans);color:var(--ink-3)}

/* ── 히어로 ────────────────────────────────── */
.hero{
    padding:clamp(40px,4.8vw,58px) 0 clamp(44px,5vw,60px);
}
.hero-grid{display:grid;grid-template-columns:minmax(0,.98fr) minmax(0,1.1fr);gap:clamp(28px,3.4vw,42px);align-items:center}
.hero h1{
    font-size:clamp(42px,6.6vw,68px);
    line-height:1.12;font-weight:800;letter-spacing:-.035em;
    margin:0 0 18px;
}
.hero .lead{max-width:38ch;margin-bottom:0}
.hero-actions{margin-top:26px;display:flex;flex-wrap:wrap;align-items:center;gap:12px}

/* ── 앱 목업 (실 스크린샷 대신, 카드 위에 그린 화면) ── */
.figure{margin:0;position:relative}

/* ── 장식 일러스트 (투명 배경 SVG) ─────────────── */
.illust{
    position:absolute;pointer-events:none;user-select:none;
    filter:drop-shadow(0 16px 26px rgba(23,24,31,.16));
}
@media (max-width:900px){.illust{display:none}}
.frame{
    background:var(--patch);
    border:1px solid var(--rule);
    padding:0;
    box-shadow:0 30px 60px -24px rgba(96,165,250,.22),0 18px 34px -20px rgba(244,114,182,.18);
    position:relative;border-radius:20px;overflow:hidden;
}

.app-mock__body{padding:clamp(24px,3.4vw,36px)}
.app-mock__row{display:flex;gap:8px;margin-bottom:22px}
.pill{
    font:600 12.5px/1 var(--sans);letter-spacing:.01em;
    padding:6px 12px;border-radius:99px;border:1px solid var(--rule-2);color:var(--ink-2);
    background:var(--paper-2);
}
.pill--accent{color:var(--accent);border-color:transparent;background:var(--pink-soft)}
.app-mock__eq{
    min-height:64px;display:flex;align-items:center;justify-content:center;
    font-size:clamp(19px,2.6vw,25px);color:var(--ink);
    margin-bottom:22px;overflow-x:auto;text-align:center;
}
.app-mock__eq .katex{color:inherit}
.app-mock__input{
    display:flex;align-items:center;
    border:1.5px solid var(--rule-2);border-radius:12px;
    padding:14px 16px;margin-bottom:18px;background:var(--paper-2);
}
.caret{width:2px;height:20px;background:var(--blue);animation:blink-caret 1.1s step-end infinite}
@keyframes blink-caret{0%,100%{opacity:1}50%{opacity:0}}
.app-mock__actions{display:flex;gap:10px}
.app-mock__actions .btn{pointer-events:none}
.app-mock__actions3{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}
.app-mock__actions3 .btn{pointer-events:none}

.app-mock__bar2{
    display:flex;align-items:center;gap:10px;
    padding:14px clamp(20px,3vw,28px);border-bottom:1px solid var(--rule);
}
.app-mock__home{
    width:30px;height:30px;border-radius:50%;flex:0 0 auto;
    display:flex;align-items:center;justify-content:center;
    border:1.5px solid var(--rule-2);color:var(--ink-3);font-size:15px;
}
.app-mock__title{font-weight:700;font-size:14.5px;color:var(--ink-2);flex:1 1 auto;text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.app-mock__badges{display:flex;gap:6px;flex:0 0 auto}

.voc-hint{
    display:flex;align-items:center;gap:6px;justify-content:center;
    padding:10px 14px;border-radius:12px;background:var(--paper-2);
    color:var(--ink-3);font-size:13px;font-weight:600;margin-bottom:16px;
}
.voc-passage{
    padding:16px;border-radius:14px;background:var(--paper-2);
    font-size:14px;line-height:1.7;color:var(--ink-2);margin-bottom:16px;
}
.voc-blank{
    display:inline-block;color:var(--accent);font-weight:700;
    border-bottom:2px solid var(--accent);padding:0 2px;
}
.voc-blank em{font-style:normal;font-size:11px;color:var(--ink-3);font-weight:500;margin-left:2px}
.voc-answer-row{display:flex;gap:10px}
.voc-answer-row .app-mock__input{flex:1 1 auto;margin-bottom:0;color:var(--ink-3);font-size:14px}

.result-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-bottom:20px}
.result-chip{
    font:700 12px/1 var(--sans);letter-spacing:.01em;
    padding:9px 4px;border-radius:10px;text-align:center;border:1.5px solid transparent;
}
.result-chip.is-o{color:#0D9488;border-color:#5EEAD4;background:var(--mint-soft)}
.result-chip.is-x{color:var(--accent);border-color:var(--pink);background:var(--pink-soft)}
.result-detail{border-top:1px solid var(--rule);padding-top:16px}
.result-detail__head{display:flex;align-items:center;gap:8px;margin-bottom:10px;font:700 14px/1 var(--sans);color:var(--ink)}
.result-tag{font:700 11px/1 var(--sans);padding:4px 9px;border-radius:99px}
.result-tag.is-o{background:var(--mint-soft);color:#0D9488}
.result-detail__eq{font-size:19px;margin-bottom:14px;color:var(--ink)}
.result-detail__eq .katex,.result-detail__row .katex{color:inherit}
.result-detail__row{display:flex;align-items:baseline;gap:8px;font-size:13px;color:var(--ink-3);margin-bottom:6px}
.result-detail__row b{color:var(--ink-2);font-weight:700;flex:0 0 auto}
.result-detail__row span{font-size:15px;color:var(--ink-2)}

.row__heading{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.mod-icon-img{
    width:32px;height:32px;border-radius:9px;object-fit:cover;
    border:1px solid var(--rule-2);background:#fff;flex:0 0 auto;
}

/* ── 섹션 헤더 ─────────────────────────────── */
.sec-head{display:flex;align-items:baseline;gap:14px;margin-bottom:clamp(20px,2.6vw,30px);flex-wrap:wrap}
.sec-head .h2{flex:1 1 auto;min-width:0}
#features .sec-head{
    border-top:1px solid var(--rule);
    padding:22px 0 0;
}

/* ── 기능 행 (specimen 포함) ───────────────── */
.rows{display:flex;flex-direction:column;gap:clamp(34px,4vw,46px)}
.row{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,.92fr);gap:clamp(24px,3.2vw,40px);align-items:start;position:relative}
.row>div:not(.row__media){padding-top:clamp(6px,1.2vw,14px)}
.row--flip .row__media{order:-1}
.row__num{font:700 13px/1 var(--sans);letter-spacing:.1em;color:var(--ink-3);margin-bottom:10px}
.row h3{margin-bottom:12px}
.row p{color:var(--ink-2)}
.row .fact{margin-top:.35em;font-size:14.5px;line-height:1.65;color:var(--ink-3)}

.specimen{border:1px solid var(--rule);background:var(--patch);box-shadow:0 24px 50px -30px rgba(96,165,250,.28);border-radius:16px;overflow:hidden}
.specimen h4{padding:13px 20px;border-bottom:1px solid var(--rule);background:linear-gradient(90deg,var(--pink-soft),var(--blue-soft) 55%,var(--mint-soft));font-size:13.5px;font-family:var(--sans);font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--ink-3)}
.specimen li{display:flex;gap:14px;align-items:baseline;padding:12px 20px;border-bottom:1px solid var(--rule);font-size:15.5px;font-weight:500}
.specimen li:last-child{border-bottom:0}
.specimen li span{font:700 13px/1 var(--sans);color:var(--ink-3);flex:0 0 auto;width:24px}

/* ── 이용 안내 (그라데이션 틴트) ─────────────── */
.ink{
    background:
        radial-gradient(ellipse 60% 70% at 12% 15%, var(--pink-soft) 0%, transparent 60%),
        radial-gradient(ellipse 55% 60% at 88% 12%, var(--blue-soft) 0%, transparent 60%),
        radial-gradient(ellipse 50% 65% at 45% 100%, var(--mint-soft) 0%, transparent 60%),
        var(--paper-2);
    color:var(--ink);
}
.ink .wrap{position:relative}
.ink h2,.ink h3{color:var(--ink)}
.ink p{color:var(--ink-2)}
.steps{display:flex;flex-direction:column;gap:clamp(28px,3.4vw,40px)}
.step__text{max-width:58ch}
.step__n{
    font:700 14px/1 var(--sans);letter-spacing:.16em;
    color:var(--ink-3);border-top:1px solid var(--rule-2);
    padding-top:10px;margin-bottom:14px;display:block;
}
.steps--compact{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(22px,3vw,32px)}
.steps--compact .step__n{margin-bottom:10px}
.steps--compact .h3{font-size:clamp(19px,2.2vw,22px)}
@media (max-width:768px){.steps--compact{grid-template-columns:1fr}}

/* ── 시작하기 ──────────────────────────────── */
.dl{text-align:center}
.dl .wrap{position:relative}
.dl .h2{margin-bottom:14px}
.dl p{margin:0 auto 26px;color:var(--ink-2);white-space:nowrap}
.dl .cta{justify-content:center}

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
html.js .rv-fig{opacity:0;transition:opacity .45s ease}
html.js .rv-fig.is-in{opacity:1}
html.js .rv-fig .frame{
    transform:translateY(34px) scale(.95);
    transition:transform .72s cubic-bezier(.3,1.42,.46,1);
}
html.js .rv-fig.is-in .frame{transform:translateY(0) scale(1)}

/* ── 반응형 ────────────────────────────────── */
@media (max-width:960px){
    .hero-grid,.row{grid-template-columns:minmax(0,1fr)}
    .row--flip .row__media{order:0}
    .hero .lead{max-width:none}
}
@media (max-width:640px){
    body{font-size:16px}
    .nav-left a{display:none}
    .brand{font-size:22px}
    .dl p,.colophon{white-space:normal}
    .colophon{margin-left:0}
    .note{font-size:23px}
    .lead{font-size:16.5px}
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
    html.js .rv,html.js .rv-fig,html.js .rv-drop{opacity:1;transform:none}
}
</style>
</head>

<body>

<header class="masthead">
    <div class="wrap">
        <a class="brand" href="#top">ISHS<span class="brand-sub">LAB</span></a>
        <nav class="nav-left">
            <a href="#features">기능</a>
            <a href="modules.php">스튜디오</a>
            <a href="#guide">이용 안내</a>
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

<main id="top">

    <!-- ─────────── 히어로 ─────────── -->
    <section class="hero">
        <div class="wrap hero-grid">
            <div>
                <h1>복습이 귀찮다면,<br><span class="ul">ISHS LAB<svg viewBox="0 0 200 10" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="ulGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#F472B6"/><stop offset="55%" stop-color="#60A5FA"/><stop offset="100%" stop-color="#5EEAD4"/></linearGradient></defs><path d="M2 7.2C33 3.4 66 2.3 100 3.6c31 1.2 63 3.4 98 1.1" fill="none" stroke="url(#ulGrad)" stroke-width="3" stroke-linecap="round"/></svg></span></h1>
                <p class="lead"><span class="nb">적분부터 알고리즘, 단어까지 —</span> <span class="nb">문제 출제도 채점도, 전부 자동으로 끝나요</span></p>
                <div class="hero-actions">
                    <a class="btn btn--fill" href="modules.php">스튜디오 둘러보기</a>
                    <a class="btn btn--line" href="auth.php?redirect=modules.php">로그인 · 가입</a>
                </div>
                <p class="note"><svg class="arw" viewBox="0 0 40 24" aria-hidden="true"><path d="M2 4c10 12 20 15 34 14M27 12l9 6-8 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>문제마다 새로 생성되고, 제출 즉시 채점까지 끝나요</span></p>
            </div>

            <figure class="figure rv-fig">
                <div class="frame" aria-hidden="true">
                    <div class="app-mock__bar2">
                        <span class="app-mock__home"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg></span>
                        <span class="app-mock__title">Integrate your skills</span>
                        <span class="app-mock__badges">
                            <span class="pill">Level 5</span>
                            <span class="pill pill--accent">16 / 19</span>
                        </span>
                    </div>
                    <div class="app-mock__body">
                        <div class="app-mock__eq" id="heroEq"></div>
                        <div class="app-mock__input"><span class="caret"></span></div>
                        <div class="app-mock__actions3">
                            <span class="btn btn--line btn--sm">&larr; Previous</span>
                            <span class="btn btn--line btn--sm">적포(적분 포기)</span>
                            <span class="btn btn--fill btn--sm">Next &rarr;</span>
                        </div>
                    </div>
                </div>
                <img class="illust" src="assets/images/illust-laptop.svg" alt="" style="width:112px;right:-38px;bottom:-26px;transform:rotate(9deg)">
                <figcaption class="note"><span>정답까지 과정도 같이 확인해요</span></figcaption>
            </figure>
        </div>
    </section>

    <!-- ─────────── 기능 ─────────── -->
    <section class="sec" id="features">
        <div class="wrap">
            <div class="sec-head">
                <h2 class="h2">혼자 풀어도 확인까지 다 해줘요</h2>
            </div>

            <div class="rows">
                <article class="row">
                    <div>
                        <p class="row__num">01</p>
                        <h3 class="h3">문제는 무한, 피드백은 즉시</h3>
                        <p>부정적분부터 고급수학까지, 풀 때마다 새로운 문제가 생성되고 제출 즉시 채점돼요. 정답이 아니어도 어디서 틀렸는지 확인할 수 있어요.</p>
                    </div>
                    <figure class="figure row__media rv-fig">
                        <div class="frame" aria-hidden="true">
                            <div class="app-mock__bar2">
                                <span class="app-mock__home"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg></span>
                                <span class="app-mock__title">Test Result</span>
                                <span class="app-mock__badges"><span class="pill pill--accent">Score: 15 / 20</span></span>
                            </div>
                            <div class="app-mock__body">
                                <div class="result-grid">
                                    <span class="result-chip is-o">Q1 O</span>
                                    <span class="result-chip is-o">Q2 O</span>
                                    <span class="result-chip is-x">Q3 X</span>
                                    <span class="result-chip is-o">Q4 O</span>
                                    <span class="result-chip is-o">Q5 O</span>
                                    <span class="result-chip is-x">Q6 X</span>
                                    <span class="result-chip is-o">Q7 O</span>
                                    <span class="result-chip is-o">Q8 O</span>
                                </div>
                                <div class="result-detail">
                                    <div class="result-detail__head">
                                        <span>Q2</span>
                                        <span class="result-tag is-o">정답</span>
                                    </div>
                                    <div class="result-detail__eq" id="resultEq"></div>
                                    <p class="result-detail__row"><b>내가 쓴 답</b><span id="resultMyAns"></span></p>
                                    <p class="result-detail__row"><b>정답</b><span id="resultAns"></span></p>
                                </div>
                            </div>
                        </div>
                        <img class="illust" src="assets/images/illust-notebook.svg" alt="" style="width:92px;right:-56px;top:-32px;transform:rotate(8deg)">
                    </figure>
                </article>

                <article class="row row--flip">
                    <div>
                        <p class="row__num">02</p>
                        <div class="row__heading">
                            <img class="mod-icon-img" src="assets/images/vocabicon.jpg" alt="Vocabulary Studio 아이콘">
                            <h3 class="h3" style="margin:0">지문 속에서 바로 암기해요</h3>
                        </div>
                        <p>단어만 따로 외우지 않아요. 실제 지문 속 빈칸을 채우면서 문맥과 함께 기억하도록 만들었어요.</p>
                    </div>
                    <figure class="figure row__media rv-fig">
                        <div class="frame" aria-hidden="true">
                            <div class="app-mock__bar2">
                                <span class="app-mock__home"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg></span>
                                <span class="pill pill--accent">#12</span>
                                <span class="app-mock__badges">
                                    <span class="pill">Word Input</span>
                                    <span class="pill">Score: 0</span>
                                </span>
                            </div>
                            <div class="app-mock__body">
                                <div class="voc-hint">&#128065; 한글 해석 보기 (Show Hint)</div>
                                <div class="voc-passage">&hellip;traditional media is either strictly monitored or controlled by those in power under <span class="voc-blank">a__________<em>(13자)</em></span> governments. On the other hand, in democratic societies&hellip;</div>
                                <div class="voc-answer-row">
                                    <div class="app-mock__input">단어를 입력하세요...</div>
                                    <span class="btn btn--fill btn--sm">확인</span>
                                </div>
                            </div>
                        </div>
                        <img class="illust" src="assets/images/illust-book.svg" alt="" style="width:120px;left:-78px;bottom:-38px;transform:rotate(-7deg)">
                    </figure>
                </article>
            </div>
        </div>
    </section>

    <!-- ─────────── 이용 안내 (잉크 반전) ─────────── -->
    <section class="sec ink" id="guide">
        <div class="wrap">
            <img class="illust" src="assets/images/illust-cap.svg" alt="" style="width:100px;top:-6px;right:6px;transform:rotate(6deg)">
            <div class="sec-head">
                <h2 class="h2">가입부터 학습까지, 3단계면 충분해요</h2>
            </div>

            <div class="steps steps--compact">
                <article class="step step--compact rv">
                    <span class="step__n">STEP 01</span>
                    <h3 class="h3">학번 인증</h3>
                </article>
                <article class="step step--compact rv">
                    <span class="step__n">STEP 02</span>
                    <h3 class="h3">닉네임으로 로그인</h3>
                </article>
                <article class="step step--compact rv">
                    <span class="step__n">STEP 03</span>
                    <h3 class="h3">바로 시작</h3>
                </article>
            </div>
        </div>
    </section>

    <!-- ─────────── 시작하기 ─────────── -->
    <section class="sec rule-top dl" id="start">
        <div class="wrap">
            <img class="illust" src="assets/images/illust-rocket.svg" alt="" style="width:96px;top:-16px;right:26px;transform:rotate(9deg)">
            <h2 class="h2">지금, 학번 인증 한 번으로 시작하세요</h2>
            <p>가입은 1분이면 충분해요. 로그인하면 모든 스튜디오를 바로 이용할 수 있어요.</p>
            <div class="cta">
                <a class="btn btn--fill" href="auth.php?redirect=modules.php">로그인 · 가입</a>
                <a class="btn btn--line" href="modules.php">스튜디오 둘러보기</a>
            </div>
            <p class="cta-tip" id="dday-tip"></p>
        </div>
    </section>

<footer class="foot">
    <div class="wrap">
        <a class="brand" href="#top">ISHS<span class="brand-sub">LAB</span></a>
        <p class="colophon">&copy; <?= $year ?> ISHS 32nd — Developed by Dohye Lee. All rights reserved.</p>
        <nav>
            <a href="#features">기능</a>
            <a href="modules.php">스튜디오</a>
            <a href="#guide">이용 안내</a>
            <a href="auth.php?redirect=modules.php">로그인 · 가입</a>
        </nav>
    </div>
</footer>

</main>

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
            const tip = document.getElementById('dday-tip');
            if (tip) tip.innerText = label + (diff > 0 ? ' — 스튜디오로 미리 준비해두세요' : '');
        };
        updateDday();

        const renderMath = (id, tex, fallback, display) => {
            const el = document.getElementById(id);
            if (!el) return;
            if (window.katex) {
                katex.render(tex, el, { throwOnError: false, displayMode: !!display });
            } else {
                el.textContent = fallback;
            }
        };
        renderMath('heroEq', '\\displaystyle\\int \\ln\\!\\left(x+\\sqrt{x^2+1}\\right)\\,dx', '∫ ln(x+√(x²+1)) dx', true);
        renderMath('resultEq', '\\displaystyle\\int x^2 e^{x}\\,dx', '∫ x²eˣ dx', true);
        renderMath('resultMyAns', '(x^2-2x+2)e^{x}+C', '(x²−2x+2)eˣ + C', false);
        renderMath('resultAns', '(x^2-2x+2)e^{x}+C', '(x²−2x+2)eˣ + C', false);
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
    q('.hero-grid>div, .sec-head, .row>div:not(.row__media), .step, #start .wrap')
        .forEach(function(scope){
            Array.prototype.slice.call(scope.children).forEach(function(el,i){mark(el,'rv',i);});
        });
    q('main .figure').forEach(function(el){mark(el,'rv-fig',0);});
    q('main .specimen').forEach(function(el,i){mark(el,'rv-drop',i%4);});

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
