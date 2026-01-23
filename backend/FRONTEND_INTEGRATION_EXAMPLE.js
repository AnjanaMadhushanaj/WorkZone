// src/api/axios.js
// ============================================
// Axios instance with JWT token handling
// ============================================

import axios from 'axios';

// Use Vercel environment variable if available
const API_BASE_URL = 
  process.env.REACT_APP_API_URL || 
  'http://localhost:5000/api';

console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - Add JWT token to every request
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData.token) {
          config.headers.Authorization = `Bearer ${userData.token}`;
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;


// ============================================
// Example Usage in Components
// ============================================

/*

// LOGIN COMPONENT
import api from '../api/axios';

const handleSubmit = async (e) => {
  e.preventDefault();
  const newErrors = {};

  if (!formData.email) newErrors.email = 'Email is required';
  if (!formData.password) newErrors.password = 'Password is required';

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  try {
    const response = await api.post('/auth/login', {
      email: formData.email,
      password: formData.password,
    });

    const userData = {
      id: response.data.user.id,
      name: response.data.user.name,
      email: response.data.user.email,
      role: response.data.user.role,
      phone: response.data.user.phone,
      token: response.data.token,
    };

    login(userData);
    
    if (response.data.user.role === 'company') {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  } catch (error) {
    const errorMessage = 
      error.response?.data?.message || 
      'Login failed. Please try again.';
    setErrors({ submit: errorMessage });
  }
};

// ============================================

// REGISTRATION COMPONENT
import api from '../api/axios';

const handleSubmit = async (e) => {
  e.preventDefault();
  const newErrors = validateForm();

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  try {
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      role: role,
    };

    // Add role-specific fields
    if (role === 'student') {
      payload.identityCardNumber = formData.identityCardNumber;
    } else if (role === 'company') {
      payload.company = formData.company;
      payload.companyRegistration = formData.companyRegistration;
    }

    const response = await api.post('/auth/register', payload);

    const userData = {
      id: response.data.user.id,
      name: response.data.user.name,
      email: response.data.user.email,
      role: response.data.user.role,
      phone: response.data.user.phone,
      token: response.data.token,
    };

    login(userData);
    
    if (role === 'company') {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  } catch (error) {
    const errorMessage = 
      error.response?.data?.message || 
      'Registration failed. Please try again.';
    setErrors({ submit: errorMessage });
  }
};

// ============================================

// GET CURRENT USER
const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data.user;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
};

// ============================================

// UPDATE PROFILE
const updateUserProfile = async (updateData) => {
  try {
    const response = await api.put('/auth/update-profile', updateData);
    return response.data.user;
  } catch (error) {
    console.error('Failed to update profile:', error);
    throw error;
  }
};

// ============================================

// LOGOUT
const handleLogout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    logout(); // Your context logout function
    navigate('/login');
  }
};

*/
