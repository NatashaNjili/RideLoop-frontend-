/* eslint-disable */
import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import NavBar from "../../../components/NavBar";
import "../../pagescss/FinancialReport.css";

import { useNavigate } from "react-router-dom";
// Import Chart.js core
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
import AdminSidebar from "../../../components/AdminSidebar";

// Register required controllers & elements
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const PAYMENT_ALL_URL = "http://localhost:8080/rideloopdb/payment/getAll";

function FinancialReport() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [customDate, setCustomDate] = useState("");

  const token = localStorage.getItem("jwtToken");
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const userID = loggedInUser?.userID;

  const chartRef = useRef(null); // Reference to the canvas
  const chartInstance = useRef(null); // Hold the chart instance for cleanup
  const navigate = useNavigate();
  // Fetch payments
  useEffect(() => {
    if (!token || !userID) {
      setError("You must be logged in.");
      setLoading(false);
      return;
    }

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const fetchPayments = async () => {
      try {
        const res = await axios.get(PAYMENT_ALL_URL);
        let data = Array.isArray(res.data) ? res.data : [res.data];
        const validPayments = data
          .filter(p => p.paymentAmount > 0 && p.paymentDate)
          .map(p => ({ ...p, date: new Date(p.paymentDate) }));
        setPayments(validPayments);
      } catch (err) {
        setError("Failed to load financial data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [token, userID]);

  // Helper
  const formatDate = (date) => date.toISOString().split("T")[0];

  // Recalculate & render chart whenever payments change
  useEffect(() => {
    if (loading || error || payments.length === 0) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    const filterByRange = (start, end = new Date()) =>
      payments.filter(p => p.date >= start && p.date <= end);

    const sum = (list) => list.reduce((s, p) => s + p.paymentAmount, 0);

    const data = {
      labels: ["Today", "This Week", "This Month", "This Year"],
      datasets: [
        {
          label: "Revenue (ZAR)",
          data: [
            sum(filterByRange(new Date(today))),
            sum(filterByRange(startOfWeek)),
            sum(filterByRange(startOfMonth)),
            sum(filterByRange(startOfYear)),
          ],
          backgroundColor: [
            "rgba(54, 162, 235, 0.7)",
            "rgba(75, 192, 192, 0.7)",
            "rgba(255, 206, 86, 0.7)",
            "rgba(255, 99, 132, 0.7)",
          ],
          borderColor: [
            "rgba(54, 162, 235, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(255, 99, 132, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };

    const config = {
      type: "bar",
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: "Revenue Overview" },
          legend: { position: "top" },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "ZAR (R)" },
          },
        },
      },
    };

    // Cleanup previous chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create new chart
    const ctx = chartRef.current.getContext("2d");
    chartInstance.current = new Chart(ctx, config);

    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [payments, loading, error]);

  // ===== Rest of logic (same as before) =====
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfYear = new Date(today.getFullYear(), 0, 1);

  const filterByRange = (startDate, endDate = new Date()) => {
    return payments.filter(p => p.date >= startDate && p.date <= endDate);
  };

  const todayPayments = filterByRange(new Date(today.setHours(0,0,0,0)));
  const weekPayments = filterByRange(startOfWeek);
  const monthPayments = filterByRange(startOfMonth);
  const yearPayments = filterByRange(startOfYear);
  const customPayments = customDate
    ? payments.filter(p => formatDate(p.date) === customDate)
    : [];

  const sumRevenue = (list) => list.reduce((sum, p) => sum + p.paymentAmount, 0);
  const todayRevenue = sumRevenue(todayPayments);
  const weekRevenue = sumRevenue(weekPayments);
  const monthRevenue = sumRevenue(monthPayments);
  const yearRevenue = sumRevenue(yearPayments);
  const customRevenue = sumRevenue(customPayments);

  // ===== Render =====
  return ( 
  <div className="layout"><AdminSidebar/>
    <div className="financial-report-container">
     
      <main className="financial-report-main">
        <main className="financial-report-main">
  {/* Back to Dashboard Button */}
 

  <h2>📊 Financial Report Dashboard</h2>
  {/* ... rest of your content */}
</main>

        {loading && <p className="loading">Loading financial data...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && (
          <>
            {/* Chart Canvas */}
            <section className="chart-section">
              <canvas ref={chartRef} width={600} height={400}></canvas>
            </section>

            {/* Custom Date Filter */}
            <section className="filter-section">
              <h3>🔍 Filter by Specific Date</h3>
              <div className="date-filter">
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  max={formatDate(new Date())}
                />
                {customDate && (
                  <div className="custom-result">
                    <h4>
                      Revenue on {customDate}:{" "}
                      <span className="revenue-amount">R{customRevenue.toFixed(2)}</span>
                    </h4>
                    {customPayments.length === 0 && (
                      <p className="no-data">No transactions found for this date.</p>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* Summary Cards */}
            <section className="summary-cards">
              <div className="card today">
                <h3>Today</h3>
                <p className="amount">R{todayRevenue.toFixed(2)}</p>
                <p className="count">({todayPayments.length} transactions)</p>
              </div>
              <div className="card week">
                <h3>This Week</h3>
                <p className="amount">R{weekRevenue.toFixed(2)}</p>
                <p className="count">({weekPayments.length} transactions)</p>
              </div>
              <div className="card month">
                <h3>This Month</h3>
                <p className="amount">R{monthRevenue.toFixed(2)}</p>
                <p className="count">({monthPayments.length} transactions)</p>
              </div>
              <div className="card year">
                <h3>This Year</h3>
                <p className="amount">R{yearRevenue.toFixed(2)}</p>
                <p className="count">({yearPayments.length} transactions)</p>
              </div>
            </section>
          </>
        )}
      </main>
    </div></div>
  );
}

export default FinancialReport;