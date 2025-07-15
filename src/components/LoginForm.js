import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import Button from './ui/Button'; // Caminho corrigido para o componente Button
import Input from './ui/Input';   // Usando também o componente Input

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
    } catch (error) {
      let errorMessage = 'Ocorreu um erro ao fazer login.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = 'E-mail ou senha inválidos.';
      }
      onNotification(errorMessage, 'error');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">E-mail</label>
        <Input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1">Senha</label>
        <Input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
      </div>
      <div className="pt-2">
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Entrando...' : 'Entrar no Portal'}
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;