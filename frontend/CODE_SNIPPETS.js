// ═══════════════════════════════════════════════════════════════════
// COPY-PASTE CODE SNIPPETS - Ready to Use!
// ═══════════════════════════════════════════════════════════════════

// 1. UPDATE YOUR App.jsx WITH THIS STRUCTURE:
// ═══════════════════════════════════════════════════════════════════

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Import pages
import { Login } from './pages/Login';
import { ProfileCompletion } from './pages/ProfileCompletion';
import { Home } from './pages/Home'; // Your home page
// ... import other pages

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return isLoggedIn() ? children : <Navigate to="/login" replace />;
};

// Main App Component
export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/auth/complete-profile" element={<ProfileCompletion />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Add your other protected routes here */}

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 2. CREATE A SIMPLE HOME PAGE (pages/Home.jsx):
// ═══════════════════════════════════════════════════════════════════

import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        <h1>WorkZone</h1>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      <main className="home-content">
        <div className="profile-card">
          <h2>Welcome, {user?.username}!</h2>
          <div className="user-info">
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Phone:</strong> {user?.phoneNumber}</p>
            <p><strong>Address:</strong> {user?.address}</p>
            <p><strong>Birthday:</strong> {user?.birthday}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// 3. API SERVICE USAGE IN YOUR COMPONENTS:
// ═══════════════════════════════════════════════════════════════════

import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const UserDashboard = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Token is automatically added by the interceptor!
        const response = await api.get(`/api/user/${user._id}`);
        setUserData(response.data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchUserProfile();
    }
  }, [user]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{userData?.username}'s Dashboard</h1>
      {/* Your dashboard content */}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// 4. EXAMPLE: CREATE A LOGOUT BUTTON:
// ═══════════════════════════════════════════════════════════════════

import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clear token & user from localStorage
    navigate('/login'); // Redirect to login
  };

  return (
    <button onClick={handleLogout} className="logout-btn">
      Sign Out
    </button>
  );
};

// ═══════════════════════════════════════════════════════════════════
// 5. EXAMPLE: CHECK AUTH STATUS IN COMPONENTS:
// ═══════════════════════════════════════════════════════════════════

import { useAuth } from '../context/AuthContext';

export const ConditionalComponent = () => {
  const { user, isLoggedIn, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!isLoggedIn()) {
    return <p>You need to log in to see this content.</p>;
  }

  return (
    <div>
      <p>You are logged in as: {user?.username}</p>
      <p>Email: {user?.email}</p>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// 6. EXAMPLE: FETCH DATA WITH API:
// ═══════════════════════════════════════════════════════════════════

import api from '../services/api';

async function getJobListings() {
  try {
    // Token is automatically added!
    const response = await api.get('/api/jobs');
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      // User token expired, already redirected to login by interceptor
    }
    throw error;
  }
}

async function applyForJob(jobId) {
  try {
    const response = await api.post('/api/jobs/apply', {
      jobId: jobId,
    });
    return response.data;
  } catch (error) {
    console.error('Application failed:', error.response?.data);
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════════
// 7. EXAMPLE: FORM COMPONENT WITH LOADING STATE:
// ═══════════════════════════════════════════════════════════════════

import { useState } from 'react';
import api from '../services/api';

export const ApplicationForm = ({ jobId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    coverLetter: '',
    portfolio: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/api/jobs/apply', {
        jobId,
        ...formData,
      });

      onSuccess?.(response.data);
      setFormData({ coverLetter: '', portfolio: '' });
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to submit application'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error-message">{error}</div>}

      <textarea
        value={formData.coverLetter}
        onChange={(e) =>
          setFormData({ ...formData, coverLetter: e.target.value })
        }
        placeholder="Your cover letter"
        disabled={loading}
      />

      <input
        type="url"
        value={formData.portfolio}
        onChange={(e) =>
          setFormData({ ...formData, portfolio: e.target.value })
        }
        placeholder="Portfolio URL"
        disabled={loading}
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Applying...' : 'Apply for Job'}
      </button>
    </form>
  );
};

// ═══════════════════════════════════════════════════════════════════
// 8. EXAMPLE: CUSTOM HOOK FOR USER DATA:
// ═══════════════════════════════════════════════════════════════════

import { useAuth } from '../context/AuthContext';

export const useUserProfile = () => {
  const { user, isLoggedIn } = useAuth();

  return {
    userId: user?._id,
    username: user?.username,
    email: user?.email,
    isLoggedIn: isLoggedIn(),
    hasProfile: !!(user?.username && user?.email),
  };
};

// Usage:
export const ProfileWidget = () => {
  const { username, email, isLoggedIn } = useUserProfile();

  if (!isLoggedIn) {
    return <p>Please log in</p>;
  }

  return (
    <div>
      <h3>{username}</h3>
      <p>{email}</p>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// 9. BASIC STYLING FOR LOADING/ERROR STATES:
// ═══════════════════════════════════════════════════════════════════

/* CSS to add to your global styles or components */

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 1rem;
}

.spinner {
  border: 4px solid #f0f0f0;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #c33;
  margin-bottom: 1rem;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f9f9f9;
  border-bottom: 1px solid #eee;
}

.profile-card {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin: 2rem auto;
}

.user-info {
  margin-top: 1rem;
}

.user-info p {
  margin: 0.5rem 0;
  padding: 0.5rem;
  background: #f9f9f9;
  border-radius: 4px;
}

// ═══════════════════════════════════════════════════════════════════
// 10. ENV VARIABLES SETUP (.env file):
// ═══════════════════════════════════════════════════════════════════

# Development
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your-google-client-id-dev

# Production will be set in Vercel dashboard:
# VITE_API_URL=https://your-backend.onrender.com
# VITE_GOOGLE_CLIENT_ID=your-google-client-id-prod

// ═══════════════════════════════════════════════════════════════════
// END OF CODE SNIPPETS
// ═══════════════════════════════════════════════════════════════════
