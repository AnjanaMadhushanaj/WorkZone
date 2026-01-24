# Frontend-Backend Integration Guide

## Overview
This guide explains how to connect the WorkZone frontend to the newly created backend authentication system.

## Backend Status
✅ Backend authentication system is ready and running on `http://localhost:5000`

## Current Frontend Implementation

The frontend currently has:
- **Login page** (`/src/pages/Login.jsx`) - Uses local mock authentication
- **Registration page** (`/src/pages/Registration.jsx`) - Uses local mock authentication
- **AuthContext** (`/src/context/AuthContext.jsx`) - Manages user state and localStorage
- **API Setup** (`/src/api/axios.js`) - Axios instance with baseURL configuration

## Integration Steps

### Step 1: Update Frontend Environment
Create or update `.env` file in the frontend root:
```
VITE_API_URL=http://localhost:5000
```

### Step 2: Update Login Component
Modify `src/pages/Login.jsx` to call the backend:

```jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import api from '../api/axios';
import '../styles/Login.css';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
        
        // Call login with user data
        login(response.data.user);
        
        navigate('/');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      setErrors({ submit: errorMessage });
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          {errors.submit && <div className="error-alert">{errors.submit}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};
```

### Step 3: Update Registration Component
Similarly, update `src/pages/Registration.jsx`:

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import '../styles/Registration.css';

export const Registration = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    identityCardNumber: '',
    company: '',
    companyRegistration: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.phone) newErrors.phone = 'Phone number is required';

    if (role === 'student' && !formData.identityCardNumber) {
      newErrors.identityCardNumber = 'Identity Card Number is required';
    }

    if (role === 'company') {
      if (!formData.company) newErrors.company = 'Company name is required';
      if (!formData.companyRegistration) newErrors.companyRegistration = 'Registration number is required';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setFormData({
      ...formData,
      identityCardNumber: '',
      company: '',
      companyRegistration: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: role,
        ...(role === 'student' && { identityCardNumber: formData.identityCardNumber }),
        ...(role === 'company' && {
          company: formData.company,
          companyRegistration: formData.companyRegistration,
        }),
      };

      const response = await api.post('/api/auth/signup', payload);

      if (response.data.success) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
        
        // Call login with user data
        login(response.data.user);

        // Redirect based on role
        if (role === 'company') {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.message === 'Email already registered') {
        setErrors({ email: 'Email already registered' });
      } else {
        setErrors({ submit: errorData?.message || 'Registration failed' });
      }
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  // ... rest of the component remains the same
```

### Step 4: Update Axios Instance
Update `src/api/axios.js` to include authentication token:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Step 5: Update AuthContext
Update `src/context/AuthContext.jsx` to verify token on app load:

```jsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          // Verify token with backend
          const response = await api.get('/api/auth/user');
          if (response.data.success) {
            setUser(response.data.user);
          } else {
            // Token invalid, clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (error) {
          // Token verification failed
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          console.error('Auth verification failed:', error);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const isLoggedIn = () => !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

## Testing the Integration

### 1. Start both servers
```bash
# Terminal 1 - Backend
cd /Users/avishka/backend/WorkZone/backend
npm run dev

# Terminal 2 - Frontend
cd /Users/avishka/backend/WorkZone/frontend
npm run dev
```

### 2. Test Registration
1. Navigate to `/registration`
2. Fill in the form with test data
3. Submit the form
4. Check that the user is registered and redirected to home or dashboard

### 3. Test Login
1. Navigate to `/login`
2. Enter the email and password from registration
3. Check that login is successful and you're redirected

### 4. Test Token Storage
Open browser DevTools (F12) → Application → Local Storage
- `user` - Contains user object
- `token` - Contains JWT token

## Error Handling

The integration includes proper error handling for:
- ✅ Network errors
- ✅ Invalid credentials
- ✅ Duplicate email registration
- ✅ Validation errors
- ✅ Server errors

## Security Notes

1. **Token Storage**: Tokens are stored in localStorage (consider upgrading to httpOnly cookies in production)
2. **CORS**: Backend accepts requests from all origins in development
3. **Password**: Passwords are hashed with bcryptjs on the backend
4. **Validation**: Both frontend and backend validate user inputs

## Next Steps

1. Implement password reset functionality
2. Add email verification
3. Create user profile/settings endpoints
4. Implement role-based access control
5. Add more job-related endpoints
6. Set up production deployment

## Troubleshooting

### CORS Errors
If you see CORS errors, ensure:
- Backend is running on http://localhost:5000
- Frontend `.env` has `VITE_API_URL=http://localhost:5000`
- Backend has CORS enabled (it does by default)

### Token Not Working
- Check if token is stored in localStorage
- Verify token format in Application tab (should start with valid JWT)
- Check backend logs for validation errors

### MongoDB Connection Error
- Ensure MongoDB is running (`brew services list`)
- Check `.env` MONGO_URI is correct
- For MongoDB Atlas, use connection string from Atlas dashboard

---

For more details, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
