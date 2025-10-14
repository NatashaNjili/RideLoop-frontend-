// MaintenanceSandR.js
// Responsible for sending and receiving insurance company data from the backend

const API_URL = 'http://localhost:8080/rideloopdb/maintenance';

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
export const deleteInsurance = async (id) => {
	const res = await fetch(`${API_URL}/${id}`, {
		method: 'DELETE',
	});
	if (!res.ok) throw new Error('Failed to delete');
	return res.json();
};

// Fetch single insurance by ID
export const fetchInsuranceById = async (id) => {
	const res = await fetch(`${API_URL}/${id}`);
	if (!res.ok) throw new Error('Insurance not found');
	return res.json();
};

// Update insurance
// MaintenanceSandR.js
export const updateInsurance = async (id, data) => {
	// Build payload with correct insurance fields
	const payload = {
		insuranceCompanyName: data.insuranceCompanyName || '',
		contactPerson: data.contactPerson || '',
		contactNumber: data.contactNumber || '',
		coverageType: data.coverageType || '',
		costPerMonth: Number(data.costPerMonth) || 0,
		description: data.description || '',
	};

	try {
		const res = await fetch(`${API_URL}/update/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
      
		});
console.error('Error in updateInsurance:', payload);
		if (!res.ok) {
			const errorText = await res.text();
			throw new Error(`Failed to update: ${errorText}`);
		}

		return await res.json();
	} catch (err) {
		console.error('Error in updateInsurance:', err);
		throw err;
	}
};