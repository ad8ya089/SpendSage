<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

error_reporting(E_ALL);
ini_set('display_errors', 1);

$conn = new mysqli("localhost", "root", "", "expense_tracker");

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "DB connection failed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? null;

if (!$id || !is_numeric($id)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid ID"]);
    exit;
}

$sql = "DELETE FROM expenses WHERE id = $id";

if ($conn->query($sql)) {
    echo json_encode(["message" => "Deleted successfully"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Deletion failed: " . $conn->error]);
}

$conn->close();
?>
