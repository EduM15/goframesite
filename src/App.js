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
import CartPage from './pages/CartPage';
import AboutPage from './pages/AboutPage'; // <-- Importação
import ContactPage from './pages/ContactPage'; // <-- Importação

// Páginas do Criador
import Overview from './pages/Overview';
import MyEvents from './pages/MyEvents';
import Upload from './pages/Upload';
import Financial from './pages/Financial';
import Account from './pages/Account';
import ActivityLog from './pages/ActivityLog';

function App() {
  const { user, loading } = useAuth();
  if (loading) { return <div className="bg-background h-screen flex items-center justify-center text-text-main">Inicializando...</div>; }

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/event/:eventId" element={<EventPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/about" element={<AboutPage />} /> {/* <-- Nova Rota */}
        <Route path="/contact" element={<ContactPage />} /> {/* <-- Nova Rota */}
      </Route>

      <Route path="/auth" element={user ? <Navigate to="/creator" /> : <AuthPage />} />

      <Route path="/creator" element={<ProtectedRoute><CreatorLayout /></ProtectedRoute>}>
        <Route index element={<Overview />} />
        <Route path="events" element={<MyEvents />} />
        <Route path="upload" element={<Upload />} />
        <Route path="financial" element={<Financial />} />
        <Route path="account" element={<Account />} />
        <Route path="activity" element={<ActivityLog />} />
        <Route path="*" element={<Navigate to="/creator" />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;