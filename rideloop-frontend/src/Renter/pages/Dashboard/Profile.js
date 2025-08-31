import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../pagescss/Profile.css";
import logo from "../../../assets/logo.png";

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

  // Auto-redirect if approved
  useEffect(() => {
    if (profile && profile.status?.toLowerCase() === "approved") {
      navigate("/renterdashboard");
    }
  }, [profile, navigate]);

  const handleEditClick = () => {
    navigate("/editprofile", { state: { userID, profile } });
  };

  if (!loggedInUser) return <p>User not logged in.</p>;
  if (loading) return <p>Loading profile...</p>;

  // Helper to display address only if fields exist
  const displayAddress = () => {
    const { streetName, suburb, province, zipCode } = profile.address;
    return [streetName, suburb, province, zipCode].filter(Boolean).join(", ");
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <img src={logo} alt="Logo" className="logo" />
        <nav>
          <ul>
            <li><a className="sidebar-link" href="/profile">Profile</a></li>
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
        {/* Removed the username from the top header */}
        <header className="top-header"></header>

        <div
          className="profile-container"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "20px",
            textAlign: "center",
          }}
        >
          {!profile ? (
            <>
              <p style={{ color: "#0255c1", fontWeight: "bold" }}>
                No profile found. Please set up your profile to continue.
              </p>
              <button
                onClick={handleEditClick}
                style={{
                  marginTop: "15px",
                  padding: "14px 28px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "18px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Create Profile
              </button>
            </>
          ) : (
            <>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <div style={{ display: "flex" }}>
                  <strong style={{ width: "100px" }}>Name:</strong>
                  <span>{profile.firstName} {profile.lastName}</span>
                </div>

                {displayAddress() && (
                  <div style={{ display: "flex", marginTop: "8px" }}>
                    <strong style={{ width: "100px" }}>Address:</strong>
                    <span style={{ color: profile.status?.toLowerCase() === "pending" ? "blue" : "black" }}>
                      {displayAddress()}
                    </span>
                  </div>
                )}

                {/* Only show phone when profile is saved */}
                {profile.phoneNumber && profile.status?.toLowerCase() !== "pending" && (
                  <div style={{ display: "flex", marginTop: "8px" }}>
                    <strong style={{ width: "100px" }}>Phone:</strong>
                    <span>{profile.phoneNumber}</span>
                  </div>
                )}

                <div style={{ display: "flex", marginTop: "8px" }}>
                  <strong style={{ width: "100px" }}>Status:</strong>
                  <span>{profile.status}</span>
                </div>
              </div>

              {profile.status?.toLowerCase() === "pending" && (
                <>
                  <p style={{ color: "black", fontWeight: "bold", marginTop: "20px" }}>
                    Hi {username}, thank you for choosing RideLoop.<br />
                    Before you ride with us, your profile is awaiting approval.
                  </p>
                  <button
                    onClick={handleEditClick}
                    style={{
                      marginTop: "20px",
                      padding: "16px 32px",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "20px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Edit Profile
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
