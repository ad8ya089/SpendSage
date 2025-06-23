import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";

function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    expense_date: "",
  });
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

const fetchExpenses = () => {
  const userId = localStorage.getItem("userId");
  
  if (!userId) {
    alert("User not logged in");
    window.location.href = "/login";
    return;
  }

  fetch("http://localhost/college-expense-tracker/backend/getExpenses.php", {
    method: "POST", // Change from GET to POST
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user_id: parseInt(userId) // Send user_id in request body
    })
  })
    .then((res) => {
      console.log("Response status:", res.status);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log("Expenses API response:", data);
      if (Array.isArray(data)) {
        setExpenses(data);
      } else if (data.error) {
        console.error("API returned error:", data.error);
        alert("Error: " + data.error);
        setExpenses([]);
      } else {
        console.error("Expected an array but got:", data);
        setExpenses([]);
      }
      setLoading(false);
    })
    .catch((err) => {
      console.error("Failed to fetch expenses:", err);
      alert("Failed to connect to server: " + err.message);
      setExpenses([]);
      setLoading(false);
    });
};

useEffect(() => {
  fetchExpenses();
}, []);


const handleSubmit = (e) => {
  e.preventDefault();

  const userId = localStorage.getItem("userId");
  if (!userId) {
    alert("User not logged in");
    return;
  }

  if (
    !form.title.trim() ||
    !form.amount ||
    !form.category.trim() ||
    !form.expense_date
  ) {
    alert("Please fill in all fields correctly.");
    return;
  }

  // Add user_id to the form data
  const expenseData = {
    ...form,
    user_id: parseInt(userId)
  };

  fetch("http://localhost/college-expense-tracker/backend/addExpense.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(expenseData),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Add expense response:", data);
      if (data.success || data.message) {
        alert(data.message || "Added");
        setForm({ title: "", amount: "", category: "", expense_date: "" });
        fetchExpenses();
      } else {
        alert(data.error || "Failed to add expense");
      }
    })
    .catch((err) => {
      console.error("Failed to add expense:", err);
      alert("Something went wrong while adding expense.");
    });
};

  const handleDelete = (id) => {
    if (!window.confirm("Delete this expense?")) return;

    fetch("http://localhost/college-expense-tracker/backend/deleteExpense.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then(() => fetchExpenses())
      .catch(() => alert("Delete failed"));
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    window.location.href = "/login";
  };

  const filteredExpenses = expenses.filter((expense) => {
    return (
      (!categoryFilter || expense.category === categoryFilter) &&
      (!dateFilter || expense.expense_date === dateFilter)
    );
  });

  const totalSpent = expenses && expenses.length > 0 
  ? expenses
      .reduce((sum, e) => {
        const amount = parseFloat(e.amount) || 0;
        console.log(`Processing expense: ${e.title}, Amount: ${e.amount}, Parsed: ${amount}`);
        return sum + amount;
      }, 0)
      .toFixed(2)
  : "0.00";

const filteredTotal = filteredExpenses && filteredExpenses.length > 0
  ? filteredExpenses
      .reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0)
      .toFixed(2)
  : "0.00";

  return (
    <Box>
      {/* Top Bar */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            📊 College Expense Tracker
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Totals */}
      <Paper sx={{ mt: 3, p: 2 }} elevation={2}>
        <Typography variant="h6" gutterBottom>
          💰 Total Spent: ₹{totalSpent}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          🎯 Filtered Total: ₹{filteredTotal}
        </Typography>
      </Paper>

      {/* Expense Form */}
      <Paper sx={{ mt: 3, p: 3 }} elevation={3}>
        <Typography variant="h6" gutterBottom>
          ➕ Add New Expense
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Title"
                fullWidth
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Amount"
                type="number"
                fullWidth
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  required
                >
                  <MenuItem value="Food">Food</MenuItem>
                  <MenuItem value="Travel">Travel</MenuItem>
                  <MenuItem value="Books">Books</MenuItem>
                  <MenuItem value="Shopping">Shopping</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={form.expense_date}
                onChange={(e) => setForm({ ...form, expense_date: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" fullWidth>
                Add Expense
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Filters */}
      <Paper sx={{ mt: 3, p: 2 }} elevation={1}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Filter by Category</InputLabel>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Food">Food</MenuItem>
                <MenuItem value="Travel">Travel</MenuItem>
                <MenuItem value="Books">Books</MenuItem>
                <MenuItem value="Shopping">Shopping</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Filter by Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Expense List */}
      <Paper sx={{ mt: 3, p: 2 }} elevation={2}>
        <Typography variant="h6" gutterBottom>
          📒 Expense History
        </Typography>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : filteredExpenses.length === 0 ? (
          <Typography>No matching expenses found.</Typography>
        ) : (
          <List>
            {filteredExpenses.map((expense) => (
              <React.Fragment key={expense.id}>
                <ListItem
                  secondaryAction={
                    <IconButton edge="end" onClick={() => handleDelete(expense.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={`${expense.title} - ₹${expense.amount}`}
                    secondary={`${expense.expense_date} | ${expense.category}`}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}

export default ExpenseTracker;
