<?php
/**
 * Database Initialization & Reset Tool (Robust Version)
 */
require_once 'db_config.php';

echo "<h2>ISHS Lab Database Initialization</h2>";

try {
    // 1. 기존 테이블 삭제 (깔끔한 리셋을 위해)
    $pdo->exec("DROP TABLE IF EXISTS users");
    echo "✅ 기존 users 테이블 삭제 완료.<br>";

    // 2. 테이블 새로 생성 (최신 스키마 반영)
    $sql = "CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        nickname VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        riro_name VARCHAR(50),
        school_name VARCHAR(100),
        grade INT,
        role VARCHAR(20) DEFAULT 'user',
        student_number VARCHAR(10),
        generation INT,
        student_type VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";

    $pdo->exec($sql);
    echo "✅ users 테이블 새로 생성 완료 (Admin Role 반영).<br>";

    echo "<h3>🚀 DB 초기화 성공!</h3>";
    echo "<p>이제 새로운 회원가입을 진행할 수 있습니다. 닉네임 <b>'09'</b>로 가입 시 관리자 권한이 부여됩니다.</p>";
    echo "<p style='color:red;'><b>보안 주의:</b> 실행 후 이 파일(db_init.php)을 반드시 서버에서 삭제해 주세요.</p>";

} catch (PDOException $e) {
    echo "<h3>❌ 오류 발생</h3>";
    echo "에러 메시지: " . $e->getMessage();
}
?>