// src/Common/utils/RentalAction.js
import axios from "axios";
import { fetchCarById } from "../../../Admin/pages/Cars/CarSandR";
import { getLocationByCoordinates } from "../../../Common/pages/Location/LocationSandR";

const RENTAL_API_URL = "http://localhost:8080/rideloopdb/rental";
const PROFILE_API_URL = "http://localhost:8080/rideloopdb/profiles";
/**
 * Get logged-in user and profileID
 */
const getProfileID = () => {
  const profileID = localStorage.getItem("profileID");
  if (!profileID) {
    throw new Error(
      "Profile not found. Please complete and submit your profile first."
    );
  }
  return parseInt(profileID, 10);
};

const calculateCost = (distanceInKm ,ratePerKm) => {
  return parseFloat((distanceInKm * ratePerKm).toFixed(2));
};

class RentalAction {
 static async createRental({ startLocation, endLocation, distanceInKm, carId, startTime,ratePerKm }) {
  try {
    const customerID = getProfileID();
    const car = await fetchCarById(carId);
    if (!car?.carId) throw new Error(`Car not found: ${carId}`);
    const carID = car.carId;

    // Get location IDs
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

    // ✅ Include distanceInKm in the payload
    const rentalData = {
      carID,
      customerID,
      date: startTime ? startTime.split("T")[0] : new Date().toISOString().split("T")[0],
      pickupLocation: pickup.locationID,
      dropoffLocation: dropoff.locationID,
      totalCost: calculateCost(distanceInKm ,ratePerKm),
      distanceInKm, // ← ADD THIS LINE
    };

    console.log("✅ Rental data:", rentalData);

    const response = await axios.post(`${RENTAL_API_URL}/create`, rentalData);
    console.log("✅ Rental successful:", response.data);

    return response.data;
  } catch (error) {
    console.error("❌ Rental failed:", error.message);
    throw error;
  }
}

static async getRentalsForUser() {
  try {
    const profileID = getProfileID(); // returns number
    const response = await axios.get(`${RENTAL_API_URL}/customer/${profileID}`);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch rentals:", error.message || error);
    throw error;
  }
}
}

export default RentalAction;