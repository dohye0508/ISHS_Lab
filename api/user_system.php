<?php
/**
 * User System Router (PHP)
 * Handles Signup, Login, and Session Management
 */
session_start();
require_once __DIR__ . '/../db_config.php';
require_once __DIR__ . '/auth_riro.php';

header('Content-Type: application/json');

$action = $_GET['action'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

    switch ($action) {
        case 'signup':
            handleSignup($data);
            break;
        case 'login':
            handleLogin($data);
            break;
        case 'logout':
            handleLogout();
            break;
        default:
            echo json_encode(["status" => "error", "message" => "잘못된 접근입니다."]);
            break;
    }
} else {
    // GET requests
    if ($action === 'status') {
        handleStatus();
    }
}

function handleSignup($data) {
    global $pdo;
    
    // Check if database is configured
    if (!isset($pdo) || !$pdo) {
        echo json_encode(["status" => "error", "message" => "데이터베이스가 구성되지 않았습니다. db_config.php를 확인해주세요."]);
        return;
    }

    $riro_id = $data['riro_id'] ?? '';
    $riro_pw = $data['riro_pw'] ?? '';
    $nickname = $data['nickname'] ?? '';
    $password = $data['password'] ?? '';

    if (!$riro_id || !$riro_pw || !$nickname || !$password) {
        echo json_encode(["status" => "error", "message" => "모든 필드를 입력해주세요."]);
        return;
    }

    // 1. Verify via Riro
    $riro = new RiroAuth();
    $res = $riro->checkLogin($riro_id, $riro_pw);

    if ($res['status'] !== 'success') {
        echo json_encode($res);
        return;
    }

    // 2. Check if nickname or username already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ? OR nickname = ?");
    $stmt->execute([$riro_id, $nickname]);
    if ($stmt->fetch()) {
        echo json_encode(["status" => "error", "message" => "이미 가입된 리로 아이디거나 이미 존재하는 닉네임입니다."]);
        return;
    }

    // 3. Insert to DB
    $hashed_pw = password_hash($password, PASSWORD_DEFAULT);
    try {
        $stmt = $pdo->prepare("INSERT INTO users (username, nickname, password, riro_name, student_number, generation, student_type) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $riro_id,
            $nickname,
            $hashed_pw,
            $res['name'],
            $res['student_number'],
            $res['generation'],
            $res['student']
        ]);

        echo json_encode(["status" => "success", "message" => "회원가입이 완료되었습니다. 로그인해주세요!"]);
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "DB 저장 중 오류 발생: " . $e->getMessage()]);
    }
}

function handleLogin($data) {
    global $pdo;
    
    if (!isset($pdo)) {
        echo json_encode(["status" => "error", "message" => "데이터베이스가 구성되지 않았습니다. db_config.php를 확인해주세요."]);
        return;
    }
    
    $nickname = $data['nickname'] ?? '';
    $password = $data['password'] ?? '';

    // Check Local DB
    $stmt = $pdo->prepare("SELECT * FROM users WHERE nickname = ?");
    $stmt->execute([$nickname]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['nickname'] = $user['nickname'];
        $_SESSION['riro_name'] = $user['riro_name'];
        $_SESSION['student_number'] = $user['student_number'];
        
        echo json_encode([
            "status" => "success", 
            "message" => "로그인 성공!",
            "user" => [
                "nickname" => $user['nickname'],
                "riro_name" => $user['riro_name']
            ]
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "닉네임 또는 비밀번호가 틀렸습니다."]);
    }
}

function handleLogout() {
    session_destroy();
    echo json_encode(["status" => "success", "message" => "로그아웃 되었습니다."]);
}

function handleStatus() {
    if (isset($_SESSION['user_id'])) {
        echo json_encode([
            "status" => "success",
            "logged_in" => true,
            "user" => [
                "nickname" => $_SESSION['nickname'],
                "riro_name" => $_SESSION['riro_name']
            ]
        ]);
    } else {
        echo json_encode(["status" => "success", "logged_in" => false]);
    }
}
?>
