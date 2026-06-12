import React from 'react';
import '../styles/Card.css';

const Card = ({ children, className = '', onClick, hoverable = false }) => {
  const cardClass = `card ${hoverable ? 'card-hoverable' : ''} ${className}`;
  
  return (
    <div className={cardClass} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
