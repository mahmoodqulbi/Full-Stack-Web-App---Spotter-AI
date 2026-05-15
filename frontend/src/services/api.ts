import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const tripService = {
  generateTrip: async (data: {
    current_location: string;
    pickup_location: string;
    dropoff_location: string;
    current_cycle_used: number;
  }) => {
    const response = await api.post('/trips/generate/', data);
    return response.data;
  },
};

export default api;
