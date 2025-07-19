import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Notification from '../../components/Notification';
import Icon from '@mdi/react';
import { mdiAccountPlus } from '@mdi/js';

const UsersTable = ({ users, title }) => ( /* ...código da tabela da resposta anterior... */ );

const ManageCreators = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ message: '', type: '' });

    useEffect(() => { /* ...código de busca da resposta anterior... */ }, []);

    const handleInvite = () => {
        const signupUrl = `${window.location.origin}/creator-signup`;
        navigator.clipboard.writeText(signupUrl).then(() => {
            setNotification({ message: 'Link de convite copiado!', type: 'success' });
            setTimeout(() => setNotification({ message: '', type: '' }), 3000);
        });
    };

    const creators = allUsers.filter(user => user.role === 'creator');
    const admins = allUsers.filter(user => user.role === 'admin');

    return (
        <div>
            <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: '', type: '' })} />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold font-bebas-neue text-primary">Gerenciar Criadores & Admins</h1>
                <Button onClick={handleInvite}>
                    <Icon path={mdiAccountPlus} size={0.8} />
                    Convidar Novo Criador
                </Button>
            </div>
            {loading ? ( <Card><p>Carregando...</p></Card> ) : (
                <div className="space-y-6">
                    <UsersTable users={creators} title="Criadores" />
                    <UsersTable users={admins} title="Administradores" />
                </div>
            )}
        </div>
    );
};

// Cole o componente UsersTable completo da resposta anterior aqui.
export default ManageCreators;