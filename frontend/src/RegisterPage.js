import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { TextField, Button, Typography, Paper, Box } from "@mui/material";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sending to backend:", JSON.stringify(form));
    fetch("http://127.0.0.1/college-expense-tracker/backend/register.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    .then((data) => {
        if (data.success) {
            alert("Registered! Please log in.");
            navigate("/login");
        } else if (data.error === "Email is already registered. Please log in.") {
            alert("Email already exists. Redirecting to login...");
            navigate("/login");
        } else {
            alert(data.error || "Registration failed");
        }
        })
    .then((res) => res.json())
    .then((data) => {
    if (data.success) {
        alert("Registered! Please log in.");
        navigate("/login");
    } else {
        alert(data.error || "Registration failed");
    }
    })
    .catch((err) => {
    console.error("FETCH ERROR:", err);
        alert("Something went wrong. Try again.");
    });
    };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#f0f2f5">
      <Paper elevation={3} style={{ padding: "2rem", width: "350px" }}>
        <Typography variant="h5" gutterBottom align="center">
          📝 Register for Expense Tracker
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            fullWidth
            margin="normal"
            value={form.name}
            onChange={handleChange}
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            value={form.email}
            onChange={handleChange}
            required
          />
            <TextField
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                value={form.password}
                onChange={handleChange}
                required
                InputProps={{
                    endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                    ),
                }}
            />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Register
          </Button>
        </form>
        <Typography align="center" variant="body2" sx={{ mt: 2 }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#1976d2", textDecoration: "none" }}>Login</Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default RegisterPage;
