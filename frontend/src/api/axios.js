import axios from 'axios';

// Centralized Axios instance for API calls
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://workzone-api-8e0o.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
