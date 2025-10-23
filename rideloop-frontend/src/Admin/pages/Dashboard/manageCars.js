import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import logo from "../../../assets/logo.png";
import AdminSidebar from "../../../components/AdminSidebar";
import AdminLocation from "../../../Common/pages/Location/AdminLocation";
import { sendLocationToBackend } from "../../../Common/pages/Location/LocationSandR";

const ManageCars = () => {
  const [coords, setCoords] = useState(null); // { latitude, longitude }
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // ===== Logout =====
  const handleLogout = () => {
    localStorage.removeItem("jwtToken"); // remove token if using auth
    localStorage.removeItem("loggedInUser");
    navigate("/Login"); // redirect to login
  };

  // ===== Optional: handle sending coords to backend =====
  const handleSendCoords = async (location) => {
    try {
      const token = localStorage.getItem("jwtToken");
      await sendLocationToBackend(location, token);
      alert("Location sent successfully!");
    } catch (error) {
      console.error("Failed to send location:", error);
      alert("Failed to send location.");
    }
  };

  return (
    <div className="layout">
      {/* Sidebar */}
     
      <AdminSidebar />

      {/* Main Content */}
      <main className="main-content">
        <div className="top-header">
          <div className="search-container">
            <input
              type="text"
              className="search-bar"
              placeholder="Search admin data..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="search-icon" />
          </div>
          <div className="user-profile">Hi, Admin</div>
        </div>

        <div className="manage-car">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h2>Manage Cars</h2>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={() => navigate("/AddNewCar")}
                style={buttonStyle("#007bff")}
              >
                + Add New Car
              </button>
              <button
                type="button"
                onClick={() => navigate("/CarList")}
                style={buttonStyle("#28a745")}
              >
                See Car Details
              </button>
            </div>
          </div>

          {/* Location Component */}
          <AdminLocation coords={coords} onSendLocation={handleSendCoords} />
        </div>
      </main>
    </div>
  );
};

// ===== Reusable button style =====
const buttonStyle = (bgColor) => ({
  background: bgColor,
  color: "#fff",
  border: "none",
  borderRadius: 6,
  padding: "8px 18px",
  fontWeight: 500,
  fontSize: 15,
  cursor: "pointer",
});

export default ManageCars;
