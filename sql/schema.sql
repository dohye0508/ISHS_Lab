-- User table for ISHS Lab
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,     -- Riro ID used at signup
    nickname VARCHAR(50) NOT NULL UNIQUE,     -- Local Nickname
    password VARCHAR(255) NOT NULL,           -- Hashed Local Password
    riro_name VARCHAR(50),                    -- Real name from Riro
    school_name VARCHAR(100),                 -- School name from Riro
    grade INT,                                -- Grade/Year
    role VARCHAR(20) DEFAULT 'user',          -- Role (admin/user)
    student_number VARCHAR(10),               -- Student number from Riro
    generation INT,                           -- Generation from Riro
    student_type VARCHAR(50),                 -- Type (e.g. Student)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- One row is created when a user starts a studio collection. A row contributes
-- to statistics only after completed_at is set by api/study_scores.php.
CREATE TABLE IF NOT EXISTS study_attempts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    studio ENUM('integral', 'advanced_math', 'general_physics') NOT NULL,
    collection_id VARCHAR(100) NOT NULL,
    total_count SMALLINT UNSIGNED NOT NULL,
    correct_count SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    skipped_count SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    attempt_token CHAR(64) NOT NULL UNIQUE,
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT fk_study_attempts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_study_attempts_studio_completed (studio, completed_at),
    INDEX idx_study_attempts_user_studio (user_id, studio, completed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
