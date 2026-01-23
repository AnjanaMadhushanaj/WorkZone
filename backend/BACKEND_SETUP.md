# Backend Development Quick Start

## 📋 Quick Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Create .env File
```bash
cp .env.example .env
```

Then edit `.env` with your MongoDB URI and JWT Secret:
```env
MONGO_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/workzone
JWT_SECRET=your_super_secret_key_min_32_characters_long
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Step 3: Start Development Server
```bash
npm run dev
```

Server runs at: `http://localhost:5000`

---

## 🧪 Testing Endpoints with cURL

### Register New User (Student)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Test@1234",
    "phone": "+1234567890",
    "role": "student",
    "identityCardNumber": "NIC123456"
  }'
```

### Register New User (Company)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Company Admin",
    "email": "admin@company.com",
    "password": "Test@1234",
    "phone": "+0987654321",
    "role": "company",
    "company": "Tech Corp",
    "companyRegistration": "REG-123456"
  }'
```

### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Test@1234"
  }'
```

### Get Current User (Requires Token)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Update Profile (Requires Token)
```bash
curl -X PUT http://localhost:5000/api/auth/update-profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "name": "John Updated",
    "phone": "+9876543210"
  }'
```

### Logout (Requires Token)
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## 📁 Project Structure

```
backend/
├── index.js                          # Main server entry point
├── package.json                      # Dependencies
├── .env.example                      # Environment template
├── AUTHENTICATION_API.md             # Full API documentation
├── BACKEND_SETUP.md                  # This file
│
├── models/
│   └── User.js                       # MongoDB User schema
│       ├── Fields: name, email, password, phone, role
│       ├── Methods: matchPassword(), toJSON()
│       └── Hooks: password hashing on save
│
├── routes/
│   └── auth.js                       # Authentication endpoints
│       ├── POST /auth/register       # User registration
│       ├── POST /auth/login          # User login
│       ├── GET /auth/me              # Get user profile
│       ├── PUT /auth/update-profile  # Update profile
│       └── POST /auth/logout         # Logout
│
└── middleware/
    └── auth.js                       # JWT authentication
        ├── generateToken()           # Create JWT
        ├── verifyToken()             # Validate JWT
        └── authorize()               # Role-based access control
```

---

## 🔐 Authentication Flow

```
User Registration
    ↓
Validate Input → Check Duplicate Email → Hash Password
    ↓
Save to MongoDB → Generate JWT Token
    ↓
Return Token + User Data to Frontend

Frontend stores: { user, token } in localStorage

User Login
    ↓
Validate Email & Password → Hash Check
    ↓
Generate JWT Token → Update lastLogin
    ↓
Return Token + User Data

Protected Routes
    ↓
Request with Authorization Header (Bearer Token)
    ↓
Middleware Verifies JWT → Attaches User to req.user
    ↓
Route Handler Executes
```

---

## 🎯 User Roles & Permissions

### Student Role
- Can register/login
- Can view available jobs
- Can apply for jobs
- Can update profile

### Company Role  
- Can register/login
- Can post jobs
- Can manage job applications
- Can view dashboards
- Can manage company profile

---

## 🧩 Connecting Frontend

### 1. Set API URL in Frontend .env
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 2. Update Frontend Axios Setup
```javascript
// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

// Add token to every request
api.interceptors.request.use((config) => {
  const user = localStorage.getItem('user');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;
```

### 3. Update Login Component
```javascript
import api from '../api/axios';

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await api.post('/auth/login', {
      email: formData.email,
      password: formData.password
    });
    login(res.data.user);
    navigate('/');
  } catch (err) {
    setErrors({submit: err.response?.data?.message});
  }
};
```

---

## 🚀 Deployment to Render

### 1. Connect GitHub Repo
- Push code to GitHub
- Connect repo to Render.com

### 2. Set Environment Variables in Render
```
MONGO_URI = mongodb+srv://...
JWT_SECRET = your_secret_key
NODE_ENV = production
FRONTEND_URL = https://your-vercel-app.vercel.app
PORT = 5000
```

### 3. Deploy
- Render auto-deploys on push to main branch
- Check build logs for errors
- Test API with deployed URL

### 4. Update Frontend API URL
```env
REACT_APP_API_URL=https://your-backend.render.com/api
```

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| CORS error | Check FRONTEND_URL in .env matches Vercel URL |
| MongoDB connection failed | Whitelist Render IP in MongoDB Atlas |
| Token not sent in request | Check localStorage has token saved |
| 404 on API routes | Ensure routes mounted in index.js |
| Password not hashing | Check bcryptjs installed: `npm list bcryptjs` |
| ENOENT .env | Create .env file with required variables |

---

## 📊 Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (hashed, required),
  phone: String (required, validated),
  role: "student" | "company" (required),
  identityCardNumber: String (student only),
  company: String (company only),
  companyRegistration: String (company only),
  profilePicture: String,
  isVerified: Boolean (default: false),
  isActive: Boolean (default: true),
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔑 Security Checklist

- [x] Passwords hashed with bcryptjs (10 rounds)
- [x] JWT token-based authentication
- [x] Input validation (validator.js)
- [x] Email uniqueness validation
- [x] Role-based access control
- [x] Secure CORS configuration
- [ ] Rate limiting (implement for production)
- [ ] Email verification (implement)
- [ ] Refresh tokens (implement)
- [ ] Password reset (implement)
- [ ] 2FA (implement for company accounts)

---

## 📞 Need Help?

- Check [AUTHENTICATION_API.md](./AUTHENTICATION_API.md) for detailed API docs
- Review User.js for schema structure
- Check auth.js for route handlers
- Review middleware/auth.js for JWT logic

Happy coding! 🎉
