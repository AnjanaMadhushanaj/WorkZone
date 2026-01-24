// App.jsx - Route Configuration Guide
// Add these imports to your App component:

import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { ProfileCompletion } from './pages/ProfileCompletion';
import { AuthProvider, useAuth } from './context/AuthContext';

// Create a ProtectedRoute component for routes that require authentication:
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return isLoggedIn() ? children : <Navigate to="/login" replace />;
};

// In your App component, wrap with AuthProvider:
export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/auth/complete-profile" element={<ProfileCompletion />} />

        {/* Protected Routes Example */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        {/* Other routes... */}
      </Routes>
    </AuthProvider>
  );
}

/*
FLOW EXPLANATION:

1. User visits /login
   ↓
2. Clicks "Sign in with Google"
   ↓
3. Frontend sends Google token to /api/auth/google-verify
   ↓
4a. If EXISTING USER:
    - Backend returns { isNewUser: false, user, token }
    - Frontend automatically calls /api/auth/google-login
    - User is saved to localStorage
    - Redirect to / (Home Page)
   ↓
4b. If NEW USER:
    - Backend returns { isNewUser: true, googleData }
    - Frontend redirects to /auth/complete-profile
    - User fills in: username, birthday, phone, address
    ↓
5. User submits form
   - Frontend sends complete data to /api/auth/google-complete-profile
   - Backend creates new user and returns { token, user }
   - User is saved to localStorage
   - Redirect to / (Home Page)
*/
