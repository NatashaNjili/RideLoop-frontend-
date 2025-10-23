import React, { useEffect, useState } from 'react';
import '../../pagescss/Maintenance.css';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaEdit } from 'react-icons/fa';
import { fetchAllInsurance, deleteInsurance } from './MaintenanceSandR';
import AdminSidebar from '../../../components/AdminSidebar';

const Maintenance = () => {
  const navigate = useNavigate();
  const [insuranceCompanies, setInsuranceCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch insurance data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchAllInsurance();
        setInsuranceCompanies(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Failed to fetch insurance companies.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle Delete
  const handleDelete = async (companyId) => {
    if (!window.confirm('Are you sure you want to delete this insurance company?')) return;

    try {
      await deleteInsurance(companyId);
      setInsuranceCompanies((prev) => prev.filter((c) => c.id !== companyId));
      alert('Insurance company deleted successfully.');
    } catch (err) {
      setError('Failed to delete insurance company. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="main-content">
        <div className="top-header">
          <div className="search-container">
            <input type="text" className="search-bar" placeholder="Search admin data..." />
            <FaSearch className="search-icon" />
          </div>
          <div className="user-profile">Hi, Admin</div>
        </div>

        <div className="maintenance-container">
          <div className="maintenance-header">
            <h2>Insurance Companies</h2>
            <button
              className="add-insurance-btn"
              onClick={() => navigate('/AddMaintenance')}
            >
              Add New Insurance
            </button>
          </div>

          {/* Insurance List */}
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : insuranceCompanies.length === 0 ? (
            <p>No insurance companies found.</p>
          ) : (
            <div className="insurance-list">
              {insuranceCompanies.map((company) => (
                <div
                  className="insurance-card"
                  key={company.id || company.insuranceCompanyName}
                >
                  <div className="insurance-card-header">
                    <h3>{company.insuranceCompanyName}</h3>
                    {/* Edit Button */}
                    <button
                      className="edit-icon-btn"
                      onClick={() => navigate(`/EditMaintenance/${company.id}`)}
                      aria-label="Edit insurance company"
                    >
                      <FaEdit />
                    </button>
                  </div>
                  <p>{company.description}</p>

                  {/* Optional: Delete button below (or keep only in confirmation) */}
                  {/* 
                    <button
                      className="delete-link"
                      onClick={() => handleDelete(company.id)}
                      style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}
                    >
                      Delete
                    </button>
                  */}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Maintenance;