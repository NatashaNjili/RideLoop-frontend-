import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../pagescss/AddMaintenance.css';
import { sendInsuranceToBackend } from './MaintenanceSandR';

const COVERAGE_TYPES = [
  'Comprehensive',
  'Third Party Only',
  'Third Party, Fire and Theft',
  'Collision',
  'Liability Only',
  'Basic Liability + Extras',
];

const AddMaintenance = () => {
  const navigate = useNavigate();

  // Form state
  const [insuranceCompanyName, setInsuranceCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [coverageType, setCoverageType] = useState('');
  const [costPerMonth, setCostPerMonth] = useState('');
  const [description, setDescription] = useState('');

  // Error state per field
  const [errors, setErrors] = useState({
    insuranceCompanyName: '',
    contactPerson: '',
    contactNumber: '',
    coverageType: '',
    costPerMonth: '',
    description: '',
  });

  // Helper: validate contact person
  const validateContactPerson = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return 'Contact person is required.';
    
    const words = trimmed.split(/\s+/);
    if (words.length < 2) return 'Enter full name (at least first and last name).';

    const allCapitalized = words.every(word => 
      word.length > 0 && word[0] === word[0].toUpperCase() && word.length > 1
    );

    if (!allCapitalized) return 'Each name must start with a capital letter.';
    return '';
  };

  // Helper: validate contact number
  const validateContactNumber = (value) => {
    if (!value) return 'Contact number is required.';
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(value)) return 'Must be a 10-digit number starting with 0.';
    return '';
  };

  // Helper: validate cost
  const validateCost = (value) => {
    if (!value) return 'Cost is required.';
    const num = Number(value);
    if (isNaN(num) || num <= 0) return 'Cost must be greater than 0.';
    return '';
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Re-validate all fields on submit
    const newErrors = {
      insuranceCompanyName: insuranceCompanyName.trim() ? '' : 'Company name is required.',
      contactPerson: validateContactPerson(contactPerson),
      contactNumber: validateContactNumber(contactNumber),
      coverageType: coverageType ? '' : 'Coverage type is required.',
      costPerMonth: validateCost(costPerMonth),
      description: description.trim() ? '' : 'Description is required.',
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some(err => err !== '');
    if (hasError) return;

    const newInsurance = {
      insuranceCompanyName: insuranceCompanyName.trim(),
      contactPerson: contactPerson.trim(),
      contactNumber,
      coverageType,
      costPerMonth: Number(costPerMonth),
      description: description.trim(),
    };

    try {
      await sendInsuranceToBackend(newInsurance);
      alert('Insurance company added successfully!');
      navigate('/Maintenance');
    } catch (err) {
      console.error('Add insurance error:', err);
      alert('Failed to add insurance company. Please try again.');
    }
  };

  return (
    <div className="add-maintenance-page">
      <div className="back-button-container">
        <button
          type="button"
          onClick={() => navigate('/Maintenance')}
          aria-label="Go back to Maintenance List"
        >
          <span aria-hidden="true">←</span> Back
        </button>
      </div>

      <div className="add-maintenance-container">
        <h2>Add Insurance Company</h2>

        <form className="add-maintenance-form" onSubmit={handleSubmit}>
          {/* Company Name */}
          <div className="form-group">
            <label htmlFor="companyName">Company Name</label>
            <input
              id="companyName"
              type="text"
              value={insuranceCompanyName}
              onChange={(e) => setInsuranceCompanyName(e.target.value)}
              onBlur={() => handleBlur('insuranceCompanyName', insuranceCompanyName)}
              placeholder="e.g., ABC Insurance Ltd"
            />
            {errors.insuranceCompanyName && (
              <p className="error-msg">{errors.insuranceCompanyName}</p>
            )}
          </div>

          {/* Contact Person */}
          <div className="form-group">
            <label htmlFor="contactPerson">Contact Person</label>
            <input
              id="contactPerson"
              type="text"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              onBlur={() => handleBlur('contactPerson', contactPerson)}
              placeholder="e.g., Natasha Njili"
            />
            {errors.contactPerson && (
              <p className="error-msg">{errors.contactPerson}</p>
            )}
          </div>

          {/* Contact Number */}
          <div className="form-group">
            <label htmlFor="contactNumber">Contact Number</label>
            <input
              id="contactNumber"
              type="tel"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              onBlur={() => handleBlur('contactNumber', contactNumber)}
              placeholder="e.g., 0771234567"
            />
            {errors.contactNumber && (
              <p className="error-msg">{errors.contactNumber}</p>
            )}
          </div>

          {/* Coverage Type */}
          <div className="form-group">
            <label htmlFor="coverageType">Coverage Type</label>
            <select
              id="coverageType"
              value={coverageType}
              onChange={(e) => setCoverageType(e.target.value)}
              onBlur={() => handleBlur('coverageType', coverageType)}
            >
              <option value="">Select a coverage type</option>
              {COVERAGE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.coverageType && (
              <p className="error-msg">{errors.coverageType}</p>
            )}
          </div>

          {/* Cost Per Month */}
          <div className="form-group">
            <label htmlFor="costPerMonth">Cost Per Month (LKR)</label>
            <input
              id="costPerMonth"
              type="number"
              value={costPerMonth}
              onChange={(e) => setCostPerMonth(e.target.value)}
              onBlur={() => handleBlur('costPerMonth', costPerMonth)}
              placeholder="e.g., 1500.00"
              min="0"
              step="0.01"
            />
            {errors.costPerMonth && (
              <p className="error-msg">{errors.costPerMonth}</p>
            )}
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => handleBlur('description', description)}
              placeholder="e.g., Covers all damages including accidents, theft, and natural disasters"
              rows="3"
            />
            {errors.description && (
              <p className="error-msg">{errors.description}</p>
            )}
          </div>

          <button type="submit" className="submit-btn">
            Add Insurance
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMaintenance;