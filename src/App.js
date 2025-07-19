import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Layouts
import PublicLayout from './components/layouts/PublicLayout';
import CreatorLayout from './components/layouts/CreatorLayout';
import AdminLayout from './components/layouts/AdminLayout';

// Componentes de Rota
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Páginas Públicas
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import EventPage from './pages/EventPage';
import CartPage from './pages/CartPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CreatorSignupPage from './pages/CreatorSignupPage';

// Páginas do Criador
import Overview from './pages/Overview';
import MyEvents from './pages/MyEvents';
import Upload from './pages/Upload';
import Financial from './pages/Financial';
import Account from './pages/Account';
import ActivityLog from './pages/ActivityLog';

// Páginas do Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminActivityLog from './pages/admin/AdminActivityLog';
import ManageCreators from './pages/admin/ManageCreators';
import CreatorDetail from './pages/admin/CreatorDetail';
import ManageClients from './pages/admin/ManageClients';
const Payouts = () => <div>Repasses</div>;
const AdminSettings = () => <div>Configurações do Admin</div>;

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="bg-background h-screen flex items-center justify-center text-text-main">Inicializando...</div>;
  }

  return (
    <Routes>
      {/* --- ROTAS PÚBLICAS --- */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/event/:eventId" element={<EventPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* --- ROTAS DE AUTENTICAÇÃO E CADASTRO --- */}
      <Route path="/creator-signup" element={<CreatorSignupPage />} />
      <Route path="/auth" element={user ? <Navigate to="/creator" /> : <AuthPage />} />

      {/* --- ROTAS DO CRIADOR (PROTEGIDAS) --- */}
      <Route path="/creator" element={<ProtectedRoute><CreatorLayout /></ProtectedRoute>}>
        <Route index element={<Overview />} />
        <Route path="events" element={<MyEvents />} />
        <Route path="upload" element={<Upload />} />
        <Route path="financial" element={<Financial />} />
        <Route path="account" element={<Account />} />
        <Route path="activity" element={<ActivityLog />} />
        <Route path="*" element={<Navigate to="/creator" />} />
      </Route>
      
      {/* --- ROTAS DO ADMIN (PROTEGIDAS) --- */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="creators" element={<ManageCreators />} />
        <Route path="creators/:creatorId" element={<CreatorDetail />} />
        <Route path="clients" element={<ManageClients />} />
        <Route path="payouts" element={<Payouts />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="activity" element={<AdminActivityLog />} />
        <Route path="*" element={<Navigate to="/admin" />} />
      </Route>

      {/* --- ROTA CURINGA FINAL --- */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;