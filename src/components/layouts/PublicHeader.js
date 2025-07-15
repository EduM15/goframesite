import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import Button from '../ui/Button'; // Usando nosso novo componente de botão

const PublicHeader = () => {
  return (
    <header className="absolute top-0 left-0 w-full z-10 p-5">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="font-bebas-neue text-4xl text-text-main">
          Go<span className="text-primary">Frame</span>
        </Link>

        {/* Navegação Central */}
        <nav className="hidden md:flex flex-col items-center gap-4">
          <div className="flex gap-8 text-text-main">
            <NavLink to="/about" className={({ isActive }) => isActive ? 'text-primary' : 'hover:text-primary'}>
              Quem Somos
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => isActive ? 'text-primary' : 'hover:text-primary'}>
              Contato
            </NavLink>
          </div>
          <Link to="/events">
            <Button variant="primary" className="font-bebas-neue text-lg tracking-wider px-6">
              Todos os Eventos
            </Button>
          </Link>
        </nav>

        {/* Ações da Direita */}
        <div className="hidden md:block">
           <Link to="/auth">
            <Button variant='secondary'>Login / Cadastro</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;