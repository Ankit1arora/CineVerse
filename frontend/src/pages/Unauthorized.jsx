import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import Button from '../components/common/Button';
import '../styles/errorPages.css';

const Unauthorized = () => {
  return (
    <div className="error-page">
      <div className="error-content">
        <AlertTriangle className="error-icon" size={64} />
        <h1>Access Denied</h1>
        <p>You don't have permission to access this page.</p>
        <Link to="/login">
          <Button variant="primary">Go to Login</Button>
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
