# Backend Architecture Overview

## System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENT (Frontend/Browser)                    │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │           React App (Login/Registration Pages)            │  │
│  └────────────────────┬────────────────────────────────────┘  │
└─────────────────────────┼──────────────────────────────────────┘
                          │ HTTP/REST API Calls
                          │
                    ┌─────▼─────┐
                    │   CORS    │
                    │ Middleware│
                    └─────┬─────┘
                          │
┌─────────────────────────┼──────────────────────────────────────┐
│                         │     EXPRESS SERVER                    │
│                    ┌────▼────┐                                  │
│                    │ Routing  │                                  │
│                    └────┬────┘                                  │
│                         │                                        │
│          ┌──────────────┼──────────────┐                        │
│          │              │              │                        │
│    ┌─────▼──────┐ ┌────▼────┐ ┌──────▼────┐                   │
│    │   Login    │ │ Sign Up  │ │  Get User │                   │
│    │ POST:/...  │ │ POST:/.. │ │ GET:/auth │                   │
│    └─────┬──────┘ └────┬────┘ │ /user     │                   │
│          │             │      └──────┬────┘                    │
│          │             │             │                          │
│    ┌─────▼─────────────▼─────────────▼──┐                      │
│    │   Authentication Logic              │                      │
│    │ • Email validation                  │                      │
│    │ • Password verification (bcryptjs)  │                      │
│    │ • JWT token generation/validation   │                      │
│    └─────┬──────────────────────────────┘                      │
│          │                                                      │
│    ┌─────▼─────────────────────────────┐                       │
│    │   Mongoose ODM / Data Models       │                       │
│    │ ┌─────────────────────────────┐   │                       │
│    │ │ User Schema                 │   │                       │
│    │ │ • name, email, password     │   │                       │
│    │ │ • phone, role, company info │   │                       │
│    │ └─────────────────────────────┘   │                       │
│    └─────┬──────────────────────────────┘                      │
└─────────────┼──────────────────────────────────────────────────┘
              │ MongoDB Protocol
              │
┌─────────────▼──────────────────────────┐
│        MongoDB Database                 │
│  ┌──────────────────────────────────┐  │
│  │ workzone                          │  │
│  │  └── users collection            │  │
│  │      ├── Student accounts        │  │
│  │      └── Company accounts        │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

## Data Flow

### Registration Flow
```
Frontend (Registration.jsx)
    ↓
Submit form with user data
    ↓
POST /api/auth/signup
    ↓
Backend (Express Router)
    ↓
Validate input (email, password, role)
    ↓
Check if email exists in MongoDB
    ↓
Hash password (bcryptjs - 10 rounds)
    ↓
Create User document
    ↓
Save to MongoDB
    ↓
Generate JWT Token (7 day expiration)
    ↓
Return { token, user }
    ↓
Frontend stores token in localStorage
    ↓
Frontend calls login() in AuthContext
    ↓
Redirect to home or dashboard
```

### Login Flow
```
Frontend (Login.jsx)
    ↓
Submit email & password
    ↓
POST /api/auth/login
    ↓
Backend (Express Router)
    ↓
Find user by email in MongoDB
    ↓
Compare submitted password with hashed password
    ↓
Password match?
  ├─ No → Return 401 error
  └─ Yes → Continue
    ↓
Generate JWT Token
    ↓
Return { token, user }
    ↓
Frontend stores token in localStorage
    ↓
Frontend calls login() in AuthContext
    ↓
Redirect to home
```

### Protected Request Flow
```
Frontend makes authenticated request
    ↓
Include token in Authorization header
  "Authorization: Bearer <token>"
    ↓
GET /api/auth/user
    ↓
Backend middleware
    ↓
Extract token from header
    ↓
Decode token using JWT_SECRET
    ↓
Extract userId from token
    ↓
Query MongoDB for user
    ↓
Return user data
```

## File Structure

```
backend/
│
├── index.js                    # Main Express app
│   ├── CORS setup
│   ├── Middleware configuration
│   ├── Route registration
│   ├── Error handling
│   └── MongoDB connection
│
├── models/
│   └── User.js                # Mongoose schema & methods
│       ├── Schema definition
│       ├── Pre-save password hashing
│       ├── Password comparison method
│       └── Response formatting
│
├── routes/
│   └── auth.js                # Authentication endpoints
│       ├── POST /signup
│       ├── POST /login
│       └── GET /user
│
├── package.json               # Dependencies & scripts
│
├── .env                       # Configuration (local)
│   ├── PORT
│   ├── MONGO_URI
│   ├── JWT_SECRET
│   └── NODE_ENV
│
├── .env.example               # Template for .env
│
├── node_modules/              # Installed dependencies
│   ├── express
│   ├── mongoose
│   ├── bcryptjs
│   ├── jwt-simple
│   ├── cors
│   └── dotenv
│
└── Documentation/
    ├── QUICKSTART.md          # Quick start guide
    ├── API_DOCUMENTATION.md   # Complete API reference
    ├── INTEGRATION_GUIDE.md   # Frontend integration steps
    └── IMPLEMENTATION_SUMMARY.md # Technical overview
```

## Technology Stack

### Backend Framework
- **Express.js** - Web framework for Node.js
- **Node.js** - JavaScript runtime

### Database
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Authentication
- **bcryptjs** - Password hashing library
- **jwt-simple** - JWT token handling

### Utilities
- **cors** - Cross-Origin Resource Sharing
- **dotenv** - Environment variable management

### Development
- **nodemon** - Auto-reload on file changes

## API Contract

### Request/Response Format

All requests and responses use JSON format.

#### Success Response Structure
```json
{
  "success": true,
  "message": "Operation successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "role": "student"
  }
}
```

#### Error Response Structure
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error info (in development)"
}
```

## Authentication Flow Chart

```
User Action                    Backend Processing              Response
──────────────────────────────────────────────────────────────────────

REGISTRATION:
User fills form
    ↓
Submit data      ──► POST /api/auth/signup
                     ├─ Validate input
                     ├─ Check email unique
                     ├─ Hash password
                     ├─ Save to MongoDB
                     ├─ Generate JWT token
                     └─ Return token + user
    ↓
Receive response ◄──
    ↓
Store token in localStorage
    ↓
Update AuthContext
    ↓
Redirect to home/dashboard


LOGIN:
User fills form
    ↓
Submit credentials ──► POST /api/auth/login
                       ├─ Find user by email
                       ├─ Verify password
                       ├─ Generate JWT token
                       └─ Return token + user
    ↓
Receive response ◄──
    ↓
Store token in localStorage
    ↓
Update AuthContext
    ↓
Redirect to home


PROTECTED REQUEST:
Need user data
    ↓
Include token   ──► GET /api/auth/user
in header           ├─ Extract token
                    ├─ Verify token
                    ├─ Get userId
                    ├─ Query MongoDB
                    └─ Return user data
    ↓
Receive response ◄──
    ↓
Use user data
```

## Security Layers

```
┌──────────────────────────────────┐
│  Frontend Validation             │ Layer 1
│  (Email format, password length) │
└────────────┬─────────────────────┘
             │
┌────────────▼──────────────────────┐
│  CORS Protection                 │ Layer 2
│  (Cross-origin requests)         │
└────────────┬─────────────────────┘
             │
┌────────────▼──────────────────────┐
│  Backend Input Validation        │ Layer 3
│  (Email, password, required      │
│   fields)                        │
└────────────┬─────────────────────┘
             │
┌────────────▼──────────────────────┐
│  Password Hashing                │ Layer 4
│  (bcryptjs with salt)            │
└────────────┬─────────────────────┘
             │
┌────────────▼──────────────────────┐
│  Database Storage                │ Layer 5
│  (MongoDB with unique email)     │
└────────────┬─────────────────────┘
             │
┌────────────▼──────────────────────┐
│  JWT Token Validation            │ Layer 6
│  (Bearer token, signature check) │
└──────────────────────────────────┘
```

## Deployment Architecture

```
Development:
Frontend (localhost:5173) ──► Backend (localhost:5000) ──► MongoDB (local)

Production:
Frontend (Vercel)        ──► Backend (Render/Railway)  ──► MongoDB Atlas
```

---

**Status**: Architecture complete and implemented ✅
