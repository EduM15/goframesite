import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm'; // Formulário do Criador
import SignUpForm from '../components/SignUpForm'; // Formulário do Criador
import Notification from '../components/Notification';

// Placeholder para o formulário de login do cliente
const ClientLoginForm = ({ onNotification }) => (
  <div className="text-center text-text-secondary">
    <p>Formulário de Login do Cliente a ser implementado.</p>
    <p className="mt-4">Por enquanto, use o acesso do Criador.</p>
  </div>
);

const AuthPage = () => {
  const [view, setView] = useState('client-login'); // 'client-login', 'creator-login', 'creator-signup'
  const [notification, setNotification] = useState({ message: '', type: '' });

  const handleNotification = (message, type) => setNotification({ message, type });
  const closeNotification = () => setNotification({ message: '', type: '' });

  const renderContent = () => {
    switch (view) {
      case 'creator-login':
        return <LoginForm onNotification={handleNotification} />;
      case 'creator-signup':
        return <SignUpForm onNotification={handleNotification} onSwitchToLogin={() => setView('creator-login')} />;
      case 'client-login':
      default:
        return <ClientLoginForm onNotification={handleNotification} />;
    }
  };

  const getTitle = () => {
    switch (view) {
      case 'creator-login': return 'Acesso do Criador';
      case 'creator-signup': return 'Cadastro de Criador';
      case 'client-login': default: return 'Acesso do Cliente';
    }
  };

  return (
    <div className="bg-background min-h-screen flex flex-col items-center justify-center text-white p-4 font-poppins">
      <Notification message={notification.message} type={notification.type} onClose={closeNotification} />
      
      <Link to="/" className="text-5xl font-bold font-bebas-neue mb-2">
        <span className="text-primary">Go</span>
        <span className="text-text-main">Frame</span>
      </Link>
      
      <div className="w-full max-w-md bg-surface p-8 rounded-lg shadow-lg mt-6">
        <h2 className="text-3xl font-bold mb-6 text-center font-bebas-neue">{getTitle()}</h2>
        {renderContent()}
        
        <div className="mt-6 text-center">
          {view === 'client-login' && (
            <button onClick={() => setView('creator-login')} className="text-sm text-primary hover:underline">
              Você é um criador? Acesse aqui
            </button>
          )}
          {view === 'creator-login' && (
            <button onClick={() => setView('creator-signup')} className="text-sm text-primary hover:underline">
              Não tem uma conta de criador? Cadastre-se
            </button>
          )}
          {view === 'creator-signup' && (
             <button onClick={() => setView('creator-login')} className="text-sm text-primary hover:underline">
              Já tem uma conta de criador? Faça o login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;