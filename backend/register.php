<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}

// Debug: Show raw input (remove later)
$raw = file_get_contents("php://input");

if (empty($raw)) {
  http_response_code(400);
  echo json_encode(["error" => "No data received", "raw" => $raw]);
  exit();
}

$data = json_decode($raw, true);
if (!is_array($data)) {
  http_response_code(400);
  echo json_encode(["error" => "Invalid JSON received", "raw" => $raw]);
  exit();
}

$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

if (!$name || !$email || !$password) {
  http_response_code(400);
  echo json_encode(["error" => "All fields are required"]);
  exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo json_encode(["error" => "Invalid email format"]);
  exit();
}

$conn = new mysqli("localhost", "root", "", "expense_tracker");
if ($conn->connect_error) {
  http_response_code(500);
  echo json_encode(["error" => "DB connection failed"]);
  exit;
}

$hashed = password_hash($password, PASSWORD_DEFAULT);
$stmt = $conn->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $name, $email, $hashed);

if ($stmt->execute()) {
  echo json_encode(["success" => true, "message" => "Registered successfully"]);
} else {
  // Duplicate entry error code is 1062
  if ($stmt->errno == 1062) {
    http_response_code(409);
    echo json_encode(["error" => "Email is already registered. Please log in."]);
  } else {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $stmt->error]);
  }
}

$conn->close();
?>
