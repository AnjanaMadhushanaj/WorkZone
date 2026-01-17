# Job Portal - React Frontend

A comprehensive React application for a Job Portal platform with student job management and company dashboard functionality.

## Features

### 1. **General UI Structure**
- **Navbar**: Navigation with links to Home, About Us, Contact Us, Terms & Policies, and Feedback
- **Responsive Design**: Mobile-friendly interface
- **Authentication Status**: Dynamic navbar based on login status
- **User Dashboard**: Company-specific navigation links

### 2. **Student Features**

#### Home Page
- Browse job listings without login
- View job titles, company names, pricing, and time requirements
- Click to view job details

#### Registration
- Form with validation
- Role selection: Student or Company
- **Conditional Fields**: Student role shows "Identity Card Number" field
- Company role shows "Company Name" and "Registration Number" fields
- Email validation and password strength checking

#### Job Details View
The most complex feature with **state-based button logic**:

```
APPLICATION STATES:
├── initial
│   └── Shows "Apply Job" button (enabled, blue)
│
├── pending
│   ├── "Apply Job" button (disabled, grey)
│   └── "Pending Approval" button (enabled, orange - pulsing animation)
│
├── approved
│   └── Shows "Access Job" button (enabled, green)
│
├── work_done
│   ├── Shows "Work Done" button (enabled, teal)
│   └── Upon click → Displays Job Receipt
│
├── receipt_shown
│   ├── Shows detailed Job Receipt with:
│   │   ├── Job Title
│   │   ├── Company Name
│   │   ├── Duration
│   │   ├── Amount Earned ($)
│   │   └── Status: Completed
│   └── "Ask for Money" button (enabled, orange)
│
└── payment_requested
    ├── Shows payment status message
    ├── Displays amount sent
    └── "Payment Requested" button (disabled, grey)
```

#### Button State Transitions

| Current State | Action | Next State | UI Change |
|---|---|---|---|
| initial | Click "Apply Job" | pending | Button becomes grey, "Pending" indicator lights up with pulse |
| pending | Backend approves | approved | Both buttons disappear, "Access Job" button appears |
| approved | Click "Access Job" | ready_to_work | Button remains or state updates |
| work_done | Click "Work Done" | receipt_shown | Job Receipt modal/card appears |
| receipt_shown | Click "Ask for Money" | payment_requested | Payment status displayed |
| payment_requested | - | - | Waiting for company payment |

### 3. **Company Features**

#### Company Dashboard
A centralized hub with 4 clickable panels:

##### Panel 1: Post Job
- Form to create new job postings
- Fields: Title, Description, Price ($), Time Required
- Success notification on submission
- Job added to "Recent Jobs" list

##### Panel 2: Recent Jobs
- Table showing:
  - Job Title
  - Date Posted
  - Number of Applicants
- Allows company to track job history

##### Panel 3: Job Requests (Applications)
- Displays all **pending** applications
- Shows: Student Name, Job Title, Applied Date
- Two action buttons per request:
  - **Approve**: Changes student's status to "approved", enabling "Access Job" button
  - **Reject**: Removes the application from the list
- Uses status badge to show approval state

##### Panel 4: Payments
- Lists all **payment_requested** applications
- Shows: Student Name, Job Title, Amount Due
- **Pay Now** button to process payment
- Updates backend to mark job as paid

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## Project Structure

```
src/
├── components/
│   └── Navbar.jsx              # Navigation bar
├── pages/
│   ├── Home.jsx               # Job listing
│   ├── Registration.jsx       # User registration
│   ├── Login.jsx             # User login
│   ├── JobDetails.jsx        # Complex state logic (MAIN)
│   ├── CompanyDashboard.jsx  # 4-panel dashboard (MAIN)
│   ├── About.jsx
│   ├── Contact.jsx
│   ├── Terms.jsx
│   └── Feedback.jsx
├── context/
│   └── AuthContext.jsx        # Authentication state management
├── styles/
│   ├── Navbar.css
│   ├── Home.css
│   ├── Registration.css
│   ├── Login.css
│   ├── JobDetails.css        # Complex button state styles
│   └── CompanyDashboard.css  # Dashboard styles
├── App.jsx                    # Main app with routing
├── App.css
├── index.css                  # Global styles
└── main.jsx
```

## Key Components Deep Dive

### JobDetails.jsx (Complex State Logic)

This component manages sophisticated UI state transitions:

```javascript
// State management
const [applicationStatus, setApplicationStatus] = useState('initial');
const [showJobReceipt, setShowJobReceipt] = useState(false);
const [loading, setLoading] = useState(false);

// Handlers for each state transition
const handleApplyJob = () => setApplicationStatus('pending');
const handleAccessJob = () => { /* access job */ };
const handleWorkDone = () => {
  setApplicationStatus('work_done');
  setShowJobReceipt(true);
};
const handleRequestPayment = () => setApplicationStatus('payment_requested');
```

### CompanyDashboard.jsx (4-Panel Dashboard)

```javascript
// Panel switching
const [activePanel, setActivePanel] = useState('overview');

// Data management
const [jobRequests, setJobRequests] = useState(mockJobRequests);
const [payments, setPayments] = useState(mockPaymentRequests);

// Handlers
const handleApproveRequest = (requestId) => { /* approve logic */ };
const handlePayStudent = (paymentId, amount) => { /* payment logic */ };
```

## State Management

- **AuthContext**: Manages user login/logout state
- **Component State**: Used for form inputs and panel displays
- **localStorage**: Persists user session across page refreshes

## Styling

- **CSS**: Custom CSS for all components
- **Responsive**: Mobile-first design approach
- **Animations**: Pulse effect for pending states, slide animations for conditional fields

## API Integration Points

Replace mock data with API calls:

```javascript
// Example: Apply for job
const response = await axios.post('/api/applications', { 
  jobId, 
  studentId: user.id 
});

// Example: Approve request
const response = await axios.put(`/api/applications/${appId}/approve`);

// Example: Request payment
const response = await axios.post(`/api/applications/${appId}/request-payment`);
```

## Future Enhancements

1. Real API integration with backend
2. Payment gateway integration
3. Notifications/Toast messages
4. Email notifications
5. Search and filter jobs
6. Job categories and tags
7. Reviews and ratings
8. Profile management
9. Job applications history
10. Payment history

## Technologies Used

- **React 19.2.0**
- **React Router DOM**
- **Axios** (for API calls)
- **Vite** (build tool)
- **CSS3**

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## License

MIT