# Complex State Logic Guide

## JobDetails Component - State Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    JOB DETAILS PAGE                                 │
│                  Application Workflow States                         │
└─────────────────────────────────────────────────────────────────────┘

                              START
                                │
                                ▼
                        ┌──────────────┐
                        │   INITIAL    │
                        └──────────────┘
                                │
                    User clicks "Apply Job"
                                │
                                ▼
                        ┌──────────────┐
                        │   PENDING    │ ◄───┐
                        └──────────────┘     │ (Waiting for company approval)
                      ┌─────────────────┐    │
                      │ Button Changes: │    │
                      │ Apply (grey)    │────┘
                      │ Pending (orange)│
                      │ (pulsing)       │
                      └─────────────────┘
                                │
                    Backend updates status
                         to "approved"
                                │
                                ▼
                        ┌──────────────┐
                        │  APPROVED    │
                        └──────────────┘
                                │
                    User clicks "Access Job"
                                │
                                ▼
                        ┌──────────────┐
                        │  WORK_DONE   │
                        └──────────────┘
                                │
                    User clicks "Work Done"
                                │
                                ▼
                        ┌──────────────┐
                        │  RECEIPT     │ ◄───┐
                        │  SHOWN       │     │
                        └──────────────┘     │
                      ┌─────────────────┐    │
                      │ Receipt Details:│    │
                      │ - Job Title     │    │
                      │ - Company       │    │
                      │ - Duration      │    │
                      │ - Amount ($)    │    │
                      │ - Status        │    │
                      └─────────────────┘    │
                                │
                    User clicks "Ask for Money"
                                │
                                ▼
                        ┌──────────────────────┐
                        │  PAYMENT_REQUESTED   │
                        └──────────────────────┘
                                │
                    Backend processes payment
                    (company approves/pays)
                                │
                                ▼
                        ┌──────────────┐
                        │  COMPLETED   │
                        └──────────────┘
                                │
                                ▼
                              END
```

## State Transition Table

| Current | Event | Next | UI Change | API Call |
|---------|-------|------|-----------|----------|
| initial | Apply Job | pending | Apply button disabled (grey), Pending button lights up | POST /applications |
| pending | Company approves | approved | Buttons disappear, "Access Job" appears | PUT /applications/{id}/approve |
| approved | Access Job | work_done | "Access Job" hidden, "Work Done" shown | POST /applications/{id}/access |
| work_done | Work Done | receipt_shown | Receipt modal/card displayed | PUT /applications/{id}/status |
| receipt_shown | Ask for Money | payment_requested | Payment status shown | POST /applications/{id}/request-payment |
| payment_requested | Company pays | completed | Success message | POST /payments |

## Component Code Structure

### State Variables

```javascript
// Application status tracking
const [applicationStatus, setApplicationStatus] = useState('initial');

// Receipt display flag
const [showJobReceipt, setShowJobReceipt] = useState(false);

// Loading state for async operations
const [loading, setLoading] = useState(false);

// Optional: Store application ID from backend
const [applicationId, setApplicationId] = useState(null);
```

### Button Rendering Logic

```javascript
// INITIAL STATE
{applicationStatus === 'initial' && (
  <button onClick={handleApplyJob}>Apply Job</button>
)}

// PENDING STATE
{applicationStatus === 'pending' && (
  <>
    <button disabled>Apply Job</button>  {/* Grey/disabled */}
    <button disabled>⏳ Pending</button>   {/* Orange/animated */}
  </>
)}

// APPROVED STATE
{applicationStatus === 'approved' && (
  <button onClick={handleAccessJob}>Access Job</button>
)}

// WORK DONE STATE
{applicationStatus === 'work_done' && (
  <button onClick={handleWorkDone}>Work Done</button>
)}

// RECEIPT SHOWN
{showJobReceipt && (
  <div className="job-receipt">
    {/* Receipt Details */}
    <button onClick={handleRequestPayment}>Ask for Money</button>
  </div>
)}

// PAYMENT REQUESTED
{applicationStatus === 'payment_requested' && (
  <div>
    <p>Payment request sent</p>
    <button disabled>Payment Requested</button>
  </div>
)}
```

### Handler Functions

```javascript
const handleApplyJob = async () => {
  setLoading(true);
  try {
    const response = await api.post('/applications', {
      jobId: parseInt(jobId),
      studentId: user.id,
    });
    setApplicationId(response.data.id);
    setApplicationStatus('pending');
  } catch (error) {
    console.error('Error:', error);
  }
  setLoading(false);
};

const handleAccessJob = () => {
  // Mark as accessed in backend
  setApplicationStatus('work_done');
};

const handleWorkDone = () => {
  // Transition to receipt state
  setApplicationStatus('work_done');
  setShowJobReceipt(true);
};

const handleRequestPayment = async () => {
  setLoading(true);
  try {
    await api.post(`/applications/${applicationId}/request-payment`);
    setApplicationStatus('payment_requested');
  } catch (error) {
    console.error('Error:', error);
  }
  setLoading(false);
};
```

## CSS State Classes

```css
/* Button states */
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-disabled {
  background-color: #bdc3c7;
  color: #7f8c8d;
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-pending {
  background-color: #f39c12;
  color: white;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* Status indicators */
.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.status-initial {
  background-color: #e8f4f8;
  color: #3498db;
}

.status-pending {
  background-color: #fef5e7;
  color: #f39c12;
  animation: pulse 2s infinite;
}

.status-approved {
  background-color: #d5f4e6;
  color: #27ae60;
}
```

## Testing the State Logic

### Manual Testing Checklist

- [ ] User can click "Apply Job" button
- [ ] Button becomes disabled/grey after clicking
- [ ] "Pending Approval" indicator appears with pulse animation
- [ ] Status indicator shows "Pending"
- [ ] Backend call is made (check Network tab in DevTools)
- [ ] When backend updates status to "approved", page refreshes
- [ ] "Access Job" button appears (green)
- [ ] User can click "Access Job"
- [ ] "Work Done" button appears
- [ ] User can click "Work Done"
- [ ] Receipt displays all job information
- [ ] "Ask for Money" button appears (orange)
- [ ] User can click "Ask for Money"
- [ ] Payment status shows correctly
- [ ] "Payment Requested" button is disabled
- [ ] Status badge updates throughout

### Automated Testing Example

```javascript
// Using React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import { JobDetails } from './JobDetails';

test('Button state transitions correctly', async () => {
  render(<JobDetails jobId="1" />);
  
  // Initial state
  expect(screen.getByText('Apply Job')).toBeInTheDocument();
  
  // Click Apply
  fireEvent.click(screen.getByText('Apply Job'));
  
  // Wait for pending state
  await waitFor(() => {
    expect(screen.getByText('Pending Approval')).toBeInTheDocument();
  });
  
  // Apply button should be disabled
  expect(screen.getByText('Apply Job')).toBeDisabled();
});
```

### API Testing Sequence

1. **Start**: Student at job details page, status = "initial"
2. **Apply**: Click Apply Job button
   - Frontend: Change state to "pending"
   - Backend: POST /applications { jobId, studentId }
   - Backend Response: { id, status: "pending" }
3. **Approve**: Company approves the application
   - Backend: PUT /applications/{id}/approve
   - Frontend: Poll or websocket receives status update
   - Frontend: Change state to "approved"
4. **Work**: Student works on the job
   - Frontend: Click "Work Done"
   - Backend: PUT /applications/{id}/status { status: "work_done" }
5. **Payment**: Student requests payment
   - Frontend: Click "Ask for Money"
   - Backend: POST /applications/{id}/request-payment
   - Frontend: Change state to "payment_requested"
6. **Complete**: Company processes payment
   - Backend: POST /payments { applicationId, amount }
   - Frontend: Show success message

## Common Issues and Solutions

### Issue: Buttons not updating state
**Solution**: Ensure state is being updated correctly in handlers. Check browser DevTools for state changes.

### Issue: Receipt not showing
**Solution**: Check that `showJobReceipt` is set to true. Verify conditional rendering logic.

### Issue: Loading spinner not working
**Solution**: Ensure `loading` state is being toggled on and off in try/finally blocks.

### Issue: API calls not working
**Solution**: Check console for errors, verify backend is running, check CORS settings.

### Issue: Button animations not working
**Solution**: Verify CSS animation is included, check browser support, use Chrome DevTools to debug.

## Future Enhancements

1. **Real-time Updates**: Use WebSockets for instant status updates
2. **Polling**: Periodically check backend for status changes
3. **Notifications**: Toast/alert notifications for state changes
4. **Undo**: Allow reverting to previous states
5. **Persistence**: Save state to localStorage for recovery
6. **Analytics**: Track time spent in each state
7. **Chat**: Allow student-company communication
8. **Dispute Resolution**: Handle payment disputes