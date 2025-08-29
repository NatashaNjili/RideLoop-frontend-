export async function sendLocationToBackend(coords) {
  const payload = {
	 longitude: coords.lng  ,
    latitude: coords.lat    // ← must be "latitude"
     // ← must be "longitude"
  };

  try {
    const response = await fetch('http://localhost:8080/rideloop/api/locations/create', {
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