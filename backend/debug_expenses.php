<?php
// Save this as debug_expenses.php and run it directly in your browser

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

echo "<h2>🔍 Debug Expenses Database</h2>";

// DB connection
$conn = new mysqli("localhost", "root", "", "expense_tracker");

if ($conn->connect_error) {
    echo "<p>❌ Database connection failed: " . $conn->connect_error . "</p>";
    exit;
}

echo "<p>✅ Database connected successfully</p>";

// Check if table exists
$result = $conn->query("SHOW TABLES LIKE 'expenses'");
if ($result->num_rows > 0) {
    echo "<p>✅ Expenses table exists</p>";
} else {
    echo "<p>❌ Expenses table does not exist!</p>";
    exit;
}

// Count total records
$result = $conn->query("SELECT COUNT(*) as count FROM expenses");
$count = $result->fetch_assoc()['count'];
echo "<p>📊 Total records in expenses table: <strong>$count</strong></p>";

if ($count == 0) {
    echo "<p>⚠️ No data in expenses table. Add some test data:</p>";
    echo "<pre>INSERT INTO expenses (title, amount, category, expense_date) VALUES 
('Test Lunch', 150.50, 'Food', '2024-06-20'),
('Test Bus', 25.00, 'Travel', '2024-06-21'),
('Test Book', 500.75, 'Books', '2024-06-22');</pre>";
} else {
    // Show sample data
    echo "<h3>📋 Sample Data:</h3>";
    $result = $conn->query("SELECT * FROM expenses LIMIT 5");
    
    echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
    echo "<tr><th>ID</th><th>Title</th><th>Amount</th><th>Amount Type</th><th>Category</th><th>Date</th></tr>";
    
    $totalCheck = 0;
    while ($row = $result->fetch_assoc()) {
        $amount = $row['amount'];
        $amountType = gettype($amount);
        $numericAmount = (float)$amount;
        $totalCheck += $numericAmount;
        
        echo "<tr>";
        echo "<td>" . $row['id'] . "</td>";
        echo "<td>" . $row['title'] . "</td>";
        echo "<td>" . $amount . "</td>";
        echo "<td>" . $amountType . "</td>";
        echo "<td>" . $row['category'] . "</td>";
        echo "<td>" . $row['expense_date'] . "</td>";
        echo "</tr>";
    }
    echo "</table>";
    
    echo "<p><strong>🧮 Manual total of shown records: ₹$totalCheck</strong></p>";
    
    // Show what the API would return
    echo "<h3>🔌 API Response Preview:</h3>";
    $result = $conn->query("SELECT id, title, amount, category, expense_date FROM expenses ORDER BY expense_date DESC LIMIT 3");
    $expenses = [];
    
    while ($row = $result->fetch_assoc()) {
        $row['amount'] = (float)$row['amount']; // Convert to float like in your API
        $row['id'] = (int)$row['id'];
        $expenses[] = $row;
    }
    
    echo "<pre>" . json_encode($expenses, JSON_PRETTY_PRINT) . "</pre>";
}

$conn->close();
?>