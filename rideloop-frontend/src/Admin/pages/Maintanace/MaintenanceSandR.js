// MaintenanceSandR.js
// Responsible for sending and receiving insurance company data from the backend

const API_URL = 'http://localhost:8080/rideloop/maintenance';

// Send new insurance company data to backend
export async function sendInsuranceToBackend(data) {
  try {
    const response = await fetch(`${API_URL}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error sending insurance:', error);
    throw error;
  }
}

// Get all insurance companies from backend
export async function fetchAllInsurance() {
  try {
    const response = await fetch(`${API_URL}/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching insurance:', error);
    throw error;
  }
}
