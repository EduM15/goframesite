import React, { createContext, useState, useContext } from 'react';

// 1. Criar o Contexto
const CartContext = createContext();

// 2. Criar o Provedor (Provider)
// Este componente irá envolver nossa aplicação e gerenciar o estado do carrinho.
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    // Verifica se o item já está no carrinho para não adicionar duplicatas
    setCartItems((prevItems) => {
      if (!prevItems.find(cartItem => cartItem.id === item.id)) {
        return [...prevItems, item];
      }
      return prevItems;
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== itemId));
  };

  const isItemInCart = (itemId) => {
    return !!cartItems.find(item => item.id === itemId);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    isItemInCart,
    cartItemCount: cartItems.length,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// 3. Criar um Hook customizado para facilitar o uso do contexto
export const useCart = () => {
  return useContext(CartContext);
};