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
$v = '20261018_1';
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
        <span class="kt-privacy" title="파일은 이 브라우저 안에서만 분석되고 서버로 전송되지 않아요.">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3zm-1 14-4-4 1.4-1.4L11 13.2l4.6-4.6L17 10l-6 6z"/></svg>
            내 기기에서만 분석
        </span>
        <span class="kt-spacer"></span>
        <button id="reload" class="btn ghost" type="button" hidden>새 파일 불러오기</button>
        <button id="theme-toggle" type="button" aria-label="밝은 테마와 어두운 테마 전환">◐</button>
    </header>

    <main>
        <section id="landing" class="landing">
            <p class="eyebrow">KAKAOTALK ANALYZER</p>
            <h1>우리 대화방을 <em>숫자로 읽어요.</em></h1>
            <p class="lede">카카오톡 대화 내보내기 파일을 올리면 참여자별 채팅 수, 자주 쓴 키워드, 활동 시간대와 성향을 한 번에 분석해요.
                제외할 사람과 기간도 자유롭게 고를 수 있어요.</p>

            <label id="drop" class="drop" for="file" tabindex="0">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.4 10.1A7.5 7.5 0 0 0 5 8.7 5.5 5.5 0 0 0 6 19.6h12.5a4.5 4.5 0 0 0 .9-9.5zM13 13v4h-2v-4H8l4-4.5 4 4.5h-3z"/></svg>
                <strong>대화 파일을 끌어다 놓거나 클릭해서 선택하세요</strong>
                <span>.txt 또는 .csv · 여러 개 선택 가능 · 8MB 이상도 문제없어요</span>
                <input id="file" type="file" accept=".txt,.csv,text/plain,text/csv" multiple>
            </label>
            <p id="loadError" class="load-error" role="alert" hidden></p>

            <div class="how">
                <div><b>1</b><span>카톡 채팅방 메뉴에서 <em>대화 내용 내보내기</em>를 선택해요.</span></div>
                <div><b>2</b><span><em>텍스트(.txt)</em>로 저장하고, 이 페이지에 올려요.</span></div>
                <div><b>3</b><span>기간·제외 인물을 고르며 <em>순위·키워드·성향</em>을 살펴봐요.</span></div>
            </div>

            <ul class="features">
                <li>참여자 순위</li><li>활동 추이</li><li>시간대 히트맵</li><li>핵심 키워드</li>
                <li>성향 칭호</li><li>답장 관계도</li><li>자동 리포트</li><li>대화 원문 검색</li>
            </ul>
            <p class="fine">대화 내용은 서버에 업로드되거나 저장되지 않아요. 필터 설정(제외한 이름 등)만 이 브라우저에 기억해요.</p>
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
