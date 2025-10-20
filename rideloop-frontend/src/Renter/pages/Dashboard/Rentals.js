// src/Renter/pages/Dashboard/Rentals.js
import React, { useEffect, useState } from 'react';
import RentalAction from '../Rides/RentalAction';
import { fetchCarById } from '../../../Admin/pages/Cars/CarSandR';
import { FaEllipsisV, FaEdit, FaTrash } from 'react-icons/fa';
import '../../pagescss/Rentals.css';

const Rentals = () => {
  const [rentalItems, setRentalItems] = useState([]); // { rental, car }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [quickStats, setQuickStats] = useState({ trips: 0, distance: 0, spent: 0 });

  useEffect(() => {
    const fetchRentalsWithCars = async () => {
      setLoading(true);
      setError('');
      try {
        const rentals = await RentalAction.getRentalsForUser();

        if (!Array.isArray(rentals) || rentals.length === 0) {
          setRentalItems([]);
          setQuickStats({ trips: 0, distance: 0, spent: 0 });
          setLoading(false);
          return;
        }

        // Fetch car details
        const rentalsWithCars = await Promise.all(
          rentals.map(async (rental) => {
            try {
              const car = await fetchCarById(rental.carID);
              return { rental, car };
            } catch (err) {
              console.warn(`Car not found for ID: ${rental.carID}`);
              return { rental, car: null };
            }
          })
        );

        setRentalItems(rentalsWithCars);

        // 🔢 Calculate stats from rentals
        const trips = rentals.length;
        const distance = rentals.reduce((sum, r) => sum + (r.distanceInKm || 0), 0);
        const spent = rentals.reduce((sum, r) => sum + (parseFloat(r.totalCost) || 0), 0);

        setQuickStats({
          trips,
          distance: parseFloat(distance.toFixed(2)),
          spent: parseFloat(spent.toFixed(2)),
        });
      } catch (err) {
        setError('Failed to load your rental history.');
        console.error(err);
        setQuickStats({ trips: 0, distance: 0, spent: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchRentalsWithCars();
  }, []);

  useEffect(() => {
    const handleClick = () => {
      if (dropdownOpen !== null) setDropdownOpen(null);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [dropdownOpen]);

  const handleView = (id) => {
    alert(`View details for Rental #${id}`);
    setDropdownOpen(null);
  };

  const handleCancel = (id) => {
    if (window.confirm('Are you sure you want to cancel this rental?')) {
      alert(`Cancellation not implemented for Rental #${id}`);
      setDropdownOpen(null);
    }
  };

  return (
    <div className="rentals-container">
      <div className="rentals-header">
        <h2>Your Rental History</h2>
      </div>

      {/* ✅ Quick stats now appear RIGHT AFTER the heading */}
      <section className="quick-stats">
        <div className="stat-card">
          <h4>Total Trips</h4>
          <p>{quickStats.trips}</p>
        </div>
        <div className="stat-card">
          <h4>Distance Driven (km)</h4>
          <p>{quickStats.distance}</p>
        </div>
        <div className="stat-card">
          <h4>Amount Spent (ZAR)</h4>
          <p>R{quickStats.spent.toFixed(2)}</p>
        </div>
      </section>

      {loading ? (
        <p>Loading your rentals...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : rentalItems.length === 0 ? (
        <p>No rentals found.</p>
      ) : (
        <div className="rental-list">
          {rentalItems.map(({ rental, car }) => (
            <div className="rental-card" key={rental.rentalID}>
              <div className="rental-card-header">
                <h3>Rental #{rental.rentalID}</h3>
                <div className="menu-container" onClick={(e) => e.stopPropagation()}>
                  <FaEllipsisV
                    className="menu-dots"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen(
                        dropdownOpen === rental.rentalID ? null : rental.rentalID
                      );
                    }}
                  />
                  {dropdownOpen === rental.rentalID && (
                    <div className="dropdown-menu">
                      <button onClick={() => handleView(rental.rentalID)}>
                        <FaEdit /> View
                      </button>
                      <button onClick={() => handleCancel(rental.rentalID)}>
                        <FaTrash /> Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {car ? (
                <p><strong>Car:</strong> {car.brand} {car.model} ({car.year})</p>
              ) : (
                <p><strong>Car:</strong> Car ID #{rental.carID}</p>
              )}

              <p><strong>Date:</strong> {rental.date}</p>
              <p><strong>Total Paid:</strong> R{Number(rental.totalCost).toFixed(2)}</p>

              {/* Only show distance if it exists */}
              {typeof rental.distanceInKm === 'number' && (
                <p><strong>Distance:</strong> {rental.distanceInKm.toFixed(2)} km</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Rentals;