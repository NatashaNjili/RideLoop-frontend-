import React, { useState, useEffect } from "react";
import axios from "axios";

function Incident() {
  const [incidents, setIncidents] = useState([]);
  const [currentRental, setCurrentRental] = useState(null);
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const BASE_URL = "http://localhost:8080/rideloopdb";

  // Get logged-in user
  const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const userId = storedUser?.userID;

  // Fetch current rental
  const fetchCurrentRental = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/rentals/current/${userId}`);
      setCurrentRental(res.data);
    } catch (err) {
      console.error("Error fetching current rental:", err);
      setError("Failed to load current rental.");
    }
  };

  // Fetch incidents linked to the user
  const fetchIncidents = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/incidents/user/${userId}`);
      setIncidents(res.data);
    } catch (err) {
      console.error("Error fetching incidents:", err);
      setError("Failed to load incidents.");
    }
  };

  // Create new incident
  const handleCreateIncident = async (e) => {
    e.preventDefault();

    if (!currentRental) {
      alert("No active rental found to link the incident.");
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/incidents/create`,
        null, // POST body empty
        {
          params: {
            type,
            description,
            rentalId: currentRental.id, // Ensure this matches backend Rental model
          },
        }
      );
      alert("Incident created successfully!");
      setType("");
      setDescription("");
      fetchIncidents(); // refresh incidents list
    } catch (err) {
      console.error("Error creating incident:", err);
      alert("Failed to create incident.");
    }
  };

  useEffect(() => {
    if (!userId) {
      setError("No logged-in user found.");
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      await fetchCurrentRental();
      await fetchIncidents();
      setLoading(false);
    };

    loadData();
  }, [userId]);

  if (loading) return <p>Loading incidents...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="incident-container">
      <h2>Incidents</h2>

      {/* Create Incident Form */}
      <form onSubmit={handleCreateIncident} className="incident-form">
        <div>
          <label>Type:</label>
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Enter incident type"
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter incident description"
            required
          />
        </div>
        <button type="submit">Report Incident</button>
      </form>

      {/* User-specific Incidents */}
      <h3>My Incidents</h3>
      {incidents.length === 0 ? (
        <p>You have not reported any incidents yet.</p>
      ) : (
        <ul className="incident-list">
          {incidents.map((inc) => (
            <li key={inc.id}>
              <strong>{inc.type}</strong> - {inc.description}{" "}
              (Rental ID: {inc.rentals?.[0]?.id || "N/A"})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Incident;

