-- ============================================================
--  TRAVEL APP — COMPLETE DATABASE SETUP
--  Database: travel_app
-- ============================================================

CREATE DATABASE IF NOT EXISTS travel_app
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE travel_app;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS admin_activity;
DROP TABLE IF EXISTS tickets;
DROP TABLE IF EXISTS routes;
DROP TABLE IF EXISTS places;
DROP TABLE IF EXISTS password_resets;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- TABLE 1: users
-- ============================================================
CREATE TABLE users (
  id            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  fullname      VARCHAR(100)    NOT NULL,
  username      VARCHAR(30)     NOT NULL,
  email         VARCHAR(150)    NOT NULL,
  phone         VARCHAR(25)     NULL DEFAULT NULL,
  location      VARCHAR(120)    NULL DEFAULT NULL,
  birthdate     DATE            NULL DEFAULT NULL,
  password      VARCHAR(255)    NULL DEFAULT NULL,
  google_id     VARCHAR(100)    NULL DEFAULT NULL,
  github_id     VARCHAR(100)    NULL DEFAULT NULL,
  auth_provider ENUM('local','google','github') NOT NULL DEFAULT 'local',
  avatar_url    VARCHAR(500)    NULL DEFAULT NULL,
  is_active     TINYINT(1)      NOT NULL DEFAULT 1,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_username  (username),
  UNIQUE KEY uq_users_email     (email),
  UNIQUE KEY uq_users_google_id (google_id),
  UNIQUE KEY uq_users_github_id (github_id),
  INDEX idx_users_email         (email),
  INDEX idx_users_username      (username),
  INDEX idx_users_created_at    (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE 2: admins
-- ============================================================
CREATE TABLE admins (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  username    VARCHAR(30)   NOT NULL,
  password    VARCHAR(255)  NOT NULL,
  email       VARCHAR(150)  NULL DEFAULT NULL,
  full_name   VARCHAR(100)  NULL DEFAULT NULL,
  role        ENUM('admin','superadmin') NOT NULL DEFAULT 'admin',
  is_active   TINYINT(1)    NOT NULL DEFAULT 1,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_admins_username (username),
  INDEX idx_admins_username     (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE 3: admin_activity  (login / logout tracking)
-- ============================================================
CREATE TABLE admin_activity (
  id             INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  admin_id       INT UNSIGNED  NOT NULL,
  admin_username VARCHAR(30)   NOT NULL,
  action         ENUM('login','logout') NOT NULL,
  ip_address     VARCHAR(45)   NULL DEFAULT NULL,
  user_agent     VARCHAR(300)  NULL DEFAULT NULL,
  logged_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_activity_admin
    FOREIGN KEY (admin_id) REFERENCES admins (id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_activity_admin_id  (admin_id),
  INDEX idx_activity_logged_at (logged_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE 4: password_resets
-- ============================================================
CREATE TABLE password_resets (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  user_id     INT UNSIGNED  NOT NULL,
  token       VARCHAR(255)  NOT NULL,
  expires_at  DATETIME      NOT NULL,
  used        TINYINT(1)    NOT NULL DEFAULT 0,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_reset_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_reset_token   (token),
  INDEX idx_reset_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE 5: routes
-- ============================================================
CREATE TABLE routes (
  id              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  route_name      VARCHAR(120)  NOT NULL,
  region          VARCHAR(80)   NULL DEFAULT NULL,
  departure_date  DATE          NULL DEFAULT NULL,
  departure_time  TIME          NULL DEFAULT NULL,
  status          VARCHAR(50)   NOT NULL DEFAULT 'Pending',
  created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_routes_region (region),
  INDEX idx_routes_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE 6: tickets
-- ============================================================
CREATE TABLE tickets (
  id            INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  user_id       INT UNSIGNED  NULL DEFAULT NULL,
  route_id      INT UNSIGNED  NULL DEFAULT NULL,
  traveller     VARCHAR(100)  NULL DEFAULT NULL,
  contact_email VARCHAR(150)  NULL DEFAULT NULL,
  route_name    VARCHAR(120)  NULL DEFAULT NULL,
  status        VARCHAR(50)   NOT NULL DEFAULT 'Pending',
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_ticket_user  FOREIGN KEY (user_id)  REFERENCES users  (id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_ticket_route FOREIGN KEY (route_id) REFERENCES routes (id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_tickets_user_id  (user_id),
  INDEX idx_tickets_route_id (route_id),
  INDEX idx_tickets_status   (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE 7: places
-- ============================================================
CREATE TABLE places (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  title       VARCHAR(120)  NOT NULL,
  region      VARCHAR(80)   NULL DEFAULT NULL,
  travel_day  VARCHAR(50)   NULL DEFAULT NULL,
  travel_time VARCHAR(50)   NULL DEFAULT NULL,
  icon        VARCHAR(20)   NULL DEFAULT NULL,
  description TEXT          NULL DEFAULT NULL,
  image_url   VARCHAR(500)  NULL DEFAULT NULL,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DEFAULT ADMIN ACCOUNT
--   username : admin
--   password : Admin@1234  (bcrypt hash)
-- ============================================================
INSERT INTO admins (username, password, email, full_name, role) VALUES (
  'admin',
  '$2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77bqiW',
  'admin@travelapp.com',
  'Super Admin',
  'superadmin'
);

-- ============================================================
-- SAMPLE ROUTES
-- ============================================================
INSERT INTO routes (route_name, region, departure_date, departure_time, status) VALUES
  ('Auckland to Wellington', 'North Island', '2026-05-10', '08:30:00', 'Confirmed'),
  ('Queenstown Express',      'South Island', '2026-05-15', '09:00:00', 'In Progress'),
  ('Rotorua Cultural Tour',   'North Island', '2026-05-20', '10:15:00', 'Pending');

-- ============================================================
-- VERIFY
-- ============================================================
SELECT 'users'           AS tbl, COUNT(*) AS rows FROM users          UNION ALL
SELECT 'admins',                  COUNT(*)         FROM admins         UNION ALL
SELECT 'admin_activity',          COUNT(*)         FROM admin_activity UNION ALL
SELECT 'routes',                  COUNT(*)         FROM routes         UNION ALL
SELECT 'tickets',                 COUNT(*)         FROM tickets        UNION ALL
SELECT 'places',                  COUNT(*)         FROM places         UNION ALL
SELECT 'password_resets',         COUNT(*)         FROM password_resets;
