// src/components/AdminSidebar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; // Adjust path if needed
import "../Admin/pagescss/AdminDashboard.css"; // Reuse your existing styles

function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Optional: clear tokens here if needed
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("loggedInUser");
    navigate('/'); // Redirect to login/landing
  };

  return (
    <aside className="sidebar">
      <img src={logo} alt="Logo" className="logo" />
      <nav>
        <ul>
          <li><Link to="/AdminDashboard" className="sidebar-link">Overview</Link></li>
          <li><Link to="/ManageCars" className="sidebar-link">Manage Cars</Link></li>
          <li><Link to="/Maintenance" className="sidebar-link">Maintenance</Link></li>
          <li><Link to="/FinancialReport" className="sidebar-link">Financial Reports</Link></li>
          <li><Link to="/Rentals" className="sidebar-link">Rentals</Link></li>
          <li><Link to="/CustomerApprovalPage" className="sidebar-link">Customer Approvals</Link></li>
          
        </ul>
      </nav>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </aside>
  );
}

export default AdminSidebar;
