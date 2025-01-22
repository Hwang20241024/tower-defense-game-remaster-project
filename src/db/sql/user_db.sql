CREATE TABLE IF NOT EXISTS user
(
    userId      INT AUTO_INCREMENT PRIMARY KEY,
    id          VARCHAR(255) UNIQUE,
    email       VARCHAR(255) UNIQUE,
    password    VARCHAR(255),
    score       INT DEFAULT 0,
    rating      INT DEFAULT 1000,
    create_dt   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

