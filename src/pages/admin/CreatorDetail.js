import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../../components/ui/Card';

const CreatorDetail = () => {
    const { creatorId } = useParams(); // Hook para capturar o ID da URL

    return (
        <div>
            <div className="mb-4 text-sm text-text-secondary">
                <Link to="/admin/creators" className="hover:text-primary">Gerenciar Criadores</Link>
                <span className="mx-2">/</span>
                <span>Detalhes do Criador</span>
            </div>
            <h1 className="text-4xl font-bold mb-6 font-bebas-neue text-primary">Gerenciando Criador</h1>
            <Card>
                <p className="text-text-secondary">ID do Criador: {creatorId}</p>
                <p className="text-text-secondary mt-4">A página de detalhes completa, baseada em `painel-admin-detalhe-criador.html`, será implementada aqui.</p>
            </Card>
        </div>
    );
};

export default CreatorDetail;
