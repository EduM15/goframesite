import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import ErrorBoundary from './components/ErrorBoundary'; // Importar
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary> {/* Envolver toda a aplicação */}
      <BrowserRouter>
        <CartProvider>
          <App />
        </CartProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);