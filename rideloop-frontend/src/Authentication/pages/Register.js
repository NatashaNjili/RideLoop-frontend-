import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/logo.png";
import "../pagescss/Register.css";

function Register() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "CUSTOMER",
  });
  const [securityCode, setSecurityCode] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleChange = (e) => {
    const role = e.target.value;
    setFormData({ ...formData, role });
    setShowPopup(role === "ADMIN");
    if (role !== "ADMIN") setSecurityCode("");
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (password) =>
    /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateEmail(formData.email)) {
      setMessage("Invalid email format.");
      return;
    }

    if (!validatePassword(formData.password)) {
      setMessage(
        "Password must be at least 8 characters, include 1 number and 1 special character."
      );
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/rideloopdb/users",
        formData,
        {
          params: formData.role === "ADMIN" ? { securityCode } : {},
        }
      );

      if (response.status === 201) {
        setMessage("Registration successful!");
        setFormData({ username: "", email: "", password: "", role: "CUSTOMER" });
        setSecurityCode("");
        setShowPopup(false);
      } else {
        setMessage(response.data?.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Error:", error);
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

      {/* Registration Form */}
      <form className="register-form" onSubmit={handleSubmit}>
        <h2 className="register-title">Register</h2>
        {message && <p className="error-message">{message}</p>}

        <label className="register-label">Username</label>
        <input
          type="text"
          name="username"
          className="register-input"
          value={formData.username}
          onChange={handleChange}
          placeholder="Enter username"
          required
        />

        <label className="register-label">Email</label>
        <input
          type="email"
          name="email"
          className="register-input"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email"
          required
        />

        <label className="register-label">Password</label>
        <input
          type="password"
          name="password"
          className="register-input"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter password"
          required
        />

        <label className="register-label">Role</label>
        <select
          name="role"
          className="register-input"
          value={formData.role}
          onChange={handleRoleChange}
        >
          <option value="CUSTOMER">Customer</option>
          <option value="ADMIN">Admin</option>
        </select>

        {showPopup && (
          <>
            <label className="register-label">Admin Security Code</label>
            <input
              type="password"
              className="register-input"
              value={securityCode}
              onChange={(e) => setSecurityCode(e.target.value)}
              placeholder="Enter security code"
              required
            />
          </>
        )}

        <button type="submit" className="register-button">Register</button>
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

export default Register;
