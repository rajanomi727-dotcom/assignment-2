-- NIXH Database Setup
-- Run this in your MySQL client before starting the server

CREATE DATABASE IF NOT EXISTS nixh_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE nixh_db;

CREATE TABLE IF NOT EXISTS users (
  id    INT          NOT NULL AUTO_INCREMENT,
  name  VARCHAR(120) NOT NULL DEFAULT '',
  email VARCHAR(200) NOT NULL DEFAULT '',
  phone VARCHAR(30)  NOT NULL DEFAULT '',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed default profile (the server also auto-seeds on first GET /profile)
INSERT INTO users (name, email, phone)
VALUES ('Alex Rivera', 'alex.rivera@nixh.app', '+1 (555) 000-0001')
ON DUPLICATE KEY UPDATE id = id;

SELECT * FROM users;
