<?php
/**
 * ISHS 분실물 센터 - 글쓰기 / 수정 페이지 (Clean & Simple)
 */
session_start();
require_once '../db_config.php';

// 로그인 필수
if (!isset($_SESSION['user_id'])) {
    header('Location: ../index.php?msg=login_required');
    exit;
}

$user_id = $_SESSION['user_id'];
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$user_id]);
$user = $stmt->fetch();

$notifications = [];
$unread_count = 0;
if ($user) {
    $notif_stmt = $pdo->prepare("SELECT * FROM lost_found_notifications WHERE user_id = ? ORDER BY id DESC LIMIT 5");
    $notif_stmt->execute([$user_id]);
    $notifications = $notif_stmt->fetchAll();

    $unread_stmt = $pdo->prepare("SELECT COUNT(*) FROM lost_found_notifications WHERE user_id = ? AND is_read = 0");
    $unread_stmt->execute([$user_id]);
    $unread_count = (int) $unread_stmt->fetchColumn();
}

$categories = ['📁 선택 안함', '💳 지갑/카드', '💻 전자기기', '👕 의류/잡화', '🔑 열쇠', '✏️ 필기구/문구', '📖 도서/노트', '⚽ 스포츠용품', '📦 기타'];
$locations = [
    '기타',
    '1학년 1반',
    '1학년 2반',
    '1학년 3반',
    '1학년 4반',
    '1학년 교무실',
    '2학년 1반',
    '2학년 2반',
    '2학년 3반',
    '2학년 4반',
    '2학년 교무실',
    '3학년 1반',
    '3학년 2반',
    '3학년 3반',
    '3학년 4반',
    '3학년 교무실',
    '강당',
    '과제연구실',
    '공작실',
    '그룹토의실',
    '급식실',
    '다목적교실',
    '도서관',
    '독서카페',
    '동아리실',
    '면학실',
    '무한상상실',
    '물리세미나실',
    '생물세미나실',
    '생물현미경실',
    '생태공원',
    '스튜디오',
    '심화물리실험실',
    '심화화학기기실',
    'SW-AI융합실',
    '아벨실',
    '연혁관',
    '운영위원회실',
    '융합실A',
    '융합실B',
    '융합실C',
    '융합실D',
    '일반물리실험실',
    '일반생물실험실',
    '일반화학실험실',
    '입학홍보실',
    '정보실',
    '주사전자현미경실',
    '중정',
    '지구과학실',
    '지능형물리과학실',
    '진로활동실',
    '창의관',
    '천문대',
    '청명관',
    '청운관',
    '초고속 카메라실',
    '편광현미경실',
    '풍동 실험실',
    '필즈실',
    '화학세미나실',
    '화학약품실'
];

// 수정 모드
$edit_id = (int) ($_GET['edit'] ?? 0);
$edit_post = null;
$edit_images = [];
$is_custom_cat = false;
$selected_cat = '선택 안함';
$is_custom_loc = false;
$selected_loc = '';

if ($edit_id) {
    $stmt = $pdo->prepare("SELECT * FROM lost_found_posts WHERE id = ? AND user_id = ?");
    $stmt->execute([$edit_id, $user_id]);
    $edit_post = $stmt->fetch();
    if (!$edit_post) {
        header('Location: index.php');
        exit;
    }

    $img_stmt = $pdo->prepare("SELECT * FROM lost_found_images WHERE post_id = ?");
    $img_stmt->execute([$edit_id]);
    $edit_images = $img_stmt->fetchAll();

    // 카테고리 기성품 여부 판별
    if (in_array($edit_post['category'], array_diff($categories, ['📦 기타']))) {
        $selected_cat = $edit_post['category'];
    } else {
        $selected_cat = '📦 기타';
        $is_custom_cat = true;
    }

    // 장소 기성품 여부 판별
    if (in_array($edit_post['location'], array_diff($locations, ['기타']))) {
        $selected_loc = $edit_post['location'];
    } else {
        $selected_loc = $edit_post['location'] ? '기타' : '';
        if ($edit_post['location']) {
            $is_custom_loc = true;
        }
    }
}

$errors = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $type = in_array($_POST['type'] ?? '', ['lost', 'found']) ? $_POST['type'] : '';
    $title = trim($_POST['title'] ?? '');
    $content = trim($_POST['content'] ?? '');

    // 카테고리 결정 (기타 선택 및 수기 입력 대응)
    $category = trim($_POST['category'] ?? '📁 선택 안함');
    if ($category === '📦 기타' && !empty($_POST['category_custom'])) {
        $category = '📦 ' . trim($_POST['category_custom']);
    }

    // 장소 결정 (기타 선택 및 수기 입력 대응)
    $location = trim($_POST['location'] ?? '');
    if ($location === '기타' && !empty($_POST['location_custom'])) {
        $location = trim($_POST['location_custom']);
    }

    $lost_date = $_POST['lost_date'] ?? null;
    $del_imgs = $_POST['delete_images'] ?? [];

    // 수령/보관 장소 결정 (습득물일 때만 해당)
    $keep_location = null;
    if ($type === 'found') {
        $keep_location = trim($_POST['keep_location'] ?? '');
        if ($keep_location === '기타' && !empty($_POST['keep_location_custom'])) {
            $keep_location = trim($_POST['keep_location_custom']);
        }
        // '기타'만 선택하고 직접 입력이 없으면 null, 빈 문자열도 null로 정규화
        if ($keep_location === '' || $keep_location === '기타') {
            $keep_location = null;
        }
    }


    // 썸네일 설정 처리
    $thumbnail_type = in_array($_POST['thumbnail_type'] ?? '', ['image', 'icon', 'text']) ? $_POST['thumbnail_type'] : 'image';
    $thumbnail_text = trim($_POST['thumbnail_text'] ?? '');
    if ($thumbnail_type !== 'text') {
        $thumbnail_text = null;
    }

    if (!$type)
        $errors[] = '분실/습득 유형을 선택해주세요.';
    if (!$title)
        $errors[] = '제목을 입력해주세요.';
    if (!$content)
        $errors[] = '내용을 입력해주세요.';

    // 사진 첨부 강제 검증
    $new_uploads_count = 0;
    if (!empty($_FILES['images']['name'][0])) {
        $new_uploads_count = count($_FILES['images']['name']);
    }
    $total_images = ($edit_id ? (count($edit_images) - count($del_imgs)) : 0) + $new_uploads_count;
    if ($total_images < 1) {
        $errors[] = '최소 1장 이상의 사진을 첨부해야 합니다.';
    }

    if (empty($errors)) {
        if ($edit_id) {
            // 수정
            $stmt = $pdo->prepare("UPDATE lost_found_posts SET type=?, title=?, content=?, category=?, location=?, keep_location=?, lost_date=?, thumbnail_type=?, thumbnail_text=? WHERE id=? AND user_id=?");
            $stmt->execute([$type, $title, $content, $category, $location, $keep_location, $lost_date ?: null, $thumbnail_type, $thumbnail_text, $edit_id, $user_id]);
            $post_id = $edit_id;

            // 기존 이미지 삭제
            foreach ($del_imgs as $del_id) {
                if (!$del_id)
                    continue;
                $di = $pdo->prepare("SELECT filename FROM lost_found_images WHERE id=? AND post_id=?");
                $di->execute([$del_id, $post_id]);
                $di_row = $di->fetch();
                if ($di_row) {
                    @unlink(__DIR__ . '/uploads/' . $di_row['filename']);
                    $pdo->prepare("DELETE FROM lost_found_images WHERE id=?")->execute([$del_id]);
                }
            }
        } else {
            // 신규
            $stmt = $pdo->prepare("INSERT INTO lost_found_posts (user_id, type, title, content, category, location, keep_location, lost_date, thumbnail_type, thumbnail_text) VALUES (?,?,?,?,?,?,?,?,?,?)");
            $stmt->execute([$user_id, $type, $title, $content, $category, $location, $keep_location, $lost_date ?: null, $thumbnail_type, $thumbnail_text]);
            $post_id = $pdo->lastInsertId();
        }

        // 이미지 업로드
        if (!empty($_FILES['images']['name'][0])) {
            $upload_dir = __DIR__ . '/uploads/';
            if (!is_dir($upload_dir))
                mkdir($upload_dir, 0755, true);

            $allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            $max_size = 5 * 1024 * 1024; // 5MB

            $existing = $pdo->prepare("SELECT COUNT(*) FROM lost_found_images WHERE post_id=?");
            $existing->execute([$post_id]);
            $existing_count = (int) $existing->fetchColumn();

            foreach ($_FILES['images']['tmp_name'] as $i => $tmp) {
                if ($existing_count >= 5)
                    break;
                if ($_FILES['images']['error'][$i] !== UPLOAD_ERR_OK)
                    continue;
                if (!in_array($_FILES['images']['type'][$i], $allowed_types))
                    continue;
                if ($_FILES['images']['size'][$i] > $max_size)
                    continue;

                $ext = pathinfo($_FILES['images']['name'][$i], PATHINFO_EXTENSION);
                $fname = uniqid('img_', true) . '.' . strtolower($ext);
                if (move_uploaded_file($tmp, $upload_dir . $fname)) {
                    $pdo->prepare("INSERT INTO lost_found_images (post_id, filename, original_name, file_size) VALUES (?,?,?,?)")
                        ->execute([$post_id, $fname, $_FILES['images']['name'][$i], $_FILES['images']['size'][$i]]);
                    $existing_count++;
                }
            }
        }

        header("Location: view.php?id=$post_id");
        exit;
    }
}
?>
<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $edit_id ? '게시물 수정' : '분실/습득 등록' ?></title>
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
        <a href="javascript:history.back()"
            style="background: var(--surface); backdrop-filter: blur(10px); color: var(--text); padding: 8px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border); box-shadow: 0 4px 12px rgba(0,0,0,0.05);"
            title="뒤로가기">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
        </a>

        <?php if ($user): ?>
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

        <header class="lf-header">
            <h1><?= $edit_id ? '게시물 수정' : '분실/습득 등록' ?></h1>
            <p class="subtitle">인천과학고등학교 분실물 센터</p>
        </header>

        <div class="lf-card">
            <?php if ($errors): ?>
                <div
                    style="background: rgba(217,48,37,0.1); border-left: 4px solid #d93025; padding: 12px; border-radius: 6px; margin-bottom: 20px; color:#d93025; font-size:0.9rem;">
                    <?php foreach ($errors as $e): ?>
                        <div style="margin-bottom:4px; display: inline-flex; align-items: center; gap: 4px;">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path
                                    d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z">
                                </path>
                                <line x1="12" y1="9" x2="12" y2="13"></line>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                            <?= htmlspecialchars($e) ?>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>

            <form method="POST" enctype="multipart/form-data" id="writeForm"
                style="display: flex; flex-direction: column; gap: 8px;">

                <!-- 유형 선택 -->
                <div class="lf-form-group">
                    <label class="lf-form-label required">게시글 유형</label>
                    <div class="lf-type-selector">
                        <label
                            class="lf-type-option type-lost <?= ($edit_post['type'] ?? $_POST['type'] ?? 'lost') === 'lost' ? 'selected lost' : '' ?>"
                            style="display:inline-flex; align-items:center; gap:4px; cursor:pointer;">
                            <input type="radio" name="type" value="lost"
                                <?= ($edit_post['type'] ?? $_POST['type'] ?? 'lost') === 'lost' ? 'checked' : '' ?> required>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2.5" style="vertical-align: middle;">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                            분실물 (물건 찾기)
                        </label>
                        <label
                            class="lf-type-option type-found <?= ($edit_post['type'] ?? $_POST['type'] ?? '') === 'found' ? 'selected found' : '' ?>"
                            style="display:inline-flex; align-items:center; gap:4px; cursor:pointer;">
                            <input type="radio" name="type" value="found"
                                <?= ($edit_post['type'] ?? $_POST['type'] ?? '') === 'found' ? 'checked' : '' ?>>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2.5" style="vertical-align: middle;">
                                <path
                                    d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z">
                                </path>
                                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                <line x1="12" y1="22.08" x2="12" y2="12"></line>
                            </svg>
                            습득물 (주운 물건 신고)
                        </label>
                    </div>
                </div>

                <!-- 제목 -->
                <div class="lf-form-group">
                    <label class="lf-form-label required" for="title">제목</label>
                    <input type="text" id="title" name="title" class="lf-input" placeholder="예) 전자기기실 복도에서 주운 에어팟 케이스"
                        value="<?= htmlspecialchars($edit_post['title'] ?? $_POST['title'] ?? '') ?>" maxlength="200"
                        required>
                </div>

                <!-- 카테고리 + 장소 -->
                <div class="lf-form-row">
                    <div class="lf-form-group">
                        <label class="lf-form-label required" for="category">카테고리</label>
                        <select id="category" name="category" class="lf-select" required>
                            <?php foreach ($categories as $c): ?>
                                <option value="<?= $c ?>" <?= $selected_cat === $c ? 'selected' : '' ?>><?= $c ?></option>
                            <?php endforeach; ?>
                        </select>
                        <input type="text" id="category_custom" name="category_custom" class="lf-input"
                            placeholder="기타 카테고리 수기 입력"
                            value="<?= ($edit_post && $is_custom_cat) ? htmlspecialchars(str_replace('📦 ', '', $edit_post['category'])) : '' ?>"
                            style="display: <?= $is_custom_cat ? 'block' : 'none' ?>; margin-top: 8px;">
                    </div>
                    <div class="lf-form-group">
                        <label class="lf-form-label" for="location">발견/분실 장소</label>
                        <select id="location" name="location" class="lf-select">
                            <option value="">선택 안함</option>
                            <?php foreach ($locations as $l): ?>
                                <option value="<?= $l ?>" <?= $selected_loc === $l ? 'selected' : '' ?>><?= $l ?></option>
                            <?php endforeach; ?>
                        </select>
                        <input type="text" id="location_custom" name="location_custom" class="lf-input"
                            placeholder="기타 장소 수기 입력"
                            value="<?= ($edit_post && $is_custom_loc) ? htmlspecialchars($edit_post['location']) : '' ?>"
                            style="display: <?= $is_custom_loc ? 'block' : 'none' ?>; margin-top: 8px;">
                    </div>
                </div>

                <!-- 날짜 -->
                <div class="lf-form-group">
                    <label class="lf-form-label" for="lost_date">날짜</label>
                    <input type="date" id="lost_date" name="lost_date" class="lf-input"
                        value="<?= htmlspecialchars($edit_post['lost_date'] ?? $_POST['lost_date'] ?? date('Y-m-d')) ?>"
                        max="<?= date('Y-m-d') ?>">
                </div>

                <!-- 수령/보관 장소 (습득물일 때만 노출) -->
                <div class="lf-form-group" id="keep_location_group"
                    style="display: <?= ($edit_post['type'] ?? $_POST['type'] ?? 'lost') === 'found' ? 'block' : 'none' ?>; background: rgba(var(--primary-rgb),0.06); border: 1.5px solid var(--primary); border-radius: 10px; padding: 14px 16px;">
                    <label class="lf-form-label" for="keep_location" style="color: var(--primary); font-weight: 800;">📦 수령/보관 장소 <span style="font-size:0.78rem; font-weight:500; opacity:0.8;">(물건을 맡겨둔 곳)</span></label>
                    <?php
                    $raw_keep = $edit_post['keep_location'] ?? $_POST['keep_location'] ?? '';
                    $is_custom_keep = false;
                    $selected_keep = '';
                    $custom_keep_val = '';

                    if ($raw_keep) {
                        if (in_array($raw_keep, array_diff($locations, ['기타']))) {
                            $selected_keep = $raw_keep;
                        } else {
                            $selected_keep = '기타';
                            $is_custom_keep = true;
                            if ($raw_keep === '기타') {
                                $custom_keep_val = $_POST['keep_location_custom'] ?? '';
                            } else {
                                $custom_keep_val = $raw_keep;
                            }
                        }
                    }
                    ?>
                    <select id="keep_location" name="keep_location" class="lf-select">
                        <option value="">선택 안함 (직접 보관 중)</option>
                        <?php foreach ($locations as $l): ?>
                            <option value="<?= $l ?>" <?= $selected_keep === $l ? 'selected' : '' ?>><?= $l ?></option>
                        <?php endforeach; ?>
                    </select>
                    <input type="text" id="keep_location_custom" name="keep_location_custom" class="lf-input"
                        placeholder="기타 수령/보관 장소 수기 입력"
                        value="<?= htmlspecialchars($custom_keep_val) ?>"
                        style="display: <?= $is_custom_keep ? 'block' : 'none' ?>; margin-top: 8px;">
                </div>

                <!-- 상세 내용 -->
                <div class="lf-form-group">
                    <label class="lf-form-label required" for="content">상세 설명</label>
                    <textarea id="content" name="content" class="lf-textarea"
                        placeholder="특징(색상, 기종 등)이나 연락처 정보, 보관 장소 등을 자세히 기재해 주세요." rows="6"
                        required><?= htmlspecialchars($edit_post['content'] ?? $_POST['content'] ?? '') ?></textarea>
                </div>

                <!-- 이미지 -->
                <div class="lf-form-group">
                    <label class="lf-form-label required">사진 첨부 (최소 1장 필수, 최대 5장, 각 5MB 이하)</label>

                    <?php if ($edit_images): ?>
                        <div style="margin-bottom: 12px;">
                            <p style="font-size: 0.85rem; font-weight:700; margin-bottom:6px; opacity:0.8;">현재 등록된 이미지 (체크 시
                                삭제):</p>
                            <div style="display:flex; gap:10px; flex-wrap:wrap;">
                                <?php foreach ($edit_images as $img): ?>
                                    <div style="position:relative; width:80px; height:60px;">
                                        <img src="uploads/<?= htmlspecialchars($img['filename']) ?>" alt=""
                                            style="width:100%; height:100%; object-fit:cover; border-radius:4px; border: 1px solid var(--border);">
                                        <label
                                            style="position:absolute; top:2px; right:2px; background:rgba(0,0,0,0.6); padding:2px; border-radius:3px; cursor:pointer;">
                                            <input type="checkbox" name="delete_images[]" value="<?= $img['id'] ?>"
                                                style="width:12px; height:12px; margin:0;">
                                        </label>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        </div>
                    <?php endif; ?>

                    <div class="lf-upload-area" onclick="document.getElementById('images').click()">
                        <input type="file" id="images" name="images[]" multiple accept="image/*" style="display:none;">
                        <span
                            style="opacity: 0.7; font-size:0.95rem; display: inline-flex; align-items: center; gap: 6px;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path
                                    d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z">
                                </path>
                                <circle cx="12" cy="13" r="4"></circle>
                            </svg>
                            이곳을 클릭하여 이미지 파일을 등록해 주세요
                        </span>
                        <div id="file-list" style="margin-top: 10px; font-size: 0.85rem; opacity: 0.8;"></div>
                    </div>
                </div>

                <!-- 썸네일 설정 -->
                <div class="lf-form-group">
                    <label class="lf-form-label">목록 썸네일 형태</label>
                    <div style="display:flex; gap:16px; margin-bottom:8px; font-size: 0.9rem;">
                        <label style="display:inline-flex; align-items:center; gap:4px; cursor:pointer;">
                            <input type="radio" name="thumbnail_type" value="image"
                                <?= ($edit_post['thumbnail_type'] ?? 'image') === 'image' ? 'checked' : '' ?>>
                            사진
                        </label>
                        <label style="display:inline-flex; align-items:center; gap:4px; cursor:pointer;">
                            <input type="radio" name="thumbnail_type" value="icon"
                                <?= ($edit_post['thumbnail_type'] ?? '') === 'icon' ? 'checked' : '' ?>>
                            카테고리 아이콘
                        </label>
                        <label style="display:inline-flex; align-items:center; gap:4px; cursor:pointer;">
                            <input type="radio" name="thumbnail_type" value="text"
                                <?= ($edit_post['thumbnail_type'] ?? '') === 'text' ? 'checked' : '' ?>>
                            직접 입력 글자 (10자 이내)
                        </label>
                    </div>
                    <input type="text" id="thumbnail_text" name="thumbnail_text" class="lf-input"
                        placeholder="썸네일에 표시할 글자 입력 (예: 지갑)"
                        value="<?= htmlspecialchars($edit_post['thumbnail_text'] ?? '') ?>" maxlength="10"
                        style="display: <?= ($edit_post['thumbnail_type'] ?? '') === 'text' ? 'block' : 'none' ?>; width: 250px;">
                </div>

                <!-- 제출 버튼 -->
                <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 15px;">
                    <a href="index.php" class="btn secondary" style="text-decoration: none;">취소</a>
                    <button type="submit" class="btn primary btn-register"><?= $edit_id ? '수정 완료' : '등록하기' ?></button>
                </div>
            </form>
        </div>

        <footer class="footer">
            © 2026 ISHS 32nd - Developed by Dohye Lee. All rights reserved.
        </footer>
    </div>

    <?php if ($user): ?>
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
                                <?= date('m/d H:i', strtotime($n['created_at'])) ?></div>
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
        // 수령/보관 장소 섹션 표시/숨김 함수
        const keepLocGroup = document.getElementById('keep_location_group');
        function updateKeepLocVisibility() {
            const checked = document.querySelector('input[name="type"]:checked');
            if (!checked) return;
            document.querySelectorAll('.lf-type-option').forEach(o => {
                o.classList.remove('selected', 'lost', 'found');
            });
            const label = checked.closest('.lf-type-option');
            if (checked.value === 'found') {
                if (label) label.classList.add('selected', 'found');
                keepLocGroup.style.display = 'block';
            } else {
                if (label) label.classList.add('selected', 'lost');
                keepLocGroup.style.display = 'none';
            }
        }

        // 페이지 로드 시 즉시 초기화 (PHP에서 기본값이 lost이더라도 정확히 반영)
        updateKeepLocVisibility();

        // change + click 둘 다 감지 (모바일 호환성)
        document.querySelectorAll('.lf-type-option input').forEach(radio => {
            radio.addEventListener('change', updateKeepLocVisibility);
            radio.addEventListener('click', updateKeepLocVisibility);
        });

        // 기타 수기 입력 토글 로직 통합
        function setupCustomInput(selectId, customId, targetValue) {
            const select = document.getElementById(selectId);
            const custom = document.getElementById(customId);
            if (!select || !custom) return;
            const handleChange = () => {
                const isTarget = select.value === targetValue;
                custom.style.display = isTarget ? 'block' : 'none';
                if (!isTarget) custom.value = '';
            };
            select.addEventListener('change', handleChange);
            select.addEventListener('input', handleChange);
            handleChange(); // 초기화 (PHP 조건과 무관하게 DOM 렌더링 후 확실히 적용)
        }

        setupCustomInput('category', 'category_custom', '📦 기타');
        setupCustomInput('location', 'location_custom', '기타');
        setupCustomInput('keep_location', 'keep_location_custom', '기타');

        // 썸네일 라디오 토글 로직
        const thumbText = document.getElementById('thumbnail_text');
        document.querySelectorAll('input[name="thumbnail_type"]').forEach(radio => {
            radio.addEventListener('change', () => {
                thumbText.style.display = radio.value === 'text' ? 'block' : 'none';
                if (radio.value !== 'text') thumbText.value = '';
            });
        });

        // 파일 목록 표시
        const fileInput = document.getElementById('images');
        const fileList = document.getElementById('file-list');
        fileInput.addEventListener('change', () => {
            fileList.innerHTML = '';
            const files = Array.from(fileInput.files);
            if (files.length > 0) {
                fileList.innerHTML = `선택된 파일: ${files.map(f => f.name).join(', ')}`;
            }
        });

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
    </script>
</body>

</html>