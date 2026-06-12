import React from 'react';
import { Inbox } from 'lucide-react';
import '../styles/EmptyState.css';

const EmptyState = ({ 
  title = 'No Data Found',
  description = 'There is nothing to display here.',
  action = null,
  icon: Icon = Inbox
}) => {
  return (
    <div className="empty-state">
      <Icon className="empty-state-icon" size={48} />
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {action && (
        <button className="btn btn-primary">{action.label}</button>
      )}
    </div>
  );
};

export default EmptyState;
