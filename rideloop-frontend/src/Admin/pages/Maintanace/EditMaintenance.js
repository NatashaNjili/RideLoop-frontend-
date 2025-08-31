// src/pages/admin/maintenance/EditMaintenance.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchInsuranceById, updateInsurance } from './MaintenanceSandR';
import '../../pagescss/EditMaintenance.css';

const EditMaintenance = () => {
	const { id } = useParams(); // Get ID from URL
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

	// Load insurance data by ID
	useEffect(() => {
		const loadInsurance = async () => {
  if (!id) {
      console.error("ID is missing or invalid:", id);
      setError("Invalid ID. Cannot load insurance details.");
      setLoading(false);
      return;
    }

			try {
				const data = await fetchInsuranceById(id);
				setFormData({
					insuranceCompanyName: data.insuranceCompanyName ?? '',
					contactPerson: data.contactPerson ?? '',
					contactNumber: data.contactNumber ?? '',
					coverageType: data.coverageType ?? '',
					costPerMonth: data.costPerMonth ?? '',
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

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');

		// Include id in body (helps backend)
		const payload = {
			...formData,
			id: id, // Ensure id is in the payload
		};

		console.log('Submitting update:', payload); // Debug

		try {
			await updateInsurance(id, payload);
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
						placeholder="e.g., ABC Insurance"
						required
					/>
				</div>

				{/* Contact Person */}
				<div className="form-group">
					<label>Contact Person</label>
					<input
						type="text"
						name="contactPerson"
						value={formData.contactPerson}
						onChange={handleChange}
						placeholder="e.g., John Doe"
						required
					/>
				</div>

				{/* Contact Number */}
				<div className="form-group">
					<label>Contact Number</label>
					<input
						type="tel"
						name="contactNumber"
						value={formData.contactNumber}
						onChange={handleChange}
						placeholder="e.g., 0812345678"
						pattern="[0-9]{10}"
						title="10-digit phone number"
						required
					/>
				</div>

				{/* Coverage Type */}
				<div className="form-group">
					<label>Coverage Type</label>
					<input
						type="text"
						name="coverageType" // ✅ Fixed: was "planType"
						value={formData.coverageType}
						onChange={handleChange}
						placeholder="e.g., Full Coverage"
						required
					/>
				</div>

				{/* Cost Per Month */}
				<div className="form-group">
					<label>Cost Per Month (R)</label>
					<input
						type="number"
						name="costPerMonth" // ✅ Fixed: was "premium"
						value={formData.costPerMonth}
						onChange={handleChange}
						min="0"
						step="0.01"
						placeholder="e.g., 1200.00"
						required
					/>
				</div>

				{/* Description */}
				<div className="form-group">
					<label>Description</label>
					<textarea
						name="description"
						value={formData.description}
						onChange={handleChange}
						rows="3"
						placeholder="e.g., Covers all damages including accidents and theft"
						required
					/>
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