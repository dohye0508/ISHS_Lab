<?php
// Database configuration for Dothome (Shared Hosting)

$db_host = 'localhost';
$db_user = 'ishslab'; // 보통 아이디와 동일
$db_pass = 'z1860my18!';
$db_name = 'ishslab'; // 보통 아이디와 동일

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    // If you haven't set up the DB yet, this might fail. 
    // We will handle this gracefully in the auth logic.
    // die("Connection failed: " . $e->getMessage());
}
?>