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
    idDocumentBase64: initialProfile?.idDocumentBase64 || null,
    licenseDocumentBase64: initialProfile?.licenseDocumentBase64 || null,
    proofOfAddressBase64: initialProfile?.proofOfAddressBase64 || null,
    profileImageBase64: initialProfile?.profileImageBase64 || null,
  });

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });

  const handleChange = async (e) => {
    const { name, value, files } = e.target;
    if (["streetName", "suburb", "province", "zipCode"].includes(name)) {
      setProfile(prev => ({ ...prev, address: { ...prev.address, [name]: value } }));
    } else if (files && files[0]) {
      const base64String = await fileToBase64(files[0]);
      setProfile(prev => ({ ...prev, [name + "Base64"]: base64String }));
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

    const { profileID, ...payload } = profile;
    const safePayload = {
      ...payload,
      idDocumentBase64: payload.idDocumentBase64 || null,
      licenseDocumentBase64: payload.licenseDocumentBase64 || null,
      proofOfAddressBase64: payload.proofOfAddressBase64 || null,
      profileImageBase64: payload.profileImageBase64 || null,
      address: payload.address || { streetName: "", suburb: "", province: "", zipCode: "" },
    };

    try {
      await axios.put(`${API_URL}/${profileID}`, safePayload);
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
            value={profile[field] || ""}
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
            value={profile.address?.[field] || ""}
            onChange={handleChange}
          />
        ))}

        <h3>Documents</h3>
        {["idDocument", "licenseDocument", "proofOfAddress", "profileImage"].map(field => (
          <input key={field} type="file" name={field} onChange={handleChange} />
        ))}

        <button type="submit" style={{ marginTop: "10px", width: "150px", padding: "8px 12px", backgroundColor: "#25c90c", color: "#fff", border: "none", borderRadius: "5px" }}>
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
