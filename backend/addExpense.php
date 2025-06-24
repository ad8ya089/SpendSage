<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}

$conn = new mysqli("localhost", "root", "", "expense_tracker");

if ($conn->connect_error) {
  http_response_code(500);
  echo json_encode(["error" => "Database connection failed"]);
  exit;
}

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

$title = trim($data['title'] ?? '');
$amount = $data['amount'] ?? '';
$category = trim($data['category'] ?? '');
$date = $data['expense_date'] ?? '';
$user_id = $data['user_id'] ?? null;

if (!$title || !$amount || !$category || !$date || !$user_id) {
  http_response_code(400);
  echo json_encode(["error" => "All fields are required, including user_id"]);
  exit;
}

if (!is_numeric($amount)) {
  echo json_encode(["error" => "Amount must be numeric"]);
  exit;
}

if (!is_numeric($user_id)) {
  echo json_encode(["error" => "Invalid user ID"]);
  exit;
}

$stmt = $conn->prepare("INSERT INTO expenses (title, amount, category, expense_date, user_id) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sdssi", $title, $amount, $category, $date, $user_id);

if ($stmt->execute()) {
  echo json_encode(["success" => true, "message" => "Expense added successfully"]);
} else {
  http_response_code(500);
  echo json_encode(["error" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
