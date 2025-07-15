import React, { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import Button from '../ui/Button';
import Input from '../ui/Input';

const SignUpForm = ({ onNotification, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    fullname: '', nickname: '', whatsapp: '', email: '', password: '', terms: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleWhatsappChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2'); // Coloca parênteses em volta dos dois primeiros dígitos
    value = value.replace(/(\d{5})(\d)/, '$1-$2'); // Coloca hífen depois do quinto dígito
    setFormData(prevState => ({ ...prevState, whatsapp: value.slice(0, 15) }));
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'whatsapp') {
      handleWhatsappChange(e);
    } else {
      setFormData(prevState => ({ ...prevState, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ... (lógica de submit existente)
    // A validação de e-mail é feita pelo "type='email'" no componente Input.
    // O navegador não permitirá o envio do formulário com um e-mail inválido.
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      
      await sendEmailVerification(user);

      await setDoc(doc(db, "creators", user.uid), {
        uid: user.uid, fullname: formData.fullname, nickname: formData.nickname,
        whatsapp: formData.whatsapp, email: formData.email, role: 'creator',
        defaultPhotoPrice: 10.00, defaultVideoPrice: 15.00, createdAt: serverTimestamp()
      });

      onNotification('Cadastro realizado! Um e-mail de verificação foi enviado.', 'success');
      setTimeout(() => onSwitchToLogin(), 3000);

    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        onNotification('Este e-mail já está em uso.', 'error');
      } else {
        onNotification('Ocorreu um erro no cadastro.', 'error');
      }
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Usando o componente Input padronizado */}
      <Input type="text" name="fullname" placeholder="Nome Completo" value={formData.fullname} onChange={handleChange} required />
      <Input type="text" name="nickname" placeholder="Apelido / Nome de Fotógrafo(a)" value={formData.nickname} onChange={handleChange} required />
      <Input type="tel" name="whatsapp" placeholder="WhatsApp (com DDD)" value={formData.whatsapp} onChange={handleChange} required />
      <Input type="email" name="email" placeholder="Seu melhor e-mail" value={formData.email} onChange={handleChange} required />
      <Input type="password" name="password" placeholder="Senha (mínimo 8 caracteres)" value={formData.password} onChange={handleChange} required minLength="8" />
      
      <div className="flex items-center">
        <input id="terms" name="terms" type="checkbox" checked={formData.terms} onChange={handleChange} className="h-4 w-4 rounded border-gray-600 bg-surface text-primary focus:ring-primary" required />
        <label htmlFor="terms" className="ml-2 block text-sm text-text-secondary">Li e aceito os <a href="#" className="font-medium text-primary hover:underline">Termos de Serviço</a></label>
      </div>
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Finalizando...' : 'Finalizar Cadastro'}
      </Button>
    </form>
  );
};

export default SignUpForm;