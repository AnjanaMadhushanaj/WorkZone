import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css';

// Mock data - replace with API call
const mockJobs = [
  { id: 1, title: 'Web Development Task', company: 'Tech Corp', price: 50, time: '2 hours' },
  { id: 2, title: 'Logo Design', company: 'Creative Inc', price: 75, time: '3 hours' },
  { id: 3, title: 'Data Entry', company: 'Admin Pro', price: 30, time: '1 hour' },
  { id: 4, title: 'Content Writing', company: 'Media House', price: 40, time: '2.5 hours' },
  { id: 5, title: 'API Integration', company: 'DevHub', price: 100, time: '4 hours' },
];

export const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const handleJobClick = (jobId) => {
    if (!isLoggedIn()) {
      navigate('/register');
    } else {
      navigate(`/job/${jobId}`);
    }
  };

  return (
    <div className="home-container">
      <div className="hero">
        <h1>Find Your Perfect Job</h1>
        <p>Browse and apply for available jobs from top companies</p>
      </div>

      <div className="jobs-section">
        <h2>Available Jobs</h2>
        <div className="jobs-grid">
          {mockJobs.map((job) => (
            <div key={job.id} className="job-card">
              <div className="job-card-header">
                <h3>{job.title}</h3>
                <span className="company">{job.company}</span>
              </div>
              <div className="job-card-details">
                <p><strong>Price:</strong> ${job.price}</p>
                <p><strong>Time:</strong> {job.time}</p>
              </div>
              <button
                className="view-details-btn"
                onClick={() => handleJobClick(job.id)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
