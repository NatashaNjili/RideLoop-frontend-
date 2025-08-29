import React, { useEffect, useState } from 'react';
import '../../pagescss/Maintenance.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import logo from '../../../assets/logo.png';
import { fetchAllInsurance } from './MaintenanceSandR';

const Maintenance = () => {
	const navigate = useNavigate();
	const [insuranceCompanies, setInsuranceCompanies] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		async function fetchData() {
			setLoading(true);
			setError('');
			try {
				const data = await fetchAllInsurance();
				setInsuranceCompanies(data);
			} catch (err) {
				setError('Failed to fetch insurance companies.');
			} finally {
				setLoading(false);
			}
		}
		fetchData();
	}, []);

	

	return (
		<div className="layout">
			{/* Sidebar */}
					<aside className="sidebar">
						<img src={logo} alt="Logo" className="logo" />
						<nav style={{ flex: 1 }}>
							<ul>
								<li><Link to="/admin/overview" className="sidebar-link">Overview</Link></li>
								<li><Link to="/admin/manage-users" className="sidebar-link">Manage Users</Link></li>
								<li><Link to="/ManageCars" className="sidebar-link">Manage Cars</Link></li>
								<li><Link to="/Maintenance" className="sidebar-link">Maintenance</Link></li>
								<li><Link to="/admin/manage-bookings" className="sidebar-link">Manage Bookings</Link></li>
								<li><Link to="/admin/reports" className="sidebar-link">Reports</Link></li>
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
						<button className="add-insurance-btn" onClick={() => navigate('/AddMaintenance')}>Add New Insurance</button>
					</div>
					{loading ? (
						<div className="insurance-list"><p>Loading...</p></div>
					) : error ? (
						<div className="insurance-list"><p className="error-message">{error}</p></div>
					) : insuranceCompanies.length === 0 ? (
						<div className="insurance-list"><p>There are currently no insurance companies available.</p></div>
					) : (
						<div className="insurance-list">
							{insuranceCompanies.map((company, idx) => (
								<div className="insurance-card" key={idx}>
									<h3>{company.insuranceCompanyName}</h3>
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
