<?php
/**
 * User System Router (PHP)
 * Handles Signup, Login, Session Management, and Role Management
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
        case 'update_role':
            handleUpdateRole($data);
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

    // 1 & 2. Riro Authentication with Auto-School Detection
    $schools = [
        'iscience' => '인천과학고등학교'
    ];

    $res = ["status" => "error", "message" => "아이디 또는 비밀번호가 틀렸습니다."];
    $final_school = "";
    $login_success = false;

    foreach ($schools as $subdomain => $formal_name) {
        $attempt = $riro->checkLogin($riro_id, $riro_pw, $subdomain);
        
        if ($attempt['status'] === 'success') {
            $res = $attempt;
            $final_school = $formal_name;
            $login_success = true;
            break;
        }
    }

    if (!$login_success) {
        echo json_encode(["status" => "error", "message" => "로그인 정보를 찾을 수 없습니다. (인천과학고 리로스쿨 계정 전용)"]);
        return;
    }

    // $login_success 이미 체크됨. iscience 서브도메인 전용이므로 별도 학교 확인 불필요.

    // 3. Check if nickname or username already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ? OR nickname = ?");
    $stmt->execute([$riro_id, $nickname]);
    if ($stmt->fetch()) {
        echo json_encode(["status" => "error", "message" => "이미 가입된 리로 아이디거나 이미 존재하는 닉네임입니다."]);
        return;
    }

    // 4. Insert to DB
    $hashed_pw = password_hash($password, PASSWORD_DEFAULT);
    $role = ($nickname === '09') ? 'admin' : 'user'; // Assign admin role to '09'
    
    try {
        $stmt = $pdo->prepare("INSERT INTO users (username, nickname, password, riro_name, school_name, grade, role, student_number, generation, student_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $riro_id,
            $nickname,
            $hashed_pw,
            $res['name'],
            $final_school,
            $res['grade'],
            $role,
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
        $_SESSION['school_name'] = $user['school_name'];
        $_SESSION['generation'] = $user['generation'];
        $_SESSION['role'] = $user['role'];
        
        try {
            $pdo->prepare("UPDATE users SET last_active = NOW() WHERE id = ?")->execute([$user['id']]);
        } catch (Exception $e) {}
        
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
        try {
            global $pdo;
            if (isset($pdo)) {
                $pdo->prepare("UPDATE users SET last_active = NOW() WHERE id = ?")->execute([$_SESSION['user_id']]);
            }
        } catch (Exception $e) {}

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

function handleUpdateRole($data) {
    global $pdo;

    // Only admin can change roles
    if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
        echo json_encode(["status" => "error", "message" => "권한이 없습니다."]);
        return;
    }

    $target_id = (int)($data['user_id'] ?? 0);
    $new_role   = $data['role'] ?? '';

    $allowed_roles = ['admin', 'sub_admin', 'user', 'banned'];
    if (!in_array($new_role, $allowed_roles)) {
        echo json_encode(["status" => "error", "message" => "유효하지 않은 역할입니다."]);
        return;
    }

    // Cannot change own role
    if ($target_id === (int)$_SESSION['user_id']) {
        echo json_encode(["status" => "error", "message" => "자신의 역할은 변경할 수 없습니다."]);
        return;
    }

    try {
        $stmt = $pdo->prepare("UPDATE users SET role = ? WHERE id = ?");
        $stmt->execute([$new_role, $target_id]);
        echo json_encode(["status" => "success", "message" => "역할이 변경되었습니다."]);
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "DB 오류: " . $e->getMessage()]);
    }
}
?>
