<?php
/**
 * ISHS 분실물 센터 - 메인 목록 페이지 (최종 개편 버전)
 */
session_start();
require_once '../db_config.php';

// 로그인 확인
$logged_in = isset($_SESSION['user_id']);
$current_user = null;
if ($logged_in) {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    $current_user = $stmt->fetch();
}

$notifications = [];
$unread_count = 0;
if ($logged_in) {
    $notif_stmt = $pdo->prepare("SELECT * FROM lost_found_notifications WHERE user_id = ? ORDER BY id DESC LIMIT 5");
    $notif_stmt->execute([$_SESSION['user_id']]);
    $notifications = $notif_stmt->fetchAll();

    $unread_stmt = $pdo->prepare("SELECT COUNT(*) FROM lost_found_notifications WHERE user_id = ? AND is_read = 0");
    $unread_stmt->execute([$_SESSION['user_id']]);
    $unread_count = (int) $unread_stmt->fetchColumn();
}

// 필터 파라미터
$type = $_GET['type'] ?? 'all';     // all / lost / found
$cat = $_GET['cat'] ?? '';
$status = $_GET['status'] ?? 'all';     // all / searching / resolved
$search = $_GET['search'] ?? '';
$page = max(1, (int) ($_GET['page'] ?? 1));
$per_page = 12;
$offset = ($page - 1) * $per_page;

$categories = ['📁 선택 안함', '💳 지갑/카드', '💻 전자기기', '👕 의류/잡화', '🔑 열쇠', '✏️ 필기구/문구', '📖 도서/노트', '⚽ 스포츠용품', '📦 기타'];

// 쿼리 빌드
$where = [];
$params = [];

if ($type !== 'all') {
    $where[] = 'p.type = ?';
    $params[] = $type;
}
if ($cat !== '') {
    $where[] = 'p.category = ?';
    $params[] = $cat;
}
if ($status !== 'all') {
    $where[] = 'p.status = ?';
    $params[] = $status;
}
if ($search !== '') {
    $where[] = '(p.title LIKE ? OR p.content LIKE ? OR p.location LIKE ?)';
    $params[] = "%$search%";
    $params[] = "%$search%";
    $params[] = "%$search%";
}

$where_sql = $where ? 'WHERE ' . implode(' AND ', $where) : '';

// 총 개수 및 데이터 가져오기 (테이블 없을 시 예외 처리)
try {
    $count_stmt = $pdo->prepare("SELECT COUNT(*) FROM lost_found_posts p $where_sql");
    $count_stmt->execute($params);
    $total = $count_stmt->fetchColumn();
    $total_pages = max(1, ceil($total / $per_page));

    // 게시물 목록
    $stmt = $pdo->prepare("
        SELECT p.*, u.nickname, u.riro_name,
               (SELECT filename FROM lost_found_images WHERE post_id = p.id ORDER BY id LIMIT 1) AS thumb,
               (SELECT COUNT(*) FROM lost_found_comments WHERE post_id = p.id) AS comment_count,
               (SELECT COUNT(*) FROM lost_found_likes WHERE post_id = p.id) AS like_count
        FROM lost_found_posts p
        JOIN users u ON p.user_id = u.id
        $where_sql
        ORDER BY CASE WHEN p.status = 'resolved' THEN 1 ELSE 0 END ASC, p.created_at DESC
        LIMIT $per_page OFFSET $offset
    ");
    $stmt->execute($params);
    $posts = $stmt->fetchAll();

    // 통계
    $stats_lost = $pdo->query("SELECT COUNT(*) FROM lost_found_posts WHERE type='lost'")->fetchColumn();
    $stats_found = $pdo->query("SELECT COUNT(*) FROM lost_found_posts WHERE type='found'")->fetchColumn();
    $stats_resolved = $pdo->query("SELECT COUNT(*) FROM lost_found_posts WHERE status='resolved'")->fetchColumn();

    $total_all = $stats_lost + $stats_found + $stats_resolved;
    $resolve_rate = $total_all > 0 ? round(($stats_resolved / $total_all) * 100) : 0;

    $my_posts_count = 0;
    if ($logged_in) {
        $my_posts_stmt = $pdo->prepare("SELECT COUNT(*) FROM lost_found_posts WHERE user_id = ?");
        $my_posts_stmt->execute([$_SESSION['user_id']]);
        $my_posts_count = (int) $my_posts_stmt->fetchColumn();
    }
} catch (PDOException $e) {
    if (strpos($e->getMessage(), 'Base table or view not found') !== false) {
        die("<div style='text-align:center; padding: 50px; font-family: sans-serif;'><h2>데이터베이스 초기화 필요</h2><p>아직 분실물 센터 DB가 설치되지 않았습니다.</p><p><a href='init_db.php' style='display:inline-block; padding:10px 20px; background:#1a73e8; color:white; text-decoration:none; border-radius:6px; margin-top:20px;'>👉 여기를 눌러 DB를 초기화해주세요</a></p></div>");
    }
    throw $e;
}

function get_category_emoji($category)
{
    $category = trim($category);
    if (empty($category))
        return '📁';
    $parts = explode(' ', $category);
    if (count($parts) > 1) {
        return $parts[0];
    }
    // 이모지가 없는 경우 카테고리에 맞춰 리턴
    if (strpos($category, '지갑') !== false || strpos($category, '카드') !== false)
        return '💳';
    if (strpos($category, '전자') !== false || strpos($category, '컴퓨터') !== false)
        return '💻';
    if (strpos($category, '의류') !== false || strpos($category, '잡화') !== false)
        return '👕';
    if (strpos($category, '열쇠') !== false)
        return '🔑';
    if (strpos($category, '필기') !== false || strpos($category, '문구') !== false)
        return '✏️';
    if (strpos($category, '도서') !== false || strpos($category, '노트') !== false)
        return '📖';
    if (strpos($category, '스포츠') !== false)
        return '⚽';
    return '📦';
}
?>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ISHS 분실물 센터</title>
    <link rel="icon" type="image/jpeg" href="../assets/images/inticon.jpg">
    <link rel="stylesheet" href="../assets/css/style.css?v=lab_final_v6">
    <link rel="stylesheet" href="assets/css/lost_found.css">
    <style>
        /* 연두색 퍼스널컬러 강제 적용 */
        :root {
            --primary: #5aaa00;
            --primary-rgb: 90, 170, 0;
        }
        [data-theme="dark"] {
            --primary: #7ed321;
            --primary-rgb: 126, 211, 33;
        }
        /* Lost & Found 헤더 accent */
        .lf-header h1 .accent {
            color: #5aaa00 !important;
        }
        [data-theme="dark"] .lf-header h1 .accent {
            color: #7ed321 !important;
        }
    </style>
    <script>
        (function () {
            var theme = localStorage.getItem('theme') || 'light';
            document.documentElement.setAttribute('data-theme', theme);
        })();
        function handleLogout() {
            if(confirm('로그아웃 하시겠습니까?')) {
                fetch('../api/user_system.php?action=logout').then(() => {
                    location.href = '../index.php';
                });
            }
        }
    </script>
</head>
<body>

    <!-- Auth UI Elements (Top-Left) -->
    <div id="auth-header" style="position: fixed; top: 20px; left: 20px; z-index: 10000; display: flex; align-items: center; gap: 10px;">
        <a href="../index.php" style="background: var(--surface); backdrop-filter: blur(10px); color: var(--text); padding: 8px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border); box-shadow: 0 4px 12px rgba(0,0,0,0.05);" title="홈으로">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
        </a>

        <?php if ($logged_in): ?>
                <div id="user-profile" style="display: flex; align-items: center; gap: 12px; background: var(--surface); backdrop-filter: blur(10px); padding: 5px 15px; border-radius: 25px; border: 1px solid var(--border); box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                    <span id="user-nickname" style="font-weight: 700; font-size: 0.9rem; color: var(--text);"><?= htmlspecialchars($current_user['nickname'] ?? $current_user['riro_name'] ?? 'User') ?></span>
                    <button onclick="handleLogout()" style="background: none; border: none; font-size: 1rem; color: #ea4335; cursor: pointer; padding: 0; display: flex; align-items: center; gap: 4px;" title="로그아웃">
                        <span style="font-size: 0.75rem; font-weight: 600;">로그아웃</span>
                        <span style="font-size: 1.1rem;">→</span>
                    </button>
                </div>
        <?php else: ?>
                <button onclick="openLoginModal()" class="btn secondary" style="padding: 8px 16px; font-size: 0.85rem; border-radius: 20px; background: var(--surface); color: var(--text); border: 1px solid var(--border); cursor: pointer;">
                    로그인
                </button>
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
            <h1><span class="accent">Lost & Found</span> Studio</h1>
            <p class="subtitle">인천과학고등학교 분실물 센터</p>
        </header>

        <!-- 실시간 현황 및 보관소 보관 수칙 위젯 -->
        <div class="lf-notice-widgets">
            <div class="lf-widget-card notice" style="padding: 12px 16px; display: flex; flex-direction: column;">
                <div class="widget-title" style="margin-bottom: 4px;">실시간 분실물 해결 현황</div>
                <div class="widget-body" style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
                    <div style="display:flex; justify-content:space-around; align-items:center; text-align:center; padding: 4px 0;">
                        <div>
                            <div style="font-size:1.3rem; font-weight:800; color:#d93025;"><?= number_format($stats_lost) ?></div>
                            <div style="font-size:0.75rem; opacity:0.7;">찾는 중</div>
                        </div>
                        <div style="width:1px; height:24px; background:var(--border);"></div>
                        <div>
                            <div style="font-size:1.3rem; font-weight:800; color:#1e8e3e;"><?= number_format($stats_found) ?></div>
                            <div style="font-size:0.75rem; opacity:0.7;">습득 신고</div>
                        </div>
                        <div style="width:1px; height:24px; background:var(--border);"></div>
                        <div>
                            <div style="font-size:1.3rem; font-weight:800; color:var(--primary);"><?= number_format($stats_resolved) ?></div>
                            <div style="font-size:0.75rem; opacity:0.7;">해결 완료</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="lf-widget-card tip" style="padding: 12px 16px; display: flex; flex-direction: column; justify-content: center;">
                <div class="widget-title" style="margin-bottom: 6px;">💡 분실물 센터 이용 팁</div>
                <div class="widget-body">
                    <ul style="font-size:0.8rem; margin: 0; padding-left: 16px;">
                        <li style="margin-bottom: 2px;">게시물 작성 시 정확한 식별을 위해 <strong>사진 첨부</strong>를 권장합니다.</li>
                        <li style="margin-bottom: 2px;">장소나 특징을 자세히 적어주시면 물건을 더 빨리 찾을 수 있습니다.</li>
                        <li>해결이 완료된 게시물은 직접 <strong>'해결완료'</strong> 상태로 변경해 주세요.</li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Notion/GitHub 스타일 통합 필터바 -->
        <form action="index.php" method="GET" class="lf-toolbar">
            <!-- 유형 필터 -->
            <select name="type" class="lf-select-compact" onchange="this.form.submit()">
                <option value="all" <?= $type === 'all' ? 'selected' : '' ?>>모든 유형</option>
                <option value="lost" <?= $type === 'lost' ? 'selected' : '' ?>>분실물</option>
                <option value="found" <?= $type === 'found' ? 'selected' : '' ?>>습득물</option>
            </select>

            <!-- 카테고리 필터 -->
            <select name="cat" class="lf-select-compact" onchange="this.form.submit()">
                <option value="">모든 카테고리</option>
                <?php foreach ($categories as $c): ?>
                        <option value="<?= $c ?>" <?= $cat === $c ? 'selected' : '' ?>><?= $c ?></option>
                <?php endforeach; ?>
            </select>

            <!-- 상태 필터 -->
            <select name="status" class="lf-select-compact" onchange="this.form.submit()">
                <option value="all" <?= $status === 'all' ? 'selected' : '' ?>>모든 상태</option>
                <option value="searching" <?= $status === 'searching' ? 'selected' : '' ?>>찾는 중</option>
                <option value="resolved" <?= $status === 'resolved' ? 'selected' : '' ?>>해결 완료</option>
            </select>

            <!-- 검색 및 등록 -->
            <input type="text" name="search" placeholder="검색" value="<?= htmlspecialchars($search) ?>" class="lf-input-compact">
            <button type="submit" class="btn-compact primary" style="padding: 0 24px; font-size: 0.95rem; font-weight: 800; display:inline-flex; gap:6px; align-items:center;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                검색
            </button>
            <a href="write.php" class="btn-compact" style="background: #d93025; color: white; border-color: #d93025; padding: 0 28px; font-size: 0.95rem; font-weight: 800; display:inline-flex; gap:6px; align-items:center; text-decoration:none;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                등록
            </a>
        </form>

        <div class="result-summary">
            검색 결과: 총 <strong><?= number_format($total) ?></strong>개
        </div>

        <!-- 게시물 그리드 (분실/습득에 따른 은은한 뒷배경 색상 적용) -->
        <?php if (empty($posts)): ?>
                <div class="empty-state">
                    <h3>등록된 게시글이 없습니다.</h3>
                    <p>유형이나 카테고리 필터를 변경하거나 새로운 글을 작성해 보세요.</p>
                </div>
        <?php else: ?>
                <div class="posts-grid">
                    <?php foreach ($posts as $post): ?>
                            <div class="post-card <?= $post['type'] ?> <?= $post['status'] === 'resolved' ? 'resolved' : '' ?>">
                                <a href="view.php?id=<?= $post['id'] ?>" onclick="event.preventDefault(); openPostModal(<?= $post['id'] ?>)" style="text-decoration: none; color: inherit;">
                                    <div class="card-img-container">
                                        <?php if ($post['thumbnail_type'] === 'image' && $post['thumb']): ?>
                                                <img src="uploads/<?= htmlspecialchars($post['thumb']) ?>" alt="">
                                        <?php elseif ($post['thumbnail_type'] === 'text' && !empty($post['thumbnail_text'])): ?>
                                                <span class="card-img-placeholder text-thumb" style="font-size: 1.15rem; font-weight: 800; color: var(--primary); letter-spacing: -0.5px; background: rgba(var(--primary-rgb), 0.05);">
                                                    <?= htmlspecialchars($post['thumbnail_text']) ?>
                                                </span>
                                        <?php else: ?>
                                                <span class="card-img-placeholder" style="font-size: 2.2rem; display:flex; align-items:center; justify-content:center; background: rgba(var(--primary-rgb), 0.03); width: 100%; height: 100%;">
                                                    <?= get_category_emoji($post['category']) ?>
                                                </span>
                                        <?php endif; ?>

                                        <?php if ($post['status'] === 'resolved'): ?>
                                                <div class="card-resolved-badge">해결 완료</div>
                                        <?php endif; ?>
                                    </div>

                                    <div class="card-info">
                                        <div class="card-badges-row">
                                            <?php if ($post['type'] === 'lost'): ?>
                                                    <span class="card-pill lost" style="display:inline-flex; align-items:center;">
                                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align:middle; margin-right:3px;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                                        분실
                                                    </span>
                                            <?php else: ?>
                                                    <span class="card-pill found" style="display:inline-flex; align-items:center;">
                                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align:middle; margin-right:3px;"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                                                        습득
                                                    </span>
                                            <?php endif; ?>
                                        </div>
                                        <h3 class="card-title"><?= htmlspecialchars($post['title']) ?></h3>
                                        <div class="card-category-text">카테고리 : <?= htmlspecialchars($post['category']) ?></div>
                                        <div class="card-loc">
                                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle; margin-right:3px; opacity:0.7;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                            장소 : <?= htmlspecialchars($post['location'] ?: '장소 미기재') ?>
                                        </div>
                                        <?php if ($post['type'] === 'found' && $post['keep_location']): ?>
                                                <div class="card-loc" style="margin-top: 2px;">
                                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle; margin-right:3px; opacity:0.7;"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                                                    수령 : <?= htmlspecialchars($post['keep_location']) ?>
                                                </div>
                                        <?php endif; ?>
                                        <div class="card-loc" style="margin-top: 2px;">
                                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle; margin-right:3px; opacity:0.7;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                            일시 : <?= $post['lost_date'] ? date('Y.m.d', strtotime($post['lost_date'])) : '미지정' ?>
                                        </div>
                                        <div class="card-footer">
                                            <span style="font-weight: 700; color: var(--text);">
                                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle; margin-right:2px; opacity:0.7;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                                <?= htmlspecialchars(($post['riro_name'] ?: '알수없음') . ($post['nickname'] ? '(' . $post['nickname'] . ')' : '')) ?>
                                            </span>
                                            <span>
                                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle; margin-right:2px; opacity:0.7;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                                <?= $post['comment_count'] ?>
                                                &nbsp;
                                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle; margin-right:2px; opacity:0.7;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                                <?= $post['views'] ?>
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            </div>
                    <?php endforeach; ?>
                </div>

                <!-- 페이지네이션 -->
                <?php if ($total_pages > 1): ?>
                        <div class="lf-pagination">
                            <?php if ($page > 1): ?>
                                    <a href="?<?= http_build_query(array_merge($_GET, ['page' => $page - 1])) ?>" class="btn-compact secondary">‹ 이전</a>
                            <?php endif; ?>
                            <?php for ($i = max(1, $page - 2); $i <= min($total_pages, $page + 2); $i++): ?>
                                    <a href="?<?= http_build_query(array_merge($_GET, ['page' => $i])) ?>" class="btn-compact <?= $i === $page ? 'primary' : 'secondary' ?>"><?= $i ?></a>
                            <?php endfor; ?>
                            <?php if ($page < $total_pages): ?>
                                    <a href="?<?= http_build_query(array_merge($_GET, ['page' => $page + 1])) ?>" class="btn-compact secondary">다음 ›</a>
                            <?php endif; ?>
                        </div>
                <?php endif; ?>
        <?php endif; ?>

        <!-- Footer -->
        <footer class="footer" style="margin-top: 60px;">
            © 2026 ISHS 32nd - Developed by Dohye Lee. All rights reserved.
        </footer>
    </div>

    <?php if ($logged_in): ?>
            <!-- Floating Notifications Widget -->
            <div id="notif-floating-widget" style="position: fixed; bottom: 25px; right: 25px; z-index: 10000; display: flex; flex-direction: column; align-items: flex-end; gap: 10px;">
                <!-- Notifications Panel (Above FAB) -->
                <div id="notif-floating-panel" style="display: none; width: 300px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.15); padding: 10px 0; max-height: 380px; overflow-y: auto; backdrop-filter: blur(10px); transition: all 0.3s ease;">
                    <div style="padding: 10px 16px; border-bottom: 1px solid var(--border); font-size: 0.85rem; font-weight: 800; opacity: 0.9; display:flex; justify-content:space-between; align-items:center;">
                        <span>🔔 알림 센터</span>
                        <?php if ($unread_count > 0): ?>
                                <span style="background: #ea4335; color: white; padding: 2px 7px; border-radius: 10px; font-size: 0.7rem; font-weight: 800;"><?= $unread_count ?></span>
                        <?php endif; ?>
                    </div>
                    <?php if (empty($notifications)): ?>
                            <div style="padding: 24px; text-align: center; font-size: 0.85rem; opacity: 0.6; color: var(--text);">새로운 알림이 없습니다.</div>
                    <?php else: ?>
                            <?php foreach ($notifications as $n): ?>
                                    <a href="read_notification.php?id=<?= $n['id'] ?>" style="display: block; padding: 12px 16px; border-bottom: 1px solid var(--border); text-decoration: none; color: var(--text); font-size: 0.8rem; line-height: 1.45; transition: background 0.2s; background: <?= $n['is_read'] ? 'transparent' : 'rgba(var(--primary-rgb), 0.04)' ?>;" onmouseover="this.style.background='rgba(var(--primary-rgb), 0.08)'" onmouseout="this.style.background='<?= $n['is_read'] ? 'transparent' : 'rgba(var(--primary-rgb), 0.04)' ?>'">
                                        <div style="font-weight: <?= $n['is_read'] ? '500' : '700' ?>; display: flex; align-items: flex-start; gap: 6px;">
                                            <span style="display: inline-block; width: 5px; height: 5px; background: #ea4335; border-radius: 50%; margin-top: 6px; visibility: <?= $n['is_read'] ? 'hidden' : 'visible' ?>;"></span>
                                            <div><?= htmlspecialchars($n['message']) ?></div>
                                        </div>
                                        <div style="font-size: 0.7rem; opacity: 0.5; margin-top: 5px; padding-left: 11px;"><?= date('m/d H:i', strtotime($n['created_at'])) ?></div>
                                    </a>
                            <?php endforeach; ?>
                    <?php endif; ?>
                </div>
                <!-- FAB Toggle Button -->
                <button onclick="toggleNotifPanel(event)" style="width: 50px; height: 50px; border-radius: 50%; background: var(--primary); color: white; border: none; box-shadow: 0 4px 20px rgba(var(--primary-rgb), 0.35); display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.06)'" onmouseout="this.style.transform='scale(1)'">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                    <?php if ($unread_count > 0): ?>
                            <span style="position: absolute; top: -1px; right: -1px; background: #ea4335; color: white; width: 18px; height: 18px; border-radius: 50%; font-size: 0.65rem; font-weight: 800; display: flex; align-items: center; justify-content: center; border: 2px solid var(--surface);"><?= $unread_count ?></span>
                    <?php endif; ?>
                </button>
            </div>
    <?php endif; ?>

    <!-- 스크립트 -->
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

        function toggleNotifPanel(e) {
            e.stopPropagation();
            const panel = document.getElementById('notif-floating-panel');
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        }
        document.addEventListener('click', () => {
            const panel = document.getElementById('notif-floating-panel');
            if (panel) panel.style.display = 'none';
        });

        async function handleLogout() {
            await fetch('../api/user_system.php?action=logout', { method: 'POST' });
            location.reload();
        }
    </script>

    <!-- ═══════════ 게시물 상세 팝업 모달 ═══════════ -->
    <div id="postModal" style="display:none; position:fixed; inset:0; z-index:50000; align-items:center; justify-content:center; padding:16px;">
        <div id="postModalOverlay" style="position:absolute; inset:0; background:rgba(0,0,0,0.5); backdrop-filter:blur(6px);" onclick="closePostModal()"></div>
        <div id="postModalBox" style="position:relative; z-index:1; width:min(96vw,860px); max-height:92vh; background:var(--surface); border-radius:20px; box-shadow:0 24px 64px rgba(0,0,0,0.2), 0 0 0 1px rgba(var(--primary-rgb),0.12); display:flex; flex-direction:column; overflow:hidden; animation:modalPop 0.26s cubic-bezier(0.2,1,0.3,1);">

            <!-- 상단 연두색 accent 바 -->
            <div style="height:4px; background:linear-gradient(90deg, var(--primary), rgba(var(--primary-rgb),0.4)); flex-shrink:0;"></div>

            <!-- 모달 헤더: 배지 + 닫기 -->
            <div style="padding:14px 20px 10px; display:flex; justify-content:space-between; align-items:center; flex-shrink:0; gap:12px;">
                <div id="pmBadges" style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;"></div>
                <button onclick="closePostModal()" style="flex-shrink:0; width:30px; height:30px; border-radius:50%; background:rgba(0,0,0,0.06); border:none; cursor:pointer; color:var(--text); display:flex; align-items:center; justify-content:center; font-size:1rem; line-height:1; transition:background 0.15s;" onmouseover="this.style.background='rgba(0,0,0,0.12)'" onmouseout="this.style.background='rgba(0,0,0,0.06)'">✕</button>
            </div>

            <!-- 구분선 -->
            <div style="height:1px; background:var(--border); flex-shrink:0;"></div>

            <!-- 모달 바디 (스크롤) -->
            <div style="overflow-y:auto; flex:1; padding:20px 24px 24px;">

                <!-- 제목과 메타 -->
                <div style="margin-bottom:18px;">
                    <h2 id="pmTitle" style="font-size:1.35rem; font-weight:800; margin:0 0 10px; line-height:1.3; color:var(--text); word-break:keep-all;"></h2>
                    <div id="pmMeta" style="display:flex; align-items:center; gap:14px; font-size:0.82rem; opacity:0.65; flex-wrap:wrap;"></div>
                </div>

                <!-- 이미지 갤러리 -->
                <div id="pmGallery" style="display:none; margin-bottom:18px; border-radius:12px; overflow:hidden; position:relative; background:var(--bg);">
                    <img id="pmMainImg" src="" alt="" style="width:100%; max-height:320px; object-fit:contain; display:block;">
                    <div id="pmPrevBtn" onclick="pmPrev()" style="display:none; position:absolute; top:50%; left:10px; transform:translateY(-50%); background:rgba(0,0,0,0.45); color:white; border-radius:50%; width:34px; height:34px; align-items:center; justify-content:center; cursor:pointer; font-size:1rem; user-select:none; transition:background 0.2s;" onmouseover="this.style.background='rgba(0,0,0,0.7)'" onmouseout="this.style.background='rgba(0,0,0,0.45)'">&#9664;</div>
                    <div id="pmNextBtn" onclick="pmNext()" style="display:none; position:absolute; top:50%; right:10px; transform:translateY(-50%); background:rgba(0,0,0,0.45); color:white; border-radius:50%; width:34px; height:34px; align-items:center; justify-content:center; cursor:pointer; font-size:1rem; user-select:none; transition:background 0.2s;" onmouseover="this.style.background='rgba(0,0,0,0.7)'" onmouseout="this.style.background='rgba(0,0,0,0.45)'">&#9654;</div>
                    <div id="pmThumbs" style="display:none;"></div>
                </div>

                <!-- 본문 -->
                <div id="pmContent" style="font-size:0.95rem; line-height:1.6; color:var(--text); white-space:pre-wrap; margin-bottom:20px;"></div>

                <!-- 수령/보관 장소 배너 -->
                <div id="pmKeepBanner" style="display:none; background:rgba(90,170,0,0.07); border:1px solid rgba(90,170,0,0.3); border-left:3px solid #5aaa00; border-radius:8px; padding:10px 14px; margin-bottom:16px; align-items:center; gap:10px; font-size:0.88rem; color:#3a7a00; font-weight:600;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5aaa00" stroke-width="2.5" style="flex-shrink:0;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    수령/보관 장소: <strong id="pmKeepPlace" style="margin-left:2px;"></strong>
                </div>

                <!-- 액션 버튼들 -->
                <div id="pmActions" style="display:flex; gap:6px; flex-wrap:wrap; justify-content:flex-end; margin-bottom:20px;"></div>

                <!-- 댓글 섹션 헤더 -->
                <div style="display:flex; align-items:center; gap:6px; margin-bottom:12px; font-weight:700; font-size:0.88rem; color:var(--primary);">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    댓글 <span id="pmCommentCount" style="opacity:0.6; font-weight:400;"></span>
                </div>

                <!-- 댓글 목록 (작성은 전체보기에서만 가능) -->
                <div id="pmCommentList"></div>
            </div>
        </div>
    </div>


    <!-- ═══════════ 로그인 팝업 모달 ═══════════ -->
    <div id="loginModal" style="display:none; position:fixed; inset:0; z-index:60000; align-items:center; justify-content:center;">
        <div style="position:absolute; inset:0; background:rgba(0,0,0,0.6); backdrop-filter:blur(4px);" onclick="closeLoginModal()"></div>
        <div style="position:relative; z-index:1; width:min(90vw,380px); background:var(--surface); border-radius:18px; box-shadow:0 20px 60px rgba(0,0,0,0.3); padding:30px; animation:modalPop 0.25s cubic-bezier(0.2,1,0.3,1);">
            <button onclick="closeLoginModal()" style="position:absolute; top:14px; right:16px; background:none; border:none; cursor:pointer; color:var(--text); opacity:0.4; font-size:1.3rem;">✕</button>
            <div style="text-align:center; margin-bottom:22px;">
                <div style="font-size:2rem; margin-bottom:8px;">🔐</div>
                <h3 style="margin:0 0 4px; font-size:1.2rem; font-weight:800;">로그인</h3>
                <p style="margin:0; font-size:0.82rem; opacity:0.6;">ISHS 분실물 센터 로그인</p>
            </div>
            <div id="loginError" style="display:none; background:rgba(234,67,53,0.1); border:1px solid rgba(234,67,53,0.3); border-radius:8px; padding:10px 14px; margin-bottom:14px; font-size:0.85rem; color:#d93025;"></div>
            <div style="display:flex; flex-direction:column; gap:12px;">
                <input id="lm_nick" type="text" placeholder="닉네임" style="width:100%; box-sizing:border-box; padding:12px 14px; border-radius:8px; border:1px solid var(--border); background:var(--bg); color:var(--text); font-family:inherit; font-size:0.92rem; outline:none;">
                <input id="lm_pw" type="password" placeholder="비밀번호" style="width:100%; box-sizing:border-box; padding:12px 14px; border-radius:8px; border:1px solid var(--border); background:var(--bg); color:var(--text); font-family:inherit; font-size:0.92rem; outline:none;" onkeydown="if(event.key==='Enter') loginModal_submit()">
                <button onclick="loginModal_submit()" style="width:100%; padding:12px; background:var(--primary); color:white; border:none; border-radius:8px; font-size:0.95rem; font-weight:800; cursor:pointer; transition:opacity 0.2s;" onmouseover="this.style.opacity='0.88'" onmouseout="this.style.opacity='1'">
                    로그인
                </button>
            </div>
            <p style="text-align:center; margin:18px 0 0; font-size:0.8rem; opacity:0.6;">계정이 없으신가요? <a href="../index.php#signup" style="color:var(--primary); font-weight:700; text-decoration:none;">회원가입</a></p>
        </div>
    </div>

    <style>
    @keyframes modalPop {
        from { opacity:0; transform:scale(0.94) translateY(10px); }
        to   { opacity:1; transform:scale(1) translateY(0); }
    }
    #postModal.open, #loginModal.open { display:flex !important; }
    </style>

    <script>
    // ── 모달 상태 ──
    let pmPostId = null, pmImages = [], pmImgIdx = 0, pmIsLogged = false, pmIsMine = false, pmIsAdmin = false, pmCurrentUserId = 0;

    // ── 게시물 팝업 ──
    async function openPostModal(id) {
        pmPostId = id;
        document.getElementById('postModal').classList.add('open');
        document.body.style.overflow = 'hidden';
        // 로딩 표시
        document.getElementById('pmTitle').textContent = '불러오는 중...';
        document.getElementById('pmContent').textContent = '';
        document.getElementById('pmBadges').innerHTML = '';
        document.getElementById('pmMeta').innerHTML = '';
        document.getElementById('pmGallery').style.display = 'none';
        document.getElementById('pmCommentList').innerHTML = '';
        document.getElementById('pmActions').innerHTML = '';
        document.getElementById('pmKeepBanner').style.display = 'none';
        try {
            const r = await fetch('view_ajax.php?id=' + id);
            const d = await r.json();
            if (d.error) { alert(d.error); closePostModal(); return; }
            renderModal(d);
        } catch(e) { alert('오류가 발생했습니다.'); closePostModal(); }
    }

    function closePostModal() {
        document.getElementById('postModal').classList.remove('open');
        document.body.style.overflow = '';
    }

    function renderModal(d) {
        const p = d.post;
        pmImages = d.images || [];
        pmImgIdx = 0;
        pmIsLogged = d.logged_in;
        pmIsMine = d.is_mine;
        pmIsAdmin = d.is_admin;
        pmCurrentUserId = d.current_user_id;

        // 배지
        const typePill = p.type === 'lost'
            ? `<span style="background:#d93025;color:white;padding:3px 10px;border-radius:4px;font-size:0.82rem;font-weight:700;">분실물</span>`
            : `<span style="background:#1e8e3e;color:white;padding:3px 10px;border-radius:4px;font-size:0.82rem;font-weight:700;">습득물</span>`;
        const statusPill = p.status === 'resolved'
            ? `<span style="background:#8e44ad;color:white;padding:3px 10px;border-radius:4px;font-size:0.82rem;font-weight:700;">해결완료</span>`
            : `<span style="background:#5f6368;color:white;padding:3px 10px;border-radius:4px;font-size:0.82rem;font-weight:700;">찾는 중</span>`;
        const catPill = `<span style="background:var(--border);color:var(--text);padding:3px 10px;border-radius:4px;font-size:0.82rem;">${esc(p.category)}</span>`;
        document.getElementById('pmBadges').innerHTML = typePill + catPill + statusPill;

        // 제목
        document.getElementById('pmTitle').textContent = p.title;

        // 메타 - SVG 아이콘, 오른쪽 세로 나열
        const iconUser = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
        const iconTime = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`;
        const iconEye  = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
        const iconPin  = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
        const iconCal  = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`;
        const author = (p.riro_name || '알수없음') + (p.nickname ? '(' + p.nickname + ')' : '');
        const mkMeta = (icon, text) => `<span style="display:inline-flex;align-items:center;gap:4px;">${icon} ${text}</span>`;
        let metaItems = mkMeta(iconUser, `<strong>${esc(author)}</strong>${p.grade ? '&nbsp;('+p.grade+'학년)' : ''}`);
        metaItems += mkMeta(iconTime, esc(p.created_at ? p.created_at.slice(0,10) : ''));
        metaItems += mkMeta(iconEye, p.views);
        if (p.location) metaItems += mkMeta(iconPin, esc(p.location));
        if (p.lost_date) metaItems += mkMeta(iconCal, p.lost_date);
        document.getElementById('pmMeta').innerHTML = metaItems;

        // 본문
        document.getElementById('pmContent').innerHTML = esc(p.content).replace(/\n/g,'<br>');

        // 수령 장소 배너
        if (p.type === 'found' && p.keep_location) {
            document.getElementById('pmKeepBanner').style.display = 'flex';
            document.getElementById('pmKeepPlace').textContent = p.keep_location;
        }

        // 이미지 갤러리
        if (pmImages.length > 0) {
            const gallery = document.getElementById('pmGallery');
            gallery.style.display = 'block';
            document.getElementById('pmMainImg').src = 'uploads/' + pmImages[0].filename;
            const thumbsEl = document.getElementById('pmThumbs');
            thumbsEl.innerHTML = pmImages.map((img, i) =>
                `<img src="uploads/${img.filename}" data-idx="${i}" onclick="pmSetImg(${i})"
                style="width:44px;height:33px;object-fit:cover;border-radius:4px;cursor:pointer;border:2px solid ${i===0?'var(--primary)':'transparent'};opacity:${i===0?1:0.6};transition:all 0.15s;">`
            ).join('');
            document.getElementById('pmPrevBtn').style.display = pmImages.length > 1 ? 'flex' : 'none';
            document.getElementById('pmNextBtn').style.display = pmImages.length > 1 ? 'flex' : 'none';
        }

        // 액션 버튼 - SVG 아이콘 사용
        const icoShare  = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`;
        const icoExt    = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`;
        const icoCheck  = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        const icoEdit   = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`;
        const icoTrash  = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path></svg>`;
        let actions = `<button onclick="pmShare()" style="background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:7px 14px;font-size:0.82rem;cursor:pointer;display:inline-flex;align-items:center;gap:5px;color:var(--text);">${icoShare} 공유</button>`;
        actions += `<a href="view.php?id=${p.id}" target="_blank" style="background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:7px 14px;font-size:0.82rem;cursor:pointer;display:inline-flex;align-items:center;gap:5px;color:var(--text);text-decoration:none;">${icoExt} 전체 보기</a>`;
        if (pmIsMine || pmIsAdmin) {
            const resolveLabel = p.status === 'resolved' ? '다시 찾는중' : '해결완료';
            actions += `<button id="pmResolveBtn" onclick="pmResolve('${p.id}','${p.status}')" style="background:var(--primary);color:white;border:none;border-radius:8px;padding:7px 14px;font-size:0.82rem;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:5px;">${icoCheck} ${resolveLabel}</button>`;
            if (pmIsMine) actions += `<a href="write.php?edit=${p.id}" style="background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:7px 14px;font-size:0.82rem;cursor:pointer;display:inline-flex;align-items:center;gap:5px;color:var(--text);text-decoration:none;">${icoEdit} 수정</a>`;
            actions += `<button onclick="pmDeletePost(${p.id})" style="background:rgba(234,67,53,0.08);color:#ea4335;border:1px solid rgba(234,67,53,0.2);border-radius:8px;padding:7px 14px;font-size:0.82rem;cursor:pointer;display:inline-flex;align-items:center;gap:5px;">${icoTrash} 삭제</button>`;
        }
        document.getElementById('pmActions').innerHTML = actions;

        // 댓글
        renderComments(d.comments, p);
    }

    function renderComments(comments, post) {
        document.getElementById('pmCommentCount').textContent = comments.length;
        let html = '';
        for (const c of comments) {
            html += renderComment(c, post, false);
            if (c.replies && c.replies.length > 0) {
                html += `<div style="margin-left:16px; border-left:2px solid var(--border); padding-left:12px;">`;
                for (const r of c.replies) html += renderComment(r, post, true);
                html += `</div>`;
            }
        }
        document.getElementById('pmCommentList').innerHTML = html || '<p style="text-align:center;opacity:0.5;padding:20px 0;font-size:0.9rem;">아직 댓글이 없습니다.</p>';
    }

    function renderComment(c, post, isReply) {
        const author = (c.riro_name || '알수없음') + (c.nickname ? '('+c.nickname+')' : '');
        const adopted = c.is_adopted ? '<span style="color:#1e8e3e;font-weight:700;margin-left:6px;">[채택됨]</span>' : '';
        const adoptedBorder = c.is_adopted ? 'border-left:3px solid #1e8e3e;padding-left:12px;background:rgba(30,142,62,0.03);' : '';
        let actions2 = '';
        if (pmIsLogged) {
            if (!isReply && pmIsMine && !c.is_adopted && post.status !== 'resolved') {
                actions2 += `<button onclick="pmAdopt(${c.id})" style="background:none;border:none;cursor:pointer;color:var(--primary);font-size:0.75rem;font-weight:700;">채택</button>`;
            }
            if (c.user_id == pmCurrentUserId || pmIsMine || pmIsAdmin) {
                actions2 += `<button onclick="pmDeleteComment(${c.id})" style="background:none;border:none;cursor:pointer;color:#ea4335;font-size:0.75rem;">삭제</button>`;
            }
        }
        const img = c.image_filename ? `<img src="uploads/${c.image_filename}" style="max-width:200px;max-height:160px;border-radius:4px;margin-top:8px;cursor:zoom-in;" onclick="window.open(this.src)">` : '';
        return `<div id="pc-${c.id}" style="padding:10px 0;border-bottom:1px solid var(--border);${adoptedBorder}">
            <div style="display:flex;justify-content:space-between;font-size:0.8rem;margin-bottom:4px;">
                <span style="font-weight:700;">${isReply?'↳ ':''}${esc(author)}${adopted}</span>
                <span style="opacity:0.55;">${esc(c.time_ago||'')}</span>
            </div>
            <div style="font-size:0.9rem;line-height:1.5;">${esc(c.content).replace(/\n/g,'<br>')}</div>
            ${img}
            <div style="display:flex;gap:8px;margin-top:6px;">${actions2}</div>
        </div>`;
    }

    function esc(s) {
        if (!s) return '';
        return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    // 이미지 갤러리
    function pmSetImg(idx) {
        pmImgIdx = idx;
        document.getElementById('pmMainImg').src = 'uploads/' + pmImages[idx].filename;
        document.querySelectorAll('#pmThumbs img').forEach((t,i) => {
            t.style.borderColor = i===idx ? 'var(--primary)' : 'transparent';
            t.style.opacity = i===idx ? '1' : '0.6';
        });
    }
    function pmPrev() { pmSetImg((pmImgIdx - 1 + pmImages.length) % pmImages.length); }
    function pmNext() { pmSetImg((pmImgIdx + 1) % pmImages.length); }

    // 답글 토글
    function togglePmReply(cid) {
        const f = document.getElementById('rf-' + cid);
        if (!f) return;
        f.style.display = f.style.display === 'none' ? 'flex' : 'none';
        f.style.flexDirection = 'column';
    }

    // 댓글 작성
    async function pmSubmitComment() {
        const ta = document.getElementById('pmCommentInput');
        const content = ta.value.trim();
        if (!content) return;
        const fi = document.getElementById('pmCommentImg');
        const fd = new FormData();
        fd.append('action', 'comment');
        fd.append('content', content);
        if (fi && fi.files[0]) fd.append('comment_image', fi.files[0]);
        const r = await fetch('view_ajax.php?id=' + pmPostId, { method:'POST', body:fd });
        const d = await r.json();
        if (d.success) { ta.value=''; fi.value=''; openPostModal(pmPostId); }
        else alert(d.error);
    }

    // 답글 작성
    async function pmSubmitReply(pid) {
        const inp = document.getElementById('ri-' + pid);
        if (!inp) return;
        const content = inp.value.trim();
        if (!content) return;
        const fd = new FormData();
        fd.append('action', 'comment');
        fd.append('content', content);
        fd.append('parent_id', pid);
        const r = await fetch('view_ajax.php?id=' + pmPostId, { method:'POST', body:fd });
        const d = await r.json();
        if (d.success) openPostModal(pmPostId);
        else alert(d.error);
    }

    // 댓글 삭제
    async function pmDeleteComment(cid) {
        if (!confirm('댓글을 삭제하시겠습니까?')) return;
        const fd = new FormData();
        fd.append('action', 'delete_comment');
        fd.append('comment_id', cid);
        const r = await fetch('view_ajax.php?id=' + pmPostId, { method:'POST', body:fd });
        const d = await r.json();
        if (d.success) openPostModal(pmPostId);
        else alert(d.error);
    }

    // 채택
    async function pmAdopt(cid) {
        if (!confirm('이 댓글을 채택하고 해결완료 처리합니까?')) return;
        const fd = new FormData();
        fd.append('action', 'adopt');
        fd.append('comment_id', cid);
        const r = await fetch('view_ajax.php?id=' + pmPostId, { method:'POST', body:fd });
        const d = await r.json();
        if (d.success) openPostModal(pmPostId);
        else alert(d.error);
    }

    // 해결완료 토글
    async function pmResolve(postId, currentStatus) {
        const fd = new FormData();
        fd.append('action', 'resolve');
        const r = await fetch('view_ajax.php?id=' + postId, { method:'POST', body:fd });
        const d = await r.json();
        if (d.success) openPostModal(pmPostId);
        else alert(d.error);
    }

    // 게시물 삭제
    async function pmDeletePost(postId) {
        if (!confirm('게시글을 삭제하시겠습니까? 되돌릴 수 없습니다.')) return;
        const fd = new FormData();
        fd.append('action', 'delete_post');
        const r = await fetch('view_ajax.php?id=' + postId, { method:'POST', body:fd });
        const d = await r.json();
        if (d.success) { closePostModal(); location.reload(); }
        else alert(d.error);
    }

    // 공유
    function pmShare() {
        const url = location.origin + location.pathname + '?popup=' + pmPostId;
        navigator.clipboard.writeText('view.php?id=' + pmPostId).then(() => alert('링크가 복사되었습니다!'));
    }

    // ESC로 닫기
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') { closePostModal(); closeLoginModal(); }
    });

    // URL에 popup= 파라미터가 있으면 자동 열기
    (function() {
        const u = new URLSearchParams(location.search);
        const pid = u.get('popup');
        if (pid) openPostModal(parseInt(pid));
    })();

    // ── 로그인 모달 ──
    function openLoginModal() {
        document.getElementById('loginModal').classList.add('open');
        document.body.style.overflow = 'hidden';
        setTimeout(() => document.getElementById('lm_nick').focus(), 100);
    }
    function closeLoginModal() {
        document.getElementById('loginModal').classList.remove('open');
        document.body.style.overflow = '';
    }
    async function loginModal_submit() {
        const nick = document.getElementById('lm_nick').value.trim();
        const pw = document.getElementById('lm_pw').value;
        const errEl = document.getElementById('loginError');
        errEl.style.display = 'none';
        if (!nick || !pw) { errEl.textContent = '닉네임과 비밀번호를 입력해주세요.'; errEl.style.display = 'block'; return; }
        const r = await fetch('../api/user_system.php?action=login', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({nickname: nick, password: pw})
        });
        const d = await r.json();
        if (d.status === 'success') {
            closeLoginModal();
            location.reload();
        } else {
            errEl.textContent = d.message || '로그인 실패';
            errEl.style.display = 'block';
        }
    }
    </script>
</body>
</html>
