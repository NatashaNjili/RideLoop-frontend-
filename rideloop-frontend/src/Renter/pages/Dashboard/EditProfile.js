import React, { useState } from "react";
import axios from "axios";
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
      setProfile(prev => ({ ...prev, address: { ...prev.address, [name]: value } }));
    } else {
      setProfile(prev => ({ ...prev, [name]: value }));
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
    <div style={{ padding: "20px" }}>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {["firstName", "lastName", "idNumber", "licenseNumber", "phoneNumber"].map(field => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={field.replace(/([A-Z])/g, " $1")}
            value={profile[field]}
            onChange={handleChange}
          />
        ))}

        <h3>Address</h3>
        {["streetName", "suburb", "province", "zipCode"].map(field => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={field.replace(/([A-Z])/g, " $1")}
            value={profile.address[field]}
            onChange={handleChange}
          />
        ))}

        <p><strong>Status:</strong> {profile.status}</p>

        <button type="submit" style={{ marginTop: "10px", width: "150px", padding: "8px 12px", backgroundColor: "#25c90c", color: "#fff", border: "none", borderRadius: "5px" }}>
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
