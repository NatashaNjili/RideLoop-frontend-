import React from "react";
import "./CarCard.css";

const placeholderImage = "https://via.placeholder.com/150x100?text=Car+Image";

const CarCard = ({ car }) => {
  return (
    <div className="car-card">
      <img
        src={placeholderImage}
        alt={`${car.brand} ${car.model}`} // ✅ Correct template literal usage
        className="car-image"
      />
      <div className="car-details">
        <h3>{car.brand}</h3>
        <p>{car.model}</p>
        <p>Year: {car.year}</p>
        <p>Rate: ${car.rate}/day</p>
        <button className="details-button">View Details</button>
      </div>
    </div>
  );
};

export default CarCard;
