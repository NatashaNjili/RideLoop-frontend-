import React, { useEffect, useState } from 'react';
import '../../pagescss/CarList.css';
import { fetchAllCars } from './CarSandR';

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCars = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAllCars();
      setCars(data);
    } catch (err) {
      setError('Failed to fetch cars.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return (
    <div className="App">
      <div className="car-list-container">
        <h2>Car List</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error-msg">{error}</p>
        ) : cars.length === 0 ? (
          <p>No cars available.</p>
        ) : (
          <div className="car-list">
            {cars.map((car, idx) => (
              <div className="car-card" key={idx}>
                <h3>{car.brand} {car.model} ({car.year})</h3>
                <p><b>License Plate:</b> {car.licensePlate}</p>
                <p><b>Rental Rate:</b> {car.rentalRate}</p>
                <p><b>Status:</b> {car.status}</p>
                <p><b>Category:</b> {car.category}</p>
                <p><b>Mileage:</b> {car.mileage}</p>
                <p><b>Last Maintenance:</b> {car.lastMaintenance}</p>
                <p><b>Maintenance Due:</b> {car.maintenanceDue}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CarList;
