import React from 'react';
import '../styles/LoadingSpinner.css';

const LoadingSpinner = ({ size = 'md', fullPage = false }) => {
  const spinnerClass = `spinner spinner-${size}`;

  if (fullPage) {
    return (
      <div className="loading-page">
        <div className={spinnerClass} />
      </div>
    );
  }

  return <div className={spinnerClass} />;
};

export default LoadingSpinner;
