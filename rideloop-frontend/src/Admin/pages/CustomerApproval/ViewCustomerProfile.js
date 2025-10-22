import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FaEllipsisV, FaTimes } from "react-icons/fa";
import axios from "axios";

const API_URL = "http://localhost:8080/rideloopdb/profiles";

// Helper: Get headers with JWT token
const getHeaders = () => {
  const token = localStorage.getItem("jwtToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const ViewCustomerProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const profile = location.state?.profile;

  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [documentModal, setDocumentModal] = useState({ open: false, type: "", url: null });

  if (!profile) return <p>No profile data available.</p>;

  // --- Approve Profile ---
  const approveProfile = async () => {
    setLoading(true);
    try {
      await axios.put(
        `${API_URL}/${profile.profileID}`,
        { status: "approved" },
        { headers: getHeaders(), params: { isAdmin: true } }
      );
      alert("Profile approved successfully!");
      navigate(-1);
    } catch (err) {
      console.error("Error approving profile:", err);
      alert("Failed to approve profile. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- Delete Profile ---
  const deleteProfile = async () => {
    if (!window.confirm("Are you sure you want to delete this profile?")) return;

    setLoading(true);
    try {
      await axios.delete(`${API_URL}/${profile.profileID}`, { headers: getHeaders() });
      alert("Profile deleted successfully!");
      navigate(-1);
    } catch (err) {
      console.error("Error deleting profile:", err);
      alert("Failed to delete profile. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- View Document in Modal ---
  const viewDocument = async (type) => {
    try {
      const res = await axios.get(
        `${API_URL}/${profile.profileID}/document/${type}`,
        { headers: getHeaders(), responseType: "blob" }
      );

      const fileURL = URL.createObjectURL(
        new Blob([res.data], { type: "application/pdf" })
      );

      setDocumentModal({ open: true, type, url: fileURL });
    } catch (err) {
      console.error(`Error fetching ${type} document:`, err);
      alert("Failed to load document.");
    }
  };

  // --- Sidebar Component ---
  const Sidebar = () => (
    <aside className="sidebar">
      <img src="/logo.png" alt="Logo" className="logo" />
      <nav>
        <ul>
          {[{ to: "/AdminDashboard", label: "Overview" },
            { to: "/ManageCars", label: "Manage Cars" },
            { to: "/Maintenance", label: "Maintenance" },
            { to: "/CustomerApprovalPage", label: "Customer Approvals" },
            { to: "/Reports", label: "Reports" },
            { to: "/RenterDashboard", label: "Renter Dashboard" }]
          .map((link, i) => (
            <li key={i}><Link to={link.to} className="sidebar-link">{link.label}</Link></li>
          ))}
        </ul>
      </nav>
      <button
        className="logout-button"
        onClick={() => { localStorage.removeItem("loggedInUser"); localStorage.removeItem("jwtToken"); navigate("/login"); }}
      >
        Logout
      </button>
    </aside>
  );

  // --- Top Header Component ---
  const TopHeader = () => (
    <header className="top-header" style={{ position: "relative" }}>
      <div className="search-container">
        <input className="search-bar" placeholder="Search..." />
      </div>
      <div className="user-profile">Admin</div>
      <div style={{ position: "absolute", right: "20px", top: "15px" }}>
        <FaEllipsisV style={{ cursor: "pointer" }} onClick={() => setMenuOpen(!menuOpen)} />
        {menuOpen && (
          <div style={menuStyle}>
            <button onClick={deleteProfile} disabled={loading} style={menuBtnStyle}>Delete Profile</button>
          </div>
        )}
      </div>
    </header>
  );

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <TopHeader />

        <div style={profileContainerStyle}>
          <h2>{profile.firstName} {profile.lastName}</h2>
          <p><strong>ID Number:</strong> {profile.idNumber}</p>
          <p><strong>License Number:</strong> {profile.licenseNumber}</p>
          <p><strong>Phone:</strong> {profile.phoneNumber}</p>
          <p><strong>Address:</strong> {profile.address.streetName}, {profile.address.suburb}, {profile.address.province}, {profile.address.zipCode}</p>
          <p><strong>Status:</strong> {profile.status}</p>

          <div style={docButtonsStyle}>
            {["id", "license", "id-copy", "residence"].map((docType) => (
              <button key={docType} onClick={() => viewDocument(docType)} style={btnStyle}>
                View {docType.replace("-", " ").toUpperCase()}
              </button>
            ))}
          </div>

          <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
            <button onClick={() => navigate(-1)} style={btnBackStyle}>Back</button>
            {profile.status.toLowerCase() === "pending" && (
              <button onClick={approveProfile} disabled={loading} style={btnApproveStyle}>
                {loading ? "Approving..." : "Approve"}
              </button>
            )}
          </div>
        </div>

        {documentModal.open && (
          <div style={modalOverlayStyle} onClick={() => setDocumentModal({ open: false, type: "", url: null })}>
            <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
              <FaTimes onClick={() => setDocumentModal({ open: false, type: "", url: null })} style={{ position: "absolute", top: "10px", right: "10px", cursor: "pointer" }} />
              <iframe src={documentModal.url} title={documentModal.type} style={{ width: "100%", height: "80vh", border: "none" }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Styles ---
const btnStyle = { padding: "10px 20px", borderRadius: "5px", border: "none", backgroundColor: "#1E90FF", color: "#fff", fontWeight: "bold", cursor: "pointer" };
const btnBackStyle = { ...btnStyle, backgroundColor: "#ccc", color: "#000" };
const btnApproveStyle = { ...btnStyle };

const profileContainerStyle = { padding: "30px", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", maxWidth: "600px", margin: "20px auto" };
const docButtonsStyle = { marginTop: "20px", display: "flex", gap: "10px", flexWrap: "wrap" };
const modalOverlayStyle = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000 };
const modalContentStyle = { position: "relative", width: "80%", maxWidth: "900px", backgroundColor: "#fff", borderRadius: "8px", padding: "20px", boxShadow: "0 2px 10px rgba(0,0,0,0.3)" };
const menuStyle = { position: "absolute", right: 0, marginTop: "5px", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.2)", borderRadius: "5px", zIndex: 1000, minWidth: "150px" };
const menuBtnStyle = { width: "100%", padding: "10px", border: "none", background: "none", textAlign: "left", cursor: "pointer" };

export default ViewCustomerProfile;
