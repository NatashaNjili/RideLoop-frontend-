// src/pages/admin/cars/EditCar.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCarById, updateCar } from './CarSandR';

const EditCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCar = async () => {
      console.log('Car ID from URL:', id);

      if (!id) {
        setError('Car ID is missing from URL.');
        return;
      }

      try {
        const data = await fetchCarById(id);
        // Ensure date strings are in YYYY-MM-DD format for input
        setCar({
          ...data,
          lastMaintenance: formatDateForInput(data.lastMaintenance),
          maintenanceDue: formatDateForInput(data.maintenanceDue),
        });
      } catch (err) {
        setError('Failed to load car details.');
        console.error(err);
      }
    };

    loadCar();
  }, [id]);

  // Format any date string (ISO, timestamp, etc.) to YYYY-MM-DD
  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return isNaN(date) ? '' : date.toISOString().split('T')[0];
  };

  // Handle change to "Last Maintenance" → auto-calculate "Maintenance Due" +12 months
  const handleLastMaintenanceChange = (e) => {
    const lastMaintDate = e.target.value;
    setCar((prev) => {
      const last = new Date(lastMaintDate);
      if (isNaN(last)) return { ...prev, lastMaintenance: lastMaintDate };

      const nextDue = new Date(last);
      nextDue.setMonth(nextDue.getMonth() + 12); // Add 12 months
      const formattedNextDue = nextDue.toISOString().split('T')[0];

      return {
        ...prev,
        lastMaintenance: lastMaintDate,
        maintenanceDue: formattedNextDue, // Auto-set due date
      };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Allow other fields to change (brand, model, etc.)
    setCar({ ...car, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCar(id, car); // Sends updated car (including auto maintenanceDue)
      alert('Car updated successfully!');
      navigate('/ManageCars');
    } catch (err) {
      setError('Failed to update car.');
      console.error(err);
    }
  };

  if (error) return <p style={{ color: 'red', padding: '20px' }}>{error}</p>;
  if (!car) return <p style={{ padding: '20px' }}>Loading car details...</p>;

  return (
    <div className="edit-car-form" style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2>Edit Car</h2>
      {error && <p className="error" style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>
          Brand:
          <input
            type="text"
            name="brand"
            value={car.brand || ''}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </label>

        <label>
          Model:
          <input
            type="text"
            name="model"
            value={car.model || ''}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </label>

        <label>
          Year:
          <input
            type="number"
            name="year"
            value={car.year || ''}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </label>

        <label>
          License Plate:
          <input
            type="text"
            name="licensePlate"
            value={car.licensePlate || ''}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </label>

        <label>
          Rental Rate (R):
          <input
            type="number"
            name="rentalRate"
            value={car.rentalRate || ''}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </label>

        <label>
          Status:
          <select
            name="status"
            value={car.status || ''}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="Available">Available</option>
            <option value="Rented">Rented</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Out of Service">Out of Service</option>
          </select>
        </label>

        <label>
          Category:
          <input
            type="text"
            name="category"
            value={car.category || ''}
            onChange={handleChange}
            style={inputStyle}
          />
        </label>

        {/* Mileage - Read Only */}
        <label>
          Current Mileage (km):
          <input
            type="number"
            value={car.mileage?.toLocaleString() || 0}
            readOnly
            disabled
            style={{ ...inputStyle, backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
          />
        </label>

        {/* Last Maintenance - Editable */}
        <label>
          Last Maintenance Date:
          <input
            type="date"
            name="lastMaintenance"
            value={car.lastMaintenance || ''}
            onChange={handleLastMaintenanceChange} // Triggers auto-calc
            required
            style={inputStyle}
          />
        </label>

        {/* Maintenance Due - Auto-filled, NOT editable */}
        <label>
          Maintenance Due (Auto: +12 months):
          <input
            type="date"
            value={car.maintenanceDue || ''}
            readOnly
            disabled
            style={{
              ...inputStyle,
              backgroundColor: '#e9f5ff',
              fontWeight: '500',
              color: '#004085',
              cursor: 'not-allowed',
            }}
          />
        </label>

        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <button type="submit" style={buttonStyle.primary}>
            Update Car
          </button>
          <button
            type="button"
            onClick={() => navigate('/CarList')}
            style={buttonStyle.secondary}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

// Styles
const inputStyle = {
  padding: '10px',
  margin: '5px 0',
  width: '100%',
  borderRadius: '6px',
  border: '1px solid #ddd',
  fontSize: '14px',
};

const buttonStyle = {
  primary: {
    padding: '10px 16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  secondary: {
    padding: '10px 16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default EditCar;