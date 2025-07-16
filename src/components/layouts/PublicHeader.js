import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import Button from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../contexts/CartContext'; // <<< ESTA É A LINHA QUE FALTAVA
import Icon from '@mdi/react';
import { mdiCartOutline } from '@mdi/js';

const PublicHeader = () => {
  const { user } = useAuth();
  const { cartItemCount } = useCart();

  return (
    <header className="bg-surface text-text-main p-5 shadow-lg sticky top-0 z-20">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="font-bebas-neue text-4xl">
          <span className="text-primary">Go</span>
          <span className="text-text-main">Frame</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/about" className={({ isActive }) => `hover:text-primary ${isActive ? 'text-primary' : ''}`}>
            Quem Somos
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `hover:text-primary ${isActive ? 'text-primary' : ''}`}>
            Contato
          </NavLink>
          <Link to="/events" className="font-bebas-neue text-lg py-2 px-5 rounded bg-primary hover:opacity-90">
            Todos os Eventos
          </Link>
        </nav>

        <div className="flex items-center gap-6">
          <Link to="/cart" className="relative text-text-secondary hover:text-primary">
             <Icon path={mdiCartOutline} size={1.2} />
             {cartItemCount > 0 && (
               <span className="absolute -top-2 -right-2 bg-danger text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                 {cartItemCount}
               </span>
             )}
          </Link>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-text-secondary">Olá!</span>
              <Link to="/creator">
                <Button>Meu Painel</Button>
              </Link>
            </div>
          ) : (
            <Link to="/auth">
              <Button>Login / Cadastro</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;