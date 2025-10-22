/* eslint-disable */
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaEllipsisV } from "react-icons/fa";
import axios from "axios";
import logo from "../../../assets/logo.png";
import "../../pagescss/Maintenance.css";

// Base URL for profile endpoints
const API_BASE = "http://localhost:8080/rideloopdb/profiles";

// Get headers with JWT token
const getHeaders = () => {
  const token = localStorage.getItem("jwtToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const CustomerApprovalPage = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [dropdownOpenId, setDropdownOpenId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Fetch profiles from backend
  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const url =
        filterStatus === "all"
          ? `${API_BASE}/getAll`
          : `${API_BASE}/status/${filterStatus}`;
      const res = await axios.get(url, { headers: getHeaders() });
      setProfiles(res.data || []);
    } catch (err) {
      console.error("Error fetching profiles:", err);
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [filterStatus]);

  // Approve profile
  const approveProfile = async (profileID) => {
    try {
      await axios.put(
        `${API_BASE}/${profileID}`,
        { status: "approved" },
        { headers: getHeaders(), params: { isAdmin: true } }
      );
      fetchProfiles();
      setDropdownOpenId(null);
    } catch (err) {
      console.error("Error approving profile:", err);
    }
  };

  // Navigate to view profile
  const viewProfile = (profile) => {
    navigate("/viewcustomerprofile", { state: { profile } });
  };

  const toggleDropdown = (profileID, e) => {
    e.stopPropagation();
    setDropdownOpenId(dropdownOpenId === profileID ? null : profileID);
  };

  // Filter profiles by search and date
  const filteredProfiles = profiles.filter((profile) => {
    const fullName = `${profile.firstName} ${profile.lastName}`.toLowerCase();
    const nameMatch = fullName.includes(searchTerm.toLowerCase());

    let dateMatch = true;
    const createdAt = profile.createdAt ? new Date(profile.createdAt) : null;
    if (dateFrom && createdAt) dateMatch = createdAt >= new Date(dateFrom);
    if (dateTo && createdAt) dateMatch = dateMatch && createdAt <= new Date(dateTo);

    return nameMatch && dateMatch;
  });

  return (
    <div className="layout">
      <aside className="sidebar">
        <img src={logo} alt="Logo" className="logo" />
        <nav>
          <ul>
            <li><Link to="/AdminDashboard" className="sidebar-link">Overview</Link></li>
            <li><Link to="/ManageCars" className="sidebar-link">Manage Cars</Link></li>
            <li><Link to="/Maintenance" className="sidebar-link">Maintenance</Link></li>
            <li><Link to="/CustomerApprovalPage" className="sidebar-link">Customer Approvals</Link></li>
            <li><Link to="/Reports" className="sidebar-link">Reports</Link></li>
            <li><Link to="/RenterDashboard" className="sidebar-link">Renter Dashboard</Link></li>
          </ul>
        </nav>
        <div style={{ marginTop: "auto" }}>
          <button className="logout-button" onClick={() => navigate("/")}>Logout</button>
        </div>
      </aside>

      <main className="main-content">
        <div className="top-header">
          <div className="search-container">
            <input
              type="text"
              className="search-bar"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="search-icon" />
          </div>
          <div className="user-profile">Admin</div>
        </div>

        <div style={{ width: "900px", padding: "30px", backgroundColor: "#f9f9f9" }}>
          <div className="maintenance-header" style={{ justifyContent: "space-between", alignItems: "center" }}>
            <h2>Customer Approval</h2>
            <div style={{ display: "flex", gap: "10px" }}>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                  padding: "5px 10px",
                  borderRadius: "5px",
                  border: "none",
                  backgroundColor: "#1E90FF",
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer",
                  minWidth: "120px"
                }}
              >
                <option value="all">All Customers</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
              </select>

              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} style={{ padding: "5px", borderRadius: "5px" }} />
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} style={{ padding: "5px", borderRadius: "5px" }} />
            </div>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : filteredProfiles.length === 0 ? (
            <p>No profiles found.</p>
          ) : (
            filteredProfiles.map((profile) => (
              <div
                key={profile.profileID}
                className="insurance-card"
                style={{ maxWidth: "700px", cursor: "pointer", backgroundColor: "#f4f4fcff", marginBottom: "15px" }}
                onClick={() => viewProfile(profile)}
              >
                <div className="insurance-card-header">
                  <h3>{profile.firstName} {profile.lastName}</h3>
                  {profile.status?.toLowerCase() === "pending" && (
                    <div className="menu-container" onClick={(e) => e.stopPropagation()}>
                      <FaEllipsisV
                        className="menu-dots"
                        onClick={(e) => toggleDropdown(profile.profileID, e)}
                      />
                      {dropdownOpenId === profile.profileID && (
                        <div className="dropdown-menu">
                          <button onClick={() => approveProfile(profile.profileID)}>Approve</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <p>Status: {profile.status}</p>
                <p>Created At: {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A"}</p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomerApprovalPage;
