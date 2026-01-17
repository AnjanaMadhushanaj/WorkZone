import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Prepare user data
    const userData = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: role,
      ...(role === 'student' && { identityCardNumber: formData.identityCardNumber }),
      ...(role === 'company' && {
        company: formData.company,
        companyRegistration: formData.companyRegistration,
      }),
    };

    // Store user in context and localStorage
    login(userData);

    // Redirect based on role
    if (role === 'company') {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        <h1>Create Your Account</h1>

        <div className="role-selector">
          <label>
            <input
              type="radio"
              value="student"
              checked={role === 'student'}
              onChange={handleRoleChange}
            />
            Student
          </label>
          <label>
            <input
              type="radio"
              value="company"
              checked={role === 'company'}
              onChange={handleRoleChange}
            />
            Company
          </label>
        </div>

        <form onSubmit={handleSubmit} className="registration-form">
          {/* Common Fields */}
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? 'error' : ''}
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          {/* Student-Specific Fields */}
          {role === 'student' && (
            <div className="form-group conditional-field">
              <label htmlFor="identityCardNumber">Identity Card Number *</label>
              <input
                type="text"
                id="identityCardNumber"
                name="identityCardNumber"
                value={formData.identityCardNumber}
                onChange={handleChange}
                className={errors.identityCardNumber ? 'error' : ''}
                placeholder="Enter your ID card number"
              />
              {errors.identityCardNumber && (
                <span className="error-text">{errors.identityCardNumber}</span>
              )}
            </div>
          )}

          {/* Company-Specific Fields */}
          {role === 'company' && (
            <>
              <div className="form-group conditional-field">
                <label htmlFor="company">Company Name *</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className={errors.company ? 'error' : ''}
                  placeholder="Enter company name"
                />
                {errors.company && <span className="error-text">{errors.company}</span>}
              </div>

              <div className="form-group conditional-field">
                <label htmlFor="companyRegistration">Registration Number *</label>
                <input
                  type="text"
                  id="companyRegistration"
                  name="companyRegistration"
                  value={formData.companyRegistration}
                  onChange={handleChange}
                  className={errors.companyRegistration ? 'error' : ''}
                  placeholder="Enter registration number"
                />
                {errors.companyRegistration && (
                  <span className="error-text">{errors.companyRegistration}</span>
                )}
              </div>
            </>
          )}

          <button type="submit" className="submit-btn">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};
