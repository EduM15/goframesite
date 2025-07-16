import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Layouts
import PublicLayout from './components/layouts/PublicLayout';
import CreatorLayout from './components/layouts/CreatorLayout';

// Componentes
import ProtectedRoute from './components/ProtectedRoute';

// Páginas
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import EventPage from './pages/EventPage';
import CartPage from './pages/CartPage'; // Importação da página real do carrinho

// Páginas do Criador
import Overview from './pages/Overview';
import MyEvents from './pages/MyEvents';
import Upload from './pages/Upload';
import Financial from './pages/Financial';
import Account from './pages/Account';


function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="bg-background h-screen flex items-center justify-center text-text-main">Inicializando...</div>;
  }

  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/event/:eventId" element={<EventPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Route>

      {/* Rota de Autenticação (sem layout principal) */}
      <Route path="/auth" element={user ? <Navigate to="/creator" /> : <AuthPage />} />

      {/* Rotas Protegidas do Criador */}
      <Route 
        path="/creator" 
        element={
          <ProtectedRoute>
            <CreatorLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path="events" element={<MyEvents />} />
        <Route path="upload" element={<Upload />} />
        <Route path="financial" element={<Financial />} />
        <Route path="account" element={<Account />} />
        <Route path="*" element={<Navigate to="/creator" />} />
      </Route>
      
      {/* Fallback para qualquer outra rota não encontrada */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;