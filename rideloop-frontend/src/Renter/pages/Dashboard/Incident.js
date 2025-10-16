import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../../pagescss/Incident.css";

function Incident() {
  const [incidents, setIncidents] = useState([]);
  const [currentRental, setCurrentRental] = useState(null);
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const BASE_URL = "http://localhost:8080/rideloopdb";

  // 1️⃣ Get logged-in user
  const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const userId = storedUser?.userID;

  // 2️⃣ Fetch the user's profile (backend endpoint: /profiles/user/{userId})
  const fetchProfile = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/profiles/user/${userId}`);
      return res.data; // CustomerProfile
    } catch (err) {
      console.error("Error fetching profile:", err);
      // If profile not found (404), treat it as 'no profile yet' and fall back to userId
      if (err.response && err.response.status === 404) {
        return null;
      }
      setError("Failed to fetch user profile.");
      return null;
    }
  }, [userId]);

  // 3️⃣ Fetch latest rental for this profile
  const fetchLatestRental = async (customerId) => {
    try {
      const res = await axios.get(`${BASE_URL}/rental/getAll`);
      const rentals = Array.isArray(res.data) ? res.data : [];
      // Filter rentals for this customer
      const myRentals = rentals.filter(
        (r) => Number(r.customerID || r.customerId) === Number(customerId)
      );
      // Sort by startDate descending and pick first active or latest rental
      const latest = myRentals
        .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
        .find((r) => r.status?.toLowerCase() !== "completed" && r.status?.toLowerCase() !== "cancelled")
        || myRentals[0] || null;

      setCurrentRental(latest);
    } catch (err) {
      console.error("Error fetching latest rental:", err);
      setError("Failed to fetch latest rental.");
    }
  };

  // 4️⃣ Fetch incidents for current rental
  const fetchIncidents = async (rentalId) => {
    try {
      if (!rentalId) return setIncidents([]);
      const res = await axios.get(`${BASE_URL}/incidents/rental/${rentalId}`);
      setIncidents(Array.isArray(res.data) ? res.data : [res.data]);
    } catch (err) {
      console.error("Error fetching incidents:", err);
      setError("Failed to load incidents.");
    }
  };

  // 5️⃣ Handle new incident
  const handleCreateIncident = async (e) => {
    e.preventDefault();
    if (!currentRental) return alert("No active rental to report incident.");
    const rentalId = currentRental.rentalID ?? currentRental.rentalId ?? currentRental.id;

    try {
      await axios.post(`${BASE_URL}/incidents/create`, null, {
        params: { type, description, rentalId },
      });
      alert("Incident reported successfully!");
      setType("");
      setDescription("");
      fetchIncidents(rentalId);
    } catch (err) {
      console.error("Error creating incident:", err);
      alert("Failed to create incident.");
    }
  };

  // 6️⃣ Load data on mount
  useEffect(() => {
    if (!userId) {
      setError("No logged-in user found.");
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      const profile = await fetchProfile();
      // Use profile.profileID when available; otherwise fall back to userId
      const lookupId = profile?.profileID ?? profile?.profileId ?? userId;
      if (lookupId) await fetchLatestRental(lookupId);
      setLoading(false);
    };

    loadData();
  }, [userId, fetchProfile]);

  // Fetch incidents when current rental changes
  useEffect(() => {
    const rentalId = currentRental?.rentalID ?? currentRental?.rentalId ?? currentRental?.id;
    if (rentalId) fetchIncidents(rentalId);
  }, [currentRental]);

  if (loading) return <p>Loading incidents...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="incident-container">
      <h2>Report Incident</h2>

      <form onSubmit={handleCreateIncident}>
        <div>
          <label>Type:</label>
          <select value={type} onChange={(e) => setType(e.target.value)} required>
            <option value="">Select incident type</option>
            <option value="Vehicle Damage">Vehicle Damage</option>
            <option value="Late Return">Late Return</option>
            <option value="Accident">Accident</option>
            <option value="Mechanical Failure">Mechanical Failure</option>
            <option value="Traffic Fine">Traffic Fine</option>
            <option value="Other">Other</option>
          </select>
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

      <h3>My Incidents</h3>
      {incidents.length === 0 ? (
        <p>No incidents reported yet.</p>
      ) : (
        <ul>
          {incidents.map((inc) => (
            <li key={inc.incidentID ?? inc.id}>
              <strong>{inc.type}</strong> — {inc.description} <br />
              <small>
                Date: {new Date(inc.dateReported || inc.date || inc.createdAt).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Incident;



