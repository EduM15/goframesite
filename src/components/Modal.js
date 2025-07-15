import React from 'react';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-lg p-6 relative" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-700">
          <h3 className="text-2xl font-bold font-bebas-neue text-primary">{title}</h3>
          <button onClick={onClose} className="text-text-secondary hover:text-white">
            <Icon path={mdiClose} size={1} />
          </button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;