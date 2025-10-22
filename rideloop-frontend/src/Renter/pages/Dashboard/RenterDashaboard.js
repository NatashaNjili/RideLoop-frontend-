/* eslint-disable */
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import RideProcess from "../Rides/RideProcess";
import "../../pagescss/RenterDashboard.css";
import NavBar from "../../../components/NavBar";

const BASE_URL = "http://localhost:8080/rideloopdb/profiles";

const RenterDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noProfile, setNoProfile] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // 🔒 Load user and token from localStorage (handles multiple tabs)
  useEffect(() => {
    const savedUser = localStorage.getItem("loggedInUser");
    const token = localStorage.getItem("jwtToken");

    // If no user or token, redirect to login
    if (!savedUser || !token) {
      navigate("/Login");
      return;
    }

    setUser(JSON.parse(savedUser));

    // Set Axios default Authorization header
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }, [navigate]);

  const userId = user?.userID;

  // 🔒 Fetch profile securely
  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/${userId}`);
        const userProfile = response.data;

        if (!userProfile || !userProfile.profileID) {
          setNoProfile(true);
          localStorage.removeItem("profileID");
          return;
        }

        // Profile exists
        setProfile(userProfile);
        localStorage.setItem("profileID", userProfile.profileID);
      } catch (error) {
        console.error("Error fetching profile:", error);

        // 🔐 Handle authorization errors
        if (error.response?.status === 403 || error.response?.status === 401) {
          alert("Session expired or unauthorized. Please log in again.");
          localStorage.removeItem("jwtToken");
          localStorage.removeItem("loggedInUser");
          navigate("/Login");
        }

        if (error.response?.status === 404) {
          setNoProfile(true);
          localStorage.removeItem("profileID");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, navigate]);

  // Redirect to create profile if none exists
  useEffect(() => {
    if (noProfile) {
      const timer = setTimeout(() => {
        navigate("/editprofile", { state: { userID: userId } });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [noProfile, navigate, userId]);

  if (loading) return <div className="loading">Loading dashboard...</div>;

  if (noProfile) {
    return (
      <div className="dashboard-page">
        <NavBar />
        <div
          className="dashboard-container"
          style={{
            textAlign: "center",
            padding: "4rem",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          <h2>Hello, {user?.username || "User"} 👋</h2>
          <p style={{ fontSize: "1.1rem", marginTop: "1rem" }}>
            You don’t have a profile yet. <br />
            Redirecting you to create your profile...
          </p>
          <Link
            to="/editprofile"
            state={{ userID: userId }}
            style={{
              display: "inline-block",
              marginTop: "2rem",
              padding: "0.8rem 1.5rem",
              backgroundColor: "#007bff",
              color: "#fff",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            Create Profile Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <NavBar />
      <div className="dashboard-container">
        <main className="dashboard-main">
          <section className="welcome-banner">
            <h2>
              Welcome back, {profile?.firstName || user?.username || "User"} 👋
            </h2>
            <p>Your journey starts here — ready for your next ride?</p>
          </section>
          <RideProcess />
        </main>
        <footer className="dashboard-footer">
          <p>© 2025 RideLoop. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default RenterDashboard;
