# WorkZone Backend - Quick Start Guide

## 🚀 Current Status
✅ **Backend Authentication System is READY**
- Server running on `http://localhost:5000`
- MongoDB connected
- All endpoints working

## 📁 What's Included

### Core Files
- **index.js** - Main server application
- **models/User.js** - User database schema with password hashing
- **routes/auth.js** - Authentication endpoints

### Documentation
1. **IMPLEMENTATION_SUMMARY.md** - What was built and how it works
2. **API_DOCUMENTATION.md** - Complete API reference with examples
3. **INTEGRATION_GUIDE.md** - Step-by-step frontend integration instructions

### Testing
- **test-api.sh** - Bash script to test all endpoints

## 🔐 Three Main Endpoints

### 1. Sign Up (Register)
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "role": "student",
  "identityCardNumber": "123456789"
}
```

**Returns:** JWT token + user data

### 2. Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Returns:** JWT token + user data

### 3. Get Current User
```bash
GET /api/auth/user
Authorization: Bearer <token>
```

**Returns:** User data

## 🎯 Next: Connect Frontend

See **INTEGRATION_GUIDE.md** for detailed steps to:
1. Update Login component
2. Update Registration component
3. Update API configuration
4. Update AuthContext
5. Test the integration

## 💾 Setup Requirements

### .env File
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/workzone
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

### MongoDB
- Must be running locally OR
- Use MongoDB Atlas connection string in MONGO_URI

## 🧪 Quick Test

### Option 1: Using curl
```bash
# Register
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123","phone":"+123","role":"student","identityCardNumber":"123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### Option 2: Using the test script
```bash
chmod +x test-api.sh
./test-api.sh
```

### Option 3: Using Postman
Import the endpoints and test manually

## 📋 Frontend Integration Checklist

- [ ] Install dependencies in frontend
- [ ] Set VITE_API_URL in frontend .env
- [ ] Update Login.jsx to call `/api/auth/login`
- [ ] Update Registration.jsx to call `/api/auth/signup`
- [ ] Update axios.js to include Authorization header
- [ ] Update AuthContext.jsx to verify token on load
- [ ] Test registration flow
- [ ] Test login flow
- [ ] Test token persistence

## 🔑 Key Features

✅ User registration (student and company roles)
✅ User login with password verification
✅ JWT token generation and validation
✅ Password hashing (bcryptjs)
✅ Email uniqueness enforcement
✅ Role-based data fields
✅ Comprehensive error handling
✅ CORS enabled
✅ MongoDB integration
✅ Environment variable configuration

## 🚦 Running the Backend

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start

# Check health
curl http://localhost:5000/health
```

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| IMPLEMENTATION_SUMMARY.md | Overview of what was built |
| API_DOCUMENTATION.md | Complete API reference |
| INTEGRATION_GUIDE.md | How to connect frontend |
| test-api.sh | Test script for endpoints |

## ⚡ Quick Reference

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Run dev | `npm run dev` |
| Run prod | `npm start` |
| Test API | `./test-api.sh` |

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB is running: `brew services list`
- Check MONGO_URI in .env
- Verify port 5000 is not in use

### CORS errors
- Frontend .env should have: `VITE_API_URL=http://localhost:5000`
- Backend CORS is enabled by default

### Login failing
- Verify email/password are correct
- Check MongoDB has the user
- Ensure password is at least 6 characters

## 📞 Support

For issues, check:
1. INTEGRATION_GUIDE.md - Common integration problems
2. API_DOCUMENTATION.md - Endpoint details
3. Backend logs - Error messages
4. MongoDB logs - Database issues

---

**Backend Status**: ✅ Ready for frontend integration
**Last Updated**: January 24, 2026
