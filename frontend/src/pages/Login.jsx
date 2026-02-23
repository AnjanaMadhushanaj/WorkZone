import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { authService } from '../services/authService';
import '../styles/Login.css';

/**
 * Login Component - Google OAuth Authentication
 * Handles user authentication via Google OAuth 2.0
 */
export const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if already logged in
  useEffect(() => {
    const token = authService.getToken();
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  /**
   * Handle Google Login Success
   * 1. Send token to backend for verification
   * 2. If existing user -> login and redirect to home
   * 3. If new user -> redirect to profile completion
   */
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');

    try {
      // Verify the Google token with backend
      const verificationResponse = await authService.verifyGoogleToken(
        credentialResponse.credential
      );

      // Store Google data temporarily for profile completion if needed
      localStorage.setItem('googleData', JSON.stringify(verificationResponse.googleData));

      if (verificationResponse.isNewUser) {
        // New user: redirect to profile completion
        navigate('/auth/complete-profile', {
          state: { googleData: verificationResponse.googleData },
        });
      } else {
        // Existing user: login and redirect to home
        const loginResponse = await authService.loginExistingUser(
          credentialResponse.credential
        );

        localStorage.setItem('token', loginResponse.token);
        localStorage.setItem('user', JSON.stringify(loginResponse.user));

        navigate('/');
      }
    } catch (err) {
      console.error('Google login error:', err);
      setError(
        err.response?.data?.message || 'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed. Please try again.');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome to WorkZone</h1>
          <p className="subtitle">Sign in with your Google account to get started</p>
        </div>

        {error && (
          <div className="error-alert">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <div className="google-login-section">
          {!loading ? (
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              text="signin_with"
              width="100%"
              locale="en"
            />
          ) : (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Signing you in...</p>
            </div>
          )}
        </div>

        <div className="login-divider">
          <span>or</span>
        </div>

        <p className="login-note">
          🔒 We use your Google account securely. Your data is safe with us.
        </p>

        <div className="login-footer">
          <p className="terms-text">
            By signing in, you agree to our{' '}
            <a href="/terms" target="_blank" rel="noreferrer">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" target="_blank" rel="noreferrer">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

