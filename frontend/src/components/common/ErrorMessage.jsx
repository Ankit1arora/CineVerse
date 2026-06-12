import React from 'react';
import { AlertCircle } from 'lucide-react';
import '../styles/ErrorMessage.css';

const ErrorMessage = ({ 
  message, 
  title = 'Error', 
  onRetry = null,
  isDismissible = true,
  onDismiss = null 
}) => {
  return (
    <div className="error-container">
      <div className="error-content">
        <AlertCircle className="error-icon" size={24} />
        <div className="error-text">
          <h3 className="error-title">{title}</h3>
          <p className="error-message">{message}</p>
        </div>
      </div>
      <div className="error-actions">
        {onRetry && (
          <button className="btn btn-primary" onClick={onRetry}>
            Try Again
          </button>
        )}
        {isDismissible && (
          <button 
            className="btn btn-secondary" 
            onClick={onDismiss}
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
