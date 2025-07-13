import React, { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const SignUpForm = ({ onNotification, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    fullname: '',
    nickname: '',
    whatsapp: '',
    email: '',
    password: '',
    terms: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullname || !formData.email || !formData.password || !formData.whatsapp || !formData.nickname) {
      onNotification('Todos os campos são obrigatórios.', 'error');
      return;
    }
    if (formData.password.length < 8) {
      onNotification('A senha deve ter no mínimo 8 caracteres.', 'error');
      return;
    }
    if (!formData.terms) {
      onNotification('Você precisa aceitar os Termos de Serviço.', 'error');
      return;
    }
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      
      await sendEmailVerification(user);

      await setDoc(doc(db, "creators", user.uid), {
        uid: user.uid,
        fullname: formData.fullname,
        nickname: formData.nickname,
        whatsapp: formData.whatsapp,
        email: formData.email,
        role: 'creator',
        defaultPhotoPrice: 10.00,
        defaultVideoPrice: 15.00,
        createdAt: serverTimestamp()
      });

      onNotification('Cadastro realizado! Um e-mail de verificação foi enviado.', 'success');
      setTimeout(() => onSwitchToLogin(), 3000);

    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        onNotification('Este e-mail já está em uso.', 'error');
      } else {
        onNotification('Ocorreu um erro no cadastro.', 'error');
      }
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" name="fullname" placeholder="Nome Completo" value={formData.fullname} onChange={handleChange} className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg p-3" required />
      <input type="text" name="nickname" placeholder="Apelido / Nome de Fotógrafo(a)" value={formData.nickname} onChange={handleChange} className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg p-3" required />
      <input type="tel" name="whatsapp" placeholder="WhatsApp (com DDD)" value={formData.whatsapp} onChange={handleChange} className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg p-3" required />
      <input type="email" name="email" placeholder="Seu melhor e-mail" value={formData.email} onChange={handleChange} className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg p-3" required />
      <input type="password" name="password" placeholder="Senha (mínimo 8 caracteres)" value={formData.password} onChange={handleChange} className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg p-3" required />
      <div className="flex items-center">
        <input id="terms" name="terms" type="checkbox" checked={formData.terms} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
        <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">Li e aceito os <a href="#" className="font-medium text-brand-orange hover:underline">Termos de Serviço</a></label>
      </div>
      <button type="submit" disabled={isLoading} className="w-full bg-brand-orange text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition-colors duration-300 disabled:bg-orange-800">
        {isLoading ? 'Finalizando...' : 'Finalizar Cadastro'}
      </button>
    </form>
  );
};

export default SignUpForm;