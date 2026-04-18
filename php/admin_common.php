<?php

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/security.php';
require_once __DIR__ . '/jwt_helper.php';

function adminEnsureTables($conn) {
 $conn->query(
  "CREATE TABLE IF NOT EXISTS admin_users (
   id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
   username VARCHAR(50) NOT NULL UNIQUE,
   password VARCHAR(255) NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   last_login_at DATETIME NULL,
   last_logout_at DATETIME NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
 );

 $conn->query(
  "CREATE TABLE IF NOT EXISTS admin_activity_log (
   id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
   admin_id INT UNSIGNED NOT NULL,
   action ENUM('in','out') NOT NULL,
   logged_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   INDEX (admin_id),
   CONSTRAINT fk_admin_activity_admin FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
 );

 $conn->query(
  "CREATE TABLE IF NOT EXISTS route_schedule (
   id INT AUTO_INCREMENT PRIMARY KEY,
   route_name VARCHAR(120) NOT NULL UNIQUE,
   region VARCHAR(120) NOT NULL,
   departure_date VARCHAR(30) NOT NULL,
   departure_time VARCHAR(30) NOT NULL,
   status VARCHAR(60) NOT NULL DEFAULT 'Scheduled',
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
 );

 $conn->query(
  "CREATE TABLE IF NOT EXISTS ticket_reports (
   id INT AUTO_INCREMENT PRIMARY KEY,
   traveller VARCHAR(140) NOT NULL,
   contact_email VARCHAR(140) NOT NULL,
   route_name VARCHAR(140) NOT NULL,
   route_code VARCHAR(60) NOT NULL,
   travel_class VARCHAR(80) NOT NULL,
   status VARCHAR(80) NOT NULL,
   issued_on VARCHAR(40) NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
 );

 $conn->query(
  "CREATE TABLE IF NOT EXISTS admin_reports (
   id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
   admin_id INT UNSIGNED NOT NULL,
   report_name VARCHAR(120) NOT NULL,
   report_value VARCHAR(120) NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   INDEX (admin_id),
   CONSTRAINT fk_admin_reports_admin FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
 );

 $conn->query(
  "CREATE TABLE IF NOT EXISTS tourism_places (
   id INT AUTO_INCREMENT PRIMARY KEY,
   title VARCHAR(160) NOT NULL,
   region VARCHAR(120) NOT NULL,
   travel_day VARCHAR(40) NOT NULL,
   travel_time VARCHAR(40) NOT NULL,
   image_url TEXT NOT NULL,
   icon VARCHAR(40) NOT NULL,
   description TEXT NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
 );

 $colCheck = $conn->query("SHOW COLUMNS FROM tourism_places LIKE 'created_by_admin_id'");
 if ($colCheck && $colCheck->num_rows === 0) {
  $conn->query(
   "ALTER TABLE tourism_places ADD COLUMN created_by_admin_id INT UNSIGNED NULL DEFAULT NULL AFTER id"
  );
 }

 $ticketUserCol = $conn->query("SHOW COLUMNS FROM ticket_reports LIKE 'user_id'");
 if ($ticketUserCol && $ticketUserCol->num_rows === 0) {
  $conn->query(
   "ALTER TABLE ticket_reports ADD COLUMN user_id INT UNSIGNED NOT NULL DEFAULT 0 AFTER id"
  );
 }

 $adminCountResult = $conn->query("SELECT COUNT(*) AS total FROM admin_users");
 $adminCount = 0;

 if ($adminCountResult) {
  $row = $adminCountResult->fetch_assoc();
  $adminCount = (int) ($row["total"] ?? 0);
 }

 if ($adminCount === 0) {
  $defaultPassword = "Admin@123";
  $stmt = $conn->prepare("INSERT INTO admin_users (username, password) VALUES (?, ?)");

  if ($stmt) {
   $defaultUsername = "admin";
   $stmt->bind_param("ss", $defaultUsername, $defaultPassword);
   $stmt->execute();
   $stmt->close();
  }
 }

 $routeCountResult = $conn->query("SELECT COUNT(*) AS total FROM route_schedule");
 $routeCount = 0;

 if ($routeCountResult) {
  $row = $routeCountResult->fetch_assoc();
  $routeCount = (int) ($row["total"] ?? 0);
 }

 if ($routeCount === 0) {
  $seedRoutes = [
   ["Te Papa Stories", "Wellington", "14 Apr 2026", "08:40", "Scheduled"],
   ["Milford Waterlines", "Fiordland", "18 Apr 2026", "10:15", "Scheduled"],
   ["Southern Heritage", "Dunedin", "22 Apr 2026", "13:30", "Scheduled"]
  ];

  $stmt = $conn->prepare("INSERT INTO route_schedule (route_name, region, departure_date, departure_time, status) VALUES (?, ?, ?, ?, ?)");

  if ($stmt) {
   foreach ($seedRoutes as $route) {
    $stmt->bind_param("sssss", $route[0], $route[1], $route[2], $route[3], $route[4]);
    $stmt->execute();
   }

   $stmt->close();
  }
 }
}

function adminRequireAuth() {
 $headers = function_exists("getallheaders") ? getallheaders() : [];
 $authorization = $headers["Authorization"] ?? $headers["authorization"] ?? "";

 if (!preg_match("/Bearer\s+(.+)/i", $authorization, $matches)) {
  return null;
 }

 $token = trim($matches[1]);
 return $token;
}

function adminResponse($data, $statusCode = 200) {
 http_response_code($statusCode);
 echo json_encode($data);
 exit();
}

function adminFetchTable($conn, $tableName) {
 $result = $conn->query("SELECT * FROM {$tableName} ORDER BY id DESC");
 $rows = [];

 if ($result) {
  while ($row = $result->fetch_assoc()) {
   $rows[] = $row;
  }
 }

 return $rows;
}

?>
