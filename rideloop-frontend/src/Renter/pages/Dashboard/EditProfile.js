import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../../../assets/logo.png";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080/rideloopdb/profiles";

const EditProfile = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const userID = storedUser?.userID;

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    profileID: null,
    firstName: "",
    lastName: "",
    idNumber: "",
    licenseNumber: "",
    phoneNumber: "",
    address: { street: "", city: "", province: "", postalCode: "" },
    status: "pending",
    profilePicture: { file: null, name: "", preview: "" },
    documents: {
      idDocument: { file: null, name: "" },
      licenseDoc: { file: null, name: "" },
      idCopy: { file: null, name: "" },
      proofOfResidence: { file: null, name: "" },
    },
  });

  // Fetch profile if exists
  useEffect(() => {
    if (!userID) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}/user/${userID}`);
        if (res.status === 200 && res.data) {
          const data = res.data;
          setProfile((prev) => ({
            ...prev,
            ...data,
            address: data.address || prev.address,
            profilePicture: {
              file: null,
              name: data.profilePicture ? "Uploaded" : "",
              preview: data.profileID
                ? `${API_URL}/${data.profileID}/document/profile-picture`
                : "",
            },
            documents: {
              idDocument: { file: null, name: data.idDocument ? "Uploaded" : "" },
              licenseDoc: { file: null, name: data.licenseDoc ? "Uploaded" : "" },
              idCopy: { file: null, name: data.idCopy ? "Uploaded" : "" },
              proofOfResidence: { file: null, name: data.proofOfResidence ? "Uploaded" : "" },
            },
          }));
        }
      } catch (err) {
        console.warn("No existing profile found. You can create one.", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userID]);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["street", "city", "province", "postalCode"].includes(name)) {
      setProfile((prev) => ({ ...prev, address: { ...prev.address, [name]: value } }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle file uploads
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (!files?.length) return;
    const file = files[0];

    if (name === "profilePicture") {
      setProfile((prev) => ({
        ...prev,
        profilePicture: { file, name: file.name, preview: URL.createObjectURL(file) },
      }));
    } else {
      setProfile((prev) => ({
        ...prev,
        documents: { ...prev.documents, [name]: { file, name: file.name } },
      }));
    }
  };

  // Submit profile data
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userID) return alert("User ID missing.");

    try {
      const profileData = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        idNumber: profile.idNumber,
        licenseNumber: profile.licenseNumber,
        phoneNumber: profile.phoneNumber,
        address: profile.address,
      };

      let savedProfile;

      if (profile.profileID) {
        const res = await axios.put(`${API_URL}/${profile.profileID}`, profileData);
        savedProfile = res.data;
      } else {
        const res = await axios.post(`${API_URL}/user/${userID}`, profileData);
        savedProfile = res.data;
      }

      const profileId = savedProfile.profileID;

      // Upload profile picture if exists
      if (profile.profilePicture.file) {
        const formData = new FormData();
        formData.append("file", profile.profilePicture.file);
        await axios.post(`${API_URL}/${profileId}/document/profile-picture`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      // Upload other documents
      const docMap = {
        idDocument: "id",
        licenseDoc: "license",
        idCopy: "id-copy",
        proofOfResidence: "residence",
      };

      for (const [key, doc] of Object.entries(profile.documents)) {
        if (doc.file) {
          const formData = new FormData();
          formData.append("file", doc.file);
          await axios.post(`${API_URL}/${profileId}/document/${docMap[key]}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      }

      alert("Profile saved successfully!");
      navigate("/profile");
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Failed to save profile. Check console for details.");
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div style={{ padding: "20px", background: "#f8f9fb", minHeight: "100vh" }}>
      <img src={logo} alt="Logo" style={{ height: "60px", marginBottom: "20px" }} />
      <h2 style={{ textAlign: "center", color: "#007bff" }}>Setup Your Profile</h2>

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
        {/* Profile Picture */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <label style={{ fontWeight: "bold" }}>Profile Picture</label>
          <div style={{ margin: "10px 0" }}>
            {profile.profilePicture.preview ? (
              <img
                src={profile.profilePicture.preview}
                alt="Profile"
                style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  background: "#e9ecef",
                  lineHeight: "120px",
                  color: "#6c757d",
                  display: "inline-block",
                }}
              >
                No Image
              </div>
            )}
          </div>
          <input type="file" name="profilePicture" onChange={handleFileChange} />
        </div>

        {/* Basic Info */}
        {["firstName", "lastName", "idNumber", "licenseNumber", "phoneNumber"].map((f) => (
          <div key={f} style={{ display: "flex", marginBottom: "12px" }}>
            <label style={{ width: "150px", fontWeight: "bold" }}>{f}</label>
            <input
              type="text"
              name={f}
              value={profile[f] || ""}
              onChange={handleChange}
              style={{ flex: 1, padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
          </div>
        ))}

        {/* Address */}
        <h3 style={{ color: "#007bff", marginTop: "20px" }}>Address</h3>
        {["street", "city", "province", "postalCode"].map((f) => (
          <div key={f} style={{ display: "flex", marginBottom: "12px" }}>
            <label style={{ width: "150px", fontWeight: "bold" }}>{f}</label>
            <input
              type="text"
              name={f}
              value={profile.address[f] || ""}
              onChange={handleChange}
              style={{ flex: 1, padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
          </div>
        ))}

        {/* Documents */}
        <h3 style={{ color: "#007bff", marginTop: "20px" }}>Documents</h3>
        {Object.keys(profile.documents).map((f) => (
          <div key={f} style={{ marginBottom: "12px" }}>
            <label style={{ fontWeight: "bold", marginRight: "10px" }}>{f}</label>
            {profile.documents[f].name && (
              <span style={{ color: "green", marginRight: "10px" }}>{profile.documents[f].name}</span>
            )}
            <input type="file" name={f} onChange={handleFileChange} />
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
              background: "#007bff",
              color: "#fff",
              borderRadius: "5px",
              fontWeight: "bold",
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
              background: "#6c757d",
              color: "#fff",
              borderRadius: "5px",
              fontWeight: "bold",
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
