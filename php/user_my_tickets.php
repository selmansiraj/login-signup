<?php
// Deploy to htdocs/php/user_my_tickets.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
 http_response_code(200);
 exit();
}

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
 http_response_code(405);
 echo json_encode(["error" => "Invalid request method"]);
 exit();
}

require_once __DIR__ . "/db.php";
require_once __DIR__ . "/security.php";
require_once __DIR__ . "/jwt_helper.php";

$headers = function_exists("getallheaders") ? getallheaders() : [];
$authorization = $headers["Authorization"] ?? $headers["authorization"] ?? "";

if (!preg_match("/Bearer\s+(.+)/i", $authorization, $matches)) {
 http_response_code(401);
 echo json_encode(["error" => "Authorization required"]);
 exit();
}

$token = trim($matches[1]);
$payload = decodeToken($token);

if (!$payload || empty($payload->user)) {
 http_response_code(401);
 echo json_encode(["error" => "Invalid session"]);
 exit();
}

$userId = (int) ($payload->user->id ?? 0);
$email = strtolower(trim((string) ($payload->user->email ?? "")));

if ($userId <= 0 && $email === "") {
 http_response_code(401);
 echo json_encode(["error" => "Invalid user token"]);
 exit();
}

$rows = [];

if ($userId > 0) {
 $stmt = $conn->prepare(
  "SELECT * FROM ticket_reports
   WHERE user_id = ? OR (user_id = 0 AND LOWER(contact_email) = ?)
   ORDER BY id DESC"
 );

 if (!$stmt) {
  http_response_code(500);
  echo json_encode(["error" => "Database prepare failed"]);
  exit();
 }

 $stmt->bind_param("is", $userId, $email);
} else {
 $stmt = $conn->prepare(
  "SELECT * FROM ticket_reports WHERE LOWER(contact_email) = ? ORDER BY id DESC"
 );

 if (!$stmt) {
  http_response_code(500);
  echo json_encode(["error" => "Database prepare failed"]);
  exit();
 }

 $stmt->bind_param("s", $email);
}

$stmt->execute();
$result = $stmt->get_result();

while ($row = $result->fetch_assoc()) {
 $rows[] = $row;
}

$stmt->close();

echo json_encode([
 "success" => true,
 "tickets" => $rows
]);

?>
