/* eslint-disable */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../pagescss/RenterDashboard.css";
import logo from "../../../assets/logo.png";

function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [rentalId, setRentalId] = useState("");
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://localhost:8080";

  useEffect(() => {
    fetchIncidents();
  }, []);

  // ===== Fetch all incidents =====
  const fetchIncidents = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/incidents/incidents/getAll`);
      setIncidents(response.data);
    } catch (error) {
      console.error("Error fetching incidents:", error);
    } finally {
      setLoading(false);
    }
  };

  // ===== Create new incident =====
  const handleCreateIncident = async (e) => {
    e.preventDefault();
    if (!type || !description || !rentalId) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/incidents/create`, null, {
        params: { type, description, rentalId },
      });

      alert("✅ Incident reported successfully!");
      setType("");
      setDescription("");
      setRentalId("");
      fetchIncidents(); // refresh list
    } catch (error) {
      console.error("Error creating incident:", error);
      alert("❌ Failed to create incident. Check console for details.");
    }
  };

  // ===== Delete incident =====
  const handleDeleteIncident = async (incidentId) => {
    if (!window.confirm("Are you sure you want to delete this incident?")) return;

    try {
      await axios.delete(`${BASE_URL}/incidents/${incidentId}`);
      alert("🗑️ Incident deleted successfully!");
      fetchIncidents();
    } catch (error) {
      console.error("Error deleting incident:", error);
    }
  };

  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <header className="top-bar">
        <div className="top-left">
          <div className="logo-container">
            <img src={logo} alt="RideLoop Logo" className="logo-image" />
          </div>
        </div>
        <div className="top-right">
          <div className="profile-dropdown">
            <button className="hamburger">☰</button>
            <div className="dropdown-menu">
              <Link to="/Profile">My Profile</Link>
              <Link to="/Wallet">Wallet</Link>
              <Link to="/Incidents">Support</Link>
              <Link to="/logout">Logout</Link>
            </div>
          </div>
        </div>
      </header>

      {/* NAVBAR */}
      <nav className="dashboard-nav">
        <ul>
          <li><Link to="/Profile">My Profile</Link></li>
          <li><Link to="/Rentals">My Rentals</Link></li>
          <li><Link to="/Wallet">Wallet</Link></li>
          <li><Link to="/notifications">Notifications</Link></li>
          <li><Link to="/incidents" className="active">Incidents</Link></li>
        </ul>
      </nav>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">
        <section className="welcome-banner">
          <h2>⚠️ Report or View Incidents</h2>
          <p>Here you can report any maintenance, security, or accident issues.</p>
        </section>

        {/* ===== Report Form ===== */}
        <section className="report-form">
          <h3>📝 Report an Incident</h3>
          <form onSubmit={handleCreateIncident} className="incident-form">
            <div className="form-group">
              <label>Type:</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="">-- Select Type --</option>
                <option value="Security">Security</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Accident">Accident</option>
              </select>
            </div>

            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the incident..."
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Rental ID:</label>
              <input
                type="number"
                value={rentalId}
                onChange={(e) => setRentalId(e.target.value)}
                placeholder="Enter rental ID"
              />
            </div>

            <button type="submit" className="primary-btn">Submit Report</button>
          </form>
        </section>

        {/* ===== List of Incidents ===== */}
        <section className="incident-list">
          <h3>📋 Reported Incidents</h3>
          {loading ? (
            <p>Loading incidents...</p>
          ) : incidents.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Date Reported</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((incident) => (
                  <tr key={incident.incidentID}>
                    <td>{incident.incidentID}</td>
                    <td>{incident.type}</td>
                    <td>{incident.description}</td>
                    <td>{incident.dateReported}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteIncident(incident.incidentID)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No incidents reported yet.</p>
          )}
        </section>
      </main>
    </div>
  );
}

export default Incidents;
