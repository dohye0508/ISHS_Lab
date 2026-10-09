<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: auth.php?msg=login_required&redirect=korean_history.php');
    exit();
}
if (isset($_SESSION['role']) && $_SESSION['role'] === 'banned') {
    http_response_code(403);
    exit();
}
?>
<!doctype html>
<html lang="ko">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <title>Korean History Studio · ISHS LAB</title>
    <meta name="description" content="일제 강점기 41~57강을 이야기로 듣는 한국사 오디오북 스튜디오.">
    <link rel="icon" type="image/svg+xml" href="assets/images/korean_history.svg">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css">
    <link rel="stylesheet" href="assets/css/korean_history.css?v=20261009_1">
    <script>
        try { document.documentElement.dataset.theme = localStorage.getItem('theme') || 'light'; } catch (_) {}
    </script>
    <script src="korean_history_data/tracks.js?v=20261009_1"></script>
</head>
<body class="history-page">
    <header class="kh-nav">
        <a href="modules.php" class="kh-logo" title="스튜디오 목록으로"><span class="grad">ISHS<span class="lab">LAB</span></span></a>
        <button id="theme-toggle" type="button" aria-label="밝은 테마와 어두운 테마 전환">◐</button>
    </header>
    <main>
        <section class="kh-hero">
            <p class="eyebrow">KOREAN HISTORY STUDIO · 41–57강</p>
            <h1>이야기로 듣는, <em>일제 강점기.</em></h1>
            <div class="chips"><span class="chip" id="chipCount"></span><span class="chip" id="chipTime"></span></div>
            <button class="kh-btn main" id="startBtn" type="button"><span id="startLbl">처음부터 듣기</span></button>
        </section>
        <div id="list"></div>
    </main>

    <div class="dock"><div class="dock-in">
        <div class="now" id="now">강을 선택하세요</div>
        <div class="bar"><span id="cur">0:00</span><input type="range" id="seek" min="0" max="1000" value="0" aria-label="재생 위치"><span id="tot">0:00</span></div>
        <div class="ctrl">
            <div class="btns">
                <button class="i" id="prev" type="button" title="이전" aria-label="이전"><svg viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg></button>
                <button class="i play" id="play" type="button" title="재생/일시정지 (Space)" aria-label="재생/일시정지"><svg viewBox="0 0 24 24" id="playIcon"><path d="M8 5v14l11-7z"/></svg></button>
                <button class="i" id="next" type="button" title="다음" aria-label="다음"><svg viewBox="0 0 24 24"><path d="M16 6h2v12h-2zM6 18l8.5-6L6 6z"/></svg></button>
            </div>
            <div class="opts">
                <label class="sw"><input type="checkbox" id="auto" checked><b></b><span class="lbl">자동 다음</span></label>
                <select class="speed" id="speed" title="재생 속도" aria-label="재생 속도">
                    <option>0.8</option><option>0.9</option><option selected>1</option><option>1.1</option><option>1.25</option><option>1.5</option><option>1.75</option><option>2</option>
                </select>
            </div>
        </div>
    </div></div>
    <audio id="audio" preload="none"></audio>
    <script src="scripts/korean_history.js?v=20261009_1"></script>
</body>
</html>
