/* eslint-disable */
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../../components/AdminSidebar";
import RentalAction from  "../../../Renter/pages/Rides/RentalAction";
import axios from "axios";
import "../../pagescss/AdminDashboard.css"; // Reuse layout/sidebar styles
import "../../pagescss/AdminRentals.css"; // New CSS

// Chart.js core
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const fetchCarById = async (id) => {
  const token = localStorage.getItem("jwtToken");
  const res = await axios.get(`http://localhost:8080/rideloopdb/api/cars/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

function AdminRentals() {
  const [rentalsWithCars, setRentalsWithCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const navigate = useNavigate();

  // Fetch all rentals + car details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const rentals = await RentalAction.getAllRentals();
        if (!Array.isArray(rentals)) {
          throw new Error("Invalid rentals data");
        }

        // Fetch car for each rental
        const enriched = await Promise.all(
          rentals.map(async (rental) => {
            try {
              const car = await fetchCarById(rental.carID);
              return { ...rental, car };
            } catch (err) {
              console.warn(`Car not found: ${rental.carID}`);
              return { ...rental, car: null };
            }
          })
        );

        setRentalsWithCars(enriched);
      } catch (err) {
        setError("Failed to load rentals data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate stats
  const totalRentals = rentalsWithCars.length;
  const totalRevenue = rentalsWithCars.reduce(
    (sum, r) => sum + (parseFloat(r.totalCost) || 0),
    0
  );

  // Group by car category
  const categoryCounts = rentalsWithCars
    .filter(item => item.car?.category)
    .reduce((acc, item) => {
      const cat = item.car.category;
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

  const categories = Object.keys(categoryCounts);
  const counts = Object.values(categoryCounts);

  // Render chart when data is ready
  useEffect(() => {
    if (loading || error || categories.length === 0) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: categories,
        datasets: [
          {
            label: "Number of Rentals",
            data: counts,
            backgroundColor: "rgba(54, 162, 235, 0.7)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: "Rental Popularity by Car Category" },
          legend: { display: false },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "Rentals" },
            ticks: { precision: 0 },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [categories, counts, loading, error]);

  return (
    <div className="layout">
      <AdminSidebar />
      <div className="admin-rentals-container">
        <main className="admin-rentals-main">
         

          <h2>🚗 Rentals Overview</h2>

          {loading && <p className="loading">Loading rentals...</p>}
          {error && <p className="error">{error}</p>}

          {!loading && !error && (
            <>
              {/* Summary Cards */}
              <section className="summary-cards">
                <div className="card total">
                  <h3>Total Rentals</h3>
                  <p className="amount">{totalRentals}</p>
                </div>
                <div className="card revenue">
                  <h3>Total Revenue</h3>
                  <p className="amount">R{totalRevenue.toFixed(2)}</p>
                </div>
              </section>

              {/* Category Chart */}
              {categories.length > 0 ? (
                <section className="chart-section">
                  <canvas ref={chartRef} height={400}></canvas>
                </section>
              ) : (
                <p>No car category data available.</p>
              )}

              {/* Optional: Rental List (for debugging) */}
              {/* <div className="rental-list">
                {rentalsWithCars.map((item) => (
                  <div key={item.rentalID} className="rental-item">
                    Rental #{item.rentalID} - {item.car?.brand || "Unknown"} ({item.car?.carCategory || "N/A"})
                  </div>
                ))}
              </div> */}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminRentals;