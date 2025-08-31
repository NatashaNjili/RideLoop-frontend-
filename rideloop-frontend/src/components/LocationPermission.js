import React from "react";
import "./LocationPermission.css";

const LocationPermission = ({ setCoords }) => {
  const handleClick = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude }); // 🔹 send location up
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          alert("Oops! You denied location access.");
        } else {
          alert("Unable to retrieve your location.");
        }
      }
    );
  };

  return (
    <div className="location-permission">
      <button className="location-link" onClick={handleClick}>
        Share Your Location
      </button>
    </div>
  );
};

export default LocationPermission;


