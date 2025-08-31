import React, { useState } from "react";
import axios from "axios"; // make sure axios is installed
import { useNavigate } from "react-router-dom";
import '../pagescss/Login.css';

function Login() {
  const [email, setEmail] = useState("");       // state for email
  const [password, setPassword] = useState(""); // state for password
  const [message, setMessage] = useState("");   // state for messages
  const navigate = useNavigate();               // navigation hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:8080/rideloopdb/users/login",
        { email, password }, // send login data in request body
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
      setMessage(`Logged in as ${user.role}`);

      if (user.role?.toUpperCase() === "ADMIN") {
        navigate("/AdminDashboard");
      } else {
        navigate("/Profile", { state: { userID: user.userID, username: user.username } });
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response && error.response.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Server error. Try again later.");
      }
    }
  };

  return (
    <div className="App">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Login</h2>

        <div>
          <label className="login-label">Email</label>
          <input
            type="email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label className="login-label">Password</label>
          <input
            type="password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit" className="login-button">Login</button>

        {message && <p className="login-error">{message}</p>}
      </form>
    </div>
  );
}

export default Login;
