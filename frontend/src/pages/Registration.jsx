import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import api from '../services/api';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';
import '../styles/Registration.css';

export const Registration = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthday: '',
    mobileNumber: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.birthday) {
      newErrors.birthday = 'Birthday is required';
    } else {
      const birthDate = new Date(formData.birthday);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      if (age < 13) {
        newErrors.birthday = 'You must be at least 13 years old';
      }
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^[\d\s\-\+\(\)]{7,}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Invalid mobile number format';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        birthday: formData.birthday,
        mobileNumber: formData.mobileNumber,
      });

      if (response.data.token) {
        login(response.data.token, response.data.user);
        setSuccessMessage('Registration successful! Redirecting...');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Registration failed. Please try again.';
      setErrors({ form: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const result = await authService.verifyGoogleToken(
        credentialResponse.credential
      );

      if (result.isNewUser) {
        localStorage.setItem('googleData', JSON.stringify(result.googleData));
        navigate('/auth/complete-profile');
      } else {
        login(result.token, result.user);
        navigate('/');
      }
    } catch (error) {
      setErrors({
        form: error.response?.data?.message || 'Google sign-up failed',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setErrors({ form: 'Google sign-up failed. Please try again.' });
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        <div className="registration-header">
          <div className="brand-badge">WZ</div>
          <div>
            <h1>Create your WorkZone account</h1>
            <p className="subtitle">Turn Spare Time into Income</p>
          </div>
        </div>

        {successMessage && <div className="success-message">{successMessage}</div>}
        {errors.form && <div className="error-message">{errors.form}</div>}

        <div className="google-button-container">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            text="signup_with"
          />
        </div>

        <div className="divider">
          <span>Or sign up with email</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="two-column">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                disabled={loading}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                disabled={loading}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>
          </div>

          <div className="two-column">
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                disabled={loading}
              />
              {errors.password && (
                <span className="field-error">{errors.password}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                disabled={loading}
              />
              {errors.confirmPassword && (
                <span className="field-error">{errors.confirmPassword}</span>
              )}
            </div>
          </div>

          <div className="two-column">
            <div className="form-group">
              <label htmlFor="birthday">Birthday *</label>
              <input
                type="date"
                id="birthday"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.birthday && (
                <span className="field-error">{errors.birthday}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="mobileNumber">Mobile Number *</label>
              <input
                type="tel"
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                disabled={loading}
              />
              {errors.mobileNumber && (
                <span className="field-error">{errors.mobileNumber}</span>
              )}
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="form-footer">
          <p>
            Already have an account?{' '}
            <a
              href="/login"
              onClick={(e) => {
                e.preventDefault();
                navigate('/login');
              }}
            >
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import api from '../services/api';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';
import '../styles/Registration.css';

export const Registration = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    birthday: '',
    mobileNumber: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.birthday) {
      newErrors.birthday = 'Birthday is required';
    } else {
      const birthDate = new Date(formData.birthday);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      if (age < 13) {
        newErrors.birthday = 'You must be at least 13 years old';
      }
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^[\d\s\-\+\(\)]{7,}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Invalid mobile number format';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        birthday: formData.birthday,
        mobileNumber: formData.mobileNumber,
      });

      if (response.data.token) {
        login(response.data.token, response.data.user);
        setSuccessMessage('Registration successful! Redirecting...');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Registration failed. Please try again.';
      setErrors({ form: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const result = await authService.verifyGoogleToken(
        credentialResponse.credential
      );

      if (result.isNewUser) {
        // Store Google data for profile completion
        localStorage.setItem('googleData', JSON.stringify(result.googleData));
        navigate('/auth/complete-profile');
      } else {
        // Existing user - auto login
        login(result.token, result.user);
        navigate('/');
      }
    } catch (error) {
      setErrors({
        form: error.response?.data?.message || 'Google sign-up failed',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setErrors({ form: 'Google sign-up failed. Please try again.' });
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        <h1>Create User Account</h1>
        <p className="subtitle">Join WorkZone and start your journey</p>

        {successMessage && <div className="success-message">{successMessage}</div>}
        {errors.form && <div className="error-message">{errors.form}</div>}

        {/* Google OAuth Button */}
        <div className="google-button-container">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            text="signup_with"
          />
        </div>

        {/* Divider */}
        <div className="divider">
          <span>Or use your email</span>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              disabled={loading}
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              disabled={loading}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              disabled={loading}
            />
            {errors.password && (
              <span className="field-error">{errors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="birthday">Birthday *</label>
            <input
              type="date"
              id="birthday"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.birthday && (
              <span className="field-error">{errors.birthday}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="mobileNumber">Mobile Number *</label>
            <input
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
              disabled={loading}
            />
            {errors.mobileNumber && (
              <span className="field-error">{errors.mobileNumber}</span>
            )}
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="form-footer">
          <p>
            Already have an account?{' '}
            <a
              href="/login"
              onClick={(e) => {
                e.preventDefault();
                navigate('/login');
              }}
            >
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
