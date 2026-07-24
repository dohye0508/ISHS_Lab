<?php
// Run this once to create the tables
require_once '../db_config.php';

$sql = file_get_contents(__DIR__ . '/sql/lost_found_schema.sql');
$statements = array_filter(array_map('trim', explode(';', $sql)));

$success = 0;
$errors = [];

// 1. 테이블 스키마 생성
foreach ($statements as $stmt) {
    if (empty($stmt)) continue;
    try {
        $pdo->exec($stmt);
        $success++;
    } catch (PDOException $e) {
        $errors[] = $e->getMessage();
    }
}

// 2. 예시용 더미 데이터 삽입 (이도혜, 이서정, 엄지오)
$dummy_users = [
    [
        'username' => 'yongha_temp',
        'nickname' => 'gd',
        'password' => password_hash('ishslab123!', PASSWORD_DEFAULT),
        'riro_name' => '이용하',
        'school_name' => '인천과학고등학교',
        'grade' => 2,
        'student_number' => '2201'
    ],
    [
        'username' => 'seojeong_temp',
        'nickname' => 'lsj',
        'password' => password_hash('ishslab123!', PASSWORD_DEFAULT),
        'riro_name' => '이서정',
        'school_name' => '인천과학고등학교',
        'grade' => 2,
        'student_number' => '2202'
    ],
    [
        'username' => 'jio_temp',
        'nickname' => 'um',
        'password' => password_hash('ishslab123!', PASSWORD_DEFAULT),
        'riro_name' => '엄지오',
        'school_name' => '인천과학고등학교',
        'grade' => 2,
        'student_number' => '2203'
    ]
];

$user_ids = [];
foreach ($dummy_users as $du) {
    // 이미 존재하는지 확인
    $chk = $pdo->prepare("SELECT id FROM users WHERE username = ?");
    $chk->execute([$du['username']]);
    $existing_user = $chk->fetch();
    
    if ($existing_user) {
        $user_ids[$du['nickname']] = $existing_user['id'];
        // Force update for dummy users fix
        try {
            $pdo->prepare("UPDATE users SET nickname=?, riro_name=? WHERE id=?")->execute([$du['nickname'], $du['riro_name'], $existing_user['id']]);
        } catch (PDOException $e) {
            // Ignore duplicate entry errors for existing nicknames to allow script to continue
            error_log("Failed to update dummy user: " . $e->getMessage());
        }
    } else {
        try {
            $ins = $pdo->prepare("INSERT INTO users (username, nickname, password, riro_name, school_name, grade, student_number) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $ins->execute([
                $du['username'],
                $du['nickname'],
                $du['password'],
                $du['riro_name'],
                $du['school_name'],
                $du['grade'],
                $du['student_number']
            ]);
            $user_ids[$du['nickname']] = $pdo->lastInsertId();
        } catch (PDOException $e) {
            $errors[] = "유저 생성 실패 (" . $du['nickname'] . "): " . $e->getMessage();
        }
    }
}

$dummy_posts = [
    [
        'nickname' => 'gd',
        'type' => 'lost',
        'title' => '애플펜슬 2세대 분실 (이름 각인 있음)',
        'content' => '2학년 교실 앞 복도 사물함 위나 독서실 주변에서 잃어버린 것 같습니다. 펜슬 바디에 제 영어 이름 각인이 작게 새겨져 있습니다. 혹시 주우신 분 있으시면 연락 부탁드려요!',
        'category' => '💻 전자기기',
        'location' => '일반생물실험실',
        'keep_location' => null,
        'lost_date' => '2026-07-10',
        'thumbnail_type' => 'image',
        'thumbnail_text' => null,
        'image_filename' => 'dummy_apple_pencil.png'
    ],
    [
        'nickname' => 'lsj',
        'type' => 'found',
        'title' => '행정실 앞 복도에서 하늘색 무선 이어폰 케이스 습득',
        'content' => '행정실 복도 정수기 옆 바닥에 떨어져 있던 하늘색 이어폰 케이스(안에 유닛 들어있음)를 주웠습니다. 주인분 확인하실 수 있게 행정실에 직접 맡겨두었습니다.',
        'category' => '💻 전자기기',
        'location' => '급식실',
        'keep_location' => '1학년 교무실',
        'lost_date' => '2026-07-14',
        'thumbnail_type' => 'image',
        'thumbnail_text' => null,
        'image_filename' => 'dummy_earphone.png'
    ],
    [
        'nickname' => 'um',
        'type' => 'lost',
        'title' => '체육관 벤치 뒤에서 나이키 흰색 캡모자 잃어버렸습니다',
        'content' => '체육 수업 끝나고 깜빡 잊고 체육관 벤치 뒤쪽에 놔두고 온 것 같습니다. 흰색에 앞부분 검은색 스우시 로고가 있는 모자입니다. 발견하신 분은 알려주시면 감사하겠습니다!',
        'category' => '👕 의류/잡화',
        'location' => '강당',
        'keep_location' => null,
        'lost_date' => '2026-07-12',
        'thumbnail_type' => 'image',
        'thumbnail_text' => '모자',
        'image_filename' => 'dummy_cap.png'
    ]
];

foreach ($dummy_posts as $dp) {
    if (!isset($user_ids[$dp['nickname']])) continue;
    $uid = $user_ids[$dp['nickname']];
    
    // 중복 생성 방지 (제목 기준)
    $chk = $pdo->prepare("SELECT id FROM lost_found_posts WHERE title = ? AND user_id = ?");
    $chk->execute([$dp['title'], $uid]);
    if (!$chk->fetch()) {
        try {
            $ins = $pdo->prepare("INSERT INTO lost_found_posts (user_id, type, title, content, category, location, keep_location, lost_date, thumbnail_type, thumbnail_text) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $ins->execute([
                $uid,
                $dp['type'],
                $dp['title'],
                $dp['content'],
                $dp['category'],
                $dp['location'],
                $dp['keep_location'],
                $dp['lost_date'],
                $dp['thumbnail_type'],
                $dp['thumbnail_text']
            ]);
            $post_id = $pdo->lastInsertId();
            if (!empty($dp['image_filename'])) {
                $img_ins = $pdo->prepare("INSERT INTO lost_found_images (post_id, filename) VALUES (?, ?)");
                $img_ins->execute([$post_id, $dp['image_filename']]);
            }
        } catch (PDOException $e) {
            $errors[] = "포스트 생성 실패: " . $e->getMessage();
        }
    }
}

echo "<h2>DB 초기화 및 예시 데이터 생성 완료</h2>";
echo "<p>성공: $success 개 쿼리 실행 완료</p>";
echo "<p>생성된 더미 계정: 이도혜, 이서정, 엄지오</p>";
if ($errors) {
    echo "<p>오류 내역:</p><ul>";
    foreach ($errors as $e) echo "<li>$e</li>";
    echo "</ul>";
}
echo "<p><a href='index.php'>분실물 센터로 이동 →</a></p>";
?>
