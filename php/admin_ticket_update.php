<?php
// Deploy to htdocs/php/admin_ticket_update.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
 http_response_code(200);
 exit();
}

include "admin_common.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
 adminResponse([
  "error" => "Invalid request method"
 ], 405);
}

adminEnsureTables($conn);

$token = adminRequireAuth();
$payload = $token ? decodeToken($token) : null;

if (!$token || !$payload || empty($payload->user) || ($payload->user->role ?? "") !== "admin") {
 adminResponse([
  "error" => "Admin session required"
 ], 401);
}

$data = json_decode(file_get_contents("php://input"), true);

if (!is_array($data)) {
 adminResponse([
  "error" => "Invalid request body"
 ], 400);
}

$ticketId = isset($data["id"]) ? (int) $data["id"] : 0;
$status = sanitize($data["status"] ?? "");

if ($ticketId <= 0) {
 adminResponse([
  "error" => "Valid ticket id is required"
 ], 400);
}

$allowed = ["Confirmed", "Cancelled"];

if (!in_array($status, $allowed, true)) {
 adminResponse([
  "error" => "Status must be Confirmed or Cancelled"
 ], 400);
}

$stmt = $conn->prepare("UPDATE ticket_reports SET status = ? WHERE id = ? LIMIT 1");

if (!$stmt) {
 adminResponse([
  "error" => "Database prepare failed"
 ], 500);
}

$stmt->bind_param("si", $status, $ticketId);

if (!$stmt->execute()) {
 adminResponse([
  "error" => "Unable to update ticket"
 ], 500);
}

if ($stmt->affected_rows === 0) {
 $stmt->close();
 adminResponse([
  "error" => "Ticket not found"
 ], 404);
}

$stmt->close();

$sel = $conn->prepare("SELECT * FROM ticket_reports WHERE id = ? LIMIT 1");
$sel->bind_param("i", $ticketId);
$sel->execute();
$row = $sel->get_result()->fetch_assoc();
$sel->close();

adminResponse([
 "success" => true,
 "message" => "Ticket updated",
 "ticket" => $row
]);

?>
