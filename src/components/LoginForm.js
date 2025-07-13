import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

const LoginForm = ({ onNotification }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      onNotification('Por favor, preencha todos os campos.', 'error');
      return;
    }
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      // O redirecionamento será tratado automaticamente pelo ProtectedRoute/App.js
    } catch (error) {
      let errorMessage = 'Ocorreu um erro ao fazer login.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = 'E-mail ou senha inválidos.';
      }
      onNotification(errorMessage, 'error');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">E-mail</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg p-3 focus:ring-orange-500 focus:border-orange-500" required />
      </div>
      <div className="mb-6">
        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Senha</label>
        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg p-3 focus:ring-orange-500 focus:border-orange-500" required />
      </div>
      <button type="submit" disabled={isLoading} className="w-full bg-brand-orange text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition-colors duration-300 disabled:bg-orange-800">
        {isLoading ? 'Entrando...' : 'Entrar no Portal'}
      </button>
    </form>
  );
};

export default LoginForm;