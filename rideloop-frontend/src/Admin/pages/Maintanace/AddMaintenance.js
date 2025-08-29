import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../pagescss/AddMaintenance.css';
import { sendInsuranceToBackend } from './MaintenanceSandR';

const AddMaintenance = ({ onAdd }) => {
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
    if (!insuranceCompanyName || !contactPerson || !contactNumber || !coverageType || !costPerMonth || !description) {
      setError('All fields are required.');
      return;
    }
    if (isNaN(Number(costPerMonth))) {
      setError('Cost per month must be a number.');
      return;
    }
    try {
      await sendInsuranceToBackend({ insuranceCompanyName, contactPerson, contactNumber, coverageType, costPerMonth, description });
      setSuccess('Insurance company added successfully!');
      setInsuranceCompanyName('');
      setContactPerson('');
      setContactNumber('');
      setCoverageType('');
      setCostPerMonth('');
      setDescription('');
      setTimeout(() => navigate('/Maintenance'), 1200); // Navigate after short delay
    } catch (err) {
      setError('Failed to add insurance company.');
    }
  };

  return (
    <div className="App">
      <div style={{ position: 'absolute', top: 24, left: 24, zIndex: 10 }}>
        <button
          type="button"
          onClick={() => navigate('/Maintenance')}
          style={{ background: 'none', border: 'none', color: '#007bff', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <span style={{ fontSize: 22, marginRight: 4 }}>&larr;</span> Back
        </button>
      </div>
      
      {/* Updated container and form classes */}
      <div className="add-maintenance-container">
        <h2>Add Insurance Company</h2>
        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-message" style={{color: '#28a745', fontSize: '0.98rem', marginBottom: '6px'}}>{success}</p>}
        
        <form className="add-maintenance-form" onSubmit={handleSubmit}>
          <div>
            <label>Company Name</label>
            <input type="text" value={insuranceCompanyName} onChange={e => setInsuranceCompanyName(e.target.value)} placeholder="Enter company name" required />
          </div>
          <div>
            <label>Contact Person</label>
            <input type="text" value={contactPerson} onChange={e => setContactPerson(e.target.value)} placeholder="Enter contact person" required />
          </div>
          <div>
            <label>Contact Number</label>
            <input type="text" value={contactNumber} onChange={e => setContactNumber(e.target.value)} placeholder="Enter contact number" required />
          </div>
          <div>
            <label>Coverage Type</label>
            <input type="text" value={coverageType} onChange={e => setCoverageType(e.target.value)} placeholder="Enter coverage type" required />
          </div>
          <div>
            <label>Cost Per Month</label>
            <input type="number" value={costPerMonth} onChange={e => setCostPerMonth(e.target.value)} placeholder="Enter cost per month" required />
          </div>
          <div>
            <label>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Enter description" required />
          </div>
          <button type="submit">Add Insurance</button>
        </form>
      </div>
    </div>
  );
};

export default AddMaintenance;
