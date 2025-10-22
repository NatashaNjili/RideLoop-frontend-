/* eslint-disable */
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../pagescss/Wallet.css";
import NavBar from "../../../components/NavBar";

const RENTAL_URL = "http://localhost:8080/rideloopdb/rental/customer";
const PAYMENT_URL = "http://localhost:8080/rideloopdb/payment/byRental";

function Wallet() {
  const [rentals, setRentals] = useState([]);
  const [payments, setPayments] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5); // initial top 5
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Wallet card states
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [storedCards, setStoredCards] = useState([]);

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const userID = loggedInUser?.userID;
  const token = localStorage.getItem("jwtToken");

  // Load stored cards from localStorage when component mounts
  useEffect(() => {
    if (userID) {
      const savedCards = JSON.parse(localStorage.getItem(`cards_${userID}`)) || [];
      setStoredCards(savedCards);
    }
  }, [userID]);

  // Save stored cards to localStorage whenever they change
  useEffect(() => {
    if (userID) {
      localStorage.setItem(`cards_${userID}`, JSON.stringify(storedCards));
    }
  }, [storedCards, userID]);

  useEffect(() => {
    if (!token || !userID) {
      setError("You must be logged in to view wallet data.");
      setLoading(false);
      return;
    }

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const fetchWalletData = async () => {
      try {
        // Fetch rentals
        const rentalRes = await axios.get(`${RENTAL_URL}/${userID}`);
        const rentalsData = rentalRes.data;
        if (!Array.isArray(rentalsData) || rentalsData.length === 0) {
          setError("No rentals found for this user.");
          setLoading(false);
          return;
        }
        setRentals(rentalsData);

        // Fetch payments for all rentals
        const paymentPromises = rentalsData.map((rental) =>
          axios
            .get(`${PAYMENT_URL}/${rental.rentalID}`)
            .then((res) => (Array.isArray(res.data) ? res.data : [res.data]))
            .catch(() => [])
        );

        const paymentsArrays = await Promise.all(paymentPromises);
        const allPayments = paymentsArrays.flat();

        // Sort descending by payment ID
        allPayments.sort((a, b) => b.paymentId - a.paymentId);
        setPayments(allPayments);
      } catch (err) {
        console.error(err);
        setError(err.response?.data || err.message || "Failed to fetch wallet data.");
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [token, userID]);

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  // Handle adding a new card
  const handleAddCard = () => {
    if (!cardNumber || !cardHolder || !expiry || !cvv) return;

    const newCard = {
      cardNumber: cardNumber.replace(/\s/g, ""),
      cardHolder,
      expiry,
      cvv,
    };

    setStoredCards((prev) => [...prev, newCard]);
    setCardNumber("");
    setCardHolder("");
    setExpiry("");
    setCvv("");
  };

  return (
    <div className="wallet-container">
      <NavBar />
      <main className="wallet-main">
        <h2>💳 Wallet</h2>

        {/* Payment Simulation Form */}
        <section className="wallet-simulation">
          {storedCards.length === 0 && (
            <>
              <h3>💳 Add Card</h3>
              <input
                type="text"
                placeholder="Card Number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
              <input
                type="text"
                placeholder="Card Holder"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
              />
              <input
                type="text"
                placeholder="Expiry (MM/YY)"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
              />
              <input
                type="text"
                placeholder="CVV"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
              />
              <button onClick={handleAddCard}>Add Card</button>
            </>
          )}

          {storedCards.length > 0 && (
            <div className="stored-cards">
              <h4>Stored Cards</h4>
              <ul>
                {storedCards.map((card, index) => (
                  <li key={index}>
                    **** **** **** {card.cardNumber.slice(-4)} | {card.cardHolder} |{" "}
                    {card.expiry}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Payments List */}
        {!loading && !error && payments.length > 0 && (
          <section className="payment-list">
            <h3>💰 Payments</h3>
            <ul>
              {payments.slice(0, visibleCount).map((p) => (
                <li key={p.paymentId}>
                  -R{p.paymentAmount.toFixed(2)} | {p.paymentStatus} |{" "}
                  {new Date(p.paymentDate).toLocaleString()}
                </li>
              ))}
            </ul>
            {visibleCount < payments.length && (
              <button className="see-more-btn" onClick={handleSeeMore}>
                See More
              </button>
            )}
          </section>
        )}

        {!loading && !error && payments.length === 0 && <p>No payments found.</p>}
      </main>
    </div>
  );
}

export default Wallet;
