import axios from 'axios';

// const API_URL = 'http://localhost:8000';
const API_URL = 'https://flight-status-system.onrender.com';

export async function getFlightStatus(flightId) {
  const token = localStorage.getItem("token");
  return axios.get(`${API_URL}/status/${flightId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function updateFlightStatus(payload) {
  const token = localStorage.getItem("token");
  return axios.post(`${API_URL}/status/`, payload, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true
  });
}

export async function getAllFlights() {
  const token = localStorage.getItem("token");
  return axios.get(`${API_URL}/flights`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}