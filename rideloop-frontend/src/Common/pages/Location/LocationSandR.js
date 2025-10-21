const LOCATION_BASE = 'http://localhost:8080/rideloopdb/api/locations';

// Helper to get auth headers if needed
const getAuthHeaders = () => {
  const token = localStorage.getItem('jwtToken');
  return token
    ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' };
};

// Send new location to backend
export async function sendLocationToBackend(coords) {
  const payload = {
    latitude: coords.lat,
    longitude: coords.lng
  };

  try {
    const response = await fetch(`${LOCATION_BASE}/create`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending location:', error);
    throw error;
  }
}

// Fetch location by ID
export async function fetchLocationById(id) {
  try {
    const response = await fetch(`${LOCATION_BASE}/${id}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch location: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching location by ID:', error);
    throw error;
  }
}

// Fetch location by coordinates
export async function getLocationByCoordinates({ lat, lng }) {
  if (lat == null || lng == null) {
    throw new Error(`Invalid coordinates: lat=${lat}, lng=${lng}`);
  }

  const url = new URL(`${LOCATION_BASE}/search`);
  url.searchParams.append('latitude', Number(lat));
  url.searchParams.append('longitude', Number(lng));

  try {
    const response = await fetch(url.toString(), { headers: getAuthHeaders() });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching location by coordinates:", error);
    throw error;
  }
}
