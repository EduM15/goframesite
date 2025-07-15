import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicHeader from './PublicHeader'; // Importação do componente real

const PublicLayout = () => {
    return (
        <div className="bg-background min-h-screen text-text-main font-poppins">
            <PublicHeader />
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default PublicLayout;