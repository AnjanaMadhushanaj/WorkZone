import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/JobDetails.css';

// Mock job data
const mockJobs = {
  1: { id: 1, title: 'Web Development Task', company: 'Tech Corp', price: 50, time: '2 hours', description: 'Build a responsive website' },
  2: { id: 2, title: 'Logo Design', company: 'Creative Inc', price: 75, time: '3 hours', description: 'Design a modern logo' },
  3: { id: 3, title: 'Data Entry', company: 'Admin Pro', price: 30, time: '1 hour', description: 'Enter data into spreadsheet' },
  4: { id: 4, title: 'Content Writing', company: 'Media House', price: 40, time: '2.5 hours', description: 'Write blog content' },
  5: { id: 5, title: 'API Integration', company: 'DevHub', price: 100, time: '4 hours', description: 'Integrate third-party APIs' },
};

export const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const job = mockJobs[jobId];

  // Application states: 'initial', 'pending', 'approved', 'work_done', 'payment_requested', 'completed'
  const [applicationStatus, setApplicationStatus] = useState('initial');
  const [showJobReceipt, setShowJobReceipt] = useState(false);
  const [loading, setLoading] = useState(false);

  // Simulate fetching application status from backend
  useEffect(() => {
    if (!isLoggedIn() || user?.role !== 'student') {
      navigate('/register');
      return;
    }

    // In real app, fetch from backend
    // setApplicationStatus('initial');
  }, [isLoggedIn, user, navigate]);

  if (!job) {
    return <div className="error">Job not found</div>;
  }

  if (!isLoggedIn() || user?.role !== 'student') {
    return null;
  }

  const handleApplyJob = async () => {
    setLoading(true);
    try {
      // API call to apply for job
      // const response = await axios.post('/api/applications', { jobId, studentId: user.id });
      setApplicationStatus('pending');
      console.log('Applied for job:', job.id);
    } catch (error) {
      console.error('Error applying for job:', error);
    }
    setLoading(false);
  };

  const handleAccessJob = () => {
    // Logic to access the job
    console.log('Accessing job:', job.id);
  };

  const handleWorkDone = () => {
    setApplicationStatus('work_done');
    setShowJobReceipt(true);
  };

  const handleRequestPayment = async () => {
    setLoading(true);
    try {
      // API call to request payment
      // const response = await axios.post(`/api/applications/${appId}/request-payment`);
      setApplicationStatus('payment_requested');
      console.log('Payment requested for job:', job.id);
    } catch (error) {
      console.error('Error requesting payment:', error);
    }
    setLoading(false);
  };

  return (
    <div className="job-details-container">
      <div className="job-details-card">
        <h1>{job.title}</h1>
        <p className="company">{job.company}</p>

        <div className="job-info">
          <div className="info-item">
            <span className="label">Time Required:</span>
            <span className="value">{job.time}</span>
          </div>
          <div className="info-item">
            <span className="label">Payment:</span>
            <span className="value price">${job.price}</span>
          </div>
        </div>

        <div className="job-description">
          <h3>Description</h3>
          <p>{job.description}</p>
        </div>

        {/* ============== BUTTON LOGIC BASED ON STATUS ============== */}
        <div className="button-section">
          {/* Initial State: Show Apply Job button */}
          {applicationStatus === 'initial' && (
            <button
              className="btn btn-primary"
              onClick={handleApplyJob}
              disabled={loading}
            >
              {loading ? 'Applying...' : 'Apply Job'}
            </button>
          )}

          {/* Pending State: Show disabled Apply + active Pending indicator */}
          {applicationStatus === 'pending' && (
            <div className="pending-state">
              <button className="btn btn-disabled" disabled>
                Apply Job
              </button>
              <button className="btn btn-pending" disabled>
                ⏳ Pending Approval
              </button>
            </div>
          )}

          {/* Approved State: Show Access Job button */}
          {applicationStatus === 'approved' && (
            <button
              className="btn btn-success"
              onClick={handleAccessJob}
            >
              Access Job
            </button>
          )}

          {/* Work Done State: Show Work Done button */}
          {applicationStatus === 'work_done' && !showJobReceipt && (
            <button
              className="btn btn-info"
              onClick={handleWorkDone}
            >
              Work Done
            </button>
          )}

          {/* Show Job Receipt */}
          {showJobReceipt && (
            <div className="job-receipt">
              <div className="receipt-header">
                <h3>Job Receipt</h3>
              </div>
              <div className="receipt-content">
                <div className="receipt-item">
                  <span className="label">Job Title:</span>
                  <span className="value">{job.title}</span>
                </div>
                <div className="receipt-item">
                  <span className="label">Company:</span>
                  <span className="value">{job.company}</span>
                </div>
                <div className="receipt-item">
                  <span className="label">Duration:</span>
                  <span className="value">{job.time}</span>
                </div>
                <div className="receipt-item">
                  <span className="label">Amount Earned:</span>
                  <span className="value amount">${job.price}</span>
                </div>
                <div className="receipt-item">
                  <span className="label">Status:</span>
                  <span className="value status">Completed</span>
                </div>
              </div>
              <button
                className="btn btn-warning"
                onClick={handleRequestPayment}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Ask for Money'}
              </button>
            </div>
          )}

          {/* Payment Requested State */}
          {applicationStatus === 'payment_requested' && (
            <div className="payment-requested-state">
              <div className="status-message">
                <p>💰 Payment request sent to {job.company}</p>
                <p className="subtext">Amount: ${job.price}</p>
              </div>
              <button className="btn btn-disabled" disabled>
                Payment Requested
              </button>
            </div>
          )}
        </div>

        {/* Status Indicator */}
        <div className="status-indicator">
          <span className="label">Current Status:</span>
          <span className={`status-badge status-${applicationStatus}`}>
            {applicationStatus.charAt(0).toUpperCase() + applicationStatus.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
};
