╔═══════════════════════════════════════════════════════════════════════╗
║                                                                       ║
║    WORKZONE - GOOGLE OAUTH AUTHENTICATION SYSTEM                     ║
║    Complete Frontend Implementation Guide                             ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝

📁 FILE STRUCTURE
═════════════════════════════════════════════════════════════════════════

src/
├── pages/
│   ├── Login.jsx                 ← Google OAuth Login (UPDATED)
│   └── ProfileCompletion.jsx     ← Profile Form for New Users (NEW)
├── services/
│   └── authService.js            ← API Service Methods (UPDATED)
├── context/
│   └── AuthContext.jsx           ← Auth State Management (UPDATED)
├── styles/
│   ├── Login.css                 ← Login Page Styling (UPDATED)
│   └── ProfileCompletion.css     ← Profile Form Styling (NEW)
├── main.jsx                      ← GoogleOAuthProvider Wrapper (EXISTING)
└── ROUTING_GUIDE.jsx             ← Route Configuration Example (NEW)

═════════════════════════════════════════════════════════════════════════

🔐 AUTHENTICATION FLOW (Complete Journey)
═════════════════════════════════════════════════════════════════════════

STEP 1: USER VISITS LOGIN PAGE
┌─────────────────────────────────────────────────────────────────────┐
│ URL: http://localhost:5174/login                                    │
│ Component: Login.jsx                                                │
│ ✓ Displays Google "Sign in with Google" button                      │
│ ✓ Checks localStorage for existing token (auto-redirect to home)   │
└─────────────────────────────────────────────────────────────────────┘

STEP 2: USER CLICKS "SIGN IN WITH GOOGLE"
┌─────────────────────────────────────────────────────────────────────┐
│ Action: GoogleLogin component opens Google OAuth dialog              │
│ Result: User authenticates with Google                              │
│ Output: credentialResponse.credential (JWT token)                   │
└─────────────────────────────────────────────────────────────────────┘

STEP 3: FRONTEND SENDS TOKEN TO BACKEND FOR VERIFICATION
┌─────────────────────────────────────────────────────────────────────┐
│ API Call:  POST /api/auth/google-verify                             │
│ Request:   { token: "google_jwt_token" }                            │
│ Service:   authService.verifyGoogleToken(googleToken)               │
│                                                                     │
│ Backend Verifies:                                                   │
│ • Is the Google token valid?                                        │
│ • Does a user with this email exist in MongoDB?                    │
└─────────────────────────────────────────────────────────────────────┘

STEP 4A: EXISTING USER PATH ✓
┌─────────────────────────────────────────────────────────────────────┐
│ Backend Response:                                                    │
│ {                                                                    │
│   "isNewUser": false,                                               │
│   "user": {                                                          │
│     "_id": "user_id",                                               │
│     "email": "john@example.com",                                    │
│     "username": "john_doe",                                         │
│     "birthday": "1995-05-15",                                       │
│     "phoneNumber": "+1234567890",                                   │
│     "address": "123 Main St",                                       │
│     "googleId": "google_id_123"                                     │
│   },                                                                 │
│   "token": "jwt_token_abc123"                                       │
│ }                                                                    │
│                                                                     │
│ Frontend Actions:                                                   │
│ 1. localStorage.setItem('token', response.token)                   │
│ 2. localStorage.setItem('user', JSON.stringify(response.user))     │
│ 3. navigate('/') → Redirect to Home Page                           │
│ 4. User is logged in immediately!                                  │
└─────────────────────────────────────────────────────────────────────┘

STEP 4B: NEW USER PATH ✓
┌─────────────────────────────────────────────────────────────────────┐
│ Backend Response:                                                    │
│ {                                                                    │
│   "isNewUser": true,                                                │
│   "googleData": {                                                    │
│     "googleId": "google_id_123",                                    │
│     "email": "newuser@example.com",                                 │
│     "name": "New User",                                             │
│     "picture": "https://lh3.googleusercontent.com/..."              │
│   }                                                                  │
│ }                                                                    │
│                                                                     │
│ Frontend Actions:                                                   │
│ 1. localStorage.setItem('googleData', JSON.stringify(googleData))  │
│ 2. navigate('/auth/complete-profile', { state: { googleData } })   │
│ 3. Render ProfileCompletion form                                    │
└─────────────────────────────────────────────────────────────────────┘

STEP 5: NEW USER COMPLETES PROFILE FORM
┌─────────────────────────────────────────────────────────────────────┐
│ Component: ProfileCompletion.jsx                                    │
│ URL: http://localhost:5174/auth/complete-profile                   │
│                                                                     │
│ Shows Google Profile:                                               │
│ • Profile picture                                                   │
│ • Email address                                                     │
│ • Full name                                                         │
│                                                                     │
│ Requires User to Enter:                                             │
│ • Username (3+ chars, alphanumeric + underscore)                   │
│ • Birthday (with age validation: 13+)                              │
│ • Phone Number (with format validation)                             │
│ • Address (5+ characters)                                           │
│                                                                     │
│ Form Features:                                                      │
│ ✓ Real-time error clearing as user types                           │
│ ✓ Field-level validation                                            │
│ ✓ Loading state during submission                                   │
│ ✓ Security & privacy notices                                        │
│ ✓ Mobile-optimized (prevents zoom on iOS)                          │
└─────────────────────────────────────────────────────────────────────┘

STEP 6: NEW USER SUBMITS COMPLETED PROFILE
┌─────────────────────────────────────────────────────────────────────┐
│ API Call:  POST /api/auth/google-complete-profile                  │
│ Service:   authService.completeUserProfile(completeProfileData)    │
│                                                                     │
│ Request Data:                                                       │
│ {                                                                    │
│   "googleId": "google_id_123",                                      │
│   "email": "newuser@example.com",                                   │
│   "name": "New User",                                               │
│   "picture": "https://...",                                         │
│   "username": "new_user_1",              ← User entered            │
│   "birthday": "2000-05-15",              ← User entered            │
│   "phoneNumber": "+1234567890",          ← User entered            │
│   "address": "123 Main Street, City"     ← User entered            │
│ }                                                                    │
│                                                                     │
│ Backend Verifies & Creates:                                         │
│ • Validate all fields                                               │
│ • Create new user document in MongoDB                               │
│ • Generate JWT token                                                │
│ • Return user object + token                                        │
└─────────────────────────────────────────────────────────────────────┘

STEP 7: NEW USER LOGGED IN & REDIRECTED
┌─────────────────────────────────────────────────────────────────────┐
│ Backend Response:                                                    │
│ {                                                                    │
│   "token": "jwt_token_xyz789",                                      │
│   "user": {                                                          │
│     "_id": "user_id_new",                                           │
│     "email": "newuser@example.com",                                 │
│     "username": "new_user_1",                                       │
│     "birthday": "2000-05-15",                                       │
│     "phoneNumber": "+1234567890",                                   │
│     "address": "123 Main Street, City",                             │
│     "googleId": "google_id_123",                                    │
│     "createdAt": "2026-01-24T12:34:56.789Z"                         │
│   }                                                                  │
│ }                                                                    │
│                                                                     │
│ Frontend Actions:                                                   │
│ 1. localStorage.setItem('token', response.token)                   │
│ 2. localStorage.setItem('user', JSON.stringify(response.user))     │
│ 3. localStorage.removeItem('googleData') ← Clean up temp data      │
│ 4. navigate('/') → Redirect to Home Page                           │
│ 5. New user is fully registered and logged in!                     │
└─────────────────────────────────────────────────────────────────────┘

═════════════════════════════════════════════════════════════════════════

💻 CODE EXAMPLES
═════════════════════════════════════════════════════════════════════════

Example 1: Using useAuth() Hook in Components
┌─────────────────────────────────────────────────────────────────────┐
import { useAuth } from './context/AuthContext';

export function UserProfile() {
  const { user, isLoggedIn, logout } = useAuth();

  if (!isLoggedIn()) {
    return <p>Please log in first</p>;
  }

  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phoneNumber}</p>
      <p>Birthday: {user.birthday}</p>
      <button onClick={logout}>Sign Out</button>
    </div>
  );
}
└─────────────────────────────────────────────────────────────────────┘

Example 2: Protected Route
┌─────────────────────────────────────────────────────────────────────┐
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return isLoggedIn() ? children : <Navigate to="/login" />;
};

// Usage:
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
└─────────────────────────────────────────────────────────────────────┘

Example 3: API Request with Auto-Injected Token
┌─────────────────────────────────────────────────────────────────────┐
// The token is automatically added to all requests via interceptor
// No need to manually add headers!

import api from './services/api';

async function fetchUserData() {
  try {
    // Token is automatically added as:
    // Authorization: Bearer <token_from_localStorage>
    const response = await api.get('/api/user/profile');
    console.log(response.data);
  } catch (error) {
    console.error(error.response?.data);
  }
}
└─────────────────────────────────────────────────────────────────────┘

═════════════════════════════════════════════════════════════════════════

🔑 KEY TECHNICAL DETAILS
═════════════════════════════════════════════════════════════════════════

1. Token Management:
   ✓ JWT tokens stored in localStorage
   ✓ Auto-injected in all API requests via axios interceptor
   ✓ Auto-cleared on 401 (Unauthorized) response
   ✓ Persistent across browser refreshes

2. User Data:
   ✓ Stored in localStorage as JSON string
   ✓ Available via useAuth() hook
   ✓ Cleared on logout
   ✓ Persisted on page refresh

3. Google OAuth:
   ✓ Uses official @react-oauth/google library
   ✓ Token decoded on backend (never on frontend)
   ✓ No sensitive data exposed to frontend
   ✓ Secure credential transmission

4. State Management:
   ✓ React Context API (AuthContext)
   ✓ useAuth() hook for easy access
   ✓ Automatic persistence
   ✓ Optional localStorage + Context combo

5. Validation:
   ✓ Frontend validation for UX
   ✓ Backend validation for security (critical)
   ✓ Phone number format checking
   ✓ Age verification (13+)
   ✓ Username format validation

═════════════════════════════════════════════════════════════════════════

📱 RESPONSIVE DESIGN FEATURES
═════════════════════════════════════════════════════════════════════════

✓ Mobile-First Approach:
  • 16px minimum font size (prevents iOS auto-zoom)
  • Touch-friendly button sizes
  • Full-width inputs on small screens
  • Optimized spacing and padding

✓ Breakpoints:
  • <400px: Extra small phones
  • 400-600px: Small phones & tablets
  • 600px+: Tablets & desktops
  • 1200px+: Large desktops

✓ Accessibility:
  • Semantic HTML structure
  • ARIA labels where needed
  • Proper form labels
  • Error message associations
  • Keyboard navigation support

═════════════════════════════════════════════════════════════════════════

🛡️ SECURITY CHECKLIST
═════════════════════════════════════════════════════════════════════════

Frontend Security:
☑ No hardcoded secrets
☑ Tokens not exposed in URL
☑ HTTPS enforced on production
☑ XSS protection (React escapes by default)
☑ CSRF protection (backend responsibility)
☑ Input validation before submission
☑ Error messages don't leak sensitive info

Backend Security (Your Developer's Responsibility):
☑ Validate JWT tokens cryptographically
☑ Verify Google token with Google's API
☑ Hash sensitive data (passwords if any)
☑ Rate limiting on auth endpoints
☑ Input sanitization & validation
☑ CORS properly configured
☑ HTTPS/TLS enforced
☑ Secure session management

═════════════════════════════════════════════════════════════════════════

✅ IMPLEMENTATION CHECKLIST
═════════════════════════════════════════════════════════════════════════

□ Environment Variables:
  □ VITE_API_URL set in .env
  □ VITE_GOOGLE_CLIENT_ID set in .env
  □ Backend URL points to correct environment

□ Dependencies:
  □ @react-oauth/google installed
  □ axios installed
  □ react-router-dom installed

□ Components:
  □ Login.jsx - Google OAuth implemented
  □ ProfileCompletion.jsx - Form with validation
  □ AuthContext.jsx - State management
  □ main.jsx - GoogleOAuthProvider wrapper

□ Services:
  □ authService.js - API methods created
  □ api.js - Axios instance with interceptors

□ Routes:
  □ /login route configured
  □ /auth/complete-profile route configured
  □ Protected routes implemented
  □ ProtectedRoute component created

□ Styles:
  □ Login.css - Responsive styling
  □ ProfileCompletion.css - Form styling
  □ Mobile responsive verified

□ Testing:
  □ npm run dev - No errors
  □ npm run build - Builds successfully
  □ Login flow tested locally
  □ Profile completion form tested

═════════════════════════════════════════════════════════════════════════

🚀 DEPLOYMENT CHECKLIST
═════════════════════════════════════════════════════════════════════════

Before Deploying to Vercel:

□ Environment Variables:
  □ Set VITE_API_URL to production backend URL
  □ Set VITE_GOOGLE_CLIENT_ID (production ID from Google Cloud)
  □ Verify in Vercel dashboard

□ Google OAuth Setup:
  □ Add Vercel domain to Google's Authorized JavaScript Origins
  □ Update Google Client ID in environment variables

□ Backend Readiness:
  □ All three endpoints implemented and tested
  □ CORS configured to allow Vercel domain
  □ Error messages are appropriate for frontend
  □ Token generation working correctly

□ Build Verification:
  □ npm run build completes without errors
  □ dist/ folder has all assets
  □ No console warnings

□ Final Testing:
  □ Test entire flow: login → complete profile → home
  □ Test existing user login path
  □ Test error handling
  □ Verify token persistence

═════════════════════════════════════════════════════════════════════════

📞 SUPPORT & DEBUGGING
═════════════════════════════════════════════════════════════════════════

Common Issues:

1. "Google button not appearing"
   → Check VITE_GOOGLE_CLIENT_ID in .env
   → Verify GoogleOAuthProvider in main.jsx
   → Browser console for errors

2. "Login successful but not redirecting"
   → Check /api/auth/google-verify endpoint
   → Verify response includes isNewUser flag
   → Check browser console for navigation errors

3. "Profile form shows empty"
   → Check localStorage.getItem('googleData')
   → Verify gooleData passed via state
   → Check console for errors

4. "Token not persisting across refreshes"
   → Verify localStorage.setItem('token', ...)
   → Check AuthContext useEffect
   → Clear cache and try again

5. "API requests failing with 401"
   → Verify token is in localStorage
   → Check api.js interceptor
   → Ensure backend validates token correctly

═════════════════════════════════════════════════════════════════════════

✨ Summary
═════════════════════════════════════════════════════════════════════════

You now have a production-ready Google OAuth authentication system that:

✓ Handles both existing and new users
✓ Conditionally shows profile completion form
✓ Securely manages JWT tokens
✓ Validates all user inputs
✓ Provides excellent UX with loading states
✓ Fully responsive on all devices
✓ Integrates seamlessly with your backend

The frontend is complete and waiting for your backend!
