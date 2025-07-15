import React from 'react';
import Icon from '@mdi/react';
import { mdiCheckCircle, mdiCloseCircle } from '@mdi/js';

const Notification = ({ message, type, onClose }) => {
  if (!message) return null;

  const isSuccess = type === 'success';
  const bgColor = isSuccess ? 'bg-success' : 'bg-danger';
  const IconComponent = isSuccess ? mdiCheckCircle : mdiCloseCircle;

  // Animação foi removida para consistência com o restante do design
  return (
    <div className={`fixed top-5 right-5 ${bgColor} text-white p-4 rounded-lg shadow-lg flex items-center z-50`}>
      <Icon path={IconComponent} size={1} className="mr-3" />
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-xl font-bold leading-none hover:text-gray-200">&times;</button>
    </div>
  );
};

export default Notification;