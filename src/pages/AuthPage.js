import React, { useState } from 'react';
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
    <div className="bg-[#121212] min-h-screen flex flex-col items-center justify-center text-white p-4 font-poppins">
      <Notification 
        message={notification.message} 
        type={notification.type} 
        onClose={closeNotification} 
      />
      <h1 className="text-5xl font-bold font-bebas-neue text-brand-orange mb-8">GoFrame.art.br</h1>
      <div className="w-full max-w-md bg-[#1e1e1e] p-8 rounded-lg shadow-lg">
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
            className="text-sm text-brand-orange hover:underline"
          >
            {isLoginView ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça o login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;