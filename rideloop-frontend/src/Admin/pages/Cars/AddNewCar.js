
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../pagescss/AddMaintenance.css';
import { createCar } from './CarSandR';

const AddNewCar = () => {
  const navigate = useNavigate();
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [rentalRate, setRentalRate] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [mileage, setMileage] = useState('');
  const [lastMaintenance, setLastMaintenance] = useState('');
  const [maintenanceDue, setMaintenanceDue] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!brand || !model || !year || !licensePlate || !rentalRate || !status || !category || !mileage || !lastMaintenance || !maintenanceDue || !latitude || !longitude) {
      setError('All fields are required.');
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
    if (isNaN(Number(mileage))) {
      setError('Mileage must be a number.');
      return;
    }
    if (isNaN(Number(latitude)) || isNaN(Number(longitude))) {
      setError('Latitude and longitude must be numbers.');
      return;
    }
    try {
      await createCar({
        brand,
        model,
        year: Number(year),
        licensePlate,
        rentalRate: Number(rentalRate),
        status,
        category,
        mileage: Number(mileage),
        lastMaintenance,
        maintenanceDue,
        location: {
          latitude: Number(latitude),
          longitude: Number(longitude)
        }
      });
      setSuccess('Car added successfully!');
      setBrand('');
      setModel('');
      setYear('');
      setLicensePlate('');
      setRentalRate('');
      setCategory('');
      setMileage('');
      setLastMaintenance('');
      setMaintenanceDue('');
      setLatitude('');
      setLongitude('');
      setTimeout(() => navigate('/ManageCars'), 1200);
    } catch (err) {
      setError('Failed to add car.');
    }
  };

  return (
    <div className="App">
      <div style={{ position: 'absolute', top: 24, left: 24, zIndex: 10 }}>
        <button
          type="button"
          onClick={() => navigate('/ManageCars')}
          style={{ background: 'none', border: 'none', color: '#007bff', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <span style={{ fontSize: 22, marginRight: 4 }}>&larr;</span> Back
        </button>
      </div>
      <form className="add-maintenance-form add-maintenance-container" onSubmit={handleSubmit} style={{ marginTop: 60 }}>
        <h2 style={{ color: '#007bff', fontSize: '1.3rem', marginBottom: 18 }}>Add New Car</h2>
        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}
        <div className="form-group">
          <label className="register-label">Brand</label>
          <input type="text" value={brand} onChange={e => setBrand(e.target.value)} placeholder="Enter brand" className="register-input" required />
        </div>
        <div className="form-group">
          <label className="register-label">Model</label>
          <input type="text" value={model} onChange={e => setModel(e.target.value)} placeholder="Enter model" className="register-input" required />
        </div>
        <div className="form-group">
          <label className="register-label">Year</label>
          <input type="number" value={year} onChange={e => setYear(e.target.value)} placeholder="Enter year" className="register-input" required />
        </div>
        <div className="form-group">
          <label className="register-label">License Plate</label>
          <input type="text" value={licensePlate} onChange={e => setLicensePlate(e.target.value)} placeholder="Enter license plate" className="register-input" required />
        </div>
        <div className="form-group">
          <label className="register-label">Rental Rate</label>
          <input type="number" value={rentalRate} onChange={e => setRentalRate(e.target.value)} placeholder="Enter rental rate" className="register-input" required />
        </div>
        <div className="form-group">
          <label className="register-label">Status</label>
          <input type="text" value={status} onChange={e => setStatus(e.target.value)} placeholder="Enter status (e.g. available, rented)" className="register-input" required />
        </div>
        <div className="form-group">
          <label className="register-label">Category</label>
          <input type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="Enter category (e.g. SUV, Sedan)" className="register-input" required />
        </div>
        <div className="form-group">
          <label className="register-label">Mileage</label>
          <input type="number" value={mileage} onChange={e => setMileage(e.target.value)} placeholder="Enter mileage" className="register-input" required />
        </div>
        <div className="form-group">
          <label className="register-label">Last Maintenance</label>
          <input type="text" value={lastMaintenance} onChange={e => setLastMaintenance(e.target.value)} placeholder="Enter last maintenance date" className="register-input" required />
        </div>
        <div className="form-group">
          <label className="register-label">Maintenance Due</label>
          <input type="text" value={maintenanceDue} onChange={e => setMaintenanceDue(e.target.value)} placeholder="Enter maintenance due date" className="register-input" required />
        </div>
        <div className="form-group">
          <label className="register-label">Latitude</label>
          <input type="number" value={latitude} onChange={e => setLatitude(e.target.value)} placeholder="Enter latitude" className="register-input" required />
        </div>
        <div className="form-group">
          <label className="register-label">Longitude</label>
          <input type="number" value={longitude} onChange={e => setLongitude(e.target.value)} placeholder="Enter longitude" className="register-input" required />
        </div>
        <button type="submit">Add Car</button>
      </form>
    </div>
  );
};

export default AddNewCar;
