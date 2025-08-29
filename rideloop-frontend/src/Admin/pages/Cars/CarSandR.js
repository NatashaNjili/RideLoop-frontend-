const API_BASE = 'http://localhost:8080/rideloop/api/cars';

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


