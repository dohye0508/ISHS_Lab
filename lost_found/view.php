<?php
/**
 * ISHS 분실물 센터 - 게시물 상세보기
 */
session_start();
require_once '../db_config.php';

$id = (int) ($_GET['id'] ?? 0);
if (!$id) {
    header('Location: index.php');
    exit;
}

$logged_in = isset($_SESSION['user_id']);
$user_id = $_SESSION['user_id'] ?? null;
$is_admin = false;

if ($logged_in) {
    $u_stmt = $pdo->prepare("SELECT role, nickname, riro_name FROM users WHERE id = ?");
    $u_stmt->execute([$user_id]);
    $u_row = $u_stmt->fetch();
    if ($u_row) {
        if ($u_row['role'] === 'admin') {
            $is_admin = true;
        }
        $user = $u_row;
    }

    $notifications = [];
    $unread_count = 0;
    $notif_stmt = $pdo->prepare("SELECT * FROM lost_found_notifications WHERE user_id = ? ORDER BY id DESC LIMIT 5");
    $notif_stmt->execute([$user_id]);
    $notifications = $notif_stmt->fetchAll();

    $unread_stmt = $pdo->prepare("SELECT COUNT(*) FROM lost_found_notifications WHERE user_id = ? AND is_read = 0");
    $unread_stmt->execute([$user_id]);
    $unread_count = (int) $unread_stmt->fetchColumn();
}

// 조회수 증가 (세션 중복 방지)
if (!isset($_SESSION['viewed_posts']))
    $_SESSION['viewed_posts'] = [];
if (!in_array($id, $_SESSION['viewed_posts'])) {
    $pdo->prepare("UPDATE lost_found_posts SET views = views+1 WHERE id=?")->execute([$id]);
    $_SESSION['viewed_posts'][] = $id;
}

// 게시물
$stmt = $pdo->prepare("
    SELECT p.*, u.nickname, u.riro_name, u.grade, u.student_number
    FROM lost_found_posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.id = ?
");
$stmt->execute([$id]);
$post = $stmt->fetch();
if (!$post) {
    header('Location: index.php');
    exit;
}

// 이미지
$img_stmt = $pdo->prepare("SELECT * FROM lost_found_images WHERE post_id=? ORDER BY id");
$img_stmt->execute([$id]);
$images = $img_stmt->fetchAll();

// 댓글
$com_stmt = $pdo->prepare("
    SELECT c.*, u.nickname, u.riro_name, u.grade
    FROM lost_found_comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.post_id = ? AND c.parent_id IS NULL
    ORDER BY c.created_at ASC
");
$com_stmt->execute([$id]);
$comments = $com_stmt->fetchAll();

// 대댓글
$rep_stmt = $pdo->prepare("
    SELECT c.*, u.nickname, u.riro_name
    FROM lost_found_comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.post_id = ? AND c.parent_id IS NOT NULL
    ORDER BY c.created_at ASC
");
$rep_stmt->execute([$id]);
$replies_raw = $rep_stmt->fetchAll();
$replies = [];
foreach ($replies_raw as $r)
    $replies[$r['parent_id']][] = $r;

// 좋아요
$like_count = 0;
$like_check = $pdo->prepare("SELECT COUNT(*) FROM lost_found_likes WHERE post_id=?");
$like_check->execute([$id]);
$like_count = (int) $like_check->fetchColumn();

$like_stmt = $pdo->prepare("SELECT COUNT(*) FROM lost_found_likes WHERE post_id=? AND user_id=?");
$like_stmt->execute([$id, $user_id]);
$user_liked = $logged_in && $like_stmt->fetchColumn() > 0;

// AJAX 핸들러
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    header('Content-Type: application/json');
    if (!$logged_in) {
        echo json_encode(['error' => '로그인이 필요합니다.']);
        exit;
    }

    $action = $_POST['action'];

    if ($action === 'comment') {
        $content = trim($_POST['content'] ?? '');
        $parent = (int) ($_POST['parent_id'] ?? 0);
        if (!$content) {
            echo json_encode(['error' => '댓글 내용을 입력하세요.']);
            exit;
        }

        $image_filename = null;
        if (!empty($_FILES['comment_image']['name']) && $_FILES['comment_image']['error'] === UPLOAD_ERR_OK) {
            $allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            $max_size = 3 * 1024 * 1024; // 3MB
            if (in_array($_FILES['comment_image']['type'], $allowed_types) && $_FILES['comment_image']['size'] <= $max_size) {
                $ext = pathinfo($_FILES['comment_image']['name'], PATHINFO_EXTENSION);
                $fname = uniqid('com_img_', true) . '.' . strtolower($ext);
                $upload_dir = __DIR__ . '/uploads/';
                if (!is_dir($upload_dir))
                    mkdir($upload_dir, 0755, true);
                if (move_uploaded_file($_FILES['comment_image']['tmp_name'], $upload_dir . $fname)) {
                    $image_filename = $fname;
                }
            }
        }

        $stmt = $pdo->prepare("INSERT INTO lost_found_comments (post_id, user_id, parent_id, content, image_filename) VALUES (?,?,?,?,?)");
        $stmt->execute([$id, $user_id, $parent ?: null, $content, $image_filename]);
        $new_id = $pdo->lastInsertId();

        // 알림 생성
        $post_owner_id = (int) $post['user_id'];
        if ($parent > 0) {
            $parent_stmt = $pdo->prepare("SELECT user_id FROM lost_found_comments WHERE id = ?");
            $parent_stmt->execute([$parent]);
            $parent_owner_id = (int) $parent_stmt->fetchColumn();

            if ($parent_owner_id > 0 && $parent_owner_id != $user_id) {
                $notif_stmt = $pdo->prepare("INSERT INTO lost_found_notifications (user_id, post_id, type, message) VALUES (?, ?, 'comment', ?)");
                $notif_stmt->execute([$parent_owner_id, $id, '내 댓글에 새로운 답글이 달렸습니다.']);
            }
            if ($post_owner_id != $user_id && $post_owner_id != $parent_owner_id) {
                $notif_stmt = $pdo->prepare("INSERT INTO lost_found_notifications (user_id, post_id, type, message) VALUES (?, ?, 'comment', ?)");
                $notif_stmt->execute([$post_owner_id, $id, '내 게시글에 새로운 댓글이 달렸습니다.']);
            }
        } else {
            if ($post_owner_id != $user_id) {
                $notif_stmt = $pdo->prepare("INSERT INTO lost_found_notifications (user_id, post_id, type, message) VALUES (?, ?, 'comment', ?)");
                $notif_stmt->execute([$post_owner_id, $id, '내 게시글에 새로운 댓글이 달렸습니다.']);
            }
        }

        $row = $pdo->prepare("SELECT c.*, u.nickname, u.riro_name, u.grade FROM lost_found_comments c JOIN users u ON c.user_id=u.id WHERE c.id=?");
        $row->execute([$new_id]);
        echo json_encode(['success' => true, 'comment' => $row->fetch()]);
        exit;
    }

    if ($action === 'delete_comment') {
        $cid = (int) ($_POST['comment_id'] ?? 0);
        $chk = $pdo->prepare("SELECT user_id FROM lost_found_comments WHERE id=? AND post_id=?");
        $chk->execute([$cid, $id]);
        $crow = $chk->fetch();
        if ($crow && ($crow['user_id'] == $user_id || $post['user_id'] == $user_id || $is_admin)) {
            $pdo->prepare("DELETE FROM lost_found_comments WHERE id=?")->execute([$cid]);
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['error' => '삭제 권한이 없습니다.']);
        }
        exit;
    }

    if ($action === 'adopt') {
        if ($post['user_id'] != $user_id) {
            echo json_encode(['error' => '권한 없음']);
            exit;
        }
        $cid = (int) ($_POST['comment_id'] ?? 0);
        $pdo->prepare("UPDATE lost_found_comments SET is_adopted=0 WHERE post_id=?")->execute([$id]);
        $pdo->prepare("UPDATE lost_found_comments SET is_adopted=1 WHERE id=? AND post_id=?")->execute([$cid, $id]);
        $pdo->prepare("UPDATE lost_found_posts SET status='resolved' WHERE id=?")->execute([$id]);

        // 알림 생성
        $c_author_stmt = $pdo->prepare("SELECT user_id FROM lost_found_comments WHERE id = ?");
        $c_author_stmt->execute([$cid]);
        $c_author_id = (int) $c_author_stmt->fetchColumn();
        if ($c_author_id > 0 && $c_author_id != $user_id) {
            $notif_stmt = $pdo->prepare("INSERT INTO lost_found_notifications (user_id, post_id, type, message) VALUES (?, ?, 'adopt', ?)");
            $notif_stmt->execute([$c_author_id, $id, '작성하신 댓글이 정보 제공으로 채택되었습니다!']);
        }

        echo json_encode(['success' => true]);
        exit;
    }

    if ($action === 'like') {
        $check = $pdo->prepare("SELECT id FROM lost_found_likes WHERE post_id=? AND user_id=?");
        $check->execute([$id, $user_id]);
        if ($check->fetch()) {
            $pdo->prepare("DELETE FROM lost_found_likes WHERE post_id=? AND user_id=?")->execute([$id, $user_id]);
            $liked = false;
        } else {
            $pdo->prepare("INSERT INTO lost_found_likes (post_id, user_id) VALUES (?,?)")->execute([$id, $user_id]);
            $liked = true;
        }
        $cnt_stmt = $pdo->prepare("SELECT COUNT(*) FROM lost_found_likes WHERE post_id=?");
        $cnt_stmt->execute([$id]);
        $cnt = $cnt_stmt->fetchColumn();
        echo json_encode(['success' => true, 'liked' => $liked, 'count' => $cnt]);
        exit;
    }

    if ($action === 'resolve') {
        if ($post['user_id'] != $user_id && !$is_admin) {
            echo json_encode(['error' => '권한 없음']);
            exit;
        }
        $new_status = $post['status'] === 'resolved' ? 'searching' : 'resolved';
        $pdo->prepare("UPDATE lost_found_posts SET status=? WHERE id=?")->execute([$new_status, $id]);
        echo json_encode(['success' => true, 'status' => $new_status]);
        exit;
    }

    if ($action === 'delete_post') {
        if ($post['user_id'] != $user_id && !$is_admin) {
            echo json_encode(['error' => '권한 없음']);
            exit;
        }
        foreach ($images as $img)
            @unlink(__DIR__ . '/uploads/' . $img['filename']);
        $pdo->prepare("DELETE FROM lost_found_posts WHERE id=?")->execute([$id]);
        echo json_encode(['success' => true, 'redirect' => 'index.php']);
        exit;
    }

    echo json_encode(['error' => '알 수 없는 액션']);
    exit;
}

function time_ago($dt)
{
    $diff = time() - strtotime($dt);
    if ($diff < 60)
        return $diff . '초 전';
    if ($diff < 3600)
        return floor($diff / 60) . '분 전';
    if ($diff < 86400)
        return floor($diff / 3600) . '시간 전';
    if ($diff < 604800)
        return floor($diff / 86400) . '일 전';
    return date('Y.m.d', strtotime($dt));
}
?>
<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($post['title']) ?></title>
    <link rel="icon" type="image/jpeg" href="../assets/images/inticon.jpg">
    <link rel="stylesheet" href="../assets/css/style.css?v=lab_final_v6">
    <link rel="stylesheet" href="assets/css/lost_found.css">
    <script>
        (function () {
            var theme = localStorage.getItem('theme') || 'light';
            document.documentElement.setAttribute('data-theme', theme);
        })();
        function handleLogout() {
            if (confirm('로그아웃 하시겠습니까?')) {
                fetch('../api/user_system.php?action=logout').then(() => {
                    location.href = '../index.php';
                });
            }
        }
    </script>
</head>

<body>

    <!-- Auth UI Elements (Top-Left) -->
    <div id="auth-header"
        style="position: fixed; top: 20px; left: 20px; z-index: 10000; display: flex; align-items: center; gap: 10px;">
        <a href="index.php"
            style="background: var(--surface); backdrop-filter: blur(10px); color: var(--text); padding: 8px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border); box-shadow: 0 4px 12px rgba(0,0,0,0.05);"
            title="목록으로">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
        </a>

        <?php if ($logged_in): ?>
            <div id="user-profile"
                style="display: flex; align-items: center; gap: 12px; background: var(--surface); backdrop-filter: blur(10px); padding: 5px 15px; border-radius: 25px; border: 1px solid var(--border); box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                <span id="user-nickname"
                    style="font-weight: 700; font-size: 0.9rem; color: var(--text);"><?= htmlspecialchars($user['nickname'] ?? $user['riro_name'] ?? 'User') ?></span>
                <button onclick="handleLogout()"
                    style="background: none; border: none; font-size: 1rem; color: #ea4335; cursor: pointer; padding: 0; display: flex; align-items: center; gap: 4px;"
                    title="로그아웃">
                    <span style="font-size: 0.75rem; font-weight: 600;">로그아웃</span>
                    <span style="font-size: 1.1rem;">→</span>
                </button>
            </div>
        <?php endif; ?>
    </div>

    <!-- Theme Toggle (Top-Right) -->
    <button id="theme-toggle" class="theme-toggle-btn" aria-label="Toggle Dark Mode">
        <svg class="sun-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2">
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
        <svg class="moon-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
    </button>

    <div class="lost-found-container">
        <div class="lf-card">
            <div class="detail-badges">
                <span class="badge-item type <?= $post['type'] ?>" style="display:inline-flex; align-items:center;">
                    <?php if ($post['type'] === 'lost'): ?>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                            style="vertical-align:middle; margin-right:4px;">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        분실물
                    <?php else: ?>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                            style="vertical-align:middle; margin-right:4px;">
                            <path
                                d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z">
                            </path>
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                            <line x1="12" y1="22.08" x2="12" y2="12"></line>
                        </svg>
                        습득물
                    <?php endif; ?>
                </span>
                <span class="badge-item cat"><?= htmlspecialchars($post['category']) ?></span>
                <span class="badge-item status <?= $post['status'] === 'resolved' ? 'resolved' : '' ?>">
                    <?= $post['status'] === 'resolved' ? '해결완료' : '찾는 중' ?>
                </span>
            </div>

            <h1 class="detail-title"><?= htmlspecialchars($post['title']) ?></h1>

            <div class="detail-meta-row">
                <span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        style="vertical-align:middle; margin-right:3px;">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <strong><?= htmlspecialchars(($post['riro_name'] ?: '알수없음') . ($post['nickname'] ? '(' . $post['nickname'] . ')' : '')) ?></strong>
                    <?php if ($post['grade']): ?>(<?= $post['grade'] ?>학년)<?php endif; ?>
                </span>
                <span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        style="vertical-align:middle; margin-right:3px;">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    등록: <?= time_ago($post['created_at']) ?>
                </span>
                <span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        style="vertical-align:middle; margin-right:3px;">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    조회수: <?= number_format($post['views']) ?>
                </span>
                <?php if ($post['location']): ?>
                    <span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            style="vertical-align:middle; margin-right:3px;">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        위치: <strong style="color: var(--text);"><?= htmlspecialchars($post['location']) ?></strong>
                    </span>
                <?php endif; ?>

                <?php if ($post['lost_date']): ?>
                    <span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            style="vertical-align:middle; margin-right:3px;">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        일시: <?= date('Y.m.d', strtotime($post['lost_date'])) ?>
                    </span>
                <?php endif; ?>
            </div>

            <!-- 이미지 갤러리 -->
            <?php if ($images): ?>
                <div class="detail-gallery" style="position: relative;">
                    <img src="uploads/<?= htmlspecialchars($images[0]['filename']) ?>" alt="" class="detail-main-img"
                        id="mainImg">
                    <?php if (count($images) > 1): ?>
                        <div class="gallery-nav prev" onclick="prevImg()"
                            style="position:absolute; top:40%; left:10px; transform:translateY(-50%); background:rgba(0,0,0,0.5); color:white; border-radius:50%; width:40px; height:40px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:1.5rem; user-select:none;">
                            &#9664;</div>
                        <div class="gallery-nav next" onclick="nextImg()"
                            style="position:absolute; top:40%; right:10px; transform:translateY(-50%); background:rgba(0,0,0,0.5); color:white; border-radius:50%; width:40px; height:40px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:1.5rem; user-select:none;">
                            &#9654;</div>

                        <div class="detail-thumbs">
                            <?php foreach ($images as $i => $img): ?>
                                <img src="uploads/<?= htmlspecialchars($img['filename']) ?>" alt=""
                                    class="detail-thumb <?= $i === 0 ? 'active' : '' ?>" data-idx="<?= $i ?>"
                                    onclick="setMainImg(<?= $i ?>)">
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
                </div>
            <?php endif; ?>



            <!-- 본문 내용 -->
            <div class="detail-content"><?= nl2br(htmlspecialchars($post['content'])) ?></div>

            <!-- 수령/보관처 눈에 띄는 배너 -->
            <?php if ($post['type'] === 'found' && $post['keep_location']): ?>
                <div class="keep-location-callout">
                    <div class="klc-icon">✓</div>
                    <span>수령/보관 장소: <strong class="klc-place"><?= htmlspecialchars($post['keep_location']) ?></strong>　<span
                            style="font-weight:400; font-size:0.85rem; opacity:0.8;">— 해당 장소를 방문하여 수령해 주세요.</span></span>
                </div>
            <?php endif; ?>

            <div
                style="display: flex; gap: 8px; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); padding-top: 20px;">
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-secondary-solid" onclick="sharePost()"
                        style="display:inline-flex; align-items:center; gap:6px;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                            <path
                                d="M13 14h-2a8.999 8.999 0 0 0-7.968 4.81A10.136 10.136 0 0 1 3 18C3 12.477 7.477 8 13 8V3l10 8-10 8v-5z">
                            </path>
                        </svg>
                        공유
                    </button>
                </div>


                <?php if ($logged_in && ($post['user_id'] == $user_id || $is_admin)): ?>
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <button class="btn primary" id="resolveBtn"
                            style="display:inline-flex; align-items:center; gap:4px; <?= ($post['user_id'] != $user_id && $is_admin) ? 'font-size: 0.75rem; padding: 6px 10px;' : '' ?>">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                <path
                                    d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-.997-6l7.07-7.071-1.414-1.414-5.656 5.657-2.829-2.829-1.414 1.414L11.003 16z">
                                </path>
                            </svg>
                            <?= ($post['user_id'] != $user_id && $is_admin) ? ($post['status'] === 'resolved' ? '관리자 권한으로 다시찾기' : '관리자 권한으로 해결완료') : ($post['status'] === 'resolved' ? '다시 찾는중으로' : '해결완료로 변경') ?>
                        </button>
                        <?php if ($post['user_id'] == $user_id): ?>
                            <a href="write.php?edit=<?= $id ?>" class="btn btn-secondary-solid"
                                style="text-decoration: none; display:inline-flex; align-items:center; gap:4px;">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                    <path
                                        d="M16.757 3l-2 2H5v14h14V9.243l2-2V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h12.757zm3.728-.9L21.9 3.516l-9.192 9.192-1.412.003-.002-1.417L20.485 2.1z">
                                    </path>
                                </svg>
                                수정
                            </a>
                        <?php endif; ?>
                        <button class="btn btn-delete" id="deleteBtn"
                            style="display:inline-flex; align-items:center; gap:4px; <?= ($post['user_id'] != $user_id && $is_admin) ? 'font-size: 0.75rem; padding: 6px 10px;' : '' ?>">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                <path
                                    d="M17 6H22V8H20V21C20 21.552 19.552 22 19 22H5C4.448 22 4 21.552 4 21V8H2V6H7V3C7 2.448 7.448 2 8 2H16C16.552 2 17 2.448 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z">
                                </path>
                            </svg>
                            <?= ($post['user_id'] != $user_id && $is_admin) ? '관리자 권한으로 삭제' : '삭제' ?>
                        </button>
                    </div>
                <?php endif; ?>
            </div>
        </div>

        <!-- ── 댓글 섹션 ── -->
        <div class="lf-card comments-box">
            <h3
                style="margin-top: 0; margin-bottom: 20px; font-weight: 800; display:flex; align-items:center; gap:6px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                댓글 <span id="commentCount"><?= count($comments) ?></span>
            </h3>

            <div id="commentsList">
                <?php foreach ($comments as $c): ?>
                    <div class="comment-item <?= $c['is_adopted'] ? 'adopted' : '' ?>" id="comment-<?= $c['id'] ?>">
                        <div class="comment-header">
                            <div>
                                <span class="comment-user"
                                    style="color: var(--text);"><?= htmlspecialchars(($c['riro_name'] ?: '알수없음') . ($c['nickname'] ? '(' . $c['nickname'] . ')' : '')) ?></span>
                                <?php if ($c['grade']): ?><span
                                        style="opacity: 0.6; font-size: 0.8rem;">(<?= $c['grade'] ?>학년)</span><?php endif; ?>
                                <?php if ($c['is_adopted']): ?><span
                                        style="color: #1e8e3e; font-weight: 700; margin-left: 6px;">[채택됨]</span><?php endif; ?>
                            </div>
                            <span style="opacity: 0.6; font-size: 0.8rem;"><?= time_ago($c['created_at']) ?></span>
                        </div>
                        <div class="comment-body"><?= nl2br(htmlspecialchars($c['content'])) ?></div>
                        <?php if (!empty($c['image_filename'])): ?>
                            <div style="margin-top: 8px; margin-bottom: 8px;">
                                <img src="uploads/<?= htmlspecialchars($c['image_filename']) ?>" alt="댓글 이미지"
                                    style="max-width: 250px; max-height: 200px; border-radius: 4px; border: 1px solid var(--border); cursor: zoom-in;"
                                    onclick="window.open(this.src)">
                            </div>
                        <?php endif; ?>

                        <div class="comment-actions">
                            <?php if ($logged_in): ?>
                                <button onclick="toggleReplyForm(<?= $c['id'] ?>)">답글</button>
                                <?php if ($post['user_id'] == $user_id && !$c['is_adopted'] && $post['status'] !== 'resolved'): ?>
                                    <button onclick="adoptComment(<?= $c['id'] ?>)">채택</button>
                                <?php endif; ?>
                                <?php if ($c['user_id'] == $user_id || $post['user_id'] == $user_id || $is_admin): ?>
                                    <button onclick="deleteComment(<?= $c['id'] ?>)"
                                        style="color:#ea4335; <?= ($c['user_id'] != $user_id && $is_admin) ? 'font-size: 0.75rem; border: 1px solid rgba(234,67,53,0.3); padding: 2px 6px; border-radius: 3px;' : '' ?>">
                                        <?= ($c['user_id'] != $user_id && $is_admin) ? '관리자 권한으로 삭제' : '삭제' ?>
                                    </button>
                                <?php endif; ?>
                            <?php endif; ?>
                        </div>

                        <!-- 대댓글 목록 -->
                        <?php if (!empty($replies[$c['id']])): ?>
                            <div class="replies-box">
                                <?php foreach ($replies[$c['id']] as $r): ?>
                                    <div class="comment-item" id="comment-<?= $r['id'] ?>"
                                        style="border-bottom:none; padding: 10px 0;">
                                        <div class="comment-header">
                                            <span class="comment-user" style="color: var(--text);">↳
                                                <?= htmlspecialchars(($r['riro_name'] ?: '알수없음') . ($r['nickname'] ? '(' . $r['nickname'] . ')' : '')) ?></span>
                                            <span style="opacity: 0.6; font-size: 0.8rem;"><?= time_ago($r['created_at']) ?></span>
                                        </div>
                                        <div class="comment-body"><?= nl2br(htmlspecialchars($r['content'])) ?></div>
                                        <?php if (!empty($r['image_filename'])): ?>
                                            <div style="margin-top: 6px; margin-bottom: 6px;">
                                                <img src="uploads/<?= htmlspecialchars($r['image_filename']) ?>" alt="답글 이미지"
                                                    style="max-width: 200px; max-height: 150px; border-radius: 4px; border: 1px solid var(--border); cursor: zoom-in;"
                                                    onclick="window.open(this.src)">
                                            </div>
                                        <?php endif; ?>
                                        <?php if ($logged_in && ($r['user_id'] == $user_id || $post['user_id'] == $user_id || $is_admin)): ?>
                                            <div class="comment-actions">
                                                <button onclick="deleteComment(<?= $r['id'] ?>)"
                                                    style="color:#ea4335; <?= ($r['user_id'] != $user_id && $is_admin) ? 'font-size: 0.75rem; border: 1px solid rgba(234,67,53,0.3); padding: 2px 6px; border-radius: 3px;' : '' ?>">
                                                    <?= ($r['user_id'] != $user_id && $is_admin) ? '관리자 권한으로 삭제' : '삭제' ?>
                                                </button>
                                            </div>
                                        <?php endif; ?>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        <?php endif; ?>

                        <!-- 대댓글 작성창 -->
                        <div class="reply-write-row" id="reply-form-<?= $c['id'] ?>"
                            style="display:none; flex-direction:column; gap:6px;">
                            <div style="display:flex; gap:6px; width:100%;">
                                <input type="text" class="lf-search-input" id="reply-input-<?= $c['id'] ?>"
                                    placeholder="답글을 입력하세요..." style="padding: 8px 12px; font-size: 0.85rem; flex:1;">
                                <button class="btn primary" onclick="submitReply(<?= $c['id'] ?>)"
                                    style="padding: 8px 16px; font-size: 0.85rem;">등록</button>
                            </div>
                            <div style="display:flex; align-items:center; gap:8px;">
                                <span style="font-size:0.75rem; opacity:0.6;">📸 사진 첨부:</span>
                                <input type="file" id="reply-image-input-<?= $c['id'] ?>" accept="image/*"
                                    style="font-size:0.75rem;">
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>

            <!-- 댓글 쓰기 -->
            <?php if ($logged_in): ?>
                <div class="comment-write-box">
                    <textarea id="commentInput" class="lf-textarea" placeholder="도움이 될 수 있는 유용한 정보를 댓글로 남겨주세요." rows="3"
                        style="resize:none; margin-bottom:10px;"></textarea>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div style="display:flex; align-items:center; gap:8px;">
                            <span style="font-size:0.8rem; opacity:0.7;">📸 사진 첨부:</span>
                            <input type="file" id="commentImageInput" accept="image/*" style="font-size:0.8rem;">
                        </div>
                        <button class="btn primary" id="submitComment"
                            style="display:inline-flex; align-items:center; gap:4px;">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2.5">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                            댓글 작성
                        </button>
                    </div>
                </div>
            <?php else: ?>
                <p style="text-align:center; opacity: 0.6; font-size: 0.9rem; padding: 20px 0;">
                    로그인하시면 댓글을 작성할 수 있습니다.
                </p>
            <?php endif; ?>
        </div>

        <footer
            style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid var(--border); font-size: 0.8rem; color: var(--text); opacity: 0.6;">
            © <?= date('Y') ?> ISHS 32nd - Developed by Dohye Lee. All rights reserved.
        </footer>
    </div>

    <?php if ($logged_in): ?>
        <!-- Floating Notifications Widget -->
        <div id="notif-floating-widget"
            style="position: fixed; bottom: 25px; right: 25px; z-index: 10000; display: flex; flex-direction: column; align-items: flex-end; gap: 10px;">
            <!-- Notifications Panel (Above FAB) -->
            <div id="notif-floating-panel"
                style="display: none; width: 300px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.15); padding: 10px 0; max-height: 380px; overflow-y: auto; backdrop-filter: blur(10px); transition: all 0.3s ease;">
                <div
                    style="padding: 10px 16px; border-bottom: 1px solid var(--border); font-size: 0.85rem; font-weight: 800; opacity: 0.9; display:flex; justify-content:space-between; align-items:center;">
                    <span>🔔 알림 센터</span>
                    <?php if ($unread_count > 0): ?>
                        <span
                            style="background: #ea4335; color: white; padding: 2px 7px; border-radius: 10px; font-size: 0.7rem; font-weight: 800;"><?= $unread_count ?></span>
                    <?php endif; ?>
                </div>
                <?php if (empty($notifications)): ?>
                    <div style="padding: 24px; text-align: center; font-size: 0.85rem; opacity: 0.6; color: var(--text);">새로운
                        알림이 없습니다.</div>
                <?php else: ?>
                    <?php foreach ($notifications as $n): ?>
                        <a href="read_notification.php?id=<?= $n['id'] ?>"
                            style="display: block; padding: 12px 16px; border-bottom: 1px solid var(--border); text-decoration: none; color: var(--text); font-size: 0.8rem; line-height: 1.45; transition: background 0.2s; background: <?= $n['is_read'] ? 'transparent' : 'rgba(var(--primary-rgb), 0.04)' ?>;"
                            onmouseover="this.style.background='rgba(var(--primary-rgb), 0.08)'"
                            onmouseout="this.style.background='<?= $n['is_read'] ? 'transparent' : 'rgba(var(--primary-rgb), 0.04)' ?>'">
                            <div
                                style="font-weight: <?= $n['is_read'] ? '500' : '700' ?>; display: flex; align-items: flex-start; gap: 6px;">
                                <span
                                    style="display: inline-block; width: 5px; height: 5px; background: #ea4335; border-radius: 50%; margin-top: 6px; visibility: <?= $n['is_read'] ? 'hidden' : 'visible' ?>;"></span>
                                <div><?= htmlspecialchars($n['message']) ?></div>
                            </div>
                            <div style="font-size: 0.7rem; opacity: 0.5; margin-top: 5px; padding-left: 11px;">
                                <?= date('m/d H:i', strtotime($n['created_at'])) ?>
                            </div>
                        </a>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
            <!-- FAB Toggle Button -->
            <button onclick="toggleNotifPanel(event)"
                style="width: 50px; height: 50px; border-radius: 50%; background: var(--primary); color: white; border: none; box-shadow: 0 4px 20px rgba(var(--primary-rgb), 0.35); display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative; transition: transform 0.2s;"
                onmouseover="this.style.transform='scale(1.06)'" onmouseout="this.style.transform='scale(1)'">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                <?php if ($unread_count > 0): ?>
                    <span
                        style="position: absolute; top: -1px; right: -1px; background: #ea4335; color: white; width: 18px; height: 18px; border-radius: 50%; font-size: 0.65rem; font-weight: 800; display: flex; align-items: center; justify-content: center; border: 2px solid var(--surface);"><?= $unread_count ?></span>
                <?php endif; ?>
            </button>
        </div>
    <?php endif; ?>

    <script>
        const POST_ID = <?= $id ?>;

        let currentImgIdx = 0;
        const imagesList = <?= json_encode(array_column($images ?? [], 'filename')) ?>;

        function setMainImg(idx) {
            currentImgIdx = idx;
            document.getElementById('mainImg').src = 'uploads/' + imagesList[idx];
            document.querySelectorAll('.detail-thumb').forEach(t => t.classList.remove('active'));
            const thumb = document.querySelector('.detail-thumb[data-idx="' + idx + '"]');
            if (thumb) thumb.classList.add('active');
        }

        function prevImg() {
            if (!imagesList || imagesList.length <= 1) return;
            let idx = (currentImgIdx - 1 + imagesList.length) % imagesList.length;
            setMainImg(idx);
        }

        function nextImg() {
            if (!imagesList || imagesList.length <= 1) return;
            let idx = (currentImgIdx + 1) % imagesList.length;
            setMainImg(idx);
        }

        // 댓글 제출
        document.getElementById('submitComment')?.addEventListener('click', submitComment);
        async function submitComment() {
            const ta = document.getElementById('commentInput');
            const content = ta.value.trim();
            if (!content) return;

            const fileInput = document.getElementById('commentImageInput');
            const formData = new FormData();
            formData.append('action', 'comment');
            formData.append('content', content);
            if (fileInput && fileInput.files[0]) {
                formData.append('comment_image', fileInput.files[0]);
            }

            const r = await fetch('', { method: 'POST', body: formData });
            const d = await r.json();
            if (d.success) {
                location.reload();
            } else alert(d.error);
        }

        // 답글 토글
        function toggleReplyForm(cid) {
            const f = document.getElementById('reply-form-' + cid);
            f.style.display = f.style.display === 'none' ? 'flex' : 'none';
        }

        // 답글 제출
        async function submitReply(pid) {
            const inp = document.getElementById('reply-input-' + pid);
            const content = inp.value.trim();
            if (!content) return;

            const fileInput = document.getElementById('reply-image-input-' + pid);
            const formData = new FormData();
            formData.append('action', 'comment');
            formData.append('content', content);
            formData.append('parent_id', pid);
            if (fileInput && fileInput.files[0]) {
                formData.append('comment_image', fileInput.files[0]);
            }

            const r = await fetch('', { method: 'POST', body: formData });
            const d = await r.json();
            if (d.success) {
                location.reload();
            } else alert(d.error);
        }

        // 댓글 삭제
        async function deleteComment(cid) {
            if (!confirm('댓글을 삭제하시겠습니까?')) return;
            const r = await fetch('', { method: 'POST', body: new URLSearchParams({ action: 'delete_comment', comment_id: cid }) });
            const d = await r.json();
            if (d.success) {
                location.reload();
            } else alert(d.error);
        }

        // 채택
        async function adoptComment(cid) {
            if (!confirm('이 댓글을 정보 제공으로 채택하고 사건을 해결완료 처리합니까?')) return;
            const r = await fetch('', { method: 'POST', body: new URLSearchParams({ action: 'adopt', comment_id: cid }) });
            const d = await r.json();
            if (d.success) location.reload();
            else alert(d.error);
        }

        // 해결 토글
        document.getElementById('resolveBtn')?.addEventListener('click', async () => {
            const r = await fetch('', { method: 'POST', body: new URLSearchParams({ action: 'resolve' }) });
            const d = await r.json();
            if (d.success) location.reload();
        });

        // 삭제
        document.getElementById('deleteBtn')?.addEventListener('click', async () => {
            if (!confirm('본 게시글을 삭제하시겠습니까? (삭제 후 되돌릴 수 없습니다)')) return;
            const r = await fetch('', { method: 'POST', body: new URLSearchParams({ action: 'delete_post' }) });
            const d = await r.json();
            if (d.success) location.href = d.redirect;
            else alert(d.error);
        });

        // 공유
        function sharePost() {
            navigator.clipboard.writeText(location.href).then(() => {
                alert('클립보드에 링크가 복사되었습니다!! 인곽생들에게 널리 공유해주세요!');
            });
        }

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
</body>

</html>