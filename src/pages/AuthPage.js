import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import SignUpForm from '../components/SignUpForm';
import Notification from '../components/Notification';

const AuthPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const handleNotification = (message, type) => {
    setNotification({ message, type });
  };

  const closeNotification = () => {
    setNotification({ message: '', type: '' });
  };

  return (
    <div className="bg-background min-h-screen flex flex-col items-center justify-center text-white p-4 font-poppins">
      <Notification 
        message={notification.message} 
        type={notification.type} 
        onClose={closeNotification} 
      />
      <Link to="/" className="text-5xl font-bold font-bebas-neue mb-2">
        <span className="text-primary">Go</span>
        <span className="text-text-main">Frame</span>
      </Link>
      
      <div className="w-full max-w-md bg-surface p-8 rounded-lg shadow-lg mt-6">
        <h2 className="text-3xl font-bold mb-6 text-center font-bebas-neue">
          {isLoginView ? 'Acesso do Criador' : 'Cadastro de Criador'}
        </h2>
        
        {isLoginView ? (
          <LoginForm onNotification={handleNotification} />
        ) : (
          <SignUpForm onNotification={handleNotification} onSwitchToLogin={() => setIsLoginView(true)} />
        )}
        
        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsLoginView(!isLoginView)} 
            className="text-sm text-primary hover:underline"
          >
            {isLoginView ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça o login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;