import api from './api';

export const authService = {
  /**
   * Verify Google token with backend
   * Returns user data if exists, or indicates new user
   */
  verifyGoogleToken: async (googleToken) => {
    try {
      const response = await api.post('/api/auth/google-verify', {
        token: googleToken,
      });
      return response.data; // { user, isNewUser, googleData }
    } catch (error) {
      throw error;
    }
  },

  /**
   * Complete profile for new users
   */
  completeUserProfile: async (profileData) => {
    try {
      const response = await api.post('/api/auth/google-complete-profile', profileData);
      return response.data; // { token, user }
    } catch (error) {
      throw error;
    }
  },

  /**
   * Login existing user
   */
  loginExistingUser: async (googleToken) => {
    try {
      const response = await api.post('/api/auth/google-login', {
        token: googleToken,
      });
      return response.data; // { token, user }
    } catch (error) {
      throw error;
    }
  },

  /**
   * Logout user
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('googleData');
  },

  /**
   * Get stored token
   */
  getToken: () => localStorage.getItem('token'),

  /**
   * Get stored user
   */
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

