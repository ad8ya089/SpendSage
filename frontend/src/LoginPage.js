import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

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
          navigate("/");
        } else {
          alert(data.error || "Login failed");
        }
      });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🔐 Login to Expense Tracker</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          name="email"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>Login</button>
      </form>
      <p style={styles.linkText}>
        Don’t have an account?{" "}
        <Link to="/register" style={styles.link}>Register here</Link>
      </p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "4rem auto",
    padding: "2rem",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    fontFamily: "sans-serif",
    backgroundColor: "#fff"
  },
  title: {
    textAlign: "center",
    marginBottom: "2rem"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem"
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    cursor: "pointer"
  },
  linkText: {
    marginTop: "1rem",
    textAlign: "center"
  },
  link: {
    color: "#007bff",
    textDecoration: "none"
  }
};

export default LoginPage;
