import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../../assets/logo.png";
import "../../pagescss/Profile.css";

const API_URL = "http://localhost:8080/rideloopdb/profiles";

const terms = [
  "You must be 18 years or older to use this service.",
  "You agree to provide accurate personal information.",
  "All payments must be made through our platform.",
  "You must follow local traffic laws while driving.",
  "Unauthorized sharing of account credentials is prohibited.",
  "Do not damage vehicles intentionally or recklessly.",
  "Report any accidents immediately to the platform.",
  "Renter is responsible for fuel charges.",
  "Insurance coverage applies as per the vehicle’s policy.",
  "Any fines or penalties are the renter’s responsibility.",
  "Do not use vehicles for illegal activities.",
  "Maintain cleanliness of the vehicle during rental.",
  "Return the vehicle on time to avoid late fees.",
  "Follow the platform’s instructions for pickup and drop-off.",
  "Keep your profile information up-to-date.",
  "The platform may suspend accounts violating terms.",
  "Disputes will be handled according to our policies.",
  "Promotional offers are subject to platform rules.",
  "The platform can update terms at any time with notice.",
  "Using the platform indicates acceptance of these terms."
];

const Profile = () => {
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const userID = loggedInUser?.userID;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTerms, setShowTerms] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");

  // Get profileID from localStorage first
  const storedProfileID = localStorage.getItem("profileID");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userID) {
        setError("No user logged in.");
        setLoading(false);
        return;
      }

      try {
        let profileData;

        if (storedProfileID) {
          // Fetch profile by stored profileID
          const res = await axios.get(`${API_URL}/${storedProfileID}`);
          profileData = res.data;
        } else {
          // Fallback: fetch profile by userID
          const res = await axios.get(`${API_URL}/user/${userID}`);
          profileData = res.data;

          // Store profileID locally for future use
          if (profileData.profileID) {
            localStorage.setItem("profileID", profileData.profileID);
          }
        }

        setProfile({
          ...profileData,
          profileID: profileData.profileID,
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

        setError("");
      } catch (err) {
        console.error("Error fetching profile:", err.response?.data || err.message);
        setError("Error fetching profile. Please try again later.");
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userID, storedProfileID]);

  useEffect(() => {
    if (profile?.status?.toLowerCase() === "approved") {
      navigate("/renterdashboard");
    }
  }, [profile, navigate]);

  const handleAcceptTerms = async () => {
    if (!accepted) return;
    try {
      await axios.put(`${API_URL}/accept-terms/${userID}`);
      setShowTerms(false);
    } catch (err) {
      console.error("Error accepting terms:", err.response?.data || err.message);
    }
  };

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
      {/* HEADER */}
      <header className="top-bar">
        <div className="top-left">
          <img src={logo} alt="RideLoop Logo" className="logo-image" />
        </div>
        <div className="top-right">
          <button className="hamburger">☰</button>
        </div>
      </header>

      {/* NAVBAR */}
      <nav className="dashboard-nav">
        <ul>
          <li><Link to="/profile">My Profile</Link></li>
          <li><Link to="/rentals">My Rentals</Link></li>
          <li><Link to="/wallet">Wallet</Link></li>
          <li><Link to="/notifications">Notifications</Link></li>
          <li><Link to="/incidents">Incidents</Link></li>
        </ul>
      </nav>

      {/* MAIN CONTENT */}
      <main className="profile-main">
        <div className="profile-card">
          {profile.profilePictureUrl && (
            <div className="profile-picture">
              <img src={profile.profilePictureUrl} alt="Profile" />
            </div>
          )}

          <div className="profile-details">
            <p><strong>Name:</strong> {profile.firstName} {profile.lastName}</p>
            {displayAddress() && <p><strong>Address:</strong> {displayAddress()}</p>}
            {profile.phoneNumber && <p><strong>Phone:</strong> {profile.phoneNumber}</p>}
            <p><strong>Status:</strong> {profile.status}</p>
          </div>

          {profile.status?.toLowerCase() === "pending" && (
            <div className="pending-msg">
              <p>Your profile is awaiting approval.</p>
              <button onClick={handleEditClick} className="primary-btn">Edit Profile</button>
            </div>
          )}

          {/* Documents */}
          {profile.documents && (
            <div className="profile-documents">
              <h4>Documents</h4>
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

      {/* TERMS MODAL */}
      {showTerms && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Terms and Conditions</h2>
            <ol className="terms-list">
              {terms.map((term, index) => (
                <li key={index}>{term}</li>
              ))}
            </ol>

            <div className="accept-terms">
              <input
                type="checkbox"
                id="accept"
                checked={accepted}
                onChange={() => setAccepted(!accepted)}
              />
              <label htmlFor="accept">I have read and accept the terms and conditions</label>
            </div>

            <button
              className={`setup-profile-btn ${!accepted ? "disabled" : ""}`}
              onClick={handleAcceptTerms}
              disabled={!accepted}
            >
              Accept Terms
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="dashboard-footer">
        <p>© 2025 RideLoop. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Profile;
