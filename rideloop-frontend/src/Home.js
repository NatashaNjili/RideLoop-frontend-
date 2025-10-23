import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "./assets/logo.png";
import "./Home.css";
import hero from "./assets/hero.jpg";

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="home-container">
      {/* ===== NAVBAR ===== */}
      <nav className="navbar">
        <div className="navbar-logo">
          <img src={logo} alt="Right Loop Logo" />

        </div>

        <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <ul className={`navbar-menu ${menuOpen ? "active" : ""}`}>
          <li><Link to="/">Home</Link></li>
          <li><a href="#how-it-works">How It Works</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><Link to="/login" className="login-btn">Login / Sign Up</Link></li>
        </ul>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="hero">
        <div className="hero-overlay">
          <div className="hero-text">
            <h1>Drive on Your Own Terms with RideLoop</h1>
            <p>Book. Drive. Pay only for the distance you travel.</p>
            <div className="hero-buttons">
              <Link to="/book" className="primary-btn">Book a Car</Link>
              <a href="#how-it-works" className="secondary-btn">See How It Works</a>
            </div>
          </div>
        </div>
      </section>

 
      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            🚙 <h3>Pick a Car</h3>
            <p>Choose from our wide range of vehicles nearby.</p>
          </div>
          <div className="step">
            🛣 <h3>Drive to Your Destination</h3>
            <p>You’re the driver — full freedom, zero hassle.</p>
          </div>
          <div className="step">
            💳 <h3>Pay by Distance</h3>
            <p>Fair pricing — pay only for kilometers you travel.</p>
          </div>
        </div>
      </section>

      {/* ===== BENEFITS SECTION ===== */}
      <section className="benefits">
        <h2>Why Choose Right Loop?</h2>
        <div className="benefit-cards">
          <div className="card">📍 Flexible rentals</div>
          <div className="card">💸 Pay-per-distance</div>
          <div className="card">🔒 Insurance & support included</div>
          <div className="card">⏰ 24/7 availability</div>
          <div className="card">📱 Manage everything in the app</div>
        </div>
      </section>

     
{/* ===== TESTIMONIALS ===== */}
<section className="testimonials">
  <h2>What Our Users Say</h2>
  
  <div className="reviews-container">
    {/* Review 1 */}
    <div className="review-card">
      <img src={require("./assets/user1.webp")} alt="User 1" className="review-img" />
      <div className="review-content">
        <h3>Jane Mokoena</h3>
        <div className="stars">⭐⭐⭐⭐⭐</div>
        <p>“Right Loop made my weekend trip stress-free and affordable! Loved the flexibility.”</p>
      </div>
    </div>

    {/* Review 2 */}
    <div className="review-card">
      <img src={require("./assets/user2.webp")} alt="User 2" className="review-img" />
      <div className="review-content">
        <h3>Thabo Nkosi</h3>
        <div className="stars">⭐⭐⭐⭐</div>
        <p>“Easy to book, clean cars, and transparent pricing. Will definitely use it again.”</p>
      </div>
    </div>

    {/* Review 3 */}
    <div className="review-card">
      <img src={require("./assets/user3.jpg")} alt="User 3" className="review-img" />
      <div className="review-content">
        <h3>Lisa Dlamini</h3>
        <div className="stars">⭐⭐⭐⭐⭐</div>
        <p>“Best car rental experience ever! Everything from booking to driving was smooth.”</p>
      </div>
    </div>
  </div>
</section>



      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <p>© 2025 Right Loop. All rights reserved.</p>
        <ul className="footer-links">
          <li><Link to="/about">About</Link></li>
          <li><Link to="/faq">FAQ</Link></li>
          <li><Link to="/terms">Terms</Link></li>
          <li><Link to="/privacy">Privacy</Link></li>
        </ul>
        <div className="social-icons">
          <i className="fab fa-facebook"></i>
          <i className="fab fa-instagram"></i>
          <i className="fab fa-twitter"></i>
          <i className="fab fa-linkedin"></i>
        </div>
      </footer>
    </div>
  );
}

export default Home;
