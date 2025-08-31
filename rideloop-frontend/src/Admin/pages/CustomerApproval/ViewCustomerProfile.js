// ViewCustomerProfile.js
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:8080/rideloopdb/profiles";

const ViewCustomerProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const profile = location.state?.profile;
  const [loading, setLoading] = useState(false);

  if (!profile) {
    return <p>No profile data available.</p>;
  }

  const approveProfile = async () => {
    setLoading(true);
    try {
      await axios.put(`${API_URL}/${profile.profileID}/status?status=approved`);
      alert("Profile approved successfully!");
      navigate(-1);
    } catch (err) {
      console.error("Error approving profile:", err);
      alert("Failed to approve profile. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <img src="/logo.png" alt="Logo" className="logo" />
        <nav>
          <ul>
            <li><a className="sidebar-link" href="/dashboard">Dashboard</a></li>
            <li><a className="sidebar-link" href="/customerapproval">Customer Approval</a></li>
            <li><a className="sidebar-link" href="/settings">Settings</a></li>
          </ul>
        </nav>
        <button
          className="logout-button"
          onClick={() => {
            localStorage.removeItem("loggedInUser");
            navigate("/login");
          }}
        >
          Logout
        </button>
      </aside>

      <div className="main-content">
        <header className="top-header">
          <div className="search-container">
            <input className="search-bar" placeholder="Search..." />
          </div>
          <div className="user-profile">Admin</div>
        </header>

        <div
          className="profile-container"
          style={{
            padding: "30px",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            maxWidth: "600px",
            margin: "20px auto"
          }}
        >
          <h2>{profile.firstName} {profile.lastName}</h2>
          <p><strong>ID Number:</strong> {profile.idNumber}</p>
          <p><strong>License Number:</strong> {profile.licenseNumber}</p>
          <p><strong>Phone:</strong> {profile.phoneNumber}</p>
          <p>
            <strong>Address:</strong> {profile.address.streetName}, {profile.address.suburb}, {profile.address.province}, {profile.address.zipCode}
          </p>
          <p><strong>Status:</strong> {profile.status}</p>

          <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                padding: "10px 20px",
                borderRadius: "5px",
                border: "none",
                backgroundColor: "#ccc",
                cursor: "pointer"
              }}
            >
              Back
            </button>

            {profile.status.toLowerCase() === "pending" && (
              <button
                onClick={approveProfile}
                disabled={loading}
                style={{
                  padding: "10px 20px",
                  borderRadius: "5px",
                  border: "none",
                  backgroundColor: "#1E90FF", // blue
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                {loading ? "Approving..." : "Approve"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCustomerProfile;
