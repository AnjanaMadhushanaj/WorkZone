# 🌐 Production Deployment Guide

## Render Backend Deployment

### Step 1: Prepare Your GitHub Repository

```bash
# Ensure all code is committed
git add .
git commit -m "Add professional authentication system"
git push origin main
```

### Step 2: Create Render Account & Connect GitHub
1. Go to [render.com](https://render.com)
2. Sign up / Log in
3. Click "New +" → "Web Service"
4. Select your GitHub repository
5. Configure as follows:

| Setting | Value |
|---------|-------|
| Name | `workzone-backend` |
| Environment | `Node` |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Plan | Free/Starter (upgrade as needed) |

### Step 3: Add Environment Variables

In Render Dashboard → Environment:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/workzone
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long_change_this
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
PORT=5000
```

### Step 4: Update package.json Start Script

Ensure you have:
```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  }
}
```

### Step 5: Deploy

1. Click "Create Web Service"
2. Render will auto-deploy when you push to main branch
3. Watch the "Logs" for deployment status
4. Your backend URL: `https://workzone-backend.onrender.com/api`

---

## Vercel Frontend Deployment

### Step 1: Prepare Vercel Configuration

Create or update `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "REACT_APP_API_URL": "@workzone_api_url"
  }
}
```

### Step 2: Push to GitHub

```bash
git add .
git commit -m "Prepare frontend for Vercel deployment"
git push origin main
```

### Step 3: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repository
4. Configure build settings:
   - Framework: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Step 4: Add Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

| Name | Value |
|------|-------|
| `REACT_APP_API_URL` | `https://workzone-backend.onrender.com/api` |

### Step 5: Deploy

1. Click "Deploy"
2. Vercel will build and deploy automatically
3. Your frontend URL: `https://workzone-frontend.vercel.app`

---

## Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Cluster

1. Go to [mongodb.com/cloud](https://mongodb.com/cloud)
2. Sign up / Log in
3. Create a free cluster
4. Create database user with strong password
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/dbname`

### Step 2: Whitelist Render IP

1. Go to MongoDB Atlas → Network Access
2. Add Render IP address (or click "Allow Access from Anywhere" for testing)
3. Save whitelist

### Step 3: Create Database

1. Go to Databases
2. Click "Browse Collections"
3. Create database named `workzone`
4. Create collection named `users`

### Step 4: Test Connection

```bash
mongo "mongodb+srv://username:password@cluster.mongodb.net/workzone"
```

---

## Update Backend for Production

### Modify `index.js`

Add production error handling:

```javascript
// At the top
if (process.env.NODE_ENV === 'production') {
  // Production-only middleware
  app.use((err, req, res, next) => {
    // Don't leak error details in production
    res.status(err.status || 500).json({
      success: false,
      message: 'Internal Server Error'
    });
  });
}
```

### Update `.env.example`

```env
# Production .env template
MONGO_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/workzone
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long_change_this
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
PORT=5000
```

---

## Post-Deployment Testing

### 1. Test Health Endpoints

```bash
curl https://workzone-backend.onrender.com/
curl https://workzone-backend.onrender.com/api/health
```

### 2. Test Authentication Flow

```bash
# Register
curl -X POST https://workzone-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test123","phone":"+1234567890","role":"student","identityCardNumber":"NIC123"}'

# Login
curl -X POST https://workzone-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123"}'
```

### 3. Test from Frontend

- Login with test account
- Register new account
- Check token is stored in localStorage
- Verify API calls succeed

---

## Monitoring & Maintenance

### Render Logs

Monitor your backend:

```bash
# In Render Dashboard
Logs → View all activity
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Connection timeout | Increase timeout in MongoDB Atlas |
| Out of memory | Upgrade Render plan |
| CORS errors | Update FRONTEND_URL in Render env vars |
| Database errors | Check MongoDB connection string |

### Regular Checks

- [ ] Monitor error logs weekly
- [ ] Update dependencies monthly
- [ ] Review MongoDB storage usage
- [ ] Check Render bandwidth usage
- [ ] Test login/register flows monthly

---

## Scaling for Production

### When to Upgrade

1. **Free Tier Issues**
   - Render: Spins down after 15 min inactivity
   - MongoDB: 512MB storage limit
   - Vercel: 12 serverless functions max

2. **Upgrade to Paid**
   - Render Starter: Always-on, better performance
   - MongoDB M0 → M10: More storage, no sleep
   - Vercel Pro: Priority support, more functions

### Performance Optimization

```javascript
// Add caching headers
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=3600');
  next();
});

// Add request compression
const compression = require('compression');
app.use(compression());
```

### Add Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts'
});

app.post('/api/auth/login', loginLimiter, ...);
```

---

## Security Checklist for Production

- [x] JWT_SECRET is strong (min 32 chars)
- [x] MONGO_URI uses environment variables
- [x] NODE_ENV set to 'production'
- [x] CORS configured for specific domain
- [x] Passwords hashed with bcryptjs
- [ ] SSL/TLS enabled (automatic on Render)
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak sensitive info
- [ ] Logs don't contain passwords/tokens
- [ ] MongoDB Atlas has IP whitelist
- [ ] Regular security audits scheduled

---

## Backup & Recovery

### MongoDB Backup

```bash
# Dump database
mongodump --uri "mongodb+srv://username:password@cluster.mongodb.net/workzone" --out ./backup

# Restore database
mongorestore --uri "mongodb+srv://username:password@cluster.mongodb.net/workzone" ./backup
```

### GitHub Backup

- Your code is automatically backed up on GitHub
- Enable GitHub Actions for automated testing

---

## Rollback Plan

If deployment fails:

### Render Rollback
1. Go to Render Dashboard → Deploys
2. Click previous successful deployment
3. Click "Re-deploy"

### Database Rollback
- Restore from MongoDB Atlas backups
- Keep transaction logs for auditing

---

## Domain Setup (Optional)

### Add Custom Domain to Vercel

1. Vercel Dashboard → Settings → Domains
2. Add your domain: `workzone.com`
3. Follow DNS setup instructions
4. Wait 24-48 hours for DNS propagation

### Add Custom Domain to Render

1. Render Dashboard → Settings → Custom Domains
2. Add your domain
3. Update DNS records

---

## Contact & Support

- **Render Docs**: [render.com/docs](https://render.com/docs)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **MongoDB Docs**: [mongodb.com/docs](https://mongodb.com/docs)
- **Express Docs**: [expressjs.com](https://expressjs.com)

---

## Success Checklist

- [x] Backend deployed to Render
- [x] Frontend deployed to Vercel
- [x] Environment variables configured
- [x] MongoDB Atlas running
- [x] CORS working correctly
- [x] Authentication endpoints tested
- [x] Token storage working
- [x] Protected routes secured
- [x] Error handling in place
- [x] Monitoring set up

**You're ready for production!** 🎉
