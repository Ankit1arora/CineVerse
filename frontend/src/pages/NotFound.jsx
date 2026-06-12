import React from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import Button from '../components/common/Button';
import '../styles/errorPages.css';

const NotFound = () => {
  return (
    <div className="error-page">
      <div className="error-content">
        <Search className="error-icon" size={64} />
        <h1>404 - Page Not Found</h1>
        <p>Sorry, the page you're looking for doesn't exist.</p>
        <Link to="/login">
          <Button variant="primary">Go Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
