// src/pages/NotAuthenticated.jsx
import { Link } from 'react-router-dom';
import '../assets/not-authenticated.css';

function NotAuthenticated() {
  return (
    <div className="auth-error-wrapper">
      <div className="auth-error-box">
        <h1>🔒 Access Denied</h1>
        <p>You must be authenticated to view this page.</p>
        <Link to="/login" className="auth-error-button">Login to Continue</Link>
      </div>
    </div>
  );
}

export default NotAuthenticated;