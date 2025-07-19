import React from 'react';
import Card from '../../components/ui/Card';

const AdminActivityLog = () => {
    return (
        <div>
            <h1 className="text-4xl font-bold mb-6 font-bebas-neue text-primary">Log de Atividades da Plataforma</h1>
            <Card>
                <p className="text-text-secondary">A tabela completa de atividades de todos os usuários, com filtros avançados, será implementada aqui.</p>
            </Card>
        </div>
    );
};

export default AdminActivityLog;