
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../pagescss/CarList.css';
import { fetchAllCars, deleteCar } from './CarSandR';
import { FaEdit, FaTrash } from 'react-icons/fa';

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchCars = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAllCars();
      setCars(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to fetch cars.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleUpdate = (carId) => {
    navigate(`/EditCar/${carId}`);
  };

  const handleDelete = async (carId) => {
    if (!window.confirm('Are you sure you want to delete this car?')) return;

    try {
      await deleteCar(carId);
      setCars((prev) => prev.filter((car) => car.id !== carId));
      alert('Car deleted successfully.');
    } catch (err) {
      setError('Failed to delete car. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="car-list-container">
      <h2>Car List</h2>

      {error && <p className="error-msg">{error}</p>}

      {loading ? (
        <p>Loading cars...</p>
      ) : cars.length === 0 ? (
        <p>No cars available.</p>
      ) : (
        <div className="car-list">
          {cars.map((car) => (
          
            <div className="car-card" key={car.id}>
              {/* Car Header with Action Icons */}
              <div className="car-card-header">
                <h3>
                  {car.brand} {car.model} ({car.year})
                </h3>
                <div className="car-actions">
                  <button
                    className="action-btn edit"
                    onClick={() => handleUpdate(car.carId)}
                    aria-label="Edit car"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => handleDelete(car.id)}
                    aria-label="Delete car"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              {/* Car Details */}
              <p><b>License Plate:</b> {car.licensePlate}</p>
              <p><b>Rental Rate:</b> R{car.rentalRate}</p>
              <p>
                <b>Status:</b>{' '}
                <span className={`status status-${car.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                  {car.status}
                </span>
              </p>
              <p><b>Category:</b> {car.category}</p>
              <p><b>Mileage:</b> {car.mileage?.toLocaleString() || 0} km</p>
              <p><b>Last Maintenance:</b> {car.lastMaintenance}</p>
              <p><b>Maintenance Due:</b> {car.maintenanceDue}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CarList;