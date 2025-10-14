// src/Common/utils/RentalAction.js
import axios from "axios";
import { fetchCarById } from "../../../Admin/pages/Cars/CarSandR";

const RENTAL_API_URL = "http://localhost:8080/rideloopdb/rental";
const PROFILE_URL = "http://localhost:8080/rideloopdb/profiles";

/**
 * Get logged-in user from localStorage
 */
const getLoggedInUser = () => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user || !user.userID) throw new Error("No authenticated user found in localStorage.");
  return user;
};

/**
 * Calculate total ride cost
 */
const calculateCost = (distanceInKm) => {
  const ratePerKm = 2.0;
  return parseFloat((distanceInKm * ratePerKm).toFixed(2));
};

/**
 * Convert a location object to a simple string (for backend)
 */
const locationToString = (loc) => {
  if (!loc) return "Unknown";
  return loc.address ?? `${loc.lat},${loc.lng}` ?? "Unknown";
};

class RentalAction {
  /**
   * Create rental
   */
  static async createRental({ startLocation, endLocation, distanceInKm, carId, startTime = new Date().toISOString() }) {
    try {
      const user = getLoggedInUser();
      const customerID = Number(user.userID);

      // Fetch car to validate
      const fullCar = await fetchCarById(carId);
      if (!fullCar || !fullCar.carId) throw new Error(`Car not loaded for ID: ${carId}`);
      const carID = fullCar.carId;

      // Convert locations to strings
      const pickupLocation = locationToString(startLocation);
      const dropoffLocation = locationToString(endLocation);

      // Calculate cost
      const totalCost = calculateCost(distanceInKm);

      // Prepare rental payload
      const rentalData = {
        carID,
        customerID,
        startDate: startTime.split("T")[0], // Use only date for LocalDate
        endDate: startTime.split("T")[0],   // same day for simplicity
        pickupLocation,
        dropoffLocation,
        insuranceID: 0,                     // default
        totalCost,
        status: "Pending",                  // default
      };

      console.log("🚀 Sending rental:", rentalData);

      const response = await axios.post(`${RENTAL_API_URL}/create`, rentalData, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("✅ Rental created:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to create rental:", error.message || error);
      throw error;
    }
  }

  /**
   * Get all rentals for logged-in user
   */
  static async getRentalsForUser() {
    try {
      const user = getLoggedInUser();
      const response = await axios.get(`${RENTAL_API_URL}/user/${user.userID}`);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to fetch rentals:", error.message || error);
      throw error;
    }
  }
}

export default RentalAction;
