import React from 'react';

const Input = ({ type = 'text', name, value, onChange, placeholder, className = '', required = false, ...props }) => {
  const baseClasses = 'w-full bg-[#2a2a2a] border border-gray-700 rounded-lg p-3 text-text-main focus:ring-primary focus:border-primary';
  const combinedClasses = `${baseClasses} ${className}`;

  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={combinedClasses}
      required={required}
      {...props} // Permite passar outros atributos como `minLength`, `disabled`, etc.
    />
  );
};

export default Input;