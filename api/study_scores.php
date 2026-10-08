<?php
/**
 * Authenticated study-score API. Client-side math grading remains the source of
 * correctness; this API records one completed result for each server-issued attempt.
 */
session_start();
require_once __DIR__ . '/../db_config.php';
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, private');

function respond($payload, $status = 200) {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function requireUser() {
    if (!isset($_SESSION['user_id'])) respond(['status' => 'error', 'message' => '로그인이 필요합니다.'], 401);
    if (isset($_SESSION['role']) && $_SESSION['role'] === 'banned') respond(['status' => 'error', 'message' => '이용할 수 없는 계정입니다.'], 403);
    return (int)$_SESSION['user_id'];
}

function requestData() {
    $decoded = json_decode(file_get_contents('php://input'), true);
    return is_array($decoded) ? $decoded : $_POST;
}

function studioFrom($data) {
    $studio = $data['studio'] ?? '';
    if (!in_array($studio, ['integral', 'advanced_math', 'general_physics'], true)) respond(['status' => 'error', 'message' => '유효하지 않은 스튜디오입니다.'], 422);
    return $studio;
}

function positiveInt($value, $name, $min = 0) {
    if (filter_var($value, FILTER_VALIDATE_INT) === false || (int)$value < $min) {
        respond(['status' => 'error', 'message' => "$name 값이 올바르지 않습니다."], 422);
    }
    return (int)$value;
}

function leaderboard($studio, $currentUserId) {
    global $pdo;
    $sql = "SELECT u.id, u.nickname, SUM(a.correct_count) AS correct_total,
                   SUM(a.total_count) AS attempted_total, MIN(a.completed_at) AS first_completed
            FROM study_attempts a
            INNER JOIN users u ON u.id = a.user_id
            WHERE a.studio = ? AND a.completed_at IS NOT NULL AND (u.role IS NULL OR u.role <> 'banned')
            GROUP BY u.id, u.nickname
            ORDER BY correct_total DESC,
                     (SUM(a.correct_count) / NULLIF(SUM(a.total_count), 0)) DESC,
                     first_completed ASC, u.id ASC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$studio]);
    $rows = $stmt->fetchAll();
    foreach ($rows as $index => &$row) {
        $row['rank'] = $index + 1;
        $row['correct_total'] = (int)$row['correct_total'];
        $row['attempted_total'] = (int)$row['attempted_total'];
        $row['accuracy'] = $row['attempted_total'] ? round($row['correct_total'] * 100 / $row['attempted_total'], 1) : 0;
        $row['is_current_user'] = (int)$row['id'] === $currentUserId;
        unset($row['id'], $row['first_completed']);
    }
    unset($row);
    $current = null;
    foreach ($rows as $row) if ($row['is_current_user']) { $current = $row; break; }
    return ['rows' => $rows, 'current' => $current];
}

if (!isset($pdo) || !$pdo) respond(['status' => 'error', 'message' => '데이터베이스가 구성되지 않았습니다.'], 500);
$userId = requireUser();
$action = $_GET['action'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $studio = studioFrom($_GET);
    if ($action === 'history') {
        try {
            $stmt = $pdo->prepare('SELECT collection_id, total_count, MAX(correct_count) AS best_correct FROM study_attempts WHERE user_id = ? AND studio = ? AND completed_at IS NOT NULL GROUP BY collection_id, total_count');
            $stmt->execute([$userId, $studio]);
            $records = $stmt->fetchAll();
            foreach ($records as &$record) {
                $record['total_count'] = (int)$record['total_count'];
                $record['best_correct'] = (int)$record['best_correct'];
            }
            unset($record);
            respond(['status' => 'success', 'records' => $records]);
        } catch (Throwable $e) {
            respond(['status' => 'error', 'message' => '학습 기록을 불러오지 못했습니다.'], 500);
        }
    }
    $board = leaderboard($studio, $userId);
    if ($action === 'summary') {
        $current = $board['current'];
        respond(['status' => 'success', 'summary' => $current ?: ['rank' => null, 'correct_total' => 0, 'attempted_total' => 0, 'accuracy' => 0]]);
    }
    if ($action === 'leaderboard') respond(['status' => 'success', 'leaderboard' => $board]);
    respond(['status' => 'error', 'message' => '잘못된 요청입니다.'], 400);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(['status' => 'error', 'message' => '허용되지 않은 요청입니다.'], 405);
$data = requestData();

if ($action === 'start') {
    $studio = studioFrom($data);
    $collectionId = trim((string)($data['collection_id'] ?? ''));
    $total = positiveInt($data['total_count'] ?? null, '문항 수', 1);
    if ($collectionId === '' || strlen($collectionId) > 100 || !preg_match('/^[A-Za-z0-9_-]+$/', $collectionId)) {
        respond(['status' => 'error', 'message' => '문제집 정보가 올바르지 않습니다.'], 422);
    }
    $token = bin2hex(random_bytes(32));
    $stmt = $pdo->prepare('INSERT INTO study_attempts (user_id, studio, collection_id, total_count, attempt_token) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([$userId, $studio, $collectionId, $total, $token]);
    respond(['status' => 'success', 'attempt' => ['id' => (int)$pdo->lastInsertId(), 'token' => $token]]);
}

if ($action === 'complete') {
    $studio = studioFrom($data);
    $attemptId = positiveInt($data['attempt_id'] ?? null, '시도 ID', 1);
    $token = (string)($data['attempt_token'] ?? '');
    $total = positiveInt($data['total_count'] ?? null, '문항 수', 1);
    $correct = positiveInt($data['correct_count'] ?? null, '정답 수');
    $skipped = positiveInt($data['skipped_count'] ?? null, '건너뜀 수');
    if (!preg_match('/^[a-f0-9]{64}$/', $token) || $correct > $total || $skipped > $total || $correct + $skipped > $total) {
        respond(['status' => 'error', 'message' => '제출한 점수 정보가 올바르지 않습니다.'], 422);
    }
    try {
        $pdo->beginTransaction();
        $stmt = $pdo->prepare('SELECT id, total_count, correct_count, skipped_count, completed_at FROM study_attempts WHERE id = ? AND user_id = ? AND studio = ? AND attempt_token = ? FOR UPDATE');
        $stmt->execute([$attemptId, $userId, $studio, $token]);
        $attempt = $stmt->fetch();
        if (!$attempt) { $pdo->rollBack(); respond(['status' => 'error', 'message' => '유효하지 않은 학습 시도입니다.'], 403); }
        if ($attempt['completed_at'] !== null) {
            // A lost response may cause a physics result to be retried. A matching
            // retry acknowledges the existing record; it never adds another score.
            if ($studio === 'general_physics' && (int)$attempt['total_count'] === $total
                && (int)$attempt['correct_count'] === $correct && (int)$attempt['skipped_count'] === $skipped) {
                $pdo->commit();
                respond(['status' => 'success', 'summary' => leaderboard($studio, $userId)['current']]);
            }
            $pdo->rollBack(); respond(['status' => 'error', 'message' => '이미 저장된 학습 기록입니다.'], 409);
        }
        if ((int)$attempt['total_count'] !== $total) { $pdo->rollBack(); respond(['status' => 'error', 'message' => '문항 수가 시작 기록과 다릅니다.'], 422); }
        $update = $pdo->prepare('UPDATE study_attempts SET correct_count = ?, skipped_count = ?, completed_at = NOW() WHERE id = ?');
        $update->execute([$correct, $skipped, $attemptId]);
        $pdo->commit();
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        respond(['status' => 'error', 'message' => '점수 저장 중 오류가 발생했습니다.'], 500);
    }
    respond(['status' => 'success', 'summary' => leaderboard($studio, $userId)['current']]);
}

respond(['status' => 'error', 'message' => '잘못된 요청입니다.'], 400);
?>
