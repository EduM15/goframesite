import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext'; // Importar o Provider
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider> {/* Envolver a aplicação com o CartProvider */}
        <App />
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);