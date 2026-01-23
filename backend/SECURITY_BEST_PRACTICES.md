# 🔐 Security & Best Practices Guide

## Password Security

### Requirements Implemented

✅ **Minimum 6 Characters** - Enforced on both frontend and backend
✅ **Bcryptjs Hashing** - 10 salt rounds (industry standard)
✅ **No Plain Text Storage** - Passwords never stored unencrypted
✅ **Constant-Time Comparison** - Prevents timing attacks
✅ **Password Reset** - Can be implemented via email token

### Password Best Practices

#### For Users

1. **Use Strong Passwords**
   - Mix uppercase, lowercase, numbers, special characters
   - At least 8+ characters (minimum is 6)
   - Avoid common words or personal information
   - Example: `S3cur3P@ssw0rd!2024`

2. **Never Share Passwords**
   - Never give password to anyone
   - Support won't ask for passwords
   - Use secure password managers (1Password, Bitwarden, LastPass)

3. **Change Regularly**
   - Change password every 90 days
   - Immediately if account compromised
   - Use different password for each site

#### For Developers

1. **Never Log Passwords**
   ```javascript
   // ❌ BAD
   console.log('Password:', password);

   // ✅ GOOD
   console.log('Password validation completed');
   ```

2. **Always Hash Before Storage**
   ```javascript
   // ✅ CORRECT
   const hashedPassword = await bcrypt.hash(password, 10);
   user.password = hashedPassword;
   ```

3. **Use HTTPS Only**
   - All passwords transmitted over HTTPS
   - No HTTP in production
   - Render automatically provides SSL

---

## JWT Token Security

### Implementation Details

```javascript
// 7-day expiration
const JWT_EXPIRE = '7d';

// Generated with user ID only (minimal payload)
const token = jwt.sign({ id: userId }, JWT_SECRET, {
  expiresIn: JWT_EXPIRE
});
```

### Best Practices

1. **Store Tokens Securely**
   ```javascript
   // ✅ localStorage (for this app)
   localStorage.setItem('user', JSON.stringify({
     id, name, email, token
   }));

   // 🔒 Better: httpOnly cookies (server sets)
   // Immune to XSS attacks
   res.cookie('token', token, {
     httpOnly: true,
     secure: true,
     sameSite: 'strict'
   });
   ```

2. **Token Refresh Strategy**
   ```javascript
   // Implement refresh tokens
   // Access token: 15 minutes
   // Refresh token: 7 days (httpOnly cookie)
   ```

3. **Handle Token Expiration**
   ```javascript
   // Frontend intercepts 401 and redirects to login
   api.interceptors.response.use(
     response => response,
     error => {
       if (error.response?.status === 401) {
         localStorage.removeItem('user');
         window.location.href = '/login';
       }
     }
   );
   ```

---

## CORS Security

### Current Configuration

```javascript
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
```

### Production Security

```env
# ✅ DO NOT use "*" in production
# ✅ Specific domain only
FRONTEND_URL=https://your-app.vercel.app

# ❌ NEVER do this in production
origin: '*'
```

### Testing CORS

```bash
# Test from browser
fetch('https://backend.com/api/auth/me', {
  headers: { 'Authorization': 'Bearer TOKEN' }
});
```

---

## Input Validation Security

### What's Protected

✅ **Email Validation**
```javascript
validator.isEmail(email) // RFC 5322 compliant
```

✅ **Phone Validation**
```javascript
validator.isMobilePhone(phone) // International format
```

✅ **Password Length**
```javascript
password.length >= 6 // Minimum requirement
```

✅ **SQL Injection Prevention**
- MongoDB parameterized queries prevent injection
- No raw SQL strings

### Additional Validation Ideas

```javascript
// Implement custom validation
const isStrongPassword = (password) => {
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);
  
  return hasUppercase && hasLowercase && hasNumbers && hasSpecialChar;
};
```

---

## Database Security

### MongoDB Atlas Configuration

✅ **IP Whitelist**
- Add Render IP in MongoDB Atlas
- Restrict access to specific IPs

✅ **Strong Credentials**
- Use alphanumeric username
- Strong password (20+ characters)
- Change periodically

✅ **Connection String**
```
mongodb+srv://username:password@cluster.mongodb.net/workzone
     ↑ USERNAME (URL encoded if special chars)
                              ↑ PASSWORD (URL encoded)
                                                    ↑ DATABASE
```

✅ **Backups**
- Enable automatic backups
- Test restore procedures
- Keep offline backup

---

## Environment Variables Security

### Secure Handling

```bash
# ✅ GOOD: Use environment variables
const mongoUri = process.env.MONGO_URI;
const jwtSecret = process.env.JWT_SECRET;

# ❌ BAD: Hardcoded secrets
const mongoUri = 'mongodb+srv://user:pass@...';
```

### Secrets Checklist

- [ ] JWT_SECRET never in code
- [ ] MONGO_URI never in code
- [ ] Database password never in code
- [ ] API keys never in code
- [ ] Always use `process.env.VARIABLE`

### Render Secrets

```bash
# Never commit .env file
echo ".env" >> .gitignore

# Set in Render Dashboard
MONGO_URI = (secret key icon) → your_connection_string
JWT_SECRET = (secret key icon) → your_super_secret_key
```

---

## Rate Limiting

### Why It Matters

Prevents:
- Brute force attacks
- Spam registrations
- DDoS attacks
- Password cracking

### Implementation

```javascript
const rateLimit = require('express-rate-limit');

// Login rate limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, try again later',
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
});

// Register rate limiter  
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 registrations per hour per IP
  message: 'Too many accounts created from this IP',
});

app.post('/api/auth/login', loginLimiter, authController.login);
app.post('/api/auth/register', registerLimiter, authController.register);
```

---

## XSS (Cross-Site Scripting) Prevention

### Vulnerabilities

```javascript
// ❌ BAD: Direct HTML injection
const userInput = "<img src=x onerror='alert(\"hacked\")'>";
document.innerHTML = userInput; // DANGEROUS!

// ✅ GOOD: Text content
document.textContent = userInput; // Safe

// ✅ GOOD: React (auto-escapes)
<div>{userInput}</div> // React escapes automatically
```

### Best Practices

1. **Sanitize Input** (if HTML needed)
   ```javascript
   const DOMPurify = require('dompurify');
   const clean = DOMPurify.sanitize(userInput);
   ```

2. **Content Security Policy**
   ```javascript
   app.use((req, res, next) => {
     res.setHeader(
       'Content-Security-Policy',
       "default-src 'self'; script-src 'self'"
     );
     next();
   });
   ```

3. **Escape HTML**
   ```javascript
   const escapeHtml = (text) => {
     return text
       .replace(/&/g, '&amp;')
       .replace(/</g, '&lt;')
       .replace(/>/g, '&gt;')
       .replace(/"/g, '&quot;')
       .replace(/'/g, '&#039;');
   };
   ```

---

## CSRF (Cross-Site Request Forgery) Prevention

### Current Implementation

```javascript
// Express handles CSRF with state management
// For form-based requests, add CSRF tokens:

const csrf = require('csurf');
const csrfProtection = csrf({ cookie: false });

app.post('/api/auth/login', csrfProtection, (req, res) => {
  // Protected route
});
```

### Frontend Implementation

```javascript
// Include CSRF token in requests
const submitForm = async (data) => {
  const response = await fetch('/api/endpoint', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
    },
    body: JSON.stringify(data)
  });
};
```

---

## SSL/TLS Security

### Render Provides

✅ Automatic HTTPS
✅ Free SSL certificates
✅ Auto-renewal
✅ HTTP → HTTPS redirect

### Verify Deployment

```bash
# Check HTTPS works
curl -I https://your-backend.onrender.com/

# Should return:
# HTTP/2 200
# strict-transport-security: max-age=31536000; includeSubDomains
```

---

## Security Headers

### Add to Backend

```javascript
const helmet = require('helmet');
app.use(helmet()); // Sets multiple security headers

// Or configure individually:
app.use((req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  next();
});
```

---

## Logging & Monitoring

### What to Log

✅ User registration attempts
✅ Login attempts (success/failure)
✅ Password changes
✅ Profile updates
✅ API errors

### What NOT to Log

❌ Passwords
❌ JWT tokens
❌ Personal sensitive data
❌ Credit card numbers
❌ SSN/ID numbers

### Implementation

```javascript
// Safe logging
console.log(`User ${user.email} logged in at ${new Date()}`);

// Structured logging (production)
const logger = require('winston');
logger.info('User login', {
  userId: user.id,
  email: user.email,
  timestamp: new Date(),
  ip: req.ip
});
```

---

## Dependency Security

### Keep Dependencies Updated

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update packages
npm update

# Check outdated packages
npm outdated
```

### Regular Maintenance

- [ ] Weekly: `npm audit`
- [ ] Monthly: `npm update`
- [ ] Quarterly: Review major versions
- [ ] Review changelogs for security fixes

---

## Incident Response Plan

### If Account Compromised

1. **Immediate**
   - Reset password
   - Revoke all tokens (force re-login)
   - Notify user via email

2. **Short-term**
   - Review account activity logs
   - Check for unauthorized actions
   - Enable 2FA if available

3. **Long-term**
   - Implement stronger authentication
   - Add activity notifications
   - Deploy monitoring alerts

### If Database Breached

1. **Immediate**
   - Take system offline
   - Notify users
   - Begin investigation

2. **Short-term**
   - Force password reset
   - Audit access logs
   - Deploy patches

3. **Long-term**
   - Implement encryption at rest
   - Add audit logging
   - Regular security audits

---

## Security Checklist - Monthly

- [ ] Review access logs
- [ ] Update npm dependencies
- [ ] Check MongoDB backup status
- [ ] Review user accounts for suspicious activity
- [ ] Test password reset functionality
- [ ] Verify SSL certificate is valid
- [ ] Check rate limiting is working
- [ ] Review environment variable security
- [ ] Audit CORS configuration
- [ ] Test token expiration

---

## Security Checklist - Quarterly

- [ ] Penetration testing
- [ ] Code security audit
- [ ] Dependency vulnerability scan
- [ ] Database backup test
- [ ] Disaster recovery test
- [ ] Security training for team
- [ ] Review incident response plan
- [ ] Update security policies
- [ ] Audit user permissions
- [ ] Review third-party integrations

---

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express.js Security](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Security](https://docs.mongodb.com/manual/security/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

## Summary

Your authentication system includes:

✅ Password hashing with bcryptjs
✅ JWT token authentication
✅ Input validation
✅ CORS security
✅ Environment variable protection
✅ Unique email enforcement
✅ Secure error handling
✅ MongoDB parameterized queries

**Additional improvements to consider:**
- [ ] Rate limiting
- [ ] Email verification
- [ ] 2FA authentication
- [ ] Refresh tokens
- [ ] Password reset
- [ ] Account lockout after failed attempts
- [ ] IP-based restrictions
- [ ] Activity logging
- [ ] Security monitoring

**Remember**: Security is an ongoing process, not a one-time setup! 🔒
