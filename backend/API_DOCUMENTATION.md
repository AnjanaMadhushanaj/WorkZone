# WorkZone Backend API

## Overview
This is the backend API for the WorkZone application, providing authentication and user management endpoints.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/workzone
   JWT_SECRET=your-secret-key-change-in-production
   NODE_ENV=development
   ```

3. **Start MongoDB:**
   ```bash
   # If using Homebrew on macOS
   brew services start mongodb-community@7.0
   
   # Or run MongoDB directly
   mongod
   ```

4. **Run the server:**
   ```bash
   # Development (with auto-reload)
   npm run dev
   
   # Production
   npm start
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication Routes

#### 1. User Registration (Sign Up)
**POST** `/api/auth/signup`

Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "role": "student",
  "identityCardNumber": "123456789"
}
```

For companies:
```json
{
  "name": "Company Name",
  "email": "company@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "role": "company",
  "company": "ABC Corporation",
  "companyRegistration": "REG123456"
}
```

Response (Success - 201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "role": "student",
    "identityCardNumber": "123456789"
  }
}
```

#### 2. User Login
**POST** `/api/auth/login`

Request body:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response (Success - 200):
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "role": "student",
    "identityCardNumber": "123456789"
  }
}
```

#### 3. Get Current User
**GET** `/api/auth/user`

Headers:
```
Authorization: Bearer <token>
```

Response (Success - 200):
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "role": "student",
    "identityCardNumber": "123456789"
  }
}
```

## Error Responses

### 400 - Bad Request
```json
{
  "success": false,
  "message": "Please provide all required fields"
}
```

### 401 - Unauthorized
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### 409 - Conflict
```json
{
  "success": false,
  "message": "Email already registered"
}
```

### 500 - Server Error
```json
{
  "success": false,
  "message": "Error registering user",
  "error": "Error details"
}
```

## Database Models

### User Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  phone: String (required),
  role: String (enum: ['student', 'company'], default: 'student'),
  identityCardNumber: String (for students),
  company: String (for companies),
  companyRegistration: String (for companies),
  createdAt: Date (default: now)
}
```

## Security Features

- **Password Hashing:** Passwords are hashed using bcryptjs
- **JWT Authentication:** Tokens are generated with expiration (7 days)
- **Email Validation:** Email format is validated and must be unique
- **CORS:** Enabled for cross-origin requests
- **Environment Variables:** Sensitive data stored in .env file

## Development

### Scripts
- `npm start` - Run the server
- `npm run dev` - Run with nodemon (auto-reload)
- `npm test` - Run tests (not configured yet)

### Project Structure
```
backend/
├── index.js              # Main application file
├── models/
│   └── User.js          # User database model
├── routes/
│   └── auth.js          # Authentication routes
├── package.json         # Dependencies
├── .env                 # Environment variables (local)
└── .env.example         # Example environment variables
```

## Testing the API

You can test the API using tools like:
- **Postman** - Import the endpoints and test manually
- **curl** - Command line tool for testing
- **Thunder Client** - VS Code extension

Example curl command for login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

## Frontend Integration

The frontend sends requests to:
```javascript
const baseURL = process.env.VITE_API_URL || 'http://localhost:5000'
```

Make sure to set the `VITE_API_URL` environment variable in the frontend `.env` file.

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running (`brew services list` on macOS)
- Check `MONGO_URI` in `.env` file
- Verify MongoDB is accessible on the specified port

### Token Validation Error
- Ensure token is sent in Authorization header with "Bearer " prefix
- Check if JWT_SECRET matches between token generation and validation
- Tokens expire after 7 days

### CORS Errors
- CORS is enabled for all origins by default
- To restrict to specific origins, modify the cors middleware in index.js

## Future Enhancements
- Email verification
- Password reset functionality
- User profile update endpoint
- Role-based access control (RBAC)
- Rate limiting
- Database query optimization
- API documentation (Swagger/OpenAPI)
