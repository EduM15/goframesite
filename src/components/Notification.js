import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const Notification = ({ message, type, onClose }) => {
  if (!message) return null;

  const isSuccess = type === 'success';
  const bgColor = isSuccess ? 'bg-green-500' : 'bg-red-500';
  const Icon = isSuccess ? CheckCircle : XCircle;

  return (
    <div className={`fixed top-5 right-5 ${bgColor} text-white p-4 rounded-lg shadow-lg flex items-center animate-fade-in-down`}>
      <Icon className="w-6 h-6 mr-3" />
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">&times;</button>
    </div>
  );
};

export default Notification;