import React, { useState } from "react";
import axios from "axios";
import "../pagescss/Register.css";

function Register() {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

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
        // Clear form
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
    <div className="App">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2 className="register-title">Register</h2>

        {message && <p className="error-message">{message}</p>}

        <div>
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
        </div>

        <div>
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
        </div>

        <div>
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
        </div>

        <div>
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
        </div>

        {showPopup && (
          <div style={{ marginTop: "15px" }}>
            <label className="register-label">Admin Security Code</label>
            <input
              type="password"
              className="register-input"
              value={securityCode}
              onChange={(e) => setSecurityCode(e.target.value)}
              placeholder="Enter security code"
              required
            />
          </div>
        )}

        <button type="submit" className="register-button" style={{ marginTop: "25px" }}>
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
