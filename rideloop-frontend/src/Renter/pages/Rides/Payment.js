/* eslint-disable */
import axios from "axios";

const BASE_URL = "http://localhost:8080/rideloopdb";
const PAYMENT_API_URL = `${BASE_URL}/payment/create`;
const REWARDS_API_URL = `${BASE_URL}/api/rewards/process`;
const PAYMENTS_BY_USER_URL = `${BASE_URL}/payments/user`;
const DEFAULT_PAYMENT_METHOD = "CARD";

/**
 * Process payment automatically using rental data
 */
export const processPaymentForRental = async (rental) => {
  if (!rental || !rental.rentalID) {
    throw new Error("Cannot process payment: invalid or missing rental data");
  }

  const paymentData = {
    rental: { rentalID: rental.rentalID },
    paymentAmount: Number(rental.totalCost),
    paymentMethod: DEFAULT_PAYMENT_METHOD,
    paymentDate: new Date().toISOString().split("T")[0], // YYYY-MM-DD
    paymentStatus: "COMPLETED",
  };

  try {
    const token = localStorage.getItem("jwtToken");

    console.log("💳 Sending payment request:", paymentData);

    const response = await axios.post(PAYMENT_API_URL, paymentData, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    console.log("✅ Payment successful:", response.data);

    // 🧠 Save paymentId to localStorage
    if (response.data && response.data.paymentId) {
      localStorage.setItem("paymentId", response.data.paymentId);
      console.log(`💾 Saved paymentId: ${response.data.paymentId} to localStorage`);
    } else {
      console.warn("⚠️ No paymentId found in response data.");
    }

    // 🎁 Automatically process rewards after payment
    const profileId = localStorage.getItem("profileID");
    const paymentId = response.data?.paymentId;

    if (profileId && paymentId) {
      await processRewards(paymentId, profileId);
    } else {
      console.warn("⚠️ Skipped reward processing: Missing profileId or paymentId.");
    }

    return response.data;

  } catch (error) {
    console.error("❌ Payment failed:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Process rewards after payment
 */
export const processRewards = async (paymentId, profileId) => {
  try {
    const token = localStorage.getItem("jwtToken");

    const url = `${REWARDS_API_URL}?paymentId=${paymentId}&profileId=${profileId}`;
    console.log("🎁 Processing rewards:", url);

    const response = await axios.post(url, {}, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    console.log("🏆 Rewards processed successfully:", response.data);
    return response.data;

  } catch (error) {
    console.error("❌ Failed to process rewards:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Show mobile-friendly payment success notification
 */
export const showPaymentSuccessNotification = (rental, payment) => {
  const formattedAmount = new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
  }).format(rental.totalCost);

  if (window.Notification) {
    if (Notification.permission === "granted") {
      new Notification("Payment Successful", {
        body: `Paid ${formattedAmount} to RideLoop`,
        icon: "/logo.png",
        tag: "ride-payment-success",
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((p) => {
        if (p === "granted") {
          new Notification("Payment Successful", {
            body: `Paid ${formattedAmount} to RideLoop`,
            icon: "/logo.png",
          });
        }
      });
    }
  }

  showToast(`✅ Paid ${formattedAmount} to RideLoop\nThank you for your ride!`);
};

const showToast = (message) => {
  const existing = document.querySelector(".ride-loop-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "ride-loop-toast";
  toast.style.cssText = `
    position: fixed; top: 20px; right: 20px; max-width: 320px;
    background: #4CAF50; color: white; padding: 16px; border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3); z-index: 3000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px; line-height: 1.5; opacity: 0; transition: opacity 0.3s ease;
    white-space: pre-line; text-align: center;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => (toast.style.opacity = "1"), 100);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 5000);
};

/**
 * Fetch payments for user
 */
export const getPaymentsForUser = async (userID) => {
  try {
    const token = localStorage.getItem("jwtToken");

    const res = await axios.get(`${PAYMENTS_BY_USER_URL}/${userID}`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    return res.data;
  } catch (error) {
    console.error("Failed to fetch payments:", error);
    throw error;
  }
};
