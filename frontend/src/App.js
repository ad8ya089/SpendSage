import React, { useEffect, useState } from "react";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost/college-expense-tracker/backend/getExpenses.php")
      .then((res) => res.json())
      .then((data) => {
        setExpenses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch expenses:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>📊 College Expense Tracker</h1>
      {loading ? (
        <p>Loading expenses...</p>
      ) : expenses.length === 0 ? (
        <p>No expenses found.</p>
      ) : (
        <ul>
          {expenses.map((expense) => (
            <li key={expense.id}>
              💸 <strong>{expense.title}</strong> — ₹{expense.amount} on {expense.expense_date}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
