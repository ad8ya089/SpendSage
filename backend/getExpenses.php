<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// DB connection
$conn = new mysqli("localhost", "root", "", "expense_tracker");

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

try {
    // Get JSON input
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);
    
    // Debug: Log the received data
    error_log("Received data: " . $input);
    
    $user_id = $data['user_id'] ?? null;

    if (!$user_id) {
        http_response_code(400);
        echo json_encode([
            "error" => "Missing user_id", 
            "received_data" => $data,
            "raw_input" => $input
        ]);
        exit;
    }

    // Use prepared statement to prevent SQL injection
    $stmt = $conn->prepare("SELECT id, title, amount, category, expense_date FROM expenses WHERE user_id = ? ORDER BY expense_date DESC");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    
    $result = $stmt->get_result();
    $expenses = [];

    while ($row = $result->fetch_assoc()) {
        // Ensure amount is numeric
        $row['amount'] = (float)$row['amount'];
        $row['id'] = (int)$row['id'];
        $expenses[] = $row;
    }

    echo json_encode($expenses);
    
    $stmt->close();
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "error" => "Server error: " . $e->getMessage()
    ]);
}

$conn->close();
?>