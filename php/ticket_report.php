<?php
// Deploy alongside other PHP in htdocs/php/

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

$data = json_decode(file_get_contents("php://input"), true);

if (!is_array($data)) {
 adminResponse([
  "error" => "Invalid request body"
 ], 400);
}

$headers = function_exists("getallheaders") ? getallheaders() : [];
$authorization = $headers["Authorization"] ?? $headers["authorization"] ?? "";
$token = null;

if (preg_match("/Bearer\s+(.+)/i", $authorization, $matches)) {
 $token = trim($matches[1]);
}

$payload = $token ? decodeToken($token) : null;
$userId = 0;

if ($payload && !empty($payload->user) && isset($payload->user->id)) {
 $userId = (int) $payload->user->id;
}

$traveller = sanitize($data["traveller"] ?? "");
$contactEmail = sanitize($data["contact"] ?? $data["contact_email"] ?? "");
$routeName = sanitize($data["routeName"] ?? "");
$routeCode = sanitize($data["code"] ?? "");
$travelClass = sanitize($data["travelClass"] ?? "");
$issuedOn = sanitize($data["issuedOn"] ?? "");

$status = "Pending";

if ($traveller === "" || $routeName === "" || $routeCode === "" || $contactEmail === "") {
 adminResponse([
  "error" => "Missing ticket fields"
 ], 400);
}

$stmt = $conn->prepare(
 "INSERT INTO ticket_reports (user_id, traveller, contact_email, route_name, route_code, travel_class, status, issued_on)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
);

if (!$stmt) {
 adminResponse([
  "error" => "Database prepare failed"
 ], 500);
}

$stmt->bind_param("isssssss", $userId, $traveller, $contactEmail, $routeName, $routeCode, $travelClass, $status, $issuedOn);

if (!$stmt->execute()) {
 adminResponse([
  "error" => "Unable to save ticket report"
 ], 500);
}

$ticketId = (int) $stmt->insert_id;
$stmt->close();

$ticket = [
 "id" => $ticketId,
 "user_id" => $userId,
 "traveller" => $traveller,
 "contact_email" => $contactEmail,
 "route_name" => $routeName,
 "route_code" => $routeCode,
 "travel_class" => $travelClass,
 "status" => $status,
 "issued_on" => $issuedOn
];

adminResponse([
 "success" => true,
 "message" => "Booking submitted — pending admin approval",
 "ticket" => $ticket
]);

?>
