import axios from 'axios';

const PAYMENT_API_URL = "http://localhost:8080/rideloopdb/payment/create";
const DEFAULT_PAYMENT_METHOD = "CARD";

/**
 * Process payment automatically using rental data
 */
export const processPaymentForRental = async (rental) => {
  if (!rental || !rental.rentalID) {
    throw new Error("Cannot process payment: invalid or missing rental data");
  }

  const paymentData = {
    rental: { rentalID: rental.rentalID }, // send minimal object
    paymentAmount: Number(rental.totalCost),
    paymentMethod: DEFAULT_PAYMENT_METHOD,
    paymentDate: new Date().toISOString().split("T")[0], // LocalDate YYYY-MM-DD
    paymentStatus: "COMPLETED"
  };

  try {
    console.log("💳 Sending payment request:", paymentData);

    const response = await axios.post(PAYMENT_API_URL, paymentData, {
      headers: { "Content-Type": "application/json" }
    });

    console.log("✅ Payment successful:", response.data);
    return response.data;

  } catch (error) {
    console.error("❌ Payment failed:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Show mobile-friendly payment success notification
 */
export const showPaymentSuccessNotification = (rental, payment) => {
  const formattedAmount = new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR'
  }).format(rental.totalCost);

  // Desktop notification
  if (window.Notification) {
    if (Notification.permission === "granted") {
      new Notification("Payment Successful", {
        body: `Paid ${formattedAmount} to RideLoop`,
        icon: "/logo.png",
        tag: "ride-payment-success"
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(p => {
        if (p === "granted") {
          new Notification("Payment Successful", {
            body: `Paid ${formattedAmount} to RideLoop`,
            icon: "/logo.png"
          });
        }
      });
    }
  }

  showToast(`✅ Paid ${formattedAmount} to RideLoop\nThank you for your ride!`);
};

const showToast = (message) => {
  const existing = document.querySelector('.ride-loop-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'ride-loop-toast';
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

  setTimeout(() => toast.style.opacity = '1', 100);
  setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 5000);
};

/**
 * Fetch payments for user
 */
export const getPaymentsForUser = async (userID) => {
  try {
    const res = await axios.get(`http://localhost:8080/rideloopdb/payments/user/${userID}`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch payments:", error);
    throw error;
  }
};
