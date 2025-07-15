import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', disabled = false }) => {
  const baseClasses = 'font-bold py-2 px-5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-primary text-white hover:opacity-90',
    secondary: 'bg-transparent border border-gray-600 text-text-secondary hover:border-primary hover:text-primary',
    danger: 'bg-danger text-white hover:opacity-90',
  };

  const combinedClasses = `${baseClasses} ${variants[variant]} ${className}`;

  return (
    <button type={type} onClick={onClick} className={combinedClasses} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;