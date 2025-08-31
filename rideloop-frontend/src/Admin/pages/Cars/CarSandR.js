const API_BASE = 'http://localhost:8080/rideloopdb/api/cars';

export async function fetchAllCars() {
  const response = await fetch(`${API_BASE}/all`);
  if (!response.ok) throw new Error('Failed to fetch cars');
  return await response.json();
}

export async function createCar(carData) {
  const response = await fetch(`${API_BASE}/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(carData),
  });
  if (!response.ok) throw new Error('Failed to create car');
  return await response.json();
}
export async function updateCarLocation(carId, location, distanceTravelled) {
  const response = await fetch(`${API_BASE}/update-location/${carId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location: {
        latitude: location.latitude || location.lat,
        longitude: location.longitude || location.lng,
      },
      distanceTravelled: Math.round(distanceTravelled * 1000), // km → meters
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update car location: ${error}`);
  }

  return await response.json(); // Returns updated car
}

