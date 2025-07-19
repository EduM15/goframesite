import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SignUpForm from '../components/SignUpForm';
import Notification from '../components/Notification';

const CreatorSignupPage = () => {
    const navigate = useNavigate();
    const [notification, setNotification] = useState({ message: '', type: '' });

    const handleNotification = (message, type) => {
        setNotification({ message, type });
    };

    const closeNotification = () => {
        setNotification({ message: '', type: '' });
    };

    // Função para redirecionar para o login após o sucesso
    const handleSuccess = () => {
        handleNotification('Cadastro realizado! Você será redirecionado para o login.', 'success');
        setTimeout(() => navigate('/auth'), 4000);
    };

    return (
        <div className="bg-background min-h-screen flex flex-col items-center justify-center text-white p-4 font-poppins">
            <Notification message={notification.message} type={notification.type} onClose={closeNotification} />
            <Link to="/" className="text-5xl font-bold font-bebas-neue mb-2">
                <span className="text-primary">Go</span>
                <span className="text-text-main">Frame</span>
            </Link>
            <div className="w-full max-w-md bg-surface p-8 rounded-lg shadow-lg mt-6">
                <h2 className="text-3xl font-bold mb-6 text-center font-bebas-neue">Cadastro de Novo Criador</h2>
                <SignUpForm onNotification={handleNotification} onSwitchToLogin={handleSuccess} />
            </div>
        </div>
    );
};

export default CreatorSignupPage;