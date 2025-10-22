/* eslint-disable */
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../pagescss/RenterDashboard.css";
import NavBar from "../../../components/NavBar";

const INCIDENT_URL = "http://localhost:8080/rideloopdb/incidents";
const RENTAL_URL = "http://localhost:8080/rideloopdb/rental";
const CAR_URL = "http://localhost:8080/rideloopdb/api/cars";

function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [rentalItems, setRentalItems] = useState([]);
  const [mostRecentRental, setMostRecentRental] = useState(null);
  const [carDetails, setCarDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const userID = loggedInUser?.userID;
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    if (!token || !userID) {
      alert("You must be logged in to view incidents.");
      setLoading(false);
      return;
    }

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const fetchRentalsAndIncidents = async () => {
      try {
        // 1️⃣ Get all rentals for the user
        const rentalRes = await axios.get(`${RENTAL_URL}/customer/${userID}`);
        const rentals = rentalRes.data;

        if (!Array.isArray(rentals) || rentals.length === 0) {
          setError("No rentals found for this profile.");
          setLoading(false);
          return;
        }

        setRentalItems(rentals);

        // 2️⃣ Get most recent rental by rentalID (assumes higher ID = newer)
        const recentRental = rentals.sort((a, b) => b.rentalID - a.rentalID)[0];
        setMostRecentRental(recentRental);

        // 3️⃣ Fetch car details for this rental
        const carRes = await axios.get(`${CAR_URL}/${recentRental.carID}`);
        setCarDetails(carRes.data);

        // 4️⃣ Fetch incidents for most recent rental
        const incidentsRes = await axios.get(`${INCIDENT_URL}/rental/${recentRental.rentalID}`);
        setIncidents(incidentsRes.data);
      } catch (err) {
        console.error("Error fetching rentals/incidents/car:", err.response?.data || err.message);
        setError(`Failed to fetch rentals/incidents/car: ${err.response?.data || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchRentalsAndIncidents();
  }, [token, userID]);

  const handleCreateIncident = async (e) => {
    e.preventDefault();
    if (!type || !description || !mostRecentRental) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post(
        `${INCIDENT_URL}/create`,
        null,
        { params: { type, description, rentalId: mostRecentRental.rentalID } }
      );
      setIncidents([...incidents, response.data]);
      alert("✅ Incident reported successfully!");
      setType("");
      setDescription("");
    } catch (error) {
      console.error("Error creating incident:", error.response?.data || error.message);
      alert(`❌ Failed to create incident: ${error.response?.data || error.message}`);
    }
  };

  const handleDeleteIncident = async (incidentId) => {
    if (!window.confirm("Are you sure you want to delete this incident?")) return;

    try {
      await axios.delete(`${INCIDENT_URL}/${incidentId}`);
      setIncidents(incidents.filter((i) => i.incidentID !== incidentId));
      alert("🗑️ Incident deleted successfully!");
    } catch (error) {
      console.error("Error deleting incident:", error.response?.data || error.message);
      alert(`❌ Failed to delete incident: ${error.response?.data || error.message}`);
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  return (
    <div className="dashboard-container">
      <NavBar />

      <main className="dashboard-main">
        <section className="welcome-banner">
          <h2>⚠️ Report or View Incidents</h2>
          <p>Here you can report any maintenance, security, or accident issues.</p>
        </section>

        {mostRecentRental && carDetails ? (
          <>
            <section className="rental-car-info">
              <h3>🚗 Most Recent Rental</h3>
              <p><strong>Car:</strong> {carDetails.brand} {carDetails.model} ({carDetails.year})</p>
              <p><strong>License Plate:</strong> {carDetails.licensePlate}</p>
              <p><strong>Rental ID:</strong> {mostRecentRental.rentalID}</p>
              <p><strong>Rental Date:</strong> {formatDate(mostRecentRental.date)}</p>
            </section>

            <section className="report-form">
              <h3>📝 Report an Incident</h3>
              <form onSubmit={handleCreateIncident} className="incident-form">
                <div className="form-group">
                  <label>Type:</label>
                  <select value={type} onChange={(e) => setType(e.target.value)} required>
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
                    required
                  />
                </div>

                <button type="submit" className="primary-btn">Submit Report</button>
              </form>
            </section>
          </>
        ) : (
          <p>{error || "Loading most recent rental..."}</p>
        )}

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
                    <td>{formatDate(incident.dateReported)}</td>
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
