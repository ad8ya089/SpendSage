import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage"; // if exists
import ExpenseTracker from "./ExpenseTracker";

function App() {
  const isLoggedIn = !!localStorage.getItem("userId");

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={isLoggedIn ? <ExpenseTracker /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
