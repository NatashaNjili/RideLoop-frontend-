// src/Renter/pages/Dashboard/Rentals.js
import React, { useEffect, useState } from 'react';
import RentalAction from '../Rides/RentalAction';
import { fetchCarById } from '../../../Admin/pages/Cars/CarSandR'; // Reuse existing
import { FaEllipsisV, FaEdit, FaTrash } from 'react-icons/fa';
import '../../pagescss/Rentals.css';

// Helper: Calculate distance from pickup & dropoff location IDs (if you store coords)
// But since you don't have coords here, we'll skip distance unless backend sends it.
// Alternative: Store distance in rental table (recommended)

const Rentals = () => {
  const [rentalItems, setRentalItems] = useState([]); // Will hold { rental, car }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(null);

  useEffect(() => {
    const fetchRentalsWithCars = async () => {
      setLoading(true);
      setError('');
      try {
        // 1. Fetch rentals
        const rentals = await RentalAction.getRentalsForUser();

        if (!Array.isArray(rentals) || rentals.length === 0) {
          setRentalItems([]);
          setLoading(false);
          return;
        }

        // 2. Fetch car details for each rental
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
      } catch (err) {
        setError('Failed to load your rental history.');
        console.error(err);
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

  // Optional: If you store distance in rental (e.g., rental.distanceInKm), use it.
  // Otherwise, you can't compute it here without location coordinates.
  // Recommendation: Add `distanceInKm` to your Rental entity.

  return (
    <div className="rentals-container">
      <div className="rentals-header">
        <h2>Your Rental History</h2>
      </div>

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
                <div
                  className="menu-container"
                  onClick={(e) => e.stopPropagation()}
                >
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

              {/* Car Info */}
              {car ? (
                <p><strong>Car:</strong> {car.brand} {car.model} ({car.year})</p>
              ) : (
                <p><strong>Car:</strong> Car ID #{rental.carID}</p>
              )}

              {/* Date */}
              <p><strong>Date:</strong> {rental.date}</p>

              {/* Cost */}
              <p><strong>Total Paid:</strong> R{Number(rental.totalCost).toFixed(2)}</p>

            
                <p><strong>Distance:</strong> {rental.distanceInKm.toFixed(2)} km</p>
              

              
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Rentals;