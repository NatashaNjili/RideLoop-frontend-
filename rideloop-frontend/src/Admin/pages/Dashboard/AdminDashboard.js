// src/pages/AdminDashboard.jsx
import React from 'react';
import '../../pagescss/AdminDashboard.css';
import { FaSearch } from 'react-icons/fa';
import AdminSidebar from  "../../../components/AdminSidebar"; // ✅ Import it

function AdminDashboard() {
  return (
    <div className="layout">
      {/* ✅ Use the new component */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="main-content">
        <div className="top-header">
          <div className="search-container">
            <input type="text" className="search-bar" placeholder="Search admin data..." />
            <FaSearch className="search-icon" />
          </div>
          <div className="user-profile">Hi, Admin</div>
        </div>

        <div className="admin-welcome">
          <h2>Welcome to the Admin Dashboard</h2>
          <p>Manage users, cars, bookings, and reports here.</p>
        </div>

        <div className="admin-stats">
          <div className="admin-card">Total Users: 120</div>
          <div className="admin-card">Cars Listed: 45</div>
          <div className="admin-card">Active Bookings: 22</div>
          <div className="admin-card">Pending Approvals: 6</div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
