/* eslint-disable */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../pagescss/Rentals.css";
import logo from "../../../assets/logo.png"; // ensure path is correct

const BASE_URL = "http://localhost:8080/rideloopdb";
const RENTAL_API = `${BASE_URL}/rental/getAll`;
const PROFILE_API = `${BASE_URL}/profiles`;
const CAR_API = `${BASE_URL}/api/cars`;

const Rentals = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    totalKm: 0,
    totalTrips: 0,
    rewards: 0,
    rewardGoal: 1000,
  });
  const [rides, setRides] = useState([]);
  const [latestRental, setLatestRental] = useState(null);
  const [car, setCar] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const userId = storedUser?.userID;
  const profileID = localStorage.getItem("profileID"); // use stored profileID

  useEffect(() => {
    const fetchRentalDetails = async () => {
      if (!profileID) {
        setMessage("Profile ID not found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        // 1️⃣ Fetch all rentals for this profile
        const rentalRes = await axios.get(RENTAL_API);
        const userRentals = rentalRes.data.filter(
          (r) => r.customerID === parseInt(profileID)
        );

        if (userRentals.length === 0) {
          setMessage("No rentals found for your profile.");
          setLoading(false);
          return;
        }

        // 2️⃣ Get latest rental
        const latest = userRentals.reduce((prev, current) =>
          new Date(prev.startDate) > new Date(current.startDate) ? prev : current
        );
        setLatestRental(latest);

        // 3️⃣ Fetch profile details
        try {
          const profileRes = await axios.get(`${PROFILE_API}/${profileID}`);
          setProfile(profileRes.data);
        } catch {
          setProfile({ firstName: "Unknown", lastName: "" });
        }

        // 4️⃣ Fetch car details
        if (latest.carID) {
          try {
            const carRes = await axios.get(`${CAR_API}/${latest.carID}`);
            setCar(carRes.data);
          } catch {
            setCar({
              brand: "Unknown",
              model: "",
              year: "",
              licensePlate: "Unknown",
              rentalRate: "Unknown",
            });
          }
        }

        // 5️⃣ Compute stats
        const totalKm = userRentals.reduce((sum, r) => sum + r.kilometers, 0);
        const totalTrips = userRentals.length;
        const rewards = totalTrips * 50; // example: 50 points per trip
        setStats((prev) => ({ ...prev, totalKm, totalTrips, rewards }));

        // 6️⃣ Recent rides (latest 5)
        const sortedRides = userRentals
          .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
          .slice(0, 5);
        setRides(sortedRides);
      } catch (err) {
        console.error("Error fetching rental details:", err);
        setMessage("Failed to fetch rental details.");
      } finally {
        setLoading(false);
      }
    };

    fetchRentalDetails();
  }, [profileID]);

  const rewardPercentage = Math.min((stats.rewards / stats.rewardGoal) * 100, 100);

  if (loading) return <div className="loading">Loading rentals...</div>;

  return (
    <div className="dashboard-container">
      {/* ===== HEADER ===== */}
      <header className="top-bar">
        <div className="top-left">
          <img src={logo} alt="RideLoop Logo" className="logo-image" />
        </div>
        <div className="top-right">
          <button className="hamburger">☰</button>
          <div className="dropdown-menu">
            <Link to="/Profile">My Profile</Link>
            <Link to="/Wallet">Wallet</Link>
            <Link to="/Incident">Support</Link>
            <Link to="/logout">Logout</Link>
          </div>
        </div>
      </header>

      {/* ===== NAVBAR ===== */}
      <nav className="dashboard-nav">
        <ul>
          <li><Link to="/Profile">My Profile</Link></li>
          <li><Link to="/Rentals">My Rentals</Link></li>
          <li><Link to="/Wallet">Wallet</Link></li>
          <li><Link to="/Notifications">Notifications</Link></li>
          <li><Link to="/Incident">Incidents</Link></li>
        </ul>
      </nav>

      <main className="dashboard-main">
       
        <div className="rentals-container">
          <h2 className="page-title">My Rentals</h2>

          {/* Stats Cards */}
          <div className="stats-cards">
            <div className="stat-card">
              <h3>{stats.totalKm} km</h3>
              <p>Total Kilometers</p>
            </div>
            <div className="stat-card">
              <h3>{stats.totalTrips}</h3>
              <p>Total Trips</p>
            </div>
            <div className="stat-card reward-card">
              <h3>{stats.rewards}</h3>
              <p>Rewards Points</p>
              <div className="reward-bar">
                <div
                  className="reward-progress"
                  style={{ width: `${rewardPercentage}%` }}
                ></div>
              </div>
              <p className="reward-goal">Goal: {stats.rewardGoal} pts</p>
            </div>
          </div>

          {/* Recent Rides */}
          <div className="recent-rides">
            <h3>Recent Rides</h3>
            <ul>
              {rides.map((ride, index) => (
                <li key={index}>
                  <div className="ride-info">
                    <span className="ride-date">
                      {new Date(ride.startDate).toLocaleDateString()}
                    </span>
                    <span className="ride-etails">
                      {ride.origin} → {ride.destination}
                    </span>
                    <span className="ride-km">{ride.kilometers} km</span>
                  </div>
                </li>
              ))}
            </ul>
            {rides.length === 5 && (
              <Link to="/RentalsFull" className="see-more">
                See More
              </Link>
            )}
          </div>

          {message && <p className="info-message">{message}</p>}
        </div>
      </main>
    </div>
  );
};

export default Rentals;
