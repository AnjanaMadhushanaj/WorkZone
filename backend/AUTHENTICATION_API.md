# WorkZone Backend - Authentication API Documentation

## Overview
Professional authentication system with JWT tokens, password hashing (bcryptjs), and role-based access control. Built for Render backend + Vercel frontend integration.

---

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the backend root directory:

```env
# MongoDB Connection (MongoDB Atlas)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/workzone

# JWT Secret (Generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URLs
FRONTEND_URL=http://localhost:3000
# For Vercel: FRONTEND_URL=https://your-frontend.vercel.app
```

### 3. Start the Server
```bash
# Development with auto-reload
npm run dev

# Production
npm start
```

---

## API Endpoints

### Base URL
- **Development**: `http://localhost:5000/api`
- **Production (Render)**: `https://your-backend.render.com/api`

---

## Authentication Endpoints

### 1. Register User
**Endpoint**: `POST /api/auth/register`

**Access**: Public

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "phone": "+1234567890",
  "role": "student",
  "identityCardNumber": "NIC123456789"
}
```

**For Company User**:
```json
{
  "name": "Company Admin",
  "email": "admin@company.com",
  "password": "SecurePassword123",
  "phone": "+1234567890",
  "role": "company",
  "company": "Tech Solutions Inc",
  "companyRegistration": "REG-12345"
}
```

**Success Response** (201):
```json
{
  "success": true,
  "message": "Account created successfully!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "phone": "+1234567890",
    "identityCardNumber": "NIC123456789"
  }
}
```

**Error Response** (400/409):
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Valid email is required",
    "password": "Password must be at least 6 characters"
  }
}
```

---

### 2. Login User
**Endpoint**: `POST /api/auth/login`

**Access**: Public

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Logged in successfully!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "phone": "+1234567890",
    "lastLogin": "2024-01-24T10:30:00.000Z"
  }
}
```

**Error Response** (401):
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### 3. Get Current User Profile
**Endpoint**: `GET /api/auth/me`

**Access**: Private (Requires Token)

**Headers**:
```
Authorization: Bearer <your_jwt_token>
```

**Success Response** (200):
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "phone": "+1234567890",
    "lastLogin": "2024-01-24T10:30:00.000Z",
    "createdAt": "2024-01-20T08:15:30.000Z",
    "identityCardNumber": "NIC123456789"
  }
}
```

---

### 4. Update Profile
**Endpoint**: `PUT /api/auth/update-profile`

**Access**: Private (Requires Token)

**Headers**:
```
Authorization: Bearer <your_jwt_token>
```

**Request Body**:
```json
{
  "name": "John Doe Updated",
  "phone": "+9876543210",
  "profilePicture": "https://example.com/image.jpg"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe Updated",
    "email": "john@example.com",
    "phone": "+9876543210",
    "role": "student"
  }
}
```

---

### 5. Logout
**Endpoint**: `POST /api/auth/logout`

**Access**: Private (Requires Token)

**Headers**:
```
Authorization: Bearer <your_jwt_token>
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Frontend Integration

### Install Required Packages
```bash
npm install axios
```

### API Configuration (src/api/axios.js)
```javascript
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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

### Update Login Component
```jsx
import api from '../api/axios';

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await api.post('/auth/login', {
      email: formData.email,
      password: formData.password,
    });

    const userData = {
      ...response.data.user,
      token: response.data.token,
    };

    login(userData);
    navigate('/');
  } catch (error) {
    setErrors({ submit: error.response?.data?.message || 'Login failed' });
  }
};
```

### Update Registration Component
```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
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
      ...response.data.user,
      token: response.data.token,
    };

    login(userData);
    navigate(role === 'company' ? '/dashboard' : '/');
  } catch (error) {
    setErrors({ submit: error.response?.data?.message || 'Registration failed' });
  }
};
```

---

## Security Features

✅ **Password Hashing**: bcryptjs (10 salt rounds)
✅ **JWT Authentication**: 7-day token expiration
✅ **Email Validation**: validator.js library
✅ **Input Validation**: Server-side validation for all fields
✅ **Role-Based Access Control**: Student & Company roles
✅ **CORS Protection**: Configured for Vercel frontend
✅ **Error Handling**: Detailed error messages in development mode
✅ **Account Management**: User active status, last login tracking
✅ **Duplicate Prevention**: Unique email validation

---

## Environment Variables for Render

When deploying to Render, add these environment variables in the Render dashboard:

| Variable | Value |
|----------|-------|
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A strong random string (min 32 characters) |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | Your Vercel frontend URL |
| `PORT` | `5000` (or leave default) |

---

## Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` is set correctly in `.env`
- Vercel URL format: `https://your-project.vercel.app`

### Token Issues
- Token expires after 7 days
- Client-side token refresh can be implemented
- Always send token in `Authorization: Bearer <token>` header

### MongoDB Connection
- Verify MongoDB Atlas IP whitelist includes Render's IPs
- Check connection string format: `mongodb+srv://user:password@cluster.mongodb.net/dbname`

---

## Best Practices

1. ✅ Always use HTTPS in production
2. ✅ Store JWT_SECRET in environment variables
3. ✅ Hash passwords client-side + server-side
4. ✅ Implement rate limiting for login/register endpoints
5. ✅ Add email verification for new accounts
6. ✅ Implement refresh tokens for better security
7. ✅ Add password reset functionality
8. ✅ Monitor failed login attempts
9. ✅ Use secure HTTPS-only cookies for token storage
10. ✅ Regular security audits and updates

---

## File Structure
```
backend/
├── index.js              # Main server file
├── package.json          # Dependencies
├── .env.example          # Environment template
├── models/
│   └── User.js          # User schema
├── routes/
│   └── auth.js          # Authentication routes
└── middleware/
    └── auth.js          # JWT verification & role authorization
```

---

## Support & Updates
For issues or questions, check MongoDB Atlas, Render documentation, or the project README.
