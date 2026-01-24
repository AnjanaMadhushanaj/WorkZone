import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import '../styles/ProfileCompletion.css';

export const ProfileCompletion = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const googleData = location.state?.googleData || JSON.parse(localStorage.getItem('googleData') || '{}');

  const [formData, setFormData] = useState({
    username: '',
    birthday: '',
    phoneNumber: '',
    address: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    if (!formData.birthday) {
      newErrors.birthday = 'Birthday is required';
    } else {
      const age = new Date().getFullYear() - new Date(formData.birthday).getFullYear();
      if (age < 13) {
        newErrors.birthday = 'You must be at least 13 years old';
      }
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number format';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.length < 5) {
      newErrors.address = 'Address must be at least 5 characters';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      // Combine Google data with profile completion data
      const completeProfileData = {
        ...googleData,
        ...formData,
      };

      // Send to backend to create/complete user profile
      const response = await authService.completeUserProfile(completeProfileData);

      // Save token and user
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.removeItem('googleData'); // Clean up

      // Redirect to home
      navigate('/');
    } catch (err) {
      console.error('Profile completion error:', err);
      setError(
        err.response?.data?.message || 'Failed to complete profile. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-completion-container">
      <div className="profile-completion-card">
        <div className="profile-header">
          <h1>Complete Your Profile</h1>
          <p className="subtitle">Just a few more details to get started on WorkZone</p>
        </div>

        {error && (
          <div className="error-alert">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Google Info Display */}
          {googleData.email && (
            <div className="google-info-display">
              {googleData.picture && (
                <img src={googleData.picture} alt="Profile" className="profile-picture" />
              )}
              <div className="google-info">
                <p className="info-label">Signing in as:</p>
                <p className="info-value">{googleData.email}</p>
                {googleData.name && (
                  <p className="info-value secondary">{googleData.name}</p>
                )}
              </div>
            </div>
          )}

          {/* Username Field */}
          <div className="form-group">
            <label htmlFor="username">Username *</label>
            <p className="field-hint">Choose a unique username for your WorkZone account</p>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="john_doe"
              disabled={loading}
              maxLength="30"
            />
            {errors.username && <span className="field-error">{errors.username}</span>}
          </div>

          {/* Birthday Field */}
          <div className="form-group">
            <label htmlFor="birthday">Birthday *</label>
            <p className="field-hint">Must be at least 13 years old</p>
            <input
              type="date"
              id="birthday"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.birthday && <span className="field-error">{errors.birthday}</span>}
          </div>

          {/* Phone Number Field */}
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number *</label>
            <p className="field-hint">We'll only use this to contact you about your account</p>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
              disabled={loading}
            />
            {errors.phoneNumber && <span className="field-error">{errors.phoneNumber}</span>}
          </div>

          {/* Address Field */}
          <div className="form-group">
            <label htmlFor="address">Address *</label>
            <p className="field-hint">Your residential address</p>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Main Street, Apt 4B, New York, NY 10001"
              disabled={loading}
              rows="3"
            />
            {errors.address && <span className="field-error">{errors.address}</span>}
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-mini"></span>
                Creating your account...
              </>
            ) : (
              'Complete Profile & Get Started'
            )}
          </button>
        </form>

        <div className="profile-footer">
          <p className="privacy-notice">
            ✓ Your information is secure and encrypted
            <br />
            ✓ We comply with GDPR and privacy regulations
          </p>
        </div>
      </div>
    </div>
  );
};
