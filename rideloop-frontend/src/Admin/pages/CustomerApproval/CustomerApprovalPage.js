import React, { useState, useEffect, useRef } from "react";
import "../../pagescss/Maintenance.css";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaEllipsisV } from "react-icons/fa";
import logo from "../../../assets/logo.png";
import axios from "axios";

const API_URL = "http://localhost:8080/rideloopdb/profiles";

const CustomerApprovalPage = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [dropdownOpenId, setDropdownOpenId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const dropdownRef = useRef();

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const url =
        filterStatus === "all"
          ? `${API_URL}`
          : `${API_URL}/status/${filterStatus}`;
      const res = await axios.get(url);
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

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const approveProfile = async (profileID) => {
    try {
      await axios.put(`${API_URL}/${profileID}`, { status: "approved" }, { params: { isAdmin: true } });
      fetchProfiles();
      setDropdownOpenId(null);
    } catch (err) {
      console.error("Error approving profile:", err);
    }
  };

  const viewProfile = (profile) => {
    navigate("/viewcustomerprofile", { state: { profile } });
  };

  const toggleDropdown = (profileID) => {
    setDropdownOpenId(dropdownOpenId === profileID ? null : profileID);
  };

  // Apply filters: search + date range
  const filteredProfiles = profiles.filter((profile) => {
    const fullName = `${profile.firstName} ${profile.lastName}`.toLowerCase();
    const nameMatch = fullName.includes(searchTerm.toLowerCase());

    let dateMatch = true;
    if (dateFrom) {
      dateMatch = new Date(profile.createdAt) >= new Date(dateFrom);
    }
    if (dateTo) {
      dateMatch = dateMatch && new Date(profile.createdAt) <= new Date(dateTo);
    }

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

              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                style={{ padding: "5px", borderRadius: "5px" }}
              />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                style={{ padding: "5px", borderRadius: "5px" }}
              />
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
                  {profile.status.toLowerCase() === "pending" && (
                    <div className="menu-container" ref={dropdownRef} onClick={(e) => e.stopPropagation()}>
                      <FaEllipsisV
                        className="menu-dots"
                        onClick={() => toggleDropdown(profile.profileID)}
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
                <p>Created At: {new Date(profile.createdAt).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomerApprovalPage;
