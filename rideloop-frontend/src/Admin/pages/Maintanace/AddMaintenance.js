import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../pagescss/AddMaintenance.css';
import { sendInsuranceToBackend } from './MaintenanceSandR';

// List of standard car insurance coverage types
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
  const [insuranceCompanyName, setInsuranceCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [coverageType, setCoverageType] = useState('');
  const [costPerMonth, setCostPerMonth] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate required fields
    if (
      !insuranceCompanyName.trim() ||
      !contactPerson.trim() ||
      !contactNumber.trim() ||
      !coverageType ||
      !costPerMonth ||
      !description.trim()
    ) {
      setError('All fields are required.');
      return;
    }

    // Validate cost is a number
    const cost = Number(costPerMonth);
    if (isNaN(cost) || cost < 0) {
      setError('Cost per month must be a valid positive number.');
      return;
    }

    // Prepare data to send
    const newInsurance = {
      insuranceCompanyName: insuranceCompanyName.trim(),
      contactPerson: contactPerson.trim(),
      contactNumber,
      coverageType,
      costPerMonth: cost,
      description: description.trim(),
    };

    try {
      await sendInsuranceToBackend(newInsurance);
      setSuccess('Insurance company added successfully!');
      
      // Reset form
      setInsuranceCompanyName('');
      setContactPerson('');
      setContactNumber('');
      setCoverageType('');
      setCostPerMonth('');
      setDescription('');

      // Redirect after success
      setTimeout(() => navigate('/Maintenance'), 1200);
    } catch (err) {
      setError('Failed to add insurance company. Please try again.');
      console.error('Add insurance error:', err);
    }
  };

  return (
    <div className="add-maintenance-page">
      {/* Back Button */}
      <div className="back-button-container">
        <button
          type="button"
          onClick={() => navigate('/Maintenance')}
          aria-label="Go back to Maintenance List"
        >
          <span aria-hidden="true">←</span> Back
        </button>
      </div>

      {/* Main Form */}
      <div className="add-maintenance-container">
        <h2>Add Insurance Company</h2>

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <form className="add-maintenance-form" onSubmit={handleSubmit}>
          {/* Company Name */}
          <div className="form-group">
            <label htmlFor="companyName">Company Name</label>
            <input
              id="companyName"
              type="text"
              value={insuranceCompanyName}
              onChange={(e) => setInsuranceCompanyName(e.target.value)}
              placeholder="e.g., ABC Insurance Ltd"
              required
            />
          </div>

          {/* Contact Person */}
          <div className="form-group">
            <label htmlFor="contactPerson">Contact Person</label>
            <input
              id="contactPerson"
              type="text"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              placeholder="e.g., John Doe"
              required
            />
          </div>

          {/* Contact Number */}
          <div className="form-group">
            <label htmlFor="contactNumber">Contact Number</label>
            <input
              id="contactNumber"
              type="tel"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="e.g., 0771234567"
              pattern="[0-9]{10}"
              title="10-digit phone number"
              required
            />
          </div>

          {/* Coverage Type (Dropdown) */}
          <div className="form-group">
            <label htmlFor="coverageType">Coverage Type</label>
            <select
              id="coverageType"
              value={coverageType}
              onChange={(e) => setCoverageType(e.target.value)}
              required
            >
              <option value="">Select a coverage type</option>
              {COVERAGE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Cost Per Month */}
          <div className="form-group">
            <label htmlFor="costPerMonth">Cost Per Month (LKR)</label>
            <input
              id="costPerMonth"
              type="number"
              value={costPerMonth}
              onChange={(e) => setCostPerMonth(e.target.value)}
              placeholder="e.g., 1500.00"
              min="0"
              step="0.01"
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Covers all damages including accidents, theft, and natural disasters"
              rows="3"
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn">
            Add Insurance
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMaintenance;