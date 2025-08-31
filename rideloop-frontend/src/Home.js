import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Ensure you have the CSS file for styling

function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-header">
          <h1>Welcome to RideLoop Rentals</h1>
          <p>RideLoop is a trusted platform connecting car owners with renters. We make car sharing easy, safe, and affordable.  Rent your car quickly and easily.</p>
         
          <div className="home-buttons">
            <Link to="/Login" className="home-button login-button">Login</Link>
            <Link to="/Register" className="home-button register-button">Register</Link>
          </div>
        </div>

        <div className="public-sections">
        
         

          {/* How it Works */}
          <section className="home-section how-it-works">
            <h2>How It Works</h2>
            <ol>
              <li>Sign up as a renter or owner.</li>
              <li>Post or browse available cars.</li>
              <li>Book and enjoy the ride!</li>
            </ol>
          </section>

         

      

       
        </div>
      </div>
    </div>
  );
}

export default Home;
