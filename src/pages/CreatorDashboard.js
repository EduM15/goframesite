// src/pages/CreatorDashboard.js
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, Calendar, Upload, DollarSign, User, Settings } from 'lucide-react';
import { auth } from '../config/firebase';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/auth');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Visão Geral', path: '/' },
    { icon: Calendar, label: 'Meus Eventos', path: '/events' },
    { icon: Upload, label: 'Upload de Mídia', path: '/upload' },
    { icon: DollarSign, label: 'Financeiro', path: '/financial' },
    { icon: User, label: 'Minha Conta', path: '/account' },
  ];

  return (
    <div className="w-64 bg-[#121212] text-white flex flex-col p-4 border-r border-gray-800">
      <div className="font-bebas-neue text-3xl text-orange-500 mb-10 pl-2">GoFrame</div>
      <nav className="flex-grow">
        {navItems.map(item => (
          <button key={item.label} onClick={() => navigate(item.path)} className="w-full flex items-center p-3 rounded-lg hover:bg-[#1e1e1e] transition-colors duration-200 mb-2">
            <item.icon className="w-5 h-5 mr-4" />
            <span className="font-poppins">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="mt-auto">
        <button onClick={handleLogout} className="w-full flex items-center p-3 rounded-lg hover:bg-[#1e1e1e] transition-colors duration-200">
          <LogOut className="w-5 h-5 mr-4" />
          <span className="font-poppins">Sair</span>
        </button>
      </div>
    </div>
  );
};

const CreatorDashboard = () => {
  return (
    <div className="flex h-screen bg-[#1e1e1e] font-poppins text-white">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet /> {/* O conteúdo da página atual será renderizado aqui */}
      </main>
    </div>
  );
};

export default CreatorDashboard;