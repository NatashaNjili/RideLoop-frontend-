/* eslint-disable */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../pagescss/Profile.css";
import NavBar from "../../../components/NavBar";

const API_URL = "http://localhost:8080/rideloopdb/profiles";

const Profile = () => {
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const userID = loggedInUser?.userID;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const storedProfileID = localStorage.getItem("profileID");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userID) {
        setError("No user logged in.");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("jwtToken");
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

        let profileData;
        if (storedProfileID) {
          const res = await axios.get(`${API_URL}/${storedProfileID}`, config);
          profileData = res.data;
        } else {
          const res = await axios.get(`${API_URL}/user/${userID}`, config);
          profileData = res.data;
          if (profileData.profileID) localStorage.setItem("profileID", profileData.profileID);
        }

        setProfile({
          ...profileData,
          address: profileData.address || { streetName: "", suburb: "", province: "", zipCode: "" },
          documents: {
            id: !!profileData.idDocument,
            license: !!profileData.licenseDoc,
            idCopy: !!profileData.idCopy,
            residence: !!profileData.proofOfResidence
          },
          profilePictureUrl: profileData.profileID
            ? `${API_URL}/${profileData.profileID}/document/profile-picture`
            : null
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Error fetching profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userID, storedProfileID]);

  // Auto-redirect if profile is approved
  useEffect(() => {
    if (profile?.status?.toLowerCase() === "approved") {
      navigate("/renterdashboard");
    }
  }, [profile, navigate]);

  const handleEditClick = () => {
    navigate("/editprofile", { state: { userID, profile } });
  };

  const displayAddress = () => {
    if (!profile) return "";
    const { streetName, suburb, province, zipCode } = profile.address;
    return [streetName, suburb, province, zipCode].filter(Boolean).join(", ");
  };

  if (!loggedInUser) return <p>User not logged in.</p>;
  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>{error}</p>;
  if (!profile) return <p>No profile found. Please create one.</p>;

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <NavBar />

      {/* Main content */}
      <main className="profile-main">
        <div className="profile-card">
          {profile.profilePictureUrl && (
            <div className="profile-picture">
              <img src={profile.profilePictureUrl} alt="Profile" />
            </div>
          )}

          <div className="profile-details">
            <h2>{profile.firstName} {profile.lastName}</h2>
            {displayAddress() && <p><strong>Address:</strong> {displayAddress()}</p>}
            {profile.phoneNumber && <p><strong>Phone:</strong> {profile.phoneNumber}</p>}
            <p><strong>Status:</strong> <span className={`status ${profile.status?.toLowerCase()}`}>{profile.status}</span></p>
          </div>

          {profile.status?.toLowerCase() === "pending" && (
            <div className="pending-msg">
              <p>Your profile is awaiting approval.</p>
              <button onClick={handleEditClick} className="primary-btn">Edit Profile</button>
            </div>
          )}

          {profile.documents && (
            <div className="profile-documents">
              <h3>Uploaded Documents</h3>
              <ul>
                {profile.documents.id && <li><a href={`${API_URL}/${profile.profileID}/document/id`} target="_blank" rel="noreferrer">ID Document</a></li>}
                {profile.documents.license && <li><a href={`${API_URL}/${profile.profileID}/document/license`} target="_blank" rel="noreferrer">License</a></li>}
                {profile.documents.idCopy && <li><a href={`${API_URL}/${profile.profileID}/document/id-copy`} target="_blank" rel="noreferrer">ID Copy</a></li>}
                {profile.documents.residence && <li><a href={`${API_URL}/${profile.profileID}/document/residence`} target="_blank" rel="noreferrer">Proof of Residence</a></li>}
              </ul>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>© 2025 RideLoop. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Profile;
