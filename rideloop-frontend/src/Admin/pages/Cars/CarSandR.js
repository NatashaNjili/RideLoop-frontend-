const API_BASE = 'http://localhost:8080/rideloopdb/api/cars';

const getAuthHeaders = () => {
  const token = localStorage.getItem('jwtToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export async function fetchAllCars() {
  const response = await fetch(`${API_BASE}/all`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error('Failed to fetch cars');
  return await response.json();
}

export async function createCar(carData) {
  const response = await fetch(`${API_BASE}/create`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(carData),
  });
  if (!response.ok) throw new Error('Failed to create car');
  return await response.json();
}

export async function updateCarLocation(carId, location, distanceTravelled) {
  const response = await fetch(`${API_BASE}/update-location/${carId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
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

export const fetchCarById = async (id) => {
  const res = await fetch(`${API_BASE}/${id}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Car not found');
  return res.json();
};

export const updateCar = async (id, carData) => {
  const res = await fetch(`${API_BASE}/update/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(carData),
  });
  if (!res.ok) throw new Error('Failed to update car');
  return res.json();
};

export const deleteCar = async (id) => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete car');
};
