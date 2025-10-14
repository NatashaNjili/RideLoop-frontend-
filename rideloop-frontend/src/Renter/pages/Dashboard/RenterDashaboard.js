import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import RideProcess from "../Rides/RideProcess";
import "../../pagescss/RenterDashboard.css";
import logo from "../../../assets/logo.png";

function RenterDashboard() {
  const [profile, setProfile] = useState(null);
  const [quickStats, setQuickStats] = useState({ trips: 0, distance: 0, spent: 0 });
  const [availableCars, setAvailableCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [location, setLocation] = useState(null);

  const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const userId = storedUser?.userID;

  useEffect(() => {
    if (!userId) return;
    const BASE_URL = "http://localhost:8080/rideloopdb";

    const fetchData = async () => {
      try {
        const userRes = await axios.get(`${BASE_URL}/users/${userId}`);
        const userProfile = userRes.data.user;
        setProfile(userProfile);
        if (userProfile?.profileID) {
          localStorage.setItem("profileID", userProfile.profileID);
        }

        const statsRes = await axios.get(`${BASE_URL}/profiles/user/${userId}`);
        if (statsRes.data.quickStats) setQuickStats(statsRes.data.quickStats);

        const carsRes = await axios.get(`${BASE_URL}/api/cars/all`);
        const available = carsRes.data.filter(car => car.status === "available");
        setAvailableCars(available);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // ===== Handle Book Now =====
  const handleBookNow = () => {
    setShowLocationPrompt(true);
  };

  // ===== Get Location =====
  const handleShareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setLocation(userLocation);
          alert(`📍 Location shared! Latitude: ${userLocation.lat}, Longitude: ${userLocation.lng}`);
          setShowLocationPrompt(false);
          // You can now redirect or proceed with booking logic here
        },
        () => {
          alert("⚠️ Please enable location access to continue.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
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
              <Link to="/Incident">Support</Link>
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
          <li><Link to="/incident">Incidents</Link></li>
        </ul>
      </nav>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">
        <section className="welcome-banner">
          <h2>Welcome back, {storedUser?.username || "Loading..."} 👋 Ready for your next trip?</h2>
          <button className="primary-btn" onClick={handleBookNow}>Book a Car</button>
        </section>

        <section className="quick-stats">
          <div className="stat-card">
            <h4>Total Trips</h4>
            <p>{quickStats.trips}</p>
          </div>
          <div className="stat-card">
            <h4>Distance Driven (km)</h4>
            <p>{quickStats.distance}</p>
          </div>
          <div className="stat-card">
            <h4>Amount Spent (ZAR)</h4>
            <p>{quickStats.spent}</p>
          </div>
        </section>

        <section className="available-cars">
          <h3>🚘 Available Cars Nearby</h3>
          <div className="cars-grid">
            {loading ? (
              <p>Loading cars...</p>
            ) : availableCars.length > 0 ? (
              availableCars.map(car => (
                <div className="car-card" key={car.carId}>
                  <p><strong>{car.brand} {car.model}</strong></p>
                  <p>Rate: ZAR {car.rentalRate}/day</p>
                  <button className="primary-btn" onClick={handleBookNow}>
                    Book Now
                  </button>
                </div>
              ))
            ) : (
              <p>No available cars nearby</p>
            )}
          </div>
        </section>

        <RideProcess />
      </main>

      {/* LOCATION MODAL */}
      {showLocationPrompt && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>📍 Share Your Location</h3>
            <p>We need your location to show cars available near you.</p>
            <div className="modal-actions">
              <button className="primary-btn" onClick={handleShareLocation}>Share Location</button>
              <button className="cancel-btn" onClick={() => setShowLocationPrompt(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RenterDashboard;
