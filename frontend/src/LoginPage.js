import React, { useState } from "react";
import { /*useNavigate,*/ Link } from "react-router-dom";
import { TextField, Button, Typography, Paper, Box } from "@mui/material";

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  // const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost/college-expense-tracker/backend/login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user_id) {
          localStorage.setItem("userId", data.user_id);
          localStorage.setItem("userName", data.name);
          window.location.href = "/";  // force a reload so App.js re-evaluates    
        } else {
          alert(data.error || "Login failed");
        }
      });
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#f0f2f5">
      <Paper elevation={3} style={{ padding: "2rem", width: "350px" }}>
        <Typography variant="h5" gutterBottom align="center">
          🔐 Login to Expense Tracker
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            name="email"
            fullWidth
            margin="normal"
            value={form.email}
            onChange={handleChange}
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={form.password}
            onChange={handleChange}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
        </form>
        <Typography align="center" variant="body2" sx={{ mt: 2 }}>
          Don’t have an account?{" "}
          <Link to="/register" style={{ color: "#1976d2", textDecoration: "none" }}>Register</Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default LoginPage;
