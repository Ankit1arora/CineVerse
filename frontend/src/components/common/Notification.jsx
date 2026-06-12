import React from 'react';
import { AlertCircle } from 'lucide-react';
import '../styles/Notification.css';

const Notification = ({ 
  message, 
  type = 'info',
  onClose 
}) => {
  const notificationClass = `notification notification-${type}`;

  return (
    <div className={notificationClass}>
      <AlertCircle size={20} />
      <span>{message}</span>
      {onClose && (
        <button 
          className="notification-close"
          onClick={onClose}
          aria-label="Close notification"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Notification;
