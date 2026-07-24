<?php
session_start();
require_once '../db_config.php';

$id = (int)($_GET['id'] ?? 0);
if ($id && isset($_SESSION['user_id'])) {
    $stmt = $pdo->prepare("SELECT * FROM lost_found_notifications WHERE id = ? AND user_id = ?");
    $stmt->execute([$id, $_SESSION['user_id']]);
    $n = $stmt->fetch();
    if ($n) {
        $up = $pdo->prepare("UPDATE lost_found_notifications SET is_read = 1 WHERE id = ?");
        $up->execute([$id]);
        header("Location: view.php?id=" . $n['post_id']);
        exit;
    }
}
header("Location: index.php");
exit;
