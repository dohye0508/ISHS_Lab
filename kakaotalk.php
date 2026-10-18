<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: auth.php?msg=login_required&redirect=kakaotalk.php');
    exit();
}
if (isset($_SESSION['role']) && $_SESSION['role'] === 'banned') {
    http_response_code(403);
    exit();
}
$v = '20261018_2';
?>
<!doctype html>
<html lang="ko">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <title>KakaoTalk Analyzer · ISHS LAB</title>
    <meta name="description" content="카카오톡 대화 내보내기 파일을 브라우저에서 분석해 참여자별 활동, 키워드, 성향을 보여주는 스튜디오.">
    <link rel="icon" type="image/svg+xml" href="assets/images/kakaotalk.svg">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css">
    <link rel="stylesheet" href="assets/css/kakaotalk.css?v=<?= $v ?>">
    <script>
        try { document.documentElement.dataset.theme = localStorage.getItem('theme') || 'light'; } catch (_) {}
    </script>
</head>
<body class="kt-page" data-ver="?v=<?= $v ?>">
    <a class="skip" href="#panel">본문으로 건너뛰기</a>
    <header class="kt-nav">
        <a href="modules.php" class="kt-logo" title="스튜디오 목록으로"><span class="grad">ISHS<span class="lab">LAB</span></span></a>
        <span class="kt-nav-title">KakaoTalk Analyzer</span>
        <span class="kt-spacer"></span>
        <button id="reload" class="btn ghost" type="button" hidden>새 파일 불러오기</button>
        <button id="theme-toggle" type="button" aria-label="밝은 테마와 어두운 테마 전환">◐</button>
    </header>

    <main>
        <section id="landing" class="landing">
            <h1>카톡 대화 분석</h1>
            <p class="lede">내보낸 대화 파일을 올리면 누가 많이 말하는지, 언제 활발한지, 어떤 말을 쓰는지 보여줘요.</p>
            <label id="drop" class="drop" for="file" tabindex="0">
                <strong>파일을 끌어다 놓거나 눌러서 선택</strong>
                <span>채팅방 메뉴 → 대화 내용 내보내기 → .txt</span>
                <input id="file" type="file" accept=".txt,.csv,text/plain,text/csv" multiple>
            </label>
            <p id="loadError" class="load-error" role="alert" hidden></p>
            <p class="fine">파일은 서버로 보내지 않고 이 브라우저에서만 분석해요.</p>
        </section>

        <section id="app" class="app" hidden>
            <div class="app-bar">
                <div id="roomInfo" class="room-info"></div>
                <button id="filterToggle" class="btn only-mobile" type="button" aria-expanded="false" aria-controls="filters">필터</button>
            </div>
            <div class="layout">
                <aside id="filters" class="filters" aria-label="분석 필터"></aside>
                <section class="content">
                    <div id="activeFilters" class="active-filters" aria-live="polite"></div>
                    <nav id="tabs" class="tabs" role="tablist" aria-label="분석 보기"></nav>
                    <div id="panel" class="panel" role="tabpanel" tabindex="-1"></div>
                </section>
            </div>
        </section>
    </main>

    <div id="loading" class="loading" hidden role="status" aria-live="polite">
        <div class="loading-card">
            <div class="spinner" aria-hidden="true"></div>
            <strong id="loadingStage">불러오는 중</strong>
            <span id="loadingFile"></span>
            <div class="progress"><i id="loadingBar"></i></div>
        </div>
    </div>

    <dialog id="personDlg" class="person-dlg" aria-label="참여자 상세"></dialog>

    <script src="scripts/kakaotalk/charts.js?v=<?= $v ?>"></script>
    <script src="scripts/kakaotalk/ui-panels.js?v=<?= $v ?>"></script>
    <script src="scripts/kakaotalk/ui.js?v=<?= $v ?>"></script>
</body>
</html>
