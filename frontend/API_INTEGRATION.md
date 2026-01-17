# API Integration Guide

This document explains how to connect the React frontend to the backend API.

## Base Configuration

Create `src/services/api.js`:

```javascript
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const user = localStorage.getItem('user');
  if (user) {
    const userData = JSON.parse(user);
    if (userData.token) {
      config.headers.Authorization = `Bearer ${userData.token}`;
    }
  }
  return config;
});

export default api;
```

## API Endpoints Integration

### 1. Authentication Endpoints

#### Register User
**File**: `src/pages/Registration.jsx`

```javascript
// Replace mock registration with:
const handleSubmit = async (e) => {
  e.preventDefault();
  const newErrors = validateForm();

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  try {
    const response = await api.post('/auth/register', {
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
    });

    const userData = {
      id: response.data.user.id,
      name: response.data.user.name,
      email: response.data.user.email,
      role: response.data.user.role,
      token: response.data.token,
    };

    login(userData);
    navigate(role === 'company' ? '/dashboard' : '/');
  } catch (error) {
    setErrors({ submit: error.response?.data?.message || 'Registration failed' });
  }
};
```

#### Login User
**File**: `src/pages/Login.jsx`

```javascript
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
      token: response.data.token,
    };

    login(userData);
    navigate('/');
  } catch (error) {
    setErrors({ submit: error.response?.data?.message || 'Login failed' });
  }
};
```

### 2. Job Endpoints

#### Fetch All Jobs (Home Page)
**File**: `src/pages/Home.jsx`

```javascript
import { useEffect, useState } from 'react';
import api from '../services/api';

export const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get('/jobs');
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // ... rest of component
};
```

#### Fetch Job Details
**File**: `src/pages/JobDetails.jsx`

```javascript
import { useEffect } from 'react';
import api from '../services/api';

useEffect(() => {
  const fetchJobDetails = async () => {
    try {
      const response = await api.get(`/jobs/${jobId}`);
      setJob(response.data);
    } catch (error) {
      console.error('Error fetching job:', error);
      navigate('/');
    }
  };

  if (isLoggedIn()) {
    fetchJobDetails();
  }
}, [jobId, isLoggedIn]);
```

### 3. Application/Job Request Endpoints

#### Apply for Job
**File**: `src/pages/JobDetails.jsx`

```javascript
const handleApplyJob = async () => {
  setLoading(true);
  try {
    const response = await api.post('/applications', {
      jobId: parseInt(jobId),
      studentId: user.id,
    });

    setApplicationStatus('pending');
    console.log('Applied successfully:', response.data);
  } catch (error) {
    console.error('Error applying for job:', error);
    alert(error.response?.data?.message || 'Failed to apply for job');
  }
  setLoading(false);
};
```

#### Request Payment
**File**: `src/pages/JobDetails.jsx`

```javascript
const handleRequestPayment = async () => {
  setLoading(true);
  try {
    const response = await api.post(`/applications/${applicationId}/request-payment`, {
      jobId: job.id,
      studentId: user.id,
    });

    setApplicationStatus('payment_requested');
    console.log('Payment requested:', response.data);
  } catch (error) {
    console.error('Error requesting payment:', error);
    alert(error.response?.data?.message || 'Failed to request payment');
  }
  setLoading(false);
};
```

#### Fetch Job Requests (Pending Applications)
**File**: `src/pages/CompanyDashboard.jsx`

```javascript
useEffect(() => {
  const fetchJobRequests = async () => {
    try {
      const response = await api.get(`/company/${user.id}/applications?status=pending`);
      setJobRequests(response.data);
    } catch (error) {
      console.error('Error fetching job requests:', error);
    }
  };

  if (isLoggedIn() && user?.role === 'company') {
    fetchJobRequests();
  }
}, [isLoggedIn, user]);
```

#### Approve Job Application
**File**: `src/pages/CompanyDashboard.jsx`

```javascript
const handleApproveRequest = async (requestId) => {
  try {
    const response = await api.put(`/applications/${requestId}/approve`, {
      status: 'approved',
    });

    setJobRequests(
      jobRequests.map((req) =>
        req.id === requestId ? { ...req, status: 'approved' } : req
      )
    );
    console.log('Request approved:', response.data);
  } catch (error) {
    console.error('Error approving request:', error);
    alert('Failed to approve request');
  }
};
```

#### Reject Job Application
**File**: `src/pages/CompanyDashboard.jsx`

```javascript
const handleRejectRequest = async (requestId) => {
  try {
    const response = await api.delete(`/applications/${requestId}`);
    
    setJobRequests(jobRequests.filter((req) => req.id !== requestId));
    console.log('Request rejected:', response.data);
  } catch (error) {
    console.error('Error rejecting request:', error);
    alert('Failed to reject request');
  }
};
```

### 4. Company Dashboard Endpoints

#### Post New Job
**File**: `src/pages/CompanyDashboard.jsx`

```javascript
const handlePostJob = async (e) => {
  e.preventDefault();
  if (!newJob.title || !newJob.description || !newJob.price || !newJob.time) {
    alert('Please fill all fields');
    return;
  }

  try {
    const response = await api.post('/jobs', {
      title: newJob.title,
      description: newJob.description,
      price: parseFloat(newJob.price),
      time: newJob.time,
      companyId: user.id,
    });

    console.log('Job posted:', response.data);
    setNewJob({ title: '', description: '', price: '', time: '' });
    setShowPostJobForm(false);
    alert('Job posted successfully!');

    // Refresh recent jobs list
    // You might want to fetch updated jobs here
  } catch (error) {
    console.error('Error posting job:', error);
    alert(error.response?.data?.message || 'Failed to post job');
  }
};
```

#### Fetch Recent Jobs
**File**: `src/pages/CompanyDashboard.jsx`

```javascript
useEffect(() => {
  const fetchRecentJobs = async () => {
    try {
      const response = await api.get(`/company/${user.id}/jobs`);
      setRecentJobs(response.data);
    } catch (error) {
      console.error('Error fetching recent jobs:', error);
    }
  };

  if (isLoggedIn() && user?.role === 'company') {
    fetchRecentJobs();
  }
}, [isLoggedIn, user]);
```

#### Fetch Payment Requests
**File**: `src/pages/CompanyDashboard.jsx`

```javascript
useEffect(() => {
  const fetchPaymentRequests = async () => {
    try {
      const response = await api.get(`/company/${user.id}/applications?status=payment_requested`);
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payment requests:', error);
    }
  };

  if (isLoggedIn() && user?.role === 'company') {
    fetchPaymentRequests();
  }
}, [isLoggedIn, user]);
```

#### Process Payment
**File**: `src/pages/CompanyDashboard.jsx`

```javascript
const handlePayStudent = async (paymentId, amount) => {
  try {
    const response = await api.post(`/payments`, {
      applicationId: paymentId,
      amount: parseFloat(amount),
      companyId: user.id,
    });

    setPayments(payments.filter((payment) => payment.id !== paymentId));
    console.log('Payment processed:', response.data);
    alert(`Payment of $${amount} processed successfully!`);
  } catch (error) {
    console.error('Error processing payment:', error);
    alert(error.response?.data?.message || 'Failed to process payment');
  }
};
```

## Backend API Response Format

### Expected Response Structures

#### Job Object
```json
{
  "id": 1,
  "title": "Web Development Task",
  "company": "Tech Corp",
  "companyId": 1,
  "price": 50,
  "time": "2 hours",
  "description": "Build a responsive website",
  "createdAt": "2025-01-15T10:00:00Z"
}
```

#### Application Object
```json
{
  "id": 1,
  "jobId": 1,
  "studentId": 2,
  "studentName": "John Doe",
  "status": "pending",
  "appliedDate": "2025-01-16T10:00:00Z"
}
```

#### User Object
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "student",
  "phone": "1234567890",
  "identityCardNumber": "ID123456",
  "token": "jwt_token_here"
}
```

## Error Handling

Create `src/services/errorHandler.js`:

```javascript
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || 'An error occurred';
    const status = error.response.status;

    switch (status) {
      case 401:
        return 'Please login again';
      case 403:
        return 'You do not have permission';
      case 404:
        return 'Resource not found';
      case 500:
        return 'Server error';
      default:
        return message;
    }
  } else if (error.request) {
    return 'No response from server';
  } else {
    return 'Error: ' + error.message;
  }
};
```

## Environment Variables

Create `.env`:

```
VITE_API_URL=http://localhost:3000/api
```

Then update `src/services/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
```

## Testing API Endpoints

Use tools like Postman or curl to test endpoints:

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "1234567890",
    "role": "student",
    "identityCardNumber": "ID123456"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Get All Jobs
curl -X GET http://localhost:3000/api/jobs

# Get Job Details
curl -X GET http://localhost:3000/api/jobs/1

# Apply for Job
curl -X POST http://localhost:3000/api/applications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "jobId": 1,
    "studentId": 2
  }'
```

## Summary

The frontend is designed to be backend-agnostic. Replace all `mock data` and `console.log` statements with actual API calls using the patterns shown above. Ensure your backend API returns data in the expected format for seamless integration.