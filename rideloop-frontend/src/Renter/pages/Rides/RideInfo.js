// RideInfo.js
import React from "react";
import '../../pagescss/RideInfo.css'; // 

const RideInfo = ({ car, onAccept, onDecline }) => {
  if (!car) return null;

  return (
    <div className="rideinfo-popup">
      <h3 className="rideinfo-title">🚗 Ready to Rent?</h3>
      <div className="rideinfo-car-details">
        <strong>{car.brand} {car.model}</strong><br />
        Year: {car.year}<br />
        Plate: {car.licensePlate}<br />
        <span className="rideinfo-price">
          💵 R{car.rentalRate}/km
        </span>
      </div>

      <div className="rideinfo-buttons">
        <button
          onClick={onAccept}
          className="rideinfo-btn rideinfo-btn-accept"
        >
          ✅ Accept
        </button>
        <button
          onClick={onDecline}
          className="rideinfo-btn rideinfo-btn-decline"
        >
          ❌ Decline
        </button>
      </div>
    </div>
  );
};

export default RideInfo;