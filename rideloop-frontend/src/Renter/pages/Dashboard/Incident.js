/* eslint-disable */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../pagescss/RenterDashboard.css";
import logo from "../../../assets/logo.png";

function Incident() {
    const [incidents, setIncidents] = useState([]);
    const [type, setType] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentRentalId, setCurrentRentalId] = useState(null);

    const BASE_URL = "http://localhost:8080/api";

    // Get logged-in user
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const userId = storedUser?.userID;

    useEffect(() => {
        if (!userId) return;
        fetchIncidents();
        fetchCurrentRental();
    }, [userId]);

    // ===== Fetch all incidents for this user =====
    const fetchIncidents = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/incidents`);
            setIncidents(response.data);
        } catch (error) {
            console.error("Error fetching incidents:", error);
        } finally {
            setLoading(false);
        }
    };

    // ===== Fetch current rental for this user =====
    const fetchCurrentRental = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/rentals/current/${userId}`);
            if (response.data && response.data.rentalID) {
                setCurrentRentalId(response.data.rentalID);
            }
        } catch (error) {
            console.error("Error fetching current rental:", error);
        }
    };

    // ===== Create new incident =====
    const handleCreateIncident = async (e) => {
        e.preventDefault();
        if (!type || !description || !currentRentalId) return;

        const payload = {
            type,
            description,
            rentalIds: [currentRentalId],
        };

        try {
            await axios.post(`${BASE_URL}/incidents`, payload, {
                headers: { "Content-Type": "application/json" },
            });
            alert("✅ Incident reported successfully!");
            setType("");
            setDescription("");
            fetchIncidents();
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
                    <li><Link to="/Incidents" className="active">Incidents</Link></li>
                </ul>
            </nav>

            {/* MAIN CONTENT */}
            <main className="dashboard-main">
                <section className="welcome-banner">
                    <h2>⚠️ Report or View Incidents</h2>
                    <p>Report any maintenance, security, or accident issues related to your current rental.</p>
                </section>

                {/* ===== Incident Form ===== */}
                <section className="report-form">
                    <h3>📝 Report an Incident</h3>
                    {!currentRentalId && (
                        <p className="help-text error">
                            You currently have no active rental. <Link to="/Rentals">View Rentals</Link> to report an incident.
                        </p>
                    )}
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

                        <button
                            type="submit"
                            className="primary-btn"
                            disabled={!currentRentalId || !type || !description}
                            title={!currentRentalId ? "You must have an active rental to report an incident" : ""}
                        >
                            Submit Report
                        </button>
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
                                <th>Rentals</th>
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
                                        {incident.rentals && incident.rentals.length > 0
                                            ? incident.rentals.map((r) => r.rentalID).join(", ")
                                            : "None"}
                                    </td>
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

export default Incident;
