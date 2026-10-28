<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: auth.php?msg=login_required&redirect=rocks.php');
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
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>Rock ID Studio · ISHS LAB</title>
    <meta name="description" content="암석 사진을 보고 이름을 맞히는 지구과학 실험 수행평가 대비 스튜디오.">
    <link rel="icon" type="image/svg+xml" href="assets/images/rocks.svg">
    <meta property="og:title" content="Rock ID Studio">
    <meta property="og:description" content="암석 사진을 보고 이름을 맞히는 지구과학 실험 수행평가 대비 스튜디오.">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css">
    <link rel="stylesheet" href="assets/css/rocks.css?v=20261028_1">
    <script>
        (function () {
            var theme = 'light';
            try { theme = localStorage.getItem('theme') || 'light'; } catch (_) {}
            document.documentElement.setAttribute('data-theme', theme);
        })();
    </script>
</head>
<body class="rocks-page">
    <header class="rk-top">
        <a class="rk-logo" href="modules.php" title="스튜디오 목록으로">ISHS<span>LAB</span></a>
        <div class="rk-top-right">
            <div id="user-profile" class="rk-user" hidden>
                <span id="user-nickname"></span>
                <button type="button" onclick="handleLogout()" title="로그아웃">로그아웃 →</button>
            </div>
            <button id="theme-toggle" class="rk-icon-btn" type="button" aria-label="밝은 테마와 어두운 테마 전환">
                <svg class="sun-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                <svg class="moon-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            </button>
        </div>
    </header>

    <main id="app"></main>

    <footer class="rk-footer">
        © 2026 ISHS 32nd - Developed by Dohye Lee. All rights reserved.
        <div id="rock-credit"></div>
    </footer>

    <div class="rk-lightbox" id="lightbox" hidden><div class="rk-lightbox-stage"><img alt=""></div><p>누르면 닫힘</p></div>

    <script src="data/rocks/rocks.js?v=20261028_1"></script>
    <script src="scripts/rocks.js?v=20261028_1"></script>
    <script>
        const AUTH_API = 'api/user_system.php';
        async function updateAuthUI() {
            try {
                const res = await fetch(`${AUTH_API}?action=status`);
                const data = await res.json();
                if (data.logged_in) {
                    document.getElementById('user-profile').hidden = false;
                    document.getElementById('user-nickname').textContent = data.user.nickname;
                }
            } catch (e) { console.error('Auth status error:', e); }
        }
        async function handleLogout() {
            await fetch(`${AUTH_API}?action=logout`, { method: 'POST' });
            location.href = 'index.php';
        }
        document.addEventListener('DOMContentLoaded', updateAuthUI);
        document.getElementById('theme-toggle').addEventListener('click', function () {
            const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            try { localStorage.setItem('theme', next); } catch (_) {}
        });
    </script>
</body>
</html>
