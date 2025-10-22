// src/Common/utils/RentalAction.js
import axios from "axios";
import { fetchCarById } from "../../../Admin/pages/Cars/CarSandR";
import { getLocationByCoordinates } from "../../../Common/pages/Location/LocationSandR";

const RENTAL_API_URL = "http://localhost:8080/rideloopdb/rental";

// Get logged-in user profileID
const getProfileID = () => {
  const profileID = localStorage.getItem("profileID");
  if (!profileID) {
    throw new Error(
      "Profile not found. Please complete and submit your profile first."
    );
  }
  return parseInt(profileID, 10);
};

// Calculate rental cost
const calculateCost = (distanceInKm, ratePerKm) => {
  return parseFloat((distanceInKm * ratePerKm).toFixed(2));
};

// Get JWT Authorization header
const getAuthHeader = () => {
  const token = localStorage.getItem("jwtToken");
  if (!token) throw new Error("JWT token not found. Please login.");
  return { Authorization: `Bearer ${token}` };
};

class RentalAction {
  // ===== CREATE RENTAL =====
  static async createRental({
    startLocation,
    endLocation,
    distanceInKm,
    carId,
    startTime,
    ratePerKm,
  }) {
    try {
      const customerID = getProfileID();
      const car = await fetchCarById(carId);
      if (!car?.carId) throw new Error(`Car not found: ${carId}`);
      const carID = car.carId;

      // Get pickup/dropoff location IDs
      const pickup = await getLocationByCoordinates({
        lat: startLocation.latitude || startLocation.lat,
        lng: startLocation.longitude || startLocation.lng,
      });
      const dropoff = await getLocationByCoordinates({
        lat: endLocation.latitude || endLocation.lat,
        lng: endLocation.longitude || endLocation.lng,
      });

      if (!pickup?.locationID || !dropoff?.locationID) {
        throw new Error("Could not resolve location IDs.");
      }

      const rentalData = {
        carID,
        customerID,
        date: startTime
          ? startTime.split("T")[0]
          : new Date().toISOString().split("T")[0],
        pickupLocation: pickup.locationID,
        dropoffLocation: dropoff.locationID,
        totalCost: calculateCost(distanceInKm, ratePerKm),
        distanceInKm,
      };

      console.log("✅ Rental data:", rentalData);

      // Include JWT header
      const response = await axios.post(`${RENTAL_API_URL}/create`, rentalData, {
        headers: getAuthHeader(),
      });

      console.log("✅ Rental successful:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Rental failed:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  // ===== GET RENTALS FOR LOGGED-IN USER =====
  static async getRentalsForUser() {
    try {
      const profileID = getProfileID();
      const response = await axios.get(`${RENTAL_API_URL}/customer/${profileID}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error(
        "❌ Failed to fetch rentals:",
        error.response?.data || error.message
      );
      throw error;
    }
  }
}

export default RentalAction;
