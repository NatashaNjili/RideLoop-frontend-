import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import logo from "../../../assets/logo.png";
import "../../pagescss/Incident.css";

const RENTAL_API = "http://localhost:8080/rideloopdb/rental/getAll";
const PROFILE_API = "http://localhost:8080/rideloopdb/profiles";
const INCIDENT_API = "http://localhost:8080/rideloopdb/incidents";
const CAR_API = "http://localhost:8080/rideloopdb/api/cars";

const Incident = () => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const profileID = localStorage.getItem("profileID");

    const [latestRental, setLatestRental] = useState(null);
    const [profile, setProfile] = useState(null);
    const [car, setCar] = useState(null);
    const [type, setType] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    // ✅ Fetch rental, profile, and car info
    useEffect(() => {
        const fetchRentalDetails = async () => {
            if (!profileID) {
                setMessage("Profile ID not found. Please log in again.");
                setLoading(false);
                return;
            }

            try {
                // 1️⃣ Fetch all rentals
                const rentalRes = await axios.get(RENTAL_API);
                const userRentals = rentalRes.data.filter(
                    (r) => r.customerID === parseInt(profileID)
                );

                if (userRentals.length === 0) {
                    setMessage("No rentals found for your profile.");
                    setLoading(false);
                    return;
                }

                // 2️⃣ Find latest rental
                const latest = userRentals.reduce((prev, current) =>
                    new Date(prev.startDate) > new Date(current.startDate) ? prev : current
                );
                setLatestRental(latest);

                // 3️⃣ Fetch profile info
                try {
                    const profileRes = await axios.get(`${PROFILE_API}/${profileID}`);
                    setProfile(profileRes.data);
                } catch (err) {
                    console.warn("Could not fetch profile details.", err);
                    setProfile({ firstName: "Unknown", lastName: "" });
                }

                // 4️⃣ Fetch car info
                if (latest.carID) {
                    try {
                        const carRes = await axios.get(`${CAR_API}/${latest.carID}`);
                        setCar(carRes.data);
                    } catch (err) {
                        console.warn("Could not fetch car info.", err);
                        setCar({
                            brand: "Unknown",
                            model: "",
                            year: "",
                            licensePlate: "Unknown",
                            rentalRate: "Unknown",
                        });
                    }
                }
            } catch (err) {
                console.error("Error fetching rental details:", err);
                setMessage("Failed to fetch rental details.");
            } finally {
                setLoading(false);
            }
        };

        fetchRentalDetails();
    }, [profileID]);

    // ✅ Submit incident report
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!latestRental?.rentalID) {
            setMessage("No rental found to report incident for.");
            return;
        }

        try {
            await axios.post(
                `${INCIDENT_API}/create?type=${encodeURIComponent(
                    type
                )}&description=${encodeURIComponent(
                    description
                )}&rentalId=${latestRental.rentalID}`
            );
            setMessage("Incident reported successfully!");
            setType("");
            setDescription("");
        } catch (err) {
            console.error("Error creating incident:", err);
            setMessage("Failed to create incident. Please try again.");
        }
    };

    if (!loggedInUser) return <p>Please log in to report an incident.</p>;
    if (loading) return <p>Loading your latest rental...</p>;

    return (
        <div className="dashboard-container">
            {/* Header */}
            <header className="top-bar">
                <div className="top-left">
                    <img src={logo} alt="RideLoop Logo" className="logo-image" />
                </div>
                <button className="hamburger">☰</button>
            </header>

            {/* Sidebar Navigation */}
            <nav className="dashboard-nav">
                <ul>
                    <li>
                        <Link to="/RenterDashboard">Home</Link>
                    </li>
                    <li>
                        <Link to="/profile">My Profile</Link>
                    </li>
                    <li>
                        <Link to="/rentals">My Rentals</Link>
                    </li>
                    <li>
                        <Link to="/wallet">Wallet</Link>
                    </li>
                    <li>
                        <Link to="/notifications">Notifications</Link>
                    </li>
                    <li>
                        <Link to="/incident" className="active">
                            Incidents
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* Main Content */}
            <main className="incident-main">
                <div className="incident-card">
                    <h2>Report an Incident</h2>

                    {latestRental ? (
                        <div className="rental-info">
                            <h3>
                                <strong>Customer:</strong>{" "}
                                {profile
                                    ? `${profile.firstName} ${profile.lastName}`
                                    : "Unknown"}
                            </h3>
                            <p>
                                <strong>Car:</strong>{" "}
                                {car ? `${car.brand} ${car.model} (${car.year})` : "Unknown"}
                            </p>
                            <p>
                                <strong>License Plate:</strong>{" "}
                                {car ? car.licensePlate : "Unknown"}
                            </p>
                            <p>
                                <strong>Rental Rate:</strong>{" "}
                                {car ? `R${car.rentalRate}` : "Unknown"}
                            </p>
                            <p>
                                <strong>Start Date:</strong> {latestRental.startDate}
                            </p>
                            <p>
                                <strong>End Date:</strong> {latestRental.endDate}
                            </p>
                        </div>
                    ) : (
                        <p>{message}</p>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="incident-form">
                        <div className="form-group">
                            <label>Incident Type</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                required
                            >
                                <option value="">-- Select Type --</option>
                                <option value="Accident">Accident</option>
                                <option value="Damage">Damage</option>
                                <option value="Late Return">Late Return</option>
                                <option value="Payment Issue">Payment Issue</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                placeholder="Describe the incident..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="primary-btn"
                            disabled={!latestRental?.rentalID}
                        >
                            Submit Incident
                        </button>
                    </form>

                    {message && <p className="message">{message}</p>}
                </div>
            </main>

            {/* Footer */}
            <footer className="dashboard-footer">
                <p>© 2025 RideLoop. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Incident;
