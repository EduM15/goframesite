import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Layouts
import PublicLayout from './components/layouts/PublicLayout';
import CreatorLayout from './components/layouts/CreatorLayout';
import AdminLayout from './components/layouts/AdminLayout'; // <-- Importação

// Componentes
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute'; // <-- Importação

// Páginas Públicas
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import EventPage from './pages/EventPage';
import CartPage from './pages/CartPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

// Páginas do Criador
import Overview from './pages/Overview';
import MyEvents from './pages/MyEvents';
import Upload from './pages/Upload';
import Financial from './pages/Financial';
import Account from './pages/Account';
import ActivityLog from './pages/ActivityLog';

// Páginas do Admin
import AdminDashboard from './pages/admin/AdminDashboard'; // <-- Importação
// Placeholders para as outras páginas de admin
const ManageCreators = () => <div>Gerenciar Criadores</div>;
const Payouts = () => <div>Repasses</div>;
const AdminSettings = () => <div>Configurações do Admin</div>;

function App() {
  const { user, loading } = useAuth();
  if (loading) { return <div className="bg-background h-screen flex items-center justify-center text-text-main">Inicializando...</div>; }

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        {/* ...outras rotas públicas... */}
      </Route>

      <Route path="/auth" element={user ? <Navigate to="/creator" /> : <AuthPage />} />

      <Route path="/creator" element={<ProtectedRoute><CreatorLayout /></ProtectedRoute>}>
        {/* ...rotas do criador... */}
      </Route>
      
      {/* NOVAS ROTAS DO ADMIN */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="creators" element={<ManageCreators />} />
        <Route path="payouts" element={<Payouts />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="*" element={<Navigate to="/admin" />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;