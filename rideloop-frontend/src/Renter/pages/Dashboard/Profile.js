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

  const handleEditClick = (profileData) => {
    navigate("/editprofile", { state: { userID, profile: profileData } });
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
                onClick={() => handleEditClick({
                  firstName: "",
                  lastName: "",
                  phoneNumber: "",
                  profileImageBase64: null,
                  address: { streetName: "", suburb: "", province: "", zipCode: "" },
                })}
                style={{ marginTop: "15px", padding: "8px 16px", cursor: "pointer" }}
              >
                Create Profile
              </button>
            </>
          ) : (
            <>
              <img
                src={profile.profileImageBase64 ? `data:image/jpeg;base64,${profile.profileImageBase64}` : "/default-profile.png"}
                alt="Profile"
                style={{ width: "150px", height: "150px", borderRadius: "50%", objectFit: "cover", marginBottom: "20px" }}
              />
              <h2>{profile.firstName} {profile.lastName}</h2>
              <p>{profile.address.streetName}, {profile.address.suburb}, {profile.address.province}, {profile.address.zipCode}</p>
              <p><strong>Phone:</strong> {profile.phoneNumber}</p>
              <button onClick={() => handleEditClick(profile)} style={{ marginTop: "15px", padding: "8px 16px", cursor: "pointer" }}>
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
