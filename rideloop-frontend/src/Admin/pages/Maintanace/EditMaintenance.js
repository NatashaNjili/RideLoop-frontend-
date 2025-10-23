// src/pages/admin/maintenance/EditMaintenance.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchInsuranceById, updateInsurance } from './MaintenanceSandR';
import '../../pagescss/EditMaintenance.css';

// Same coverage types as in AddMaintenance (optional, but consistent)
const COVERAGE_TYPES = [
  'Comprehensive',
  'Third Party Only',
  'Third Party, Fire and Theft',
  'Collision',
  'Liability Only',
  'Basic Liability + Extras',
];

const EditMaintenance = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    insuranceCompanyName: '',
    contactPerson: '',
    contactNumber: '',
    coverageType: '',
    costPerMonth: '',
    description: '',
  });

  // Per-field errors
  const [errors, setErrors] = useState({
    insuranceCompanyName: '',
    contactPerson: '',
    contactNumber: '',
    coverageType: '',
    costPerMonth: '',
    description: '',
  });

  // Validation helpers (same as AddMaintenance)
  const validateContactPerson = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return 'Contact person is required.';
    const words = trimmed.split(/\s+/);
    if (words.length < 2) return 'Enter full name (at least first and last name).';
    const allCapitalized = words.every(
      (word) => word.length > 0 && word[0] === word[0].toUpperCase() && word.length > 1
    );
    if (!allCapitalized) return 'Each name must start with a capital letter.';
    return '';
  };

  const validateContactNumber = (value) => {
    if (!value) return 'Contact number is required.';
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(value)) return 'Must be a 10-digit number starting with 0.';
    return '';
  };

  const validateCost = (value) => {
    if (!value) return 'Cost is required.';
    const num = Number(value);
    if (isNaN(num) || num <= 0) return 'Cost must be greater than 0.';
    return '';
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle blur validation
  const handleBlur = (field, value) => {
    let error = '';
    switch (field) {
      case 'contactPerson':
        error = validateContactPerson(value);
        break;
      case 'contactNumber':
        error = validateContactNumber(value);
        break;
      case 'costPerMonth':
        error = validateCost(value);
        break;
      case 'insuranceCompanyName':
        error = value.trim() ? '' : 'Company name is required.';
        break;
      case 'coverageType':
        error = value ? '' : 'Coverage type is required.';
        break;
      case 'description':
        error = value.trim() ? '' : 'Description is required.';
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  // Load insurance data
  useEffect(() => {
    if (!id) {
      setError('Invalid ID. Cannot load insurance details.');
      setLoading(false);
      return;
    }

    const loadInsurance = async () => {
      try {
        const data = await fetchInsuranceById(id);
        setFormData({
          insuranceCompanyName: data.insuranceCompanyName ?? '',
          contactPerson: data.contactPerson ?? '',
          contactNumber: data.contactNumber ?? '',
          coverageType: data.coverageType ?? '',
          costPerMonth: data.costPerMonth?.toString() ?? '',
          description: data.description ?? '',
        });
      } catch (err) {
        setError(err.message || 'Failed to load insurance details.');
      } finally {
        setLoading(false);
      }
    };

    loadInsurance();
  }, [id]);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Re-validate all fields
    const newErrors = {
      insuranceCompanyName: formData.insuranceCompanyName.trim() ? '' : 'Company name is required.',
      contactPerson: validateContactPerson(formData.contactPerson),
      contactNumber: validateContactNumber(formData.contactNumber),
      coverageType: formData.coverageType ? '' : 'Coverage type is required.',
      costPerMonth: validateCost(formData.costPerMonth),
      description: formData.description.trim() ? '' : 'Description is required.',
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err !== '')) {
      return;
    }

    try {
      await updateInsurance(id, {
        ...formData,
        costPerMonth: Number(formData.costPerMonth),
      });
      navigate('/Maintenance', { state: { success: 'Insurance updated successfully!' } });
    } catch (err) {
      setError(err.message || 'Update failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="edit-insurance-page">
        <h2>Edit Insurance Company</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="edit-insurance-page">
      <h2>Edit Insurance Company</h2>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="insurance-form">
        {/* Company Name */}
        <div className="form-group">
          <label>Company Name</label>
          <input
            type="text"
            name="insuranceCompanyName"
            value={formData.insuranceCompanyName}
            onChange={handleChange}
            onBlur={() => handleBlur('insuranceCompanyName', formData.insuranceCompanyName)}
            placeholder="e.g., ABC Insurance"
          />
          {errors.insuranceCompanyName && <p className="error-msg">{errors.insuranceCompanyName}</p>}
        </div>

        {/* Contact Person */}
        <div className="form-group">
          <label>Contact Person</label>
          <input
            type="text"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleChange}
            onBlur={() => handleBlur('contactPerson', formData.contactPerson)}
            placeholder="e.g., Natasha Njili"
          />
          {errors.contactPerson && <p className="error-msg">{errors.contactPerson}</p>}
        </div>

        {/* Contact Number */}
        <div className="form-group">
          <label>Contact Number</label>
          <input
            type="tel"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            onBlur={() => handleBlur('contactNumber', formData.contactNumber)}
            placeholder="e.g., 0771234567"
          />
          {errors.contactNumber && <p className="error-msg">{errors.contactNumber}</p>}
        </div>

        {/* Coverage Type (Dropdown for consistency) */}
        <div className="form-group">
          <label>Coverage Type</label>
          <select
            name="coverageType"
            value={formData.coverageType}
            onChange={handleChange}
            onBlur={() => handleBlur('coverageType', formData.coverageType)}
          >
            <option value="">Select a coverage type</option>
            {COVERAGE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.coverageType && <p className="error-msg">{errors.coverageType}</p>}
        </div>

        {/* Cost Per Month */}
        <div className="form-group">
          <label>Cost Per Month (LKR)</label>
          <input
            type="number"
            name="costPerMonth"
            value={formData.costPerMonth}
            onChange={handleChange}
            onBlur={() => handleBlur('costPerMonth', formData.costPerMonth)}
            min="0"
            step="0.01"
            placeholder="e.g., 1500.00"
          />
          {errors.costPerMonth && <p className="error-msg">{errors.costPerMonth}</p>}
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            onBlur={() => handleBlur('description', formData.description)}
            rows="3"
            placeholder="e.g., Covers all damages including accidents and theft"
          />
          {errors.description && <p className="error-msg">{errors.description}</p>}
        </div>

        {/* Buttons */}
        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate('/Maintenance')}
          >
            Cancel
          </button>
          <button type="submit" className="save-btn">
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMaintenance;