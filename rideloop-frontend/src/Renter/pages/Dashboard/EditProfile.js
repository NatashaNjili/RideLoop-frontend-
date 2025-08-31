import React, { useState } from "react";
import axios from "axios";
import logo from "../../../assets/logo.png"; 
import { useLocation, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080/rideloopdb/profiles";

const EditProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userID, profile: initialProfile } = location.state || {};

  const [profile, setProfile] = useState({
    profileID: initialProfile?.profileID || null,
    firstName: initialProfile?.firstName || "",
    lastName: initialProfile?.lastName || "",
    idNumber: initialProfile?.idNumber || "",
    licenseNumber: initialProfile?.licenseNumber || "",
    phoneNumber: initialProfile?.phoneNumber || "",
    address: initialProfile?.address || { streetName: "", suburb: "", province: "", zipCode: "" },
    status: initialProfile?.status || "pending",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["streetName", "suburb", "province", "zipCode"].includes(name)) {
      setProfile((prev) => ({ ...prev, address: { ...prev.address, [name]: value } }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile.profileID) {
      alert("Cannot update profile: ID is missing.");
      return;
    }

    try {
      await axios.put(`${API_URL}/${profile.profileID}`, profile);
      alert("Profile updated successfully!");
      navigate("/profile", { state: { userID } });
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Failed to save profile.");
    }
  };

  return (
    <div style={{ backgroundColor: "#fff", minHeight: "100vh", padding: "20px" }}>
      {/* Logo top left */}
      <img src="/logo.png" alt="Logo" style={{ height: "60px", marginBottom: "10px" }} />

      {/* Center heading */}
      <h2 style={{ textAlign: "center", color: "#007bff", marginBottom: "20px" }}>
        Setup Your Profile
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: "20px",
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        {["firstName", "lastName", "idNumber", "licenseNumber", "phoneNumber"].map((field) => (
          <div key={field} style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
            <label style={{ width: "150px", fontWeight: "bold", color: "#000" }}>
              {field.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type="text"
              name={field}
              placeholder={field.replace(/([A-Z])/g, " $1")}
              value={profile[field]}
              onChange={handleChange}
              style={{ flex: 1, padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
          </div>
        ))}

        <h3 style={{ color: "#007bff", marginTop: "30px", marginBottom: "20px" }}>Address</h3>
        {["streetName", "suburb", "province", "zipCode"].map((field) => (
          <div key={field} style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
            <label style={{ width: "150px", fontWeight: "bold", color: "#000" }}>
              {field.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type="text"
              name={field}
              placeholder={field.replace(/([A-Z])/g, " $1")}
              value={profile.address[field]}
              onChange={handleChange}
              style={{ flex: 1, padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
          </div>
        ))}

        <p>
          <strong>Status:</strong> {profile.status}
        </p>

        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button
            type="submit"
            style={{
              flex: 1,
              padding: "10px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              flex: 1,
              padding: "10px",
              backgroundColor: "#6c757d",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
