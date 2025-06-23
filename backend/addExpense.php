<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "expense_tracker");

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$title = $conn->real_escape_string($data['title']);
$amount = (float)$data['amount'];
$category = $conn->real_escape_string($data['category']);
$expense_date = $conn->real_escape_string($data['expense_date']);

$sql = "INSERT INTO expenses (title, amount, category, expense_date)
        VALUES ('$title', $amount, '$category', '$expense_date')";

if ($conn->query($sql)) {
    echo json_encode(["message" => "Expense added successfully"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to add expense"]);
}

$conn->close();
?>
