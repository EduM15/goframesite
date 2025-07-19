import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// ... (todas as outras importações)
import CreatorSignupPage from './pages/CreatorSignupPage'; // <-- Importação

function App() {
  const { user, loading } = useAuth();
  if (loading) { /* ... */ }

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        {/* ... (rotas públicas) */}
      </Route>

      {/* Rota de Cadastro de Criador (pública, mas não linkada) */}
      <Route path="/creator-signup" element={<CreatorSignupPage />} />

      <Route path="/auth" element={user ? <Navigate to="/creator" /> : <AuthPage />} />
      <Route path="/creator" element={<ProtectedRoute><CreatorLayout /></ProtectedRoute>}>
        {/* ... (rotas do criador) */}
      </Route>
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        {/* ... (rotas do admin) */}
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;