-- User table for ISHS Lab
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,     -- Riro ID used at signup
    nickname VARCHAR(50) NOT NULL UNIQUE,     -- Local Nickname
    password VARCHAR(255) NOT NULL,           -- Hashed Local Password
    riro_name VARCHAR(50),                    -- Real name from Riro
    school_name VARCHAR(100),                 -- School name from Riro
    grade INT,                                -- Grade/Year
    student_number VARCHAR(10),               -- Student number from Riro
    generation INT,                           -- Generation from Riro
    student_type VARCHAR(50),                 -- Type (e.g. Student)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
