<?php
/**
 * ISHS 분실물 센터 - 모달 AJAX API
 */
session_start();
require_once '../db_config.php';

header('Content-Type: application/json; charset=utf-8');

$id = (int)($_GET['id'] ?? $_POST['id'] ?? 0);
$logged_in = isset($_SESSION['user_id']);
$user_id = $_SESSION['user_id'] ?? null;
$is_admin = false;

if (!$id) { echo json_encode(['error' => 'invalid']); exit; }

if ($logged_in) {
    $u = $pdo->prepare("SELECT role FROM users WHERE id = ?");
    $u->execute([$user_id]);
    $ur = $u->fetch();
    if ($ur && $ur['role'] === 'admin') $is_admin = true;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!$logged_in) { echo json_encode(['error' => '로그인이 필요합니다.']); exit; }
    $action = $_POST['action'] ?? '';
    $post_stmt = $pdo->prepare("SELECT * FROM lost_found_posts WHERE id = ?");
    $post_stmt->execute([$id]);
    $post = $post_stmt->fetch();
    if (!$post) { echo json_encode(['error' => '게시물 없음']); exit; }

    if ($action === 'comment') {
        $content = trim($_POST['content'] ?? '');
        $parent = (int)($_POST['parent_id'] ?? 0);
        if (!$content) { echo json_encode(['error' => '내용 필요']); exit; }
        $image_filename = null;
        if (!empty($_FILES['comment_image']['name']) && $_FILES['comment_image']['error'] === UPLOAD_ERR_OK) {
            $allowed = ['image/jpeg','image/png','image/gif','image/webp'];
            if (in_array($_FILES['comment_image']['type'], $allowed) && $_FILES['comment_image']['size'] <= 3*1024*1024) {
                $ext = strtolower(pathinfo($_FILES['comment_image']['name'], PATHINFO_EXTENSION));
                $fname = uniqid('com_img_', true) . '.' . $ext;
                $dir = __DIR__ . '/uploads/';
                if (!is_dir($dir)) mkdir($dir, 0755, true);
                if (move_uploaded_file($_FILES['comment_image']['tmp_name'], $dir . $fname)) $image_filename = $fname;
            }
        }
        $stmt = $pdo->prepare("INSERT INTO lost_found_comments (post_id, user_id, parent_id, content, image_filename) VALUES (?,?,?,?,?)");
        $stmt->execute([$id, $user_id, $parent ?: null, $content, $image_filename]);
        $post_owner = (int)$post['user_id'];
        if ($parent > 0) {
            $ps = $pdo->prepare("SELECT user_id FROM lost_found_comments WHERE id = ?");
            $ps->execute([$parent]);
            $po = (int)$ps->fetchColumn();
            if ($po > 0 && $po != $user_id) $pdo->prepare("INSERT INTO lost_found_notifications (user_id, post_id, type, message) VALUES (?,?,'comment','내 댓글에 새로운 답글이 달렸습니다.')")->execute([$po, $id]);
            if ($post_owner != $user_id && $post_owner != $po) $pdo->prepare("INSERT INTO lost_found_notifications (user_id, post_id, type, message) VALUES (?,?,'comment','내 게시글에 새로운 댓글이 달렸습니다.')")->execute([$post_owner, $id]);
        } else {
            if ($post_owner != $user_id) $pdo->prepare("INSERT INTO lost_found_notifications (user_id, post_id, type, message) VALUES (?,?,'comment','내 게시글에 새로운 댓글이 달렸습니다.')")->execute([$post_owner, $id]);
        }
        echo json_encode(['success' => true]); exit;
    }

    if ($action === 'delete_comment') {
        $cid = (int)($_POST['comment_id'] ?? 0);
        $chk = $pdo->prepare("SELECT user_id FROM lost_found_comments WHERE id = ? AND post_id = ?");
        $chk->execute([$cid, $id]);
        $crow = $chk->fetch();
        if ($crow && ($crow['user_id'] == $user_id || $post['user_id'] == $user_id || $is_admin)) {
            $pdo->prepare("DELETE FROM lost_found_comments WHERE id = ?")->execute([$cid]);
            echo json_encode(['success' => true]);
        } else { echo json_encode(['error' => '권한 없음']); }
        exit;
    }

    if ($action === 'adopt') {
        if ($post['user_id'] != $user_id) { echo json_encode(['error' => '권한 없음']); exit; }
        $cid = (int)($_POST['comment_id'] ?? 0);
        $pdo->prepare("UPDATE lost_found_comments SET is_adopted=0 WHERE post_id=?")->execute([$id]);
        $pdo->prepare("UPDATE lost_found_comments SET is_adopted=1 WHERE id=? AND post_id=?")->execute([$cid, $id]);
        $pdo->prepare("UPDATE lost_found_posts SET status='resolved' WHERE id=?")->execute([$id]);
        $ps = $pdo->prepare("SELECT user_id FROM lost_found_comments WHERE id = ?");
        $ps->execute([$cid]);
        $ca = (int)$ps->fetchColumn();
        if ($ca > 0 && $ca != $user_id) $pdo->prepare("INSERT INTO lost_found_notifications (user_id, post_id, type, message) VALUES (?,?,'adopt','작성하신 댓글이 정보 제공으로 채택되었습니다!')")->execute([$ca, $id]);
        echo json_encode(['success' => true]); exit;
    }

    if ($action === 'resolve') {
        if ($post['user_id'] != $user_id && !$is_admin) { echo json_encode(['error' => '권한 없음']); exit; }
        $new_status = $post['status'] === 'resolved' ? 'searching' : 'resolved';
        $pdo->prepare("UPDATE lost_found_posts SET status=? WHERE id=?")->execute([$new_status, $id]);
        echo json_encode(['success' => true, 'status' => $new_status]); exit;
    }

    if ($action === 'delete_post') {
        if ($post['user_id'] != $user_id && !$is_admin) { echo json_encode(['error' => '권한 없음']); exit; }
        $imgs = $pdo->prepare("SELECT filename FROM lost_found_images WHERE post_id = ?");
        $imgs->execute([$id]);
        foreach ($imgs->fetchAll() as $img) @unlink(__DIR__ . '/uploads/' . $img['filename']);
        $pdo->prepare("DELETE FROM lost_found_posts WHERE id=?")->execute([$id]);
        echo json_encode(['success' => true]); exit;
    }

    echo json_encode(['error' => '알 수 없는 액션']); exit;
}

// GET
if (!isset($_SESSION['viewed_posts'])) $_SESSION['viewed_posts'] = [];
if (!in_array($id, $_SESSION['viewed_posts'])) {
    $pdo->prepare("UPDATE lost_found_posts SET views=views+1 WHERE id=?")->execute([$id]);
    $_SESSION['viewed_posts'][] = $id;
}

$stmt = $pdo->prepare("SELECT p.*, u.nickname, u.riro_name, u.grade, u.student_number FROM lost_found_posts p JOIN users u ON p.user_id=u.id WHERE p.id=?");
$stmt->execute([$id]);
$post = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$post) { echo json_encode(['error' => '게시물 없음']); exit; }

$img_stmt = $pdo->prepare("SELECT * FROM lost_found_images WHERE post_id=? ORDER BY id");
$img_stmt->execute([$id]);
$images = $img_stmt->fetchAll(PDO::FETCH_ASSOC);

$com_stmt = $pdo->prepare("SELECT c.*, u.nickname, u.riro_name, u.grade FROM lost_found_comments c JOIN users u ON c.user_id=u.id WHERE c.post_id=? AND c.parent_id IS NULL ORDER BY c.created_at ASC");
$com_stmt->execute([$id]);
$comments = $com_stmt->fetchAll(PDO::FETCH_ASSOC);

$rep_stmt = $pdo->prepare("SELECT c.*, u.nickname, u.riro_name FROM lost_found_comments c JOIN users u ON c.user_id=u.id WHERE c.post_id=? AND c.parent_id IS NOT NULL ORDER BY c.created_at ASC");
$rep_stmt->execute([$id]);
$replies_raw = $rep_stmt->fetchAll(PDO::FETCH_ASSOC);
$replies = [];
foreach ($replies_raw as $r) $replies[$r['parent_id']][] = $r;

function time_ago_ajax($dt) {
    $diff = time() - strtotime($dt);
    if ($diff < 60) return $diff . '초 전';
    if ($diff < 3600) return floor($diff/60) . '분 전';
    if ($diff < 86400) return floor($diff/3600) . '시간 전';
    if ($diff < 604800) return floor($diff/86400) . '일 전';
    return date('Y.m.d', strtotime($dt));
}

foreach ($comments as &$c) {
    $c['time_ago'] = time_ago_ajax($c['created_at']);
    $c['replies'] = $replies[$c['id']] ?? [];
    foreach ($c['replies'] as &$r) $r['time_ago'] = time_ago_ajax($r['created_at']);
}
unset($c, $r);

echo json_encode([
    'post' => $post,
    'images' => $images,
    'comments' => $comments,
    'is_mine' => $logged_in && (int)$post['user_id'] === (int)$user_id,
    'is_admin' => $is_admin,
    'logged_in' => $logged_in,
    'current_user_id' => (int)$user_id,
], JSON_UNESCAPED_UNICODE);
