import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/logo.png";
import "../pagescss/Login.css";

function Login() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:8080/rideloopdb/users/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response.data;

      if (data.message !== "Login successful") {
        setMessage(data.message);
        return;
      }

      const user = data.user;
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      console.log(`${user.username} (ID: ${user.userID}) login successful`);

      if (user.role?.toUpperCase() === "ADMIN") {
        navigate("/AdminDashboard");
      } else {
        navigate("/RenterDashboard", { state: { userID: user.userID, username: user.username } });
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage(error.response?.data?.message || "Server error. Try again later.");
    }
  };

  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">
          <img src={logo} alt="RideLoop Logo" />
        </div>

        <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <ul className={`navbar-menu ${menuOpen ? "active" : ""}`}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/About">About</Link></li>
          <li><Link to="/Contact">Contact</Link></li>
          <li><Link to="/Login">Login</Link></li>
          <li><Link to="/Register">Register</Link></li>
        </ul>
      </nav>

      {/* Login Form */}
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Login</h2>

        <label className="login-label">Email</label>
        <input
          type="email"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />

        <label className="login-label">Password</label>
        <input
          type="password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />

        <button type="submit" className="login-button">Login</button>

        {message && <p className="login-error">{message}</p>}

        <p className="login-footer-text">
          Don't have an account? <Link to="/Register">Register here</Link>
        </p>
      </form>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} RideLoop Rentals. All rights reserved.</p>
        <ul className="footer-links">
          <li><Link to="/Terms">Terms</Link></li>
          <li><Link to="/Privacy">Privacy</Link></li>
          <li><Link to="/Contact">Contact</Link></li>
        </ul>
      </footer>
    </div>
  );
}

export default Login;
