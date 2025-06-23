<?php
// CORS preflight support
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    http_response_code(200);
    exit();
}

// Actual request headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

error_reporting(E_ALL);
ini_set('display_errors', 1);

$conn = new mysqli("localhost", "root", "", "expense_tracker");

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$user_id = $data['user_id'] ?? null;
$title = $conn->real_escape_string($data['title']);
$amount = (float)$data['amount'];
$category = $conn->real_escape_string($data['category']);
$expense_date = $conn->real_escape_string($data['expense_date']);

// Validate input
if (
    !isset($data['title'], $data['amount'], $data['category'], $data['expense_date']) ||
    empty(trim($data['title'])) ||
    empty(trim($data['category'])) ||
    !is_numeric($data['amount']) ||
    $data['amount'] <= 0 ||
    empty($data['expense_date'])
) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid input"]);
    exit;
}

$title = $conn->real_escape_string($data['title']);
$amount = (float)$data['amount'];
$category = $conn->real_escape_string($data['category']);
$expense_date = $conn->real_escape_string($data['expense_date']);

$sql = "INSERT INTO expenses (title, amount, category, expense_date, user_id)
        VALUES ('$title', $amount, '$category', '$expense_date', $user_id)";

if ($conn->query($sql)) {
    echo json_encode(["message" => "Expense added successfully"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to add expense: " . $conn->error]);
}


$conn->close();
?>
