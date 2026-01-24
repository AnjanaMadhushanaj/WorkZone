# WorkZone Authentication System - Updated Documentation

## Overview
This authentication system now supports both manual registration/login and Google OAuth authentication for the WorkZone MERN stack application.

---

## 📋 User Model Schema

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | String | Yes | User's full name |
| email | String | Yes (Unique) | User's email address |
| password | String | Conditional* | Hashed password (required only if googleId is absent) |
| birthday | Date | No | User's date of birth |
| location | String | No | User's location/address |
| phoneNumber | String | No | User's phone number |
| googleId | String | No | Google account ID (for OAuth users) |
| profilePicture | String | No | URL to profile picture |
| phone | String | No | Legacy phone field |
| role | String | Yes | "student" or "company" (default: "student") |
| identityCardNumber | String | Conditional | Required for students |
| company | String | Conditional | Required for companies |
| companyRegistration | String | Conditional | Required for companies |
| createdAt | Date | Auto | Account creation timestamp |

*Password is required only for manual registration. Google OAuth users don't need a password.

---

## 🔐 API Endpoints

### 1. POST `/api/auth/register`
**Manual User Registration**

#### Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "birthday": "1995-01-15",
  "location": "Colombo, Sri Lanka",
  "phoneNumber": "+94771234567",
  "role": "student",
  "identityCardNumber": "199512345678"
}
```

#### Optional Fields
- `birthday` - Date of birth
- `location` - User's location
- `phoneNumber` - Contact number
- `role` - "student" (default) or "company"

#### Role-Specific Fields
**For Students:**
- `identityCardNumber` - Required

**For Companies:**
- `company` - Company name (required)
- `companyRegistration` - Registration number (required)

#### Success Response (201)
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "birthday": "1995-01-15T00:00:00.000Z",
    "location": "Colombo, Sri Lanka",
    "phoneNumber": "+94771234567",
    "profilePicture": null,
    "role": "student",
    "identityCardNumber": "199512345678"
  }
}
```

#### Error Responses
- **400** - Missing required fields
- **409** - Email already registered
- **500** - Server error

---

### 2. POST `/api/auth/login`
**Manual User Login**

#### Request Body
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "birthday": "1995-01-15T00:00:00.000Z",
    "location": "Colombo, Sri Lanka",
    "phoneNumber": "+94771234567",
    "profilePicture": null,
    "phone": null,
    "role": "student"
  }
}
```

#### Special Cases
- If user registered with Google (no password), returns error message:
  ```json
  {
    "success": false,
    "message": "This account uses Google Sign-In. Please login with Google."
  }
  ```

#### Error Responses
- **400** - Missing email or password
- **401** - Invalid credentials
- **500** - Server error

---

### 3. POST `/api/auth/google`
**Google OAuth Login/Registration**

#### Request Body
```json
{
  "credential": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjFkYzBmM..."
}
```

The `credential` is the Google ID token received from Google Sign-In on the frontend.

#### How It Works
1. Verifies the Google credential token using `google-auth-library`
2. Extracts user information (email, name, picture, googleId)
3. If user exists (by email or googleId):
   - Logs in the existing user
   - Updates googleId if not set
   - Updates profile picture if changed
4. If user doesn't exist:
   - Creates a new user with Google data
   - Sets default role as "student"

#### Success Response (200)
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "birthday": null,
    "location": null,
    "phoneNumber": null,
    "profilePicture": "https://lh3.googleusercontent.com/...",
    "phone": null,
    "role": "student",
    "googleId": "103847362847362847362"
  }
}
```

#### Error Responses
- **400** - Missing credential token
- **401** - Invalid Google token
- **500** - Server error

---

### 4. GET `/api/auth/user`
**Get Current Authenticated User**

#### Headers
```
Authorization: Bearer <jwt_token>
```

#### Success Response (200)
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "birthday": "1995-01-15T00:00:00.000Z",
    "location": "Colombo, Sri Lanka",
    "phoneNumber": "+94771234567",
    "profilePicture": null,
    "phone": null,
    "role": "student"
  }
}
```

---

## 🔒 Security Features

### Password Security
- ✅ Hashed using bcryptjs with 10 salt rounds
- ✅ Never stored in plain text
- ✅ Never returned in API responses
- ✅ Password not required for Google OAuth users

### JWT Token Security
- ✅ 7-day expiration period
- ✅ Signed with JWT_SECRET from environment
- ✅ Contains user ID and timestamps (iat, exp)
- ✅ Verified on protected routes

### Google OAuth Security
- ✅ Token verified using official Google Auth Library
- ✅ Validates against GOOGLE_CLIENT_ID
- ✅ Extracts verified user information
- ✅ Secure user matching by email or googleId

### CORS Security
- ✅ Configured to allow specific origins
- ✅ Supports Vercel domains (.vercel.app)
- ✅ Allows localhost for development
- ✅ Credentials enabled for secure requests

---

## ⚙️ Environment Variables

### Required Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Frontend
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### Getting Google Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Select "Web application"
6. Add authorized JavaScript origins:
   - `http://localhost:5173` (development)
   - `https://your-frontend-domain.vercel.app` (production)
7. Add authorized redirect URIs:
   - `http://localhost:5173` (development)
   - `https://your-frontend-domain.vercel.app` (production)
8. Copy the Client ID

---

## 🚀 CORS Configuration

### Allowed Origins
- Environment variable `FRONTEND_URL`
- `http://localhost:5173`
- `http://localhost:3000`
- `http://localhost:5174`
- Any domain ending in `.vercel.app`

### Configuration Details
```javascript
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5174',
    ];
    
    // Allow Vercel domains
    const isVercelDomain = origin?.includes('.vercel.app');
    const isAllowed = allowedOrigins.includes(origin) || isVercelDomain;
    
    if (!origin || isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
```

---

## 📱 Frontend Integration

### Google Sign-In Setup

#### 1. Install Google Sign-In Library
```bash
npm install @react-oauth/google
```

#### 2. Wrap App with GoogleOAuthProvider
```jsx
import { GoogleOAuthProvider } from '@react-oauth/google';

<GoogleOAuthProvider clientId="your-google-client-id">
  <App />
</GoogleOAuthProvider>
```

#### 3. Implement Google Login Button
```jsx
import { GoogleLogin } from '@react-oauth/google';

<GoogleLogin
  onSuccess={async (credentialResponse) => {
    try {
      const response = await api.post('/api/auth/google', {
        credential: credentialResponse.credential,
      });
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        login(response.data.user);
        navigate('/');
      }
    } catch (error) {
      console.error('Google login error:', error);
    }
  }}
  onError={() => {
    console.log('Login Failed');
  }}
/>
```

### Manual Registration
```jsx
const handleRegister = async (formData) => {
  try {
    const response = await api.post('/api/auth/register', {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      birthday: formData.birthday,
      location: formData.location,
      phoneNumber: formData.phoneNumber,
      role: formData.role,
      // Add role-specific fields
    });
    
    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      login(response.data.user);
      navigate('/');
    }
  } catch (error) {
    console.error('Registration error:', error);
  }
};
```

### Manual Login
```jsx
const handleLogin = async (email, password) => {
  try {
    const response = await api.post('/api/auth/login', {
      email,
      password,
    });
    
    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      login(response.data.user);
      navigate('/');
    }
  } catch (error) {
    console.error('Login error:', error);
  }
};
```

---

## 🧪 Testing

### Test Manual Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "birthday": "1995-01-15",
    "location": "Colombo",
    "phoneNumber": "+94771234567",
    "role": "student",
    "identityCardNumber": "199512345678"
  }'
```

### Test Manual Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Test Get User (with token)
```bash
curl -X GET http://localhost:5000/api/auth/user \
  -H "Authorization: Bearer <your_jwt_token>"
```

---

## 🔄 Migration Notes

### From Old to New Schema

The User model has been updated to include:
- `birthday` (Date)
- `location` (String)
- `phoneNumber` (String)
- `googleId` (String)
- `profilePicture` (String)

Existing users will have these fields as `null` by default.

### Backward Compatibility

- Old `/api/auth/signup` endpoint still works
- Password is now conditional (not required for Google users)
- All existing user records remain valid

---

## 📊 Deployment on Render

### Environment Variables to Set on Render

1. `MONGO_URI` - Your MongoDB Atlas connection string
2. `JWT_SECRET` - Strong secret key for JWT
3. `GOOGLE_CLIENT_ID` - Google OAuth Client ID
4. `FRONTEND_URL` - Your Vercel frontend URL
5. `NODE_ENV` - Set to "production"
6. `PORT` - Usually auto-set by Render

### Build Command
```bash
npm install
```

### Start Command
```bash
npm start
```

---

## 🐛 Troubleshooting

### Google OAuth Not Working
- ✅ Verify GOOGLE_CLIENT_ID in .env
- ✅ Check authorized origins in Google Console
- ✅ Ensure frontend domain is whitelisted
- ✅ Verify token is being sent from frontend

### CORS Errors
- ✅ Check FRONTEND_URL is set correctly
- ✅ Verify frontend domain matches allowed origins
- ✅ For Vercel, ensure domain ends with .vercel.app

### Password Login Fails for Google Users
- ✅ This is expected behavior
- ✅ Google users should use Google Sign-In
- ✅ Error message guides users to correct method

---

## 📈 Features Summary

### ✅ Implemented Features
- Manual user registration with extended fields
- Manual user login with password verification
- Google OAuth login/registration
- JWT token-based authentication
- Role-based user types (student/company)
- Profile picture support
- Secure password hashing
- CORS configuration for Vercel
- Backward compatibility with existing endpoints

### 🚀 Ready for Production
- Environment variable configuration
- Secure CORS setup
- Google OAuth integration
- MongoDB Atlas support
- Render deployment ready

---

**Last Updated**: January 24, 2026
**Version**: 2.0
**Status**: Production Ready 🚀
