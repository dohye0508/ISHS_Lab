<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: auth.php?msg=login_required&redirect=biology.php');
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
    <title>Biology Studio · ISHS LAB</title>
    <meta name="description" content="발생학·세포·근육·식물 단원을 카드로 넘기며 외우는 생물학 암기 스튜디오.">
    <link rel="icon" type="image/svg+xml" href="assets/images/biology.svg">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css">
    <link rel="stylesheet" href="assets/css/biology.css?v=20261008_1">
    <script>
        try { document.documentElement.dataset.theme = localStorage.getItem('theme') || 'light'; } catch (_) {}
    </script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js"></script>
    <script src="biology_data/suji.js?v=20261008_1"></script>
    <!-- 선생님 분량: 새 파일을 biology_data/ 에 만든 뒤 아래에 한 줄만 추가하면 탭이 생깁니다. -->
    <script src="biology_data/gyeongmin.js?v=20261008_1"></script>
</head>
<body class="biology-page">
    <header class="bio-nav">
        <a href="modules.php" class="bio-logo" title="스튜디오 목록으로"><span class="grad">ISHS<span class="lab">LAB</span></span></a>
        <button id="theme-toggle" type="button" aria-label="밝은 테마와 어두운 테마 전환">◐</button>
    </header>
    <main>
        <section class="bio-hero">
            <div><p class="eyebrow">BIOLOGY STUDIO</p><h1>카드를 넘기며, <em>생명을 외우다.</em></h1></div>
        </section>

        <div class="tabs teachers" id="teachers" role="group" aria-label="선생님"></div>
        <div class="tabs topics" id="topics" role="group" aria-label="단원과 주제"></div>

        <div class="meta">
            <span><b id="pos">0</b> <span id="total"></span></span>
            <span id="statTxt"></span>
            <button class="bio-btn small" id="openGrid" type="button">목록</button>
        </div>
        <div class="line" aria-hidden="true"><i id="bar"></i></div>

        <div class="stage" id="stage"></div>

        <div class="actions">
            <div class="nav">
                <button class="bio-btn" id="bPrev" type="button">← 이전</button>
                <button class="bio-btn main" id="bFlip" type="button">정답 보기</button>
                <button class="bio-btn" id="bNext" type="button">다음 →</button>
            </div>
            <div class="marks">
                <button class="mark u" id="bUnsure" type="button" aria-pressed="false">헷갈려요</button>
                <button class="mark k" id="bKnown" type="button" aria-pressed="false">외웠어요</button>
            </div>
        </div>
    </main>

    <div class="drawer" id="drawer" hidden>
        <div class="panel" role="dialog" aria-label="목록과 설정">
            <div class="phead"><h2>카드 목록</h2><button class="bio-btn small" id="closeGrid" type="button">닫기</button></div>
            <div class="prow">
                <span class="seg" id="modeSeg" role="group" aria-label="보기 범위">
                    <button type="button" data-m="all" aria-pressed="true">전체</button>
                    <button type="button" data-m="unsure" aria-pressed="false">헷갈려요</button>
                    <button type="button" data-m="new" aria-pressed="false">안 본 것</button>
                </span>
                <button class="tog" id="shuf" type="button" aria-pressed="false">섞기</button>
                <form class="jump" id="jumpForm"><input id="jumpIn" type="number" min="1" inputmode="numeric" placeholder="번호"><button class="bio-btn small" type="submit">이동</button></form>
            </div>
            <div class="legend"><span class="l1">외웠어요</span><span class="l2">헷갈려요</span><span>안 본 것</span></div>
            <div class="grid" id="grid"></div>
            <div class="prow"><button class="tog" id="reset" type="button">이 선생님 기록 지우기</button></div>
        </div>
    </div>
    <footer>ISHS LAB · Biology Studio</footer>
    <script src="scripts/biology.js?v=20261008_1"></script>
</body>
</html>
