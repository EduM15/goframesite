import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import Notification from '../components/Notification';

const ClientLoginForm = () => (
  <div className="text-center text-text-secondary">
    <p>O portal do cliente será implementado em breve.</p>
  </div>
);

const AuthPage = () => {
  const [isCreatorView, setIsCreatorView] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const handleNotification = (message, type) => setNotification({ message, type });
  const closeNotification = () => setNotification({ message: '', type: '' });

  return (
    <div className="bg-background min-h-screen flex flex-col items-center justify-center text-white p-4 font-poppins">
      <Notification message={notification.message} type={notification.type} onClose={closeNotification} />
      <Link to="/" className="text-5xl font-bold font-bebas-neue mb-2">
        <span className="text-primary">Go</span>
        <span className="text-text-main">Frame</span>
      </Link>
      <div className="w-full max-w-md bg-surface p-8 rounded-lg shadow-lg mt-6">
        <h2 className="text-3xl font-bold mb-6 text-center font-bebas-neue">
          {isCreatorView ? 'Acesso do Criador' : 'Acesso do Cliente'}
        </h2>
        {isCreatorView ? <LoginForm onNotification={handleNotification} /> : <ClientLoginForm />}
        <div className="mt-6 text-center">
          <button onClick={() => setIsCreatorView(!isCreatorView)} className="text-sm text-primary hover:underline">
            {isCreatorView ? 'Acessar como Cliente' : 'Você é um criador? Acesse aqui'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;