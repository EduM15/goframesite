import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="bg-background h-screen flex items-center justify-center text-white">Verificando permissões...</div>;
  }

  // O hook 'useAuth' já busca os dados do Firestore, incluindo o campo 'role'
  if (user && user.role === 'admin') {
    return children;
  }

  // Se não for admin, redireciona para a página inicial
  return <Navigate to="/" />;
};

export default AdminRoute;