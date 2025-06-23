import React, { useEffect, useState } from "react";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // New: Form state
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    expense_date: "",
  });

  // Fetch expenses
  const fetchExpenses = () => {
    fetch("http://localhost/college-expense-tracker/backend/getExpenses.php")
      .then((res) => res.json())
      .then((data) => {
        setExpenses(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Handle form submit
  const handleSubmit = (e) => {
  e.preventDefault();

  // Basic input validation
  if (
    !form.title.trim() ||
    !form.amount ||
    !form.category.trim() ||
    !form.expense_date
  ) {
    alert("Please fill in all fields correctly.");
    return;
  }

  fetch("http://localhost/college-expense-tracker/backend/addExpense.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message || "Added");
      setForm({ title: "", amount: "", category: "", expense_date: "" });
      fetchExpenses();
    })
    .catch(() => alert("Failed to add expense"));
};


  return (
    <div style={{ padding: "2rem" }}>
      <h1>📊 College Expense Tracker</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          placeholder="Amount"
          type="number"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          required
        />
        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
        />
        <input
          type="date"
          value={form.expense_date}
          onChange={(e) => setForm({ ...form, expense_date: e.target.value })}
          required
        />
        <button type="submit">Add Expense</button>
      </form>

      {/* Expense List */}
      {loading ? (
        <p>Loading...</p>
      ) : expenses.length === 0 ? (
        <p>No expenses yet.</p>
      ) : (
        <ul>
          {expenses.map((expense) => (
            <li key={expense.id}>
              💸 <strong>{expense.title}</strong> — ₹{expense.amount} on{" "}
              {expense.expense_date} ({expense.category})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
