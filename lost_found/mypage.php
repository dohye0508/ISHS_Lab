<?php
/**
 * ISHS 분실물 센터 - 마이페이지 (Clean & Simple)
 */
session_start();
require_once '../db_config.php';

if (!isset($_SESSION['user_id'])) {
    header('Location: ../index.php?msg=login_required');
    exit;
}

$user_id = $_SESSION['user_id'];
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$user_id]);
$user = $stmt->fetch();

// 내 게시물
$tab = $_GET['tab'] ?? 'posts';
$page = max(1, (int)($_GET['page'] ?? 1));
$per_page = 10;
$offset = ($page - 1) * $per_page;

$my_posts_count = $pdo->prepare("SELECT COUNT(*) FROM lost_found_posts WHERE user_id=?");
$my_posts_count->execute([$user_id]);
$total_posts = $my_posts_count->fetchColumn();

$my_comments_count = $pdo->prepare("SELECT COUNT(*) FROM lost_found_comments WHERE user_id=?");
$my_comments_count->execute([$user_id]);
$total_comments = $my_comments_count->fetchColumn();

$resolved_count = $pdo->prepare("SELECT COUNT(*) FROM lost_found_posts WHERE user_id=? AND status='resolved'");
$resolved_count->execute([$user_id]);
$total_resolved = $resolved_count->fetchColumn();

if ($tab === 'posts') {
    $total = $total_posts;
    $stmt2 = $pdo->prepare("
        SELECT p.*,
               (SELECT filename FROM lost_found_images WHERE post_id=p.id ORDER BY id LIMIT 1) AS thumb,
               (SELECT COUNT(*) FROM lost_found_comments WHERE post_id=p.id) AS comment_count
        FROM lost_found_posts p
        WHERE p.user_id=?
        ORDER BY p.created_at DESC
        LIMIT $per_page OFFSET $offset
    ");
    $stmt2->execute([$user_id]);
    $items = $stmt2->fetchAll();
} else {
    $total = $total_comments;
    $stmt2 = $pdo->prepare("
        SELECT c.*, p.title AS post_title, p.id AS post_id
        FROM lost_found_comments c
        JOIN lost_found_posts p ON c.post_id = p.id
        WHERE c.user_id=?
        ORDER BY c.created_at DESC
        LIMIT $per_page OFFSET $offset
    ");
    $stmt2->execute([$user_id]);
    $items = $stmt2->fetchAll();
}
$total_pages = max(1, ceil($total / $per_page));

function time_ago($dt) {
    $diff = time() - strtotime($dt);
    if ($diff < 60)     return $diff . '초 전';
    if ($diff < 3600)   return floor($diff/60) . '분 전';
    if ($diff < 86400)  return floor($diff/3600) . '시간 전';
    if ($diff < 604800) return floor($diff/86400) . '일 전';
    return date('Y.m.d', strtotime($dt));
}
?>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>마이페이지 - 분실물 센터</title>
    <link rel="icon" type="image/jpeg" href="../assets/images/inticon.jpg">
    <link rel="stylesheet" href="../assets/css/style.css?v=lab_final_v6">
    <link rel="stylesheet" href="assets/css/lost_found.css">
    <script>
        (function () {
            var theme = localStorage.getItem('theme') || 'light';
            document.documentElement.setAttribute('data-theme', theme);
        })();
    </script>
</head>
<body>

    <!-- Auth UI Elements (Top-Left) -->
    <div id="auth-header" style="position: fixed; top: 20px; left: 20px; z-index: 10000; display: flex; align-items: center; gap: 10px;">
        <a href="index.php" style="background: rgba(var(--surface-rgb), 0.85); backdrop-filter: blur(10px); color: var(--text); padding: 8px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border); box-shadow: 0 4px 12px rgba(0,0,0,0.05);" title="분실물 센터 홈">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
        </a>

        <?php if ($user): ?>
            <div id="user-profile" style="display: flex; align-items: center; gap: 12px; background: rgba(var(--surface-rgb), 0.85); backdrop-filter: blur(10px); padding: 5px 15px; border-radius: 25px; border: 1px solid var(--border); box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                <span id="user-nickname" style="font-weight: 700; font-size: 0.9rem; color: var(--text);">
                    👤 <?= htmlspecialchars($user['nickname'] ?? $user['riro_name'] ?? '') ?>
                </span>
                <button onclick="handleLogout()" style="background: none; border: none; font-size: 1rem; color: #ea4335; cursor: pointer; padding: 0; display: flex; align-items: center; gap: 4px;" title="로그아웃">
                    <span style="font-size: 0.75rem; font-weight: 600;">로그아웃</span>
                    <span style="font-size: 1.1rem;">→</span>
                </button>
            </div>
        <?php endif; ?>
    </div>

    <!-- Theme Toggle (Top-Right) -->
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

    <div class="lost-found-container">
        
        <header class="lf-header">
            <h1>👤 마이페이지</h1>
            <p class="subtitle">작성한 글과 댓글을 관리하고 조회합니다.</p>
        </header>

        <!-- 프로필 통계 카드 -->
        <div class="lf-card" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
            <div>
                <h2 style="margin:0 0 8px 0; font-weight:800;"><?= htmlspecialchars($user['nickname'] ?? $user['riro_name'] ?? '사용자') ?></h2>
                <div style="font-size:0.85rem; opacity:0.7; display:flex; gap:8px;">
                    <?php if ($user['grade']): ?><span>🎓 <?= $user['grade'] ?>학년</span><?php endif; ?>
                    <?php if ($user['generation']): ?><span>✨ <?= $user['generation'] ?>기</span><?php endif; ?>
                </div>
            </div>
            
            <div style="display:flex; gap:24px;">
                <div style="text-align:center;">
                    <div style="font-size:1.5rem; font-weight:800; color:var(--primary);"><?= $total_posts ?></div>
                    <div style="font-size:0.75rem; opacity:0.6;">작성 글</div>
                </div>
                <div style="text-align:center;">
                    <div style="font-size:1.5rem; font-weight:800; color:var(--primary);"><?= $total_comments ?></div>
                    <div style="font-size:0.75rem; opacity:0.6;">댓글 수</div>
                </div>
                <div style="text-align:center;">
                    <div style="font-size:1.5rem; font-weight:800; color:var(--primary);"><?= $total_resolved ?></div>
                    <div style="font-size:0.75rem; opacity:0.6;">해결 완료</div>
                </div>
            </div>
        </div>

        <!-- 탭 네비게이션 -->
        <div style="display:flex; gap:10px; margin-bottom: 20px; border-bottom: 1px solid var(--border); padding-bottom: 8px;">
            <a href="?tab=posts" class="btn <?= $tab==='posts'?'primary':'secondary' ?>" style="text-decoration:none;">내 작성물 (<?= $total_posts ?>)</a>
            <a href="?tab=comments" class="btn <?= $tab==='comments'?'primary':'secondary' ?>" style="text-decoration:none;">내 댓글 (<?= $total_comments ?>)</a>
        </div>

        <!-- 목록 리스트 -->
        <?php if (empty($items)): ?>
            <div class="empty-state">
                <h3>작성된 내역이 없습니다.</h3>
            </div>
        <?php elseif ($tab==='posts'): ?>
            <div style="display:flex; flex-direction:column; gap:12px; margin-bottom: 30px;">
                <?php foreach ($items as $p): ?>
                    <div class="lf-card" style="padding:16px; margin-bottom:0; display:flex; justify-content:space-between; align-items:center; gap:16px;">
                        <div style="flex:1; min-width:0;">
                            <span class="badge-item type <?= $p['type'] ?>" style="font-size: 0.7rem; padding: 2px 6px;"><?= $p['type']==='lost'?'분실':'습득' ?></span>
                            <span class="badge-item status <?= $p['status'] === 'resolved' ? 'resolved' : '' ?>" style="font-size: 0.7rem; padding: 2px 6px;"><?= $p['status']==='resolved'?'해결완료':'찾는 중' ?></span>
                            <h3 style="margin:6px 0; font-size:1.05rem; font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                                <a href="view.php?id=<?= $p['id'] ?>" style="text-decoration:none; color:inherit;"><?= htmlspecialchars($p['title']) ?></a>
                            </h3>
                            <div style="font-size:0.8rem; opacity:0.6;">
                                📁 <?= htmlspecialchars($p['category']) ?> · 💬 <?= $p['comment_count'] ?> · 🕒 <?= time_ago($p['created_at']) ?>
                            </div>
                        </div>
                        <div style="flex-shrink:0;">
                            <a href="write.php?edit=<?= $p['id'] ?>" class="btn secondary" style="padding: 6px 12px; font-size:0.8rem; text-decoration:none;">수정</a>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php else: ?>
            <div style="display:flex; flex-direction:column; gap:12px; margin-bottom: 30px;">
                <?php foreach ($items as $c): ?>
                    <div class="lf-card" style="padding:16px; margin-bottom:0;">
                        <div style="font-size:0.8rem; opacity:0.6; margin-bottom:6px;">
                            💬 원문: <a href="view.php?id=<?= $c['post_id'] ?>" style="color:var(--primary); font-weight:700; text-decoration:none;"><?= htmlspecialchars($c['post_title']) ?></a>
                        </div>
                        <p style="margin:0; font-size:0.95rem; line-height:1.4;"><?= htmlspecialchars(mb_substr($c['content'], 0, 100)) ?><?= mb_strlen($c['content'])>100?'...':'' ?></p>
                        <div style="font-size:0.75rem; opacity:0.5; margin-top:6px;"><?= time_ago($c['created_at']) ?></div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>

        <!-- 페이지네이션 -->
        <?php if ($total_pages > 1): ?>
            <div class="lf-pagination">
                <?php if ($page>1): ?><a href="?tab=<?= $tab ?>&page=<?= $page-1 ?>" class="btn secondary">‹ 이전</a><?php endif; ?>
                <?php for ($i=max(1,$page-2); $i<=min($total_pages,$page+2); $i++): ?>
                    <a href="?tab=<?= $tab ?>&page=<?= $i ?>" class="btn <?= $i===$page?'primary':'secondary' ?>"><?= $i ?></a>
                <?php endfor; ?>
                <?php if ($page<$total_pages): ?><a href="?tab=<?= $tab ?>&page=<?= $page+1 ?>" class="btn secondary">다음 ›</a><?php endif; ?>
            </div>
        <?php endif; ?>

        <footer class="footer">
            © 2026 ISHS 32nd - Developed by Dohye Lee. All rights reserved.
        </footer>
    </div>

    <script>
        // 테마 토글
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

        async function handleLogout() {
            await fetch('../api/user_system.php?action=logout', { method: 'POST' });
            location.href = 'index.php';
        }
    </script>
</body>
</html>
