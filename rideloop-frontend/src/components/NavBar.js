/* eslint-disable */
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const Navbar = ({ profileName }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("profileID");
    navigate("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <style>{`
        /* === NAVBAR STYLING === */
        .top-bar {
          background: #bfccd9;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.8rem 1.5rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .top-left img {
          width: 220px;
        }

        .top-right {
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .profile-name {
          font-weight: 500;
          color: #fff;
          margin-right: 0.5rem;
        }

        .hamburger {
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .hamburger:hover {
          transform: rotate(90deg);
          color: #007bff;
        }

        .dropdown-menu {
          position: absolute;
          right: 0;
          top: 50px;
          background: #fff;
          color: #333;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          flex-direction: column;
          padding: 0.5rem 0;
          min-width: 180px;
          display: none;
          z-index: 1000;
          transition: opacity 0.3s ease, transform 0.2s ease;
        }

        .dropdown-menu.show {
          display: flex;
          opacity: 1;
          transform: translateY(0);
        }

        .dropdown-menu a,
        .dropdown-menu button {
          padding: 0.5rem 1rem;
          text-decoration: none;
          color: #333;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          font-size: 0.95rem;
        }

        .dropdown-menu a:hover,
        .dropdown-menu button:hover {
          background: #f0f0f0;
        }

        .dashboard-nav {
          background: #fff;
          display: flex;
          justify-content: center;
          border-bottom: 2px solid #e2e8f0;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }

        .dashboard-nav ul {
          display: flex;
          gap: 2rem;
          list-style: none;
          padding: 0.8rem 0;
          margin: 0;
        }

        .dashboard-nav li a {
          text-decoration: none;
          color: #334155;
          font-weight: 500;
          padding-bottom: 4px;
          transition: color 0.3s, border-bottom 0.3s;
        }

        .dashboard-nav li a:hover {
          color: #007bff;
          border-bottom: 2px solid #007bff;
        }

        @media (max-width: 768px) {
          .dashboard-nav {
            display: none;
          }
          .top-left img {
            width: 180px;
          }
        }
      `}</style>

      <header className="top-bar">
        <div className="top-left">
          <img src={logo} alt="RideLoop Logo" />
        </div>

        <div className="top-right" ref={dropdownRef}>
          {profileName && <span className="profile-name">{profileName}</span>}
          <button className="hamburger" onClick={toggleDropdown}>
            ☰
          </button>
          <div className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}>
            <Link to="/Profile" onClick={() => setDropdownOpen(false)}>
              My Profile
            </Link>
            <Link to="/Wallet" onClick={() => setDropdownOpen(false)}>
              Wallet
            </Link>
            <Link to="/Incident" onClick={() => setDropdownOpen(false)}>
              Support
            </Link>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>

      <nav className="dashboard-nav">
        <ul>
          <li>
            <Link to="/renterdashboard">Home</Link>
          </li>
          <li>
            <Link to="/Profile">My Profile</Link>
          </li>
          <li>
            <Link to="/Rentals">My Rentals</Link>
          </li>
          
          <li>
            <Link to="/Notifications">Notifications</Link>
          </li>
          <li>
            <Link to="/Incident">Incidents</Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
