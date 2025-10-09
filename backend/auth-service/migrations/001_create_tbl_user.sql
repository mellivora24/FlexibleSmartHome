-- Active: 1749601700368@@localhost@5433@auth_db
CREATE TABLE tbl_user (
    id SERIAL PRIMARY KEY,
    mcu_code INT DEFAULT -1,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hash_password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tbl_useraction (
    id SERIAL PRIMARY KEY,
    uid INT NOT NULL,
    type VARCHAR(100) NOT NULL,
    data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (uid) REFERENCES tbl_user (id) ON DELETE CASCADE
);
