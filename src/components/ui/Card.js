import React from 'react';

const Card = ({ children, className = '' }) => {
  // O `className` permite adicionar classes customizadas quando necessário
  const baseClasses = 'bg-surface rounded-lg p-6 shadow-lg';
  
  return (
    <div className={`${baseClasses} ${className}`}>
      {children}
    </div>
  );
};

export default Card;