import React, { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { auth } from '../../config/firebase';
import Modal from '../Modal';
import Button from '../ui/Button';
import Icon from '@mdi/react';
import { mdiViewDashboard, mdiCalendar, mdiUpload, mdiChartBar, mdiAccountCog, mdiLogout } from '@mdi/js';

const Sidebar = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
  const handleLogout = () => {
    auth.signOut();
    setIsLogoutModalOpen(false);
  };

  const navItems = [
    { icon: mdiViewDashboard, label: 'Visão Geral', path: '/creator' },
    { icon: mdiCalendar, label: 'Meus Eventos', path: '/creator/events' },
    { icon: mdiUpload, label: 'Upload de Mídia', path: '/creator/upload' },
    { icon: mdiChartBar, label: 'Financeiro', path: '/creator/financial' },
    { icon: mdiAccountCog, label: 'Minha Conta', path: '/creator/account' },
  ];

  const baseLinkClasses = "w-full flex items-center p-3 rounded-lg transition-colors duration-200 mb-2 text-left";
  const activeLinkClasses = "bg-primary text-text-main";
  const inactiveLinkClasses = "text-text-secondary hover:bg-surface hover:text-text-main";
  const logoutClasses = "text-text-secondary hover:bg-danger hover:text-text-main";

  return (
    <div className="w-64 bg-background text-text-main flex flex-col p-4 border-r border-surface h-full">
      <Link to="/" className="font-bebas-neue text-3xl mb-10 pl-2 text-center">
        <span className="text-primary">Go</span>
        <span className="text-text-main">Frame</span>
      </Link>
      <nav className="flex-grow">
        {navItems.map(item => (
          <NavLink 
            key={item.label} 
            to={item.path}
            end={item.path === '/creator'}
            className={({ isActive }) => `${baseLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}
          >
            <Icon path={item.icon} size={1} className="mr-4" />
            <span className="font-poppins">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto">
        <button onClick={() => setIsLogoutModalOpen(true)} className={`${baseLinkClasses} ${logoutClasses}`}>
          <Icon path={mdiLogout} size={1} className="mr-4" />
          <span className="font-poppins">Sair</span>
        </button>
      </div>

      <Modal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} title="Confirmar Saída">
          <p>Você tem certeza que deseja sair da sua conta?</p>
          <div className="flex justify-end space-x-3 pt-6">
              <Button variant="secondary" onClick={() => setIsLogoutModalOpen(false)}>Cancelar</Button>
              <Button variant="danger" onClick={handleLogout}>Confirmar Saída</Button>
          </div>
      </Modal>
    </div>
  );
};

const CreatorLayout = () => {
  return (
    <div className="flex h-screen bg-background font-poppins text-text-main">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default CreatorLayout;