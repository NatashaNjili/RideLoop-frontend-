import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../pagescss/AddMaintenance.css';
import { createCar } from './CarSandR';
import { fetchLocationById } from '../../../Common/pages/Location/LocationSandR';
const AddNewCar = () => {
  const navigate = useNavigate();
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [rentalRate, setRentalRate] = useState('');
  const [category, setCategory] = useState('');
  const [mileage, setMileage] = useState('0');
  const [lastMaintenance, setLastMaintenance] = useState('');
  const [maintenanceDue, setMaintenanceDue] = useState('');
  const [officeLocation, setOfficeLocation] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const STATUS = 'available'; // ✅ Default status

  // 🔧 Load maintenance dates and office location on mount
  useEffect(() => {
    const loadData = async () => {
      // Set maintenance dates
      const today = new Date();
      const lastMaint = new Date(today);
      lastMaint.setDate(today.getDate() - 5);
      setLastMaintenance(lastMaint.toISOString().split('T')[0]);

      const dueDate = new Date(today);
      dueDate.setFullYear(today.getFullYear() + 1);
      setMaintenanceDue(dueDate.toISOString().split('T')[0]);

      // Fetch office location (ID 652)
      try {
        const location = await fetchLocationById(652);
        console.log('📍 Office location loaded:', location);
        setOfficeLocation(location);
      } catch (err) {
        console.error('❌ Failed to load office location:', err);
        setError('Could not load office location. Using default.');
        // Fallback: Pretoria or Johannesburg
        setOfficeLocation({ latitude: -25.7461, longitude: 28.1881 });
      }
    };

    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate required fields (status is automatic)
    if (!brand || !model || !year || !licensePlate || !rentalRate || !category) {
      setError('Please fill in all required fields.');
      return;
    }

    if (isNaN(Number(year))) {
      setError('Year must be a number.');
      return;
    }
    if (isNaN(Number(rentalRate))) {
      setError('Rental rate must be a number.');
      return;
    }

    if (!officeLocation) {
      setError('Location data not available. Cannot add car.');
      return;
    }

    try {
      await createCar({
        brand,
        model,
        year: Number(year),
        licensePlate,
        rentalRate: Number(rentalRate),
        status: STATUS, // ✅ Hardcoded to 'available'
        category,
        mileage: 0,
        lastMaintenance,
        maintenanceDue,
        location: {
          latitude: officeLocation.latitude,
          longitude: officeLocation.longitude,
        },
      });

      setSuccess('Car added successfully!');

      // Reset form
      setBrand('');
      setModel('');
      setYear('');
      setLicensePlate('');
      setRentalRate('');
      setCategory('');

      // Redirect
      setTimeout(() => navigate('/ManageCars'), 1200);
    } catch (err) {
      setError('Failed to add car. Please try again.');
    }
  };

  if (!officeLocation) {
    return (
      <div className="App">
        <p>Loading office location...</p>
      </div>
    );
  }

  return (
    <div className="App">
      {/* Back Button */}
      <div style={{ position: 'absolute', top: 24, left: 24, zIndex: 10 }}>
        <button
          type="button"
          onClick={() => navigate('/ManageCars')}
          style={{
            background: 'none',
            border: 'none',
            color: '#007bff',
            fontSize: 18,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 22, marginRight: 4 }}>&larr;</span> Back
        </button>
      </div>

      {/* Form */}
      <form className="add-maintenance-form add-maintenance-container" onSubmit={handleSubmit} style={{ marginTop: 60 }}>
        <h2 style={{ color: '#007bff', fontSize: '1.3rem', marginBottom: 18 }}>Add New Car</h2>
        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

        <div className="form-group">
          <label className="register-label">Brand</label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Enter brand"
            className="register-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="register-label">Model</label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Enter model"
            className="register-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="register-label">Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Enter year"
            className="register-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="register-label">License Plate</label>
          <input
            type="text"
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value)}
            placeholder="Enter license plate"
            className="register-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="register-label">Rental Rate</label>
          <input
            type="number"
            value={rentalRate}
            onChange={(e) => setRentalRate(e.target.value)}
            placeholder="Enter rental rate"
            className="register-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="register-label">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Sedan, SUV"
            className="register-input"
            required
          />
        </div>

        {/* Mileage */}
        <div className="form-group">
          <label className="register-label">Mileage</label>
          <input type="number" value="0" className="register-input" readOnly />
          <small style={{ color: 'gray', fontSize: '0.8rem' }}>New cars start at 0 km</small>
        </div>

        {/* Status - Auto "available" */}
        <div className="form-group">
          <label className="register-label">Status</label>
          <input
            type="text"
            value={STATUS}
            className="register-input"
            readOnly
          />
          <small style={{ color: 'gray', fontSize: '0.8rem' }}>All new cars are marked as available</small>
        </div>

        {/* Last Maintenance */}
        <div className="form-group">
          <label className="register-label">Last Maintenance</label>
          <input
            type="date"
            value={lastMaintenance}
            onChange={(e) => setLastMaintenance(e.target.value)}
            className="register-input"
            readOnly
          />
          <small style={{ color: 'gray', fontSize: '0.8rem' }}>Auto-set to 5 days ago</small>
        </div>

        {/* Maintenance Due */}
        <div className="form-group">
          <label className="register-label">Maintenance Due</label>
          <input
            type="date"
            value={maintenanceDue}
            onChange={(e) => setMaintenanceDue(e.target.value)}
            className="register-input"
            readOnly
          />
          <small style={{ color: 'gray', fontSize: '0.8rem' }}>Auto-set to 1 year from today</small>
        </div>

        {/* Office Location */}
        <div className="form-group">
          <label className="register-label">Initial Location</label>
          <input
            type="text"
            value={`Lat: ${officeLocation.latitude}, Lng: ${officeLocation.longitude}`}
            className="register-input"
            readOnly
          />
          <small style={{ color: 'gray', fontSize: '0.8rem' }}>Office location (ID: 652)</small>
        </div>

        <button type="submit">Add Car</button>
      </form>
    </div>
  );
};

export default AddNewCar;