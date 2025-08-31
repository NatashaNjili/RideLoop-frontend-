import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import logo from '../../../assets/logo.png';

import AdminLocation from "../../../Common/pages/Location/AdminLocation";
import { sendLocationToBackend } from "../../../Common/pages/Location/LocationSandR";

const ManageCars = () => {
  const [coords, setCoords] = useState(null); // { latitude, longitude }
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };



  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <img src={logo} alt="Logo" className="logo" />
        <nav style={{ flex: 1 }}>
          <ul>
            <li><Link to="/admin/overview" className="sidebar-link">Overview</Link></li>
            <li><Link to="/admin/manage-users" className="sidebar-link">Manage Users</Link></li>
            <li><Link to="/ManageCars" className="sidebar-link">Manage Cars</Link></li>
            <li><Link to="/Maintenance" className="sidebar-link">Maintenance</Link></li>
            <li><Link to="/admin/manage-bookings" className="sidebar-link">Manage Bookings</Link></li>
            <li><Link to="/admin/reports" className="sidebar-link">Reports</Link></li>
          </ul>
        </nav>
        <div style={{ marginTop: 'auto' }}>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </aside>
      {/* Main Content */}
      <main className="main-content">
        <div className="top-header">
          <div className="search-container">
            <input type="text" className="search-bar" placeholder="Search admin data..." />
            <FaSearch className="search-icon" />
          </div>
          <div className="user-profile">Hi, Admin</div>
        </div>
        <div className="manage-car">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h2>Manage Cars</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => navigate('/AddNewCar')}
                style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 500, fontSize: 15, cursor: 'pointer' }}
              >
                + Add New Car
              </button>
              <button
                type="button"
                onClick={() => navigate('/CarList')}
                style={{ background: '#28a745', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 500, fontSize: 15, cursor: 'pointer' }}
              >
                See Car Details
              </button>
            </div>
          </div>
          <AdminLocation coords={coords} />
        </div>
      </main>
    </div>
  );
};

export default ManageCars;
