# Quick Start Guide

## Getting Started

### 1. Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Backend API running (if using real data)

### 2. Installation

```bash
cd frontend
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5174`

## File Structure Overview

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   └── Navbar.jsx
│   ├── pages/              # Full page components
│   │   ├── Home.jsx
│   │   ├── Registration.jsx
│   │   ├── Login.jsx
│   │   ├── JobDetails.jsx  # ⭐ Complex state logic
│   │   ├── CompanyDashboard.jsx  # ⭐ 4-panel dashboard
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Terms.jsx
│   │   └── Feedback.jsx
│   ├── context/            # State management
│   │   └── AuthContext.jsx
│   ├── styles/             # CSS files
│   │   ├── Navbar.css
│   │   ├── Home.css
│   │   ├── Registration.css
│   │   ├── Login.css
│   │   ├── JobDetails.css
│   │   └── CompanyDashboard.css
│   ├── App.jsx             # Main app with routes
│   ├── App.css
│   ├── index.css           # Global styles
│   └── main.jsx            # Entry point
├── public/
├── package.json
└── vite.config.js
```

## Key Features Implementation

### 1. Complex State Logic (JobDetails.jsx)

**Location**: `src/pages/JobDetails.jsx`

**States**:
- `initial` → Student can click "Apply Job"
- `pending` → Waiting for company approval (visual feedback)
- `approved` → Show "Access Job" button
- `work_done` → Show "Work Done" button
- `receipt_shown` → Display job receipt
- `payment_requested` → Payment status display

**Key Code Section**:
```javascript
const [applicationStatus, setApplicationStatus] = useState('initial');
const [showJobReceipt, setShowJobReceipt] = useState(false);

// Button rendering based on status
{applicationStatus === 'initial' && (
  <button onClick={handleApplyJob}>Apply Job</button>
)}
```

**To Test**:
1. Go to Home page
2. Click "View Details" on any job
3. Click "Apply Job" - button becomes grey
4. "Pending Approval" button lights up
5. In real implementation, company approves → state changes to "approved"

### 2. Company Dashboard (CompanyDashboard.jsx)

**Location**: `src/pages/CompanyDashboard.jsx`

**4 Panels**:
1. **Post Job** - Create new job postings
2. **Recent Jobs** - View job history
3. **Job Requests** - Manage pending applications (Approve/Reject)
4. **Payments** - Process student payments

**To Test**:
1. Register as "Company"
2. Go to `/dashboard`
3. Click each panel to see different views
4. Try creating a job, approving requests, processing payments

### 3. Registration with Conditional Fields

**Location**: `src/pages/Registration.jsx`

**Dynamic Fields**:
- Student role shows: Identity Card Number field
- Company role shows: Company Name + Registration Number fields

**To Test**:
1. Go to `/register`
2. Select "Student" - see identity card field appear
3. Switch to "Company" - see company fields
4. Fill and submit

## Testing Workflows

### Student Workflow

```
1. Home (/): Browse jobs
   ↓
2. Register (/register): Create account as Student
   ↓
3. Home: View jobs (you can now see details)
   ↓
4. Job Details (/job/{id}): Apply for job
   - Button states change
   - Status indicator updates
   ↓
5. After approval: Access job, complete work, request payment
```

### Company Workflow

```
1. Register (/register): Create account as Company
   ↓
2. Dashboard (/dashboard): 4-panel interface
   ↓
3. Post Job: Create new job posting
   ↓
4. Job Requests: Approve pending applications
   ↓
5. Payments: Process payments to students
```

## Mock Data

The application currently uses mock data. To see actual data:

1. **Update `src/pages/Home.jsx`**: Replace `mockJobs` array
2. **Update `src/pages/JobDetails.jsx`**: Replace `mockJobs` object
3. **Update `src/pages/CompanyDashboard.jsx`**: Replace mock arrays

Example:
```javascript
// Replace this:
const mockJobs = [...];

// With API call:
useEffect(() => {
  const fetchJobs = async () => {
    const response = await api.get('/jobs');
    setJobs(response.data);
  };
  fetchJobs();
}, []);
```

## Customization

### Change Colors
Edit `src/styles/` files:
- Primary blue: `#3498db` → Your color
- Success green: `#27ae60` → Your color
- Warning orange: `#f39c12` → Your color

### Change App Name
Edit `src/components/Navbar.jsx`:
```javascript
<Link to="/" className="navbar-logo">
  Your App Name
</Link>
```

### Add More Pages
1. Create component in `src/pages/`
2. Import in `src/App.jsx`
3. Add route: `<Route path="/path" element={<Component />} />`

## Debugging

### Use Browser DevTools

1. **Console**: Check for errors
2. **Network**: Monitor API calls
3. **React DevTools**: Inspect component state

### Check State Changes

```javascript
useEffect(() => {
  console.log('applicationStatus changed:', applicationStatus);
}, [applicationStatus]);
```

### Check API Requests

```javascript
api.interceptors.response.use(
  response => {
    console.log('API Response:', response);
    return response;
  },
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);
```

## Deployment

### Build for Production

```bash
npm run build
```

Output goes to `dist/` folder

### Preview Production Build

```bash
npm run preview
```

### Deploy to Hosting

**Using Vercel**:
```bash
npm install -g vercel
vercel
```

**Using Netlify**:
```bash
npm install -g netlify-cli
netlify deploy
```

## Performance Optimization

1. **Code Splitting**: Implement lazy loading for routes
```javascript
const Home = lazy(() => import('./pages/Home'));
```

2. **Memoization**: Use `memo()` for expensive components
```javascript
export const JobCard = memo(({ job }) => {...});
```

3. **Images**: Optimize and compress images

## Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint code
npm run lint

# Install new package
npm install package-name
```

## Troubleshooting

### Port 5174 already in use?
```bash
# Kill process on port 5174
# Windows: Use Task Manager or:
netstat -ano | findstr :5174

# Linux/Mac:
lsof -i :5174
kill -9 <PID>
```

### Modules not found?
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Styles not loading?
- Check CSS file paths
- Ensure CSS files are imported in components
- Check browser console for CSS errors

## Next Steps

1. **Read Full Documentation**: See `FRONTEND_DOCS.md`
2. **API Integration**: See `API_INTEGRATION.md`
3. **State Logic**: See `COMPLEX_STATE_GUIDE.md`
4. **Connect Backend**: Update mock data with real API calls
5. **Add More Features**: Forms validation, error handling, etc.

## Support

For issues or questions:
1. Check browser console for errors
2. Review documentation files
3. Check component props and state
4. Use React DevTools to inspect components