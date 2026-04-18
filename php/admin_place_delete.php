<?php
// Copy to XAMPP: htdocs/php/admin_place_delete.php (same folder as other admin_*.php)

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
 http_response_code(200);
 exit();
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
 adminResponse([
  "error" => "Invalid request method"
 ], 405);
}

include "admin_common.php";

adminEnsureTables($conn);

$token = adminRequireAuth();
$payload = $token ? decodeToken($token) : null;

if (!$token || !$payload || empty($payload->user) || ($payload->user->role ?? "") !== "admin") {
 adminResponse([
  "error" => "Admin session required"
 ], 401);
}

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);
$placeId = isset($data["id"]) ? (int) $data["id"] : 0;

if ($placeId <= 0) {
 adminResponse([
  "error" => "Valid place id is required"
 ], 400);
}

$currentAdminId = (int) ($payload->user->id ?? 0);

$stmt = $conn->prepare("SELECT id, image_url, created_by_admin_id FROM tourism_places WHERE id = ? LIMIT 1");

if (!$stmt) {
 adminResponse([
  "error" => "Database prepare failed"
 ], 500);
}

$stmt->bind_param("i", $placeId);
$stmt->execute();
$row = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$row) {
 adminResponse([
  "error" => "Place not found"
 ], 404);
}

$ownerId = isset($row["created_by_admin_id"]) ? (int) $row["created_by_admin_id"] : 0;

if ($ownerId > 0 && $ownerId !== $currentAdminId) {
 adminResponse([
  "error" => "You can only delete destinations you published"
 ], 403);
}

$imageUrl = (string) ($row["image_url"] ?? "");

if ($imageUrl !== "") {
 $pathPart = parse_url($imageUrl, PHP_URL_PATH);
 if (is_string($pathPart) && strpos($pathPart, "/uploads/places/") !== false) {
  $fileName = basename($pathPart);
  if ($fileName !== "" && $fileName !== "." && $fileName !== "..") {
   $fullPath = __DIR__ . DIRECTORY_SEPARATOR . "uploads" . DIRECTORY_SEPARATOR . "places" . DIRECTORY_SEPARATOR . $fileName;
   if (is_file($fullPath)) {
    @unlink($fullPath);
   }
  }
 }
}

$del = $conn->prepare("DELETE FROM tourism_places WHERE id = ? LIMIT 1");

if (!$del) {
 adminResponse([
  "error" => "Database prepare failed"
 ], 500);
}

$del->bind_param("i", $placeId);

if (!$del->execute()) {
 adminResponse([
  "error" => "Unable to delete place"
 ], 500);
}

$del->close();

adminResponse([
 "success" => true,
 "message" => "Place removed",
 "id" => $placeId
]);

?>
