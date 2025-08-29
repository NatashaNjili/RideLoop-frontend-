import React, { useState } from "react";
import "./LocationPermission.css";

const LocationPermission = ({ setCoords }) => {
  const [message, setMessage] = useState("");

  const handleClick = () => {
  if (!navigator.geolocation) {
    setMessage("Geolocation is not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      setMessage(`Your location: Latitude ${latitude}, Longitude ${longitude}`);
      setCoords({ lat: latitude, lng: longitude }); 
    },
    (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        setMessage("Oops! You denied location access.");
      } else {
        setMessage("Unable to retrieve your location.");
      }
    }
  );
};

  return (
    <div className="location-permission">
      <a href="#!" className="location-link" onClick={handleClick}>
        Share Your Location
      </a>
      {message && <p className="location-message">{message}</p>}
    </div>
  );
};


export default LocationPermission;
