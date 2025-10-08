// import React from "react";
// import { Link } from "react-router-dom";
// import logo from "../../../assets/logo.png";
// import "../../pagescss/RenterDashboard.css";
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";
// import "../../pagescss/Profile.css";
// import logo from "../../../assets/logo.png";

// const API_URL = "http://localhost:8080/rideloopdb/profiles";

// const terms = [
//   "You must be 18 years or older to use this service.",
//   "You agree to provide accurate personal information.",
//   "All payments must be made through our platform.",
//   "You must follow local traffic laws while driving.",
//   "Unauthorized sharing of account credentials is prohibited.",
//   "Do not damage vehicles intentionally or recklessly.",
//   "Report any accidents immediately to the platform.",
//   "Renter is responsible for fuel charges.",
//   "Insurance coverage applies as per the vehicle’s policy.",
//   "Any fines or penalties are the renter’s responsibility.",
//   "Do not use vehicles for illegal activities.",
//   "Maintain cleanliness of the vehicle during rental.",
//   "Return the vehicle on time to avoid late fees.",
//   "Follow the platform’s instructions for pickup and drop-off.",
//   "Keep your profile information up-to-date.",
//   "The platform may suspend accounts violating terms.",
//   "Disputes will be handled according to our policies.",
//   "Promotional offers are subject to platform rules.",
//   "The platform can update terms at any time with notice.",
//   "Using the platform indicates acceptance of these terms."
// ];

// const Profile = () => {
//   const navigate = useNavigate();
//   const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
//   const userID = loggedInUser?.userID;

//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showTerms, setShowTerms] = useState(false);
//   const [accepted, setAccepted] = useState(false);

//   useEffect(() => {
//     if (!userID) return;

//     const fetchProfile = async () => {
//       try {
//         const res = await axios.get(`${API_URL}/me?userID=${userID}`);
//         if (res.data) {
//           setProfile({
//             ...res.data,
//             address: res.data.address || { streetName: "", suburb: "", province: "", zipCode: "" }
//           });
//           if (!res.data.termsAccepted) setShowTerms(true);
//         } else {
//           setProfile(null);
//           setShowTerms(true);
//         }
//       } catch (err) {
//         console.error("Error fetching profile:", err);
//         setProfile(null);
//         setShowTerms(true);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [userID]);

//   const handleEditClick = () => {
//     navigate("/editprofile", { state: { userID, profile } });
//   };

//   const handleAcceptTerms = async () => {
//     if (!accepted) return;
//     try {
//       await axios.put(`${API_URL}/accept-terms/${userID}`);
//       setShowTerms(false);
//       if (!profile) handleEditClick();
//     } catch (err) {
//       console.error("Error accepting terms:", err);
//     }
//   };

//   const displayAddress = () => {
//     if (!profile) return "";
//     const { streetName, suburb, province, zipCode } = profile.address;
//     return [streetName, suburb, province, zipCode].filter(Boolean).join(", ");
//   };

//   if (!loggedInUser) return <p>User not logged in.</p>;
//   if (loading) return <p>Loading profile...</p>;



// function Profile() {
//   return (
//     <div className="dashboard-container">
//       {/* ===== HEADER ===== */}
//       <header className="top-bar">
//         <div className="top-left">
//           <div className="logo-container">
//             <img src={logo} alt="RideLoop Logo" className="logo-image" />
//           </div>
//         </div>
//         <div className="top-right">
//           <button className="hamburger">☰</button>
//         </div>
//       </header>

//       {/* ===== NAV BAR ===== */}
//       <nav className="dashboard-nav">
//         <ul>
//           <li><Link to="/Profile">My Profile</Link></li>
//           <li><Link to="/Rentals">My Rentals</Link></li>
//           <li><Link to="/Wallet">Wallet</Link></li>
//           <li><Link to="/Notifications">Notifications</Link></li>
//           <li><Link to="/Incidents">Incidents</Link></li>
//         </ul>
//       </nav>

//      <div className="layout-top-menu">
//            {/* Top Navigation */}
//            <header className="top-nav">
//              <div className="logo-container">
//                <img src={logo} alt="Logo" className="logo" />
//              </div>
//              <nav className="top-menu">
//                <Link to="/profile">Profile</Link>
//                <Link to="/myrentals">My Rentals</Link>
//                <Link to="/wallet">Wallet</Link>
//                <Link to="/notifications">Notifications</Link>
//              </nav>
//              <button
//                className="logout-button"
//                onClick={() => {
//                  localStorage.removeItem("loggedInUser");
//                  navigate("/login");
//                }}
//              >
//                Logout
//              </button>
//            </header>
     
//            {/* Main Content */}
//            <main className="profile-main">
//              {!profile ? (
//                <div className="no-profile">
//                  <p>No profile found. Please set up your profile to continue.</p>
//                  <button onClick={handleEditClick} className="primary-btn">Create Profile</button>
//                </div>
//              ) : (
//                <div className="profile-card">
//                  <div className="profile-details">
//                    <p><strong>Name:</strong> {profile.firstName} {profile.lastName}</p>
//                    {displayAddress() && <p><strong>Address:</strong> {displayAddress()}</p>}
//                    {profile.phoneNumber && <p><strong>Phone:</strong> {profile.phoneNumber}</p>}
//                    <p><strong>Status:</strong> {profile.status}</p>
//                  </div>
     
//                  {profile.status?.toLowerCase() === "pending" && (
//                    <div className="pending-msg">
//                      <p>Your profile is awaiting approval.</p>
//                      <button onClick={handleEditClick} className="primary-btn">Edit Profile</button>
//                    </div>
//                  )}
//                </div>
//              )}
//            </main>
     
//            {/* Terms Modal */}
//            {showTerms && (
//              <div className="modal-overlay">
//                <div className="modal-content">
//                  <h2>Terms and Conditions</h2>
//                  <ol className="terms-list">
//                    {terms.map((term, index) => (
//                      <li key={index}>{term}</li>
//                    ))}
//                  </ol>
     
//                  <div className="accept-terms">
//                    <input
//                      type="checkbox"
//                      id="accept"
//                      checked={accepted}
//                      onChange={() => setAccepted(!accepted)}
//                    />
//                    <label htmlFor="accept">I have read and accept the terms and conditions</label>
//                  </div>
     
//                  <button
//                    className={`setup-profile-btn ${!accepted ? "disabled" : ""}`}
//                    onClick={handleAcceptTerms}
//                    disabled={!accepted}
//                  >
//                    {profile ? "Accept Terms" : "Accept & Create Profile"}
//                  </button>
//                </div>
//              </div>
//            )}
//          </div>
//        );
//      };
//       {/* ===== FOOTER ===== */}
//       <footer className="dashboard-footer">
//         <p>© 2025 RideLoop. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// }

// export default Profile;
