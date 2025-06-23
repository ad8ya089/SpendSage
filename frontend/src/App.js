import React, { useEffect, useState } from "react";

function App() {
  const [expenses, setExpenses] = useState([]);
  const total = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0).toFixed(2);
  const [loading, setLoading] = useState(true);

  // New: Form state
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    expense_date: "",
  });
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");


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
const handleDelete = (id) => {
  if (!window.confirm("Are you sure you want to delete this expense?")) return;

  fetch("http://localhost/college-expense-tracker/backend/deleteExpense.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message || "Deleted");
      fetchExpenses(); // refresh the list
    })
    .catch((err) => {
      console.error("Delete error:", err);
      alert("Failed to delete");
    });
};
  return (
    <div style={{ padding: "2rem" }}>
      <h1>📊 College Expense Tracker</h1>

      {/* Form */}
      <h2>🧾 Total Spent: ₹{total}</h2>
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

      <div style={{ margin: "20px 0" }}>
        <label>
          Category:
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ marginLeft: "10px" }}
          >
            <option value="">All</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Books">Books</option>
            <option value="Shopping">Shopping</option>
          </select>
        </label>

        <label style={{ marginLeft: "30px" }}>
          Date:
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{ marginLeft: "10px" }}
          />
        </label>
      </div>


      {/* Expense List */}
      {loading ? (
        <p>Loading...</p>
      ) : expenses.length === 0 ? (
        <p>No expenses yet.</p>
      ) : (
        <ul>
          {expenses
            .filter((expense) => {
              return (
                (!categoryFilter || expense.category === categoryFilter) &&
                (!dateFilter || expense.expense_date === dateFilter)
              );
            })
            .map((expense) => (
              <li key={expense.id}>
                💸 <strong>{expense.title}</strong> — ₹{expense.amount} on{" "}
                {expense.expense_date} ({expense.category})
                <button
                  onClick={() => handleDelete(expense.id)}
                  style={{ marginLeft: "1rem", color: "red" }}
                >
                  🗑️
                </button>
              </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
