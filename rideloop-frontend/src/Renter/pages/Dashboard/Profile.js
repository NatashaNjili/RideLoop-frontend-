import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../pagescss/Profile.css";

const API_URL = "http://localhost:8080/rideloopdb/profiles";

const Profile = () => {
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const userID = loggedInUser?.userID;
  const username = loggedInUser?.username;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userID) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}/me?userID=${userID}`);
        setProfile({
          ...res.data,
          address: res.data.address || { streetName: "", suburb: "", province: "", zipCode: "" },
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userID]);

  const handleEditClick = () => {
    navigate("/editprofile", { state: { userID, profile } });
  };

  if (!loggedInUser) return <p>User not logged in.</p>;
  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="layout">
      <aside className="sidebar">
        <img src="/logo.png" alt="Logo" className="logo" />
        <nav>
          <ul>
            <li><a className="sidebar-link" href="/dashboard">Dashboard</a></li>
            <li><a className="sidebar-link" href="/profile">Profile</a></li>
            <li><a className="sidebar-link" href="/settings">Settings</a></li>
          </ul>
        </nav>
        <button
          className="logout-button"
          onClick={() => {
            localStorage.removeItem("loggedInUser");
            navigate("/login");
          }}
        >
          Logout
        </button>
      </aside>

      <div className="main-content">
        <header className="top-header">
          <div className="search-container">
            <input className="search-bar" placeholder="Search..." />
            <i className="search-icon">🔍</i>
          </div>
          <div className="user-profile">{username || "User"}</div>
        </header>

        <div className="profile-container" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
          {!profile ? (
            <>
              <p>No profile found.</p>
              <button
                onClick={handleEditClick}
                style={{ marginTop: "15px", padding: "8px 16px", cursor: "pointer" }}
              >
                Create Profile
              </button>
            </>
          ) : (
            <>
              <h2>{profile.firstName} {profile.lastName}</h2>
              <p>{profile.address.streetName}, {profile.address.suburb}, {profile.address.province}, {profile.address.zipCode}</p>
              <p><strong>Phone:</strong> {profile.phoneNumber}</p>
              <p><strong>Status:</strong> {profile.status}</p>
              <button onClick={handleEditClick} style={{ marginTop: "15px", padding: "8px 16px", cursor: "pointer" }}>
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
