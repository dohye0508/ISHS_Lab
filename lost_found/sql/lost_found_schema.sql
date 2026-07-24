-- 기존 테이블 제거 (새 스키마 적용)
DROP TABLE IF EXISTS lost_found_notifications;
DROP TABLE IF EXISTS lost_found_likes;
DROP TABLE IF EXISTS lost_found_comments;
DROP TABLE IF EXISTS lost_found_images;
DROP TABLE IF EXISTS lost_found_posts;

-- 분실물 게시글 테이블
CREATE TABLE IF NOT EXISTS lost_found_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type ENUM('lost', 'found') NOT NULL,          -- 분실(lost) / 습득(found)
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) DEFAULT '기타',           -- 카테고리 (지갑, 전자기기, 의류 등)
    location VARCHAR(200),                         -- 발견/분실 장소
    keep_location VARCHAR(200) DEFAULT NULL,       -- 수령/보관 장소 (NEW)
    lost_date DATE,                                -- 분실/습득 날짜
    status ENUM('searching', 'resolved') DEFAULT 'searching', -- 해결 여부
    views INT DEFAULT 0,
    thumbnail_type ENUM('image', 'icon', 'text') DEFAULT 'image',
    thumbnail_text VARCHAR(10) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 분실물 이미지 테이블
CREATE TABLE IF NOT EXISTS lost_found_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255),
    file_size INT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES lost_found_posts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 댓글 테이블
CREATE TABLE IF NOT EXISTS lost_found_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    parent_id INT DEFAULT NULL,                    -- 대댓글용
    content TEXT NOT NULL,
    is_adopted TINYINT(1) DEFAULT 0,               -- 채택된 댓글
    image_filename VARCHAR(255) DEFAULT NULL,      -- 댓글 첨부 이미지 (NEW)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES lost_found_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES lost_found_comments(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 좋아요/도움됨 테이블
CREATE TABLE IF NOT EXISTS lost_found_likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_like (post_id, user_id),
    FOREIGN KEY (post_id) REFERENCES lost_found_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 알림 테이블
CREATE TABLE IF NOT EXISTS lost_found_notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    type ENUM('comment', 'adopt') NOT NULL,
    message VARCHAR(255) NOT NULL,
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES lost_found_posts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
