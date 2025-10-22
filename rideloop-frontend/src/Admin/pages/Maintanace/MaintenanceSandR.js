

// src/Common/pages/MaintenanceSandR.js
// Responsible for sending and receiving insurance company data from the backend

const API_URL = 'http://localhost:8080/rideloopdb/maintenance';

// ===== Helper: Get headers with optional JWT token =====
const getHeaders = (token) => {
  const jwtToken = token || localStorage.getItem('jwtToken'); // Ensure matches login storage
  return {
    'Content-Type': 'application/json',
    ...(jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {}),
  };
};

// ===== Create new insurance company =====
export async function sendInsuranceToBackend(data, token = null) {
  try {
    const res = await fetch(`${API_URL}/create`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    return await res.json();
  } catch (err) {
    console.error('Error sending insurance:', err);
    throw err;
  }
}

// ===== Fetch all insurance companies =====
export async function fetchAllInsurance(token = null) {
  try {
    const res = await fetch(`${API_URL}/all`, {
      method: 'GET',
      headers: getHeaders(token),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    return await res.json();
  } catch (err) {
    console.error('Error fetching insurance:', err);
    throw err;
  }
}

// ===== Fetch single insurance by ID =====
export async function fetchInsuranceById(id, token = null) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'GET',
      headers: getHeaders(token),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Insurance not found: ${text}`);
    }

    return await res.json();
  } catch (err) {
    console.error('Error fetching insurance by ID:', err);
    throw err;
  }
}

// ===== Update insurance =====
export async function updateInsurance(id, data, token = null) {
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
      headers: getHeaders(token),
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to update: ${text}`);
    }

    return await res.json();
  } catch (err) {
    console.error('Error updating insurance:', err);
    throw err;
  }
}

// ===== Delete insurance by ID =====
export async function deleteInsurance(id, token = null) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to delete: ${text}`);
    }

    return await res.json();
  } catch (err) {
    console.error('Error deleting insurance:', err);
    throw err;
  }
}
