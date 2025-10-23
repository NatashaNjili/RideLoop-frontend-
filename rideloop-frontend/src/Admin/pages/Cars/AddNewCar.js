import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../pagescss/AddMaintenance.css';
import { createCar } from './CarSandR';
import { fetchLocationById } from '../../../Common/pages/Location/LocationSandR';

// Predefined car categories
const CAR_CATEGORIES = [
  'Sedan',
  'SUV',
  'Hatchback',
  'Pickup Truck',
  'Coupe',
  'Convertible',
  'Minivan',
  'Crossover',
  'Van',
  'Electric Vehicle (EV)',
  'Hybrid',
];

// Car status options
const STATUS_OPTIONS = [
  { value: 'available', label: 'Available' },
  { value: 'rented', label: 'Rented' },
  { value: 'in_maintenance', label: 'In Maintenance' },
  { value: 'written_off', label: 'Written Off' },
];

const AddNewCar = () => {
  const navigate = useNavigate();

  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [rentalRate, setRentalRate] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('available');
  const [officeLocation, setOfficeLocation] = useState(null);
  const [lastMaintenance, setLastMaintenance] = useState('');
  const [maintenanceDue, setMaintenanceDue] = useState('');

  // Per-field error tracking
  const [errors, setErrors] = useState({
    brand: '',
    model: '',
    year: '',
    licensePlate: '',
    rentalRate: '',
    category: '',
  });

  // Validation functions
  const validateBrand = (value) => {
    if (!value.trim()) return 'Brand is required.';
    if (!/^[A-Z]/.test(value)) return 'Brand must start with a capital letter.';
    return '';
  };

  const validateModel = (value) => {
    if (!value.trim()) return 'Model is required.';
    if (!/^[A-Z]/.test(value)) return 'Model must start with a capital letter.';
    if (!/^[A-Za-z\s]+$/.test(value)) return 'Model must contain only letters and spaces.';
    return '';
  };

  const validateYear = (value) => {
    if (!value) return 'Year is required.';
    const currentYear = new Date().getFullYear();
    if (!/^\d{4}$/.test(value)) return 'Year must be a 4-digit number.';
    const num = Number(value);
    if (isNaN(num) || num < 1900 || num > currentYear) return `Year must be between 1900 and ${currentYear}.`;
    return '';
  };

  const validateLicensePlate = (value) => {
    if (!value) return 'License plate is required.';
    if (value.length !== 8) return 'License plate must be exactly 8 characters.';
    return '';
  };

  const validateRentalRate = (value) => {
    if (!value) return 'Rental rate is required.';
    const num = Number(value);
    if (isNaN(num) || num <= 0) return 'Rental rate must be a positive number.';
    return '';
  };

  const validateCategory = (value) => {
    if (!value) return 'Please select a category.';
    return '';
  };

  const handleBlur = (field, value) => {
    let error = '';
    switch (field) {
      case 'brand':
        error = validateBrand(value);
        break;
      case 'model':
        error = validateModel(value);
        break;
      case 'year':
        error = validateYear(value);
        break;
      case 'licensePlate':
        error = validateLicensePlate(value);
        break;
      case 'rentalRate':
        error = validateRentalRate(value);
        break;
      case 'category':
        error = validateCategory(value);
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  // Load default dates & office location
  useEffect(() => {
    const loadData = async () => {
      const today = new Date();
      const lastMaint = new Date(today);
      lastMaint.setDate(today.getDate() - 5);
      setLastMaintenance(lastMaint.toISOString().split('T')[0]);

      const dueDate = new Date(today);
      dueDate.setFullYear(today.getFullYear() + 1);
      setMaintenanceDue(dueDate.toISOString().split('T')[0]);

      try {
        const location = await fetchLocationById(652);
        setOfficeLocation(location);
      } catch (err) {
        console.error('❌ Failed to load office location:', err);
        setOfficeLocation({ latitude: -25.7461, longitude: 28.1881 }); // Pretoria fallback
      }
    };
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Re-validate all fields on submit
    const newErrors = {
      brand: validateBrand(brand),
      model: validateModel(model),
      year: validateYear(year),
      licensePlate: validateLicensePlate(licensePlate),
      rentalRate: validateRentalRate(rentalRate),
      category: validateCategory(category),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err !== '')) {
      return;
    }

    if (!officeLocation) {
      alert('Office location is not available. Cannot add car.');
      return;
    }

    try {
      await createCar({
        brand: brand.trim(),
        model: model.trim(),
        year: Number(year),
        licensePlate: licensePlate.trim(),
        rentalRate: Number(rentalRate),
        status,
        category,
        mileage: 0,
        lastMaintenance,
        maintenanceDue,
        location: {
          latitude: officeLocation.latitude,
          longitude: officeLocation.longitude,
        },
      });

      alert('Car added successfully!');
      navigate('/ManageCars');
    } catch (err) {
      console.error('Car creation failed:', err);
      alert('Failed to add car. Please try again.');
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
      <form
        className="add-maintenance-form add-maintenance-container"
        onSubmit={handleSubmit}
        style={{ marginTop: 60 }}
      >
        <h2 style={{ color: '#007bff', fontSize: '1.3rem', marginBottom: 18 }}>
          Add New Car
        </h2>

        {/* Brand */}
        <div className="form-group">
          <label className="register-label">Brand</label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            onBlur={() => handleBlur('brand', brand)}
            placeholder="e.g., Toyota"
            className="register-input"
          />
          {errors.brand && <p className="error-msg">{errors.brand}</p>}
        </div>

        {/* Model */}
        <div className="form-group">
          <label className="register-label">Model</label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            onBlur={() => handleBlur('model', model)}
            placeholder="e.g., Corolla"
            className="register-input"
          />
          {errors.model && <p className="error-msg">{errors.model}</p>}
        </div>

        {/* Year */}
        <div className="form-group">
          <label className="register-label">Year</label>
          <input
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            onBlur={() => handleBlur('year', year)}
            placeholder="e.g., 2023"
            className="register-input"
            maxLength="4"
          />
          {errors.year && <p className="error-msg">{errors.year}</p>}
        </div>

        {/* License Plate */}
        <div className="form-group">
          <label className="register-label">License Plate</label>
          <input
            type="text"
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value)}
            onBlur={() => handleBlur('licensePlate', licensePlate)}
            placeholder="e.g., ABC12345"
            className="register-input"
            maxLength="8"
          />
          {errors.licensePlate && <p className="error-msg">{errors.licensePlate}</p>}
        </div>

        {/* Rental Rate */}
        <div className="form-group">
          <label className="register-label">Rental Rate (LKR)</label>
          <input
            type="number"
            value={rentalRate}
            onChange={(e) => setRentalRate(e.target.value)}
            onBlur={() => handleBlur('rentalRate', rentalRate)}
            placeholder="e.g., 1500"
            className="register-input"
            min="0"
            step="0.01"
          />
          {errors.rentalRate && <p className="error-msg">{errors.rentalRate}</p>}
        </div>

        {/* Category Dropdown */}
        <div className="form-group">
          <label className="register-label">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            onBlur={() => handleBlur('category', category)}
            className="register-input"
          >
            <option value="">Select a category</option>
            {CAR_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <p className="error-msg">{errors.category}</p>}
        </div>

        {/* Status Dropdown */}
        <div className="form-group">
          <label className="register-label">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="register-input"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <small style={{ color: 'gray', fontSize: '0.8rem' }}>
            Choose the current status of the car
          </small>
        </div>

        {/* Mileage (read-only) */}
        <div className="form-group">
          <label className="register-label">Mileage</label>
          <input type="number" value="0" className="register-input" readOnly />
          <small style={{ color: 'gray', fontSize: '0.8rem' }}>New cars start at 0 km</small>
        </div>

        {/* Last Maintenance */}
        <div className="form-group">
          <label className="register-label">Last Maintenance</label>
          <input
            type="date"
            value={lastMaintenance}
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

        <button type="submit" className="submit-btn">
          Add Car
        </button>
      </form>
    </div>
  );
};

export default AddNewCar;