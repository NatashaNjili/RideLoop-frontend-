export async function sendLocationToBackend(coords) {
  const payload = {
	 longitude: coords.lng  ,
    latitude: coords.lat    // ← must be "latitude"
     // ← must be "longitude"
  };

  try {
    const response = await fetch('http://localhost:8080/rideloopdb/api/locations/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
export async function fetchLocationById(id) {
  const response = await fetch(`http://localhost:8080/rideloop/api/locations/${id}`);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch location: ${errorText}`);
  }

  return await response.json();
}


// src/api/LocationSandR.js (or wherever this is defined)
export async function getLocationByCoordinates({ lat, lng }) {
  try {
    // 🔒 Validate inputs
    if (lat == null || lng == null) {
      throw new Error(`Invalid coordinates: lat=${lat}, lng=${lng}`);
    }

    // Ensure they are numbers
    const latitude = Number(lat);
    const longitude = Number(lng);

    if (!isFinite(latitude) || !isFinite(longitude)) {
      throw new Error(`Invalid coordinate values: lat=${lat}, lng=${lng}`);
    }

    // Build URL safely
    const url = new URL('http://localhost:8080/rideloopdb/api/locations/search');
    url.searchParams.append('latitude', latitude);
    url.searchParams.append('longitude', longitude); // No .toString() needed — append handles it

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

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