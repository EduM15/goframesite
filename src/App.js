// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

import ProtectedRoute from './components/ProtectedRoute';
import CreatorDashboard from './pages/CreatorDashboard';
import AuthPage from './pages/AuthPage';
import Overview from './pages/Overview';
import MyEvents from './pages/MyEvents';

// Crie arquivos placeholder para estas páginas se desejar
// import Upload from './pages/Upload';
// import Financial from './pages/Financial';
// import Account from './pages/Account';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="bg-[#121212] h-screen flex items-center justify-center text-white">Inicializando...</div>;
  }

  return (
    <Routes>
      <Route path="/auth" element={user ? <Navigate to="/" /> : <AuthPage />} />
      
      <Route 
        path="/*"
        element={
          <ProtectedRoute>
            <CreatorDashboard />
          </ProtectedRoute>
        }
      >
          {/* Rotas aninhadas dentro do CreatorDashboard */}
          <Route index element={<Overview />} />
          <Route path="events" element={<MyEvents />} />
          {/* <Route path="upload" element={<Upload />} />
          <Route path="financial" element={<Financial />} />
          <Route path="account" element={<Account />} /> 
          */}
      </Route>
    </Routes>
  );
}

export default App;