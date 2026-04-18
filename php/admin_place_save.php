<?php

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

$title = sanitize($_POST["title"] ?? "");
$region = sanitize($_POST["region"] ?? "");
$travelDay = sanitize($_POST["travel_day"] ?? "");
$travelTime = sanitize($_POST["travel_time"] ?? "");
$icon = sanitize($_POST["icon"] ?? "");
$description = sanitize($_POST["description"] ?? "");
$file = $_FILES["image_file"] ?? null;

if (!$title || !$region || !$travelDay || !$travelTime || !$icon || !$description || !$file) {
 adminResponse([
  "error" => "All place fields are required"
 ], 400);
}

if (($file["error"] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
 adminResponse([
  "error" => "Image upload failed"
 ], 400);
}

$allowedExtensions = ["jpg", "jpeg", "png", "webp", "gif"];
$originalName = (string) ($file["name"] ?? "");
$extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

if (!in_array($extension, $allowedExtensions, true)) {
 adminResponse([
  "error" => "Upload a JPG, PNG, WEBP, or GIF image"
 ], 400);
}

if ((int) ($file["size"] ?? 0) > 5 * 1024 * 1024) {
 adminResponse([
  "error" => "Image must be smaller than 5MB"
 ], 400);
}

$tmpPath = $file["tmp_name"] ?? "";
$imageInfo = $tmpPath ? @getimagesize($tmpPath) : false;

if ($imageInfo === false) {
 adminResponse([
  "error" => "Uploaded file is not a valid image"
 ], 400);
}

$uploadDirectory = __DIR__ . DIRECTORY_SEPARATOR . "uploads" . DIRECTORY_SEPARATOR . "places";

if (!is_dir($uploadDirectory) && !mkdir($uploadDirectory, 0777, true) && !is_dir($uploadDirectory)) {
 adminResponse([
  "error" => "Unable to prepare upload directory"
 ], 500);
}

$fileName = "place_" . time() . "_" . bin2hex(random_bytes(4)) . "." . $extension;
$destinationPath = $uploadDirectory . DIRECTORY_SEPARATOR . $fileName;

if (!move_uploaded_file($tmpPath, $destinationPath)) {
 adminResponse([
  "error" => "Unable to store uploaded image"
 ], 500);
}

$isHttps = (!empty($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] !== "off") || (($_SERVER["SERVER_PORT"] ?? "") === "443");
$scheme = $isHttps ? "https" : "http";
$host = $_SERVER["HTTP_HOST"] ?? "localhost";
$imageUrl = $scheme . "://" . $host . "/php/uploads/places/" . $fileName;

$adminId = (int) ($payload->user->id ?? 0);

$stmt = $conn->prepare(
 "INSERT INTO tourism_places (created_by_admin_id, title, region, travel_day, travel_time, image_url, icon, description)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
);

if (!$stmt) {
 adminResponse([
  "error" => "Database prepare failed"
 ], 500);
}

$stmt->bind_param("isssssss", $adminId, $title, $region, $travelDay, $travelTime, $imageUrl, $icon, $description);

if (!$stmt->execute()) {
 adminResponse([
  "error" => "Unable to save place"
 ], 500);
}

$placeId = (int) $stmt->insert_id;
$stmt->close();

$selectStmt = $conn->prepare("SELECT * FROM tourism_places WHERE id = ? LIMIT 1");

if (!$selectStmt) {
 adminResponse([
  "error" => "Unable to reload place"
 ], 500);
}

$selectStmt->bind_param("i", $placeId);
$selectStmt->execute();
$place = $selectStmt->get_result()->fetch_assoc();
$selectStmt->close();

adminResponse([
 "success" => true,
 "message" => "Place published successfully",
 "place" => $place
]);

?>
