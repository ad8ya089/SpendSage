<?php

// DB connection
$conn = new mysqli("localhost", "root", "", "expense_tracker");

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

$sql = "SELECT * FROM expenses ORDER BY expense_date DESC";
$result = $conn->query($sql);

$expenses = [];

while ($row = $result->fetch_assoc()) {
    $expenses[] = $row;
}

echo json_encode($expenses);
$conn->close();
?>
