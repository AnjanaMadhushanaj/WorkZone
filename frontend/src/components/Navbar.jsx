import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

export const Navbar = () => {
  const { isLoggedIn, logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Job Portal
        </Link>
        <ul className="navbar-menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
          <li><Link to="/terms">Terms & Policies</Link></li>
          <li><Link to="/feedback">Feedback</Link></li>
          {isLoggedIn() ? (
            <>
              {user?.role === 'company' && (
                <li><Link to="/dashboard">Dashboard</Link></li>
              )}
              <li>
                <span className="user-name">{user?.name}</span>
              </li>
              <li>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/register" className="register-link">Register</Link></li>
              <li><Link to="/login" className="login-link">Login</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};
