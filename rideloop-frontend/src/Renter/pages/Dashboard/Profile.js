/* eslint-disable */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../pagescss/Profile.css";
import NavBar from "../../../components/NavBar";

const API_URL = "http://localhost:8080/rideloopdb/profiles";
const REWARDS_URL = "http://localhost:8080/rideloopdb/api/rewards/customer";

const Profile = () => {
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const userID = loggedInUser?.userID;

  const [profile, setProfile] = useState(null);
  const [rewardsSummary, setRewardsSummary] = useState({ totalPoints: 0, tier: "Bronze" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const storedProfileID = localStorage.getItem("profileID");

  /** ==========================
   *  FETCH CUSTOMER PROFILE
   *  ========================== */
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

        let response;
        if (storedProfileID) {
          response = await axios.get(`${API_URL}/${storedProfileID}`, config);
        } else {
          response = await axios.get(`${API_URL}/user/${userID}`, config);
          if (response.data.profileID) localStorage.setItem("profileID", response.data.profileID);
        }

        const data = response.data;
        setProfile({
          ...data,
          address: data.address || { streetName: "", suburb: "", province: "", zipCode: "" },
          documents: {
            id: !!data.idDocument,
            license: !!data.licenseDoc,
            idCopy: !!data.idCopy,
            residence: !!data.proofOfResidence,
          },
          profilePictureUrl: null,
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

  /** ==========================
   *  FETCH PROFILE PICTURE
   *  ========================== */
  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (!profile?.profileID) return;
      try {
        const token = localStorage.getItem("jwtToken");
        const res = await axios.get(`${API_URL}/${profile.profileID}/document/profile-picture`, {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        });
        const imageUrl = URL.createObjectURL(res.data);
        setProfile(prev => ({ ...prev, profilePictureUrl: imageUrl }));
      } catch (err) {
        console.warn("Profile picture not found or error fetching:", err.message);
      }
    };
    fetchProfilePicture();
  }, [profile?.profileID]);

  /** ==========================
   *  FETCH REWARDS SUMMARY
   *  ========================== */
  useEffect(() => {
    const fetchRewardsSummary = async () => {
      if (!profile?.profileID) return;
      try {
        const token = localStorage.getItem("jwtToken");
        // Get all rewards for this profile
        const res = await axios.get(`${REWARDS_URL}/${profile.profileID}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const rewardsList = res.data || [];

        // Sum points
        const totalPoints = rewardsList.reduce((sum, r) => sum + (r.currentPoints || 0), 0);
        // Determine current tier based on total points
        let tier = "Bronze";
        if (totalPoints >= 1000) tier = "Platinum";
        else if (totalPoints >= 500) tier = "Gold";
        else if (totalPoints >= 250) tier = "Silver";

        setRewardsSummary({ totalPoints, tier });
      } catch (err) {
        console.warn("No rewards found for this profile yet.", err.message);
        setRewardsSummary({ totalPoints: 0, tier: "Bronze" });
      }
    };
    fetchRewardsSummary();
  }, [profile?.profileID]);

  /** ==========================
   *  REDIRECT IF APPROVED
   *  ========================== */
  useEffect(() => {
    if (profile?.status?.toLowerCase() === "approved") {
      navigate("/renterdashboard");
    }
  }, [profile, navigate]);

  /** ==========================
   *  HELPERS
   *  ========================== */
  const handleEditClick = () => navigate("/editprofile", { state: { userID, profile } });

  const displayAddress = () => {
    if (!profile) return "";
    const { streetName, suburb, province, zipCode } = profile.address;
    return [streetName, suburb, province, zipCode].filter(Boolean).join(", ");
  };

  /** ==========================
   *  RENDER
   *  ========================== */
  if (!loggedInUser) return <p>User not logged in.</p>;
  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>{error}</p>;
  if (!profile) return <p>No profile found. Please create one.</p>;

  return (
    <div className="dashboard-container">
      <NavBar />
      <main className="profile-main">
        <div className="profile-card">
          {/* Profile Picture */}
          {profile.profilePictureUrl && (
            <div className="profile-picture">
              <img src={profile.profilePictureUrl} alt="Profile" />
            </div>
          )}

          {/* Profile Details */}
          <div className="profile-details">
            <h2>{profile.firstName} {profile.lastName}</h2>
            {displayAddress() && <p><strong>Address:</strong> {displayAddress()}</p>}
            {profile.phoneNumber && <p><strong>Phone:</strong> {profile.phoneNumber}</p>}
            <p>
              <strong>Status:</strong>{" "}
              <span className={`status ${profile.status?.toLowerCase()}`}>
                {profile.status}
              </span>
            </p>

            {/* Rewards Section */}
            <div className="profile-rewards">
              <h3>Your Rewards</h3>
              <p><strong>Total Points:</strong> {rewardsSummary.totalPoints}</p>
              <p><strong>Tier:</strong> {rewardsSummary.tier}</p>
            </div>
          </div>

          {/* Pending Message */}
          {profile.status?.toLowerCase() === "pending" && (
            <div className="pending-msg">
              <p>Your profile is awaiting approval.</p>
              <button onClick={handleEditClick} className="primary-btn">Edit Profile</button>
            </div>
          )}

          {/* Uploaded Documents */}
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
      <footer className="dashboard-footer">
        <p>© 2025 RideLoop. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Profile;
