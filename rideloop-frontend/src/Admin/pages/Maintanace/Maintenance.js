import React, { useEffect, useState } from 'react';
import '../../pagescss/Maintenance.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaEllipsisV, FaEdit, FaTrash } from 'react-icons/fa';
import logo from '../../../assets/logo.png';
import { fetchAllInsurance, deleteInsurance } from './MaintenanceSandR';

const Maintenance = () => {
	const navigate = useNavigate();
	const [insuranceCompanies, setInsuranceCompanies] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [dropdownOpen, setDropdownOpen] = useState(null); // Track open dropdown

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

	// Close dropdown on outside click
	useEffect(() => {
		const handleClickOutside = () => {
			if (dropdownOpen) setDropdownOpen(null);
		};
		document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
	}, [dropdownOpen]);

	// Handle Update Navigation
	const handleUpdate = (companyId) => {
		navigate(`/EditMaintenance/${companyId}`); // Make sure this route exists
		setDropdownOpen(null);
	};

	// Handle Delete
	const handleDelete = async (companyId) => {
		if (!window.confirm('Are you sure you want to delete this insurance company?')) return;

		try {
			await deleteInsurance(companyId); // API call to delete
			setInsuranceCompanies((prev) => prev.filter((c) => c.id !== companyId));
			alert('Insurance company deleted successfully.');
		} catch (err) {
			setError('Failed to delete insurance company. Please try again.');
			console.error(err);
		}
		setDropdownOpen(null);
	};

	return (
		<div className="layout">
			{/* Sidebar */}
			<aside className="sidebar">
				<img src={logo} alt="Logo" className="logo" />
				<nav style={{ flex: 1 }}>
					<ul>
						<li><Link to="/" className="sidebar-link">Overview</Link></li>
						{/* <li><Link to="/admin/manage-users" className="sidebar-link">Manage Users</Link></li> */}
						<li><Link to="/ManageCars" className="sidebar-link">Manage Cars</Link></li>
						<li><Link to="/Maintenance" className="sidebar-link">Maintenance</Link></li>
						{/* <li><Link to="/admin/manage-bookings" className="sidebar-link">Manage Bookings</Link></li> */}
						<li><Link to="/Reports" className="sidebar-link">Reports</Link></li>
					</ul>
				</nav>
				<div style={{ marginTop: 'auto' }}>
					<button className="logout-button" onClick={() => navigate('/')}>Logout</button>
				</div>
			</aside>

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
										<div
											className="menu-container"
											onClick={(e) => e.stopPropagation()}
										>
											<FaEllipsisV
												className="menu-dots"
												onClick={() =>
													setDropdownOpen(
														dropdownOpen === company.id ? null : company.id
													)
												}
											/>
											{dropdownOpen === company.id && (
												<div className="dropdown-menu">
													<button onClick={() => handleUpdate(company.id)}>
														<FaEdit /> Update
													</button>
													<button onClick={() => handleDelete(company.id)}>
														<FaTrash /> Delete
													</button>
												</div>
											)}
										</div>
									</div>
									<p>{company.description}</p>
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
