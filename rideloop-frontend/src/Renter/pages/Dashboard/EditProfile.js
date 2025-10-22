/* eslint-disable */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "../../../components/NavBar";
import "../../pagescss/Edit.css";

const API_URL = "http://localhost:8080/rideloopdb/profiles";

const EditProfile = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const userID = storedUser?.userID;
  const jwtToken = localStorage.getItem("jwtToken");
  const headers = { Authorization: `Bearer ${jwtToken}` };

  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const [profile, setProfile] = useState({
    profile_id: null,
    first_name: "",
    last_name: "",
    id_number: "",
    license_number: "",
    phone_number: "",
    street_name: "",
    suburb: "",
    province: "",
    zip_code: "",
    profile_picture: null,
    documents: {
      id_document: null,
      license_doc: null,
      id_copy: null,
      proof_of_residence: null,
    },
  });

  // Fetch profile
  useEffect(() => {
    if (!userID || !jwtToken) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/user/${userID}`, { headers });
        if (data) {
          setProfile({
            profile_id: data.profileID || null,
            first_name: data.firstName || "",
            last_name: data.lastName || "",
            id_number: data.idNumber || "",
            license_number: data.licenseNumber || "",
            phone_number: data.phoneNumber || "",
            street_name: data.address?.streetName || "",
            suburb: data.address?.suburb || "",
            province: data.address?.province || "",
            zip_code: data.address?.zipCode || "",
            profile_picture: null,
            documents: {
              id_document: null,
              license_doc: null,
              id_copy: null,
              proof_of_residence: null,
            },
          });
        }
      } catch (err) {
        console.warn("Error fetching profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userID, jwtToken]);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file uploads (only preview profile picture)
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (!files?.length) return;

    const file = files[0];
    if (name === "profile_picture") {
      setProfile((prev) => ({ ...prev, profile_picture: file }));
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setProfile((prev) => ({
        ...prev,
        documents: { ...prev.documents, [name]: file },
      }));
    }
  };

  // Save profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userID || !jwtToken) return alert("User not logged in");

    try {
      const profileData = {
        firstName: profile.first_name,
        lastName: profile.last_name,
        idNumber: profile.id_number,
        licenseNumber: profile.license_number,
        phoneNumber: profile.phone_number,
        address: {
          streetName: profile.street_name,
          suburb: profile.suburb,
          province: profile.province,
          zipCode: profile.zip_code,
        },
      };

      const response = profile.profile_id
        ? await axios.put(`${API_URL}/${profile.profile_id}`, profileData, { headers })
        : await axios.post(`${API_URL}/user/${userID}`, profileData, { headers });

      const savedProfile = response.data;
      const profileId = savedProfile.profileID;

      const uploadFile = async (endpoint, file) => {
        const formData = new FormData();
        formData.append("file", file);
        await axios.post(endpoint, formData, {
          headers: { ...headers, "Content-Type": "multipart/form-data" },
        });
      };

      // Upload profile picture
      if (profile.profile_picture) {
        await uploadFile(`${API_URL}/${profileId}/document/profile-picture`, profile.profile_picture);
      }

      // Upload documents
      const docMap = {
        id_document: "id",
        license_doc: "license",
        id_copy: "id-copy",
        proof_of_residence: "residence",
      };

      for (const [key, file] of Object.entries(profile.documents)) {
        if (file) await uploadFile(`${API_URL}/${profileId}/document/${docMap[key]}`, file);
      }

      alert("Profile saved successfully!");
      navigate("/RenterDashboard");
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Error saving profile");
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="edit-profile-container">
      <NavBar />
      <div className="edit-profile-card">
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit} className="edit-profile-form">
           <label>Profile Picture</label>
            <input type="file" name="profile_picture" accept="image/*" onChange={handleFileChange} />
            {previewImage && (
              <img src={previewImage} alt="Profile Preview" className="preview-img" />
            )}{/* Personal Info */}
          <div className="form-section">
            <h3>Personal Information</h3>
            <input type="text" name="first_name" value={profile.first_name} onChange={handleChange} placeholder="First Name" />
            <input type="text" name="last_name" value={profile.last_name} onChange={handleChange} placeholder="Last Name" />
            <input type="text" name="id_number" value={profile.id_number} onChange={handleChange} placeholder="ID Number" />
            <input type="text" name="license_number" value={profile.license_number} onChange={handleChange} placeholder="License Number" />
            <input type="text" name="phone_number" value={profile.phone_number} onChange={handleChange} placeholder="Phone Number" />
          </div>

          {/* Address */}
          <div className="form-section">
            <h3>Address</h3>
            <input type="text" name="street_name" value={profile.street_name} onChange={handleChange} placeholder="Street Name" />
            <input type="text" name="suburb" value={profile.suburb} onChange={handleChange} placeholder="Suburb" />
            <input type="text" name="province" value={profile.province} onChange={handleChange} placeholder="Province" />
            <input type="text" name="zip_code" value={profile.zip_code} onChange={handleChange} placeholder="Zip Code" />
          </div>

          {/* Documents */}
          <div className="form-section">
            <h3>Documents Upload</h3>

           

            <label>ID Document</label>
            <input type="file" name="id_document" onChange={handleFileChange} />

            <label>License Document</label>
            <input type="file" name="license_doc" onChange={handleFileChange} />

            <label>ID Copy</label>
            <input type="file" name="id_copy" onChange={handleFileChange} />

            <label>Proof of Residence</label>
            <input type="file" name="proof_of_residence" onChange={handleFileChange} />
          </div>

          <button type="submit" className="primary-btn">Save Profile</button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
