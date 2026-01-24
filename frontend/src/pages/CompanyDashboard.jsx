import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/CompanyDashboard.css';

// Mock data
const mockCompanyJobs = [
  { id: 1, title: 'Web Development', datePosted: '2025-01-15', applicants: 5 },
  { id: 2, title: 'Logo Design', datePosted: '2025-01-10', applicants: 3 },
  { id: 3, title: 'API Integration', datePosted: '2025-01-05', applicants: 2 },
];

const mockJobRequests = [
  { id: 1, studentName: 'John Doe', jobTitle: 'Web Development', appliedDate: '2025-01-16', status: 'pending' },
  { id: 2, studentName: 'Jane Smith', jobTitle: 'Logo Design', appliedDate: '2025-01-15', status: 'pending' },
  { id: 3, studentName: 'Bob Johnson', jobTitle: 'API Integration', appliedDate: '2025-01-14', status: 'pending' },
];

const mockPaymentRequests = [
  { id: 1, studentName: 'Alice Brown', jobTitle: 'Web Development', requestDate: '2025-01-16' },
  { id: 2, studentName: 'Charlie Davis', jobTitle: 'Data Entry', requestDate: '2025-01-15' },
];

export const CompanyDashboard = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [activePanel, setActivePanel] = useState('overview');
  const [showPostJobForm, setShowPostJobForm] = useState(false);
  const [jobRequests, setJobRequests] = useState(mockJobRequests);
  const [payments, setPayments] = useState(mockPaymentRequests);
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    time: '',
  });

  if (!isLoggedIn() || user?.role !== 'company') {
    return (
      <div className="error-message">
        <h1>Access Denied</h1>
        <p>This page is only for company users.</p>
      </div>
    );
  }

  const handleApproveRequest = (requestId) => {
    setJobRequests(
      jobRequests.map((req) =>
        req.id === requestId ? { ...req, status: 'approved' } : req
      )
    );
    // API call to update backend
    console.log('Approved request:', requestId);
  };

  const handleRejectRequest = (requestId) => {
    setJobRequests(jobRequests.filter((req) => req.id !== requestId));
    // API call to update backend
    console.log('Rejected request:', requestId);
  };

  const handlePayStudent = (paymentId) => {
    setPayments(payments.filter((payment) => payment.id !== paymentId));
    // API call to process payment
    console.log('Payment processed:', paymentId);
    alert('Daily payout processed successfully!');
  };

  const handlePostJob = (e) => {
    e.preventDefault();
    if (!newJob.title || !newJob.description || !newJob.time) {
      alert('Please fill all fields');
      return;
    }
    // API call to post job
    console.log('Job posted:', newJob);
    setNewJob({ title: '', description: '', time: '' });
    setShowPostJobForm(false);
    alert('Job posted successfully!');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob({ ...newJob, [name]: value });
  };

  return (
    <div className="company-dashboard">
      <div className="dashboard-header">
        <h1>Company Dashboard</h1>
        <p className="company-name">Welcome, {user?.company}</p>
      </div>

      {/* Dashboard Panels */}
      <div className="dashboard-panels">
        {/* Panel 1: Post Job */}
        <div
          className="dashboard-panel"
          onClick={() => setActivePanel('post-job')}
        >
          <div className="panel-icon">📝</div>
          <h3>Post Job</h3>
          <p>Create new job posting</p>
        </div>

        {/* Panel 2: Recent Jobs */}
        <div
          className="dashboard-panel"
          onClick={() => setActivePanel('recent-jobs')}
        >
          <div className="panel-icon">📋</div>
          <h3>Recent Jobs</h3>
          <p>View job history ({mockCompanyJobs.length})</p>
        </div>

        {/* Panel 3: Job Requests */}
        <div
          className="dashboard-panel"
          onClick={() => setActivePanel('job-requests')}
        >
          <div className="panel-icon">👥</div>
          <h3>Job Requests</h3>
          <p>Pending applications ({jobRequests.filter(r => r.status === 'pending').length})</p>
        </div>

        {/* Panel 4: Payments */}
        <div
          className="dashboard-panel"
          onClick={() => setActivePanel('payments')}
        >
          <div className="panel-icon">💳</div>
          <h3>Payments</h3>
          <p>Payment requests ({payments.length})</p>
        </div>
      </div>

      {/* Panel Contents */}
      <div className="dashboard-content">
        {/* POST JOB PANEL */}
        {activePanel === 'post-job' && (
          <div className="content-section">
            <h2>Post a New Job</h2>
            {!showPostJobForm ? (
              <button
                className="btn btn-primary"
                onClick={() => setShowPostJobForm(true)}
              >
                + Create Job Posting
              </button>
            ) : (
              <form className="job-form" onSubmit={handlePostJob}>
                <div className="form-group">
                  <label htmlFor="title">Job Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newJob.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Web Development Task"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    value={newJob.description}
                    onChange={handleInputChange}
                    placeholder="Describe the job requirements"
                    rows="4"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="time">Time Required *</label>
                  <input
                    type="text"
                    id="time"
                    name="time"
                    value={newJob.time}
                    onChange={handleInputChange}
                    placeholder="e.g., 2 hours"
                    required
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-success">
                    Post Job
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowPostJobForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* RECENT JOBS PANEL */}
        {activePanel === 'recent-jobs' && (
          <div className="content-section">
            <h2>Recent Jobs</h2>
            <table className="jobs-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Date Posted</th>
                  <th>Applicants</th>
                </tr>
              </thead>
              <tbody>
                {mockCompanyJobs.map((job) => (
                  <tr key={job.id}>
                    <td>{job.title}</td>
                    <td>{job.datePosted}</td>
                    <td>{job.applicants}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* JOB REQUESTS PANEL */}
        {activePanel === 'job-requests' && (
          <div className="content-section">
            <h2>Job Applications</h2>
            {jobRequests.length === 0 ? (
              <p className="empty-message">No pending applications</p>
            ) : (
              <div className="requests-list">
                {jobRequests.map((request) => (
                  <div key={request.id} className="request-card">
                    <div className="request-info">
                      <h4>{request.studentName}</h4>
                      <p className="job-title">{request.jobTitle}</p>
                      <p className="applied-date">Applied: {request.appliedDate}</p>
                    </div>
                    <div className="request-actions">
                      {request.status === 'pending' && (
                        <>
                          <button
                            className="btn btn-success"
                            onClick={() => handleApproveRequest(request.id)}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleRejectRequest(request.id)}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {request.status === 'approved' && (
                        <span className="status-badge approved">Approved</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PAYMENTS PANEL */}
        {activePanel === 'payments' && (
          <div className="content-section">
            <h2>Payment Requests</h2>
            {payments.length === 0 ? (
              <p className="empty-message">No payment requests</p>
            ) : (
              <div className="payments-list">
                {payments.map((payment) => (
                  <div key={payment.id} className="payment-card">
                    <div className="payment-info">
                      <h4>{payment.studentName}</h4>
                      <p className="job-title">{payment.jobTitle}</p>
                      <p className="request-date">Requested: {payment.requestDate}</p>
                    </div>
                    <div className="payment-amount">
                      <span className="schedule">Daily payout schedule</span>
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={() => handlePayStudent(payment.id)}
                    >
                      Pay Now
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
