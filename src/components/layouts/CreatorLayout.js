import React, { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { auth } from '../../config/firebase';
import Modal from '../Modal'; // Importar o Modal
import Button from '../ui/Button'; // Importar o Button
import Icon from '@mdi/react';
import { mdiViewDashboard, mdiCalendar, mdiUpload, mdiChartBar, mdiAccountCog, mdiLogout } from '@mdi/js';

const Sidebar = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const handleLogout = () => {
    auth.signOut();
    setIsLogoutModalOpen(false);
  };

  // ... (navItems, classes - sem alteração)

  return (
    <div className="w-64 bg-background ... h-full">
      {/* ... (Logo e Nav - sem alteração) ... */}
      <div className="mt-auto">
        {/* O botão agora abre o modal */}
        <button onClick={() => setIsLogoutModalOpen(true)} className={`${baseLinkClasses} ${logoutClasses}`}>
          <Icon path={mdiLogout} size={1} className="mr-4" />
          <span className="font-poppins">Sair</span>
        </button>
      </div>

      {/* Modal de Confirmação de Logout */}
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
// ... (Componente CreatorLayout e export - sem alteração)