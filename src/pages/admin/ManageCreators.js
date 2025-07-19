import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Link } from 'react-router-dom';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Icon from '@mdi/react';
import { mdiAccountPlus } from '@mdi/js';

// Um componente reutilizável para a tabela, para evitar repetição de código
const UsersTable = ({ users, title }) => (
    <Card>
        <h2 className="text-2xl font-bebas-neue text-primary mb-4">{title}</h2>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="border-b border-gray-700">
                    <tr>
                        <th className="p-4 font-semibold text-text-secondary">Nome de Exibição</th>
                        <th className="p-4 font-semibold text-text-secondary">Email</th>
                        <th className="p-4 font-semibold text-text-secondary">Role</th>
                        <th className="p-4 font-semibold text-text-secondary">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length === 0 ? (
                        <tr><td colSpan="4" className="text-center p-8 text-text-secondary">Nenhum usuário nesta categoria.</td></tr>
                    ) : (
                        users.map(user => (
                            <tr key={user.id} className="border-b border-gray-800 hover:bg-background">
                                <td className="p-4 font-bold">{user.nickname}</td>
                                <td className="p-4 text-text-secondary">{user.email}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${user.role === 'admin' ? 'bg-primary text-white' : 'bg-surface text-text-secondary'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <Link to={`/admin/creators/${user.id}`}>
                                        <Button variant="secondary" className="text-xs">Gerenciar</Button>
                                    </Link>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    </Card>
);


const ManageCreators = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "creators"), where("role", "in", ["creator", "admin"]));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAllUsers(usersData);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Filtra a lista de usuários para separar criadores de admins
    const creators = allUsers.filter(user => user.role === 'creator');
    const admins = allUsers.filter(user => user.role === 'admin');

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold font-bebas-neue text-primary">Gerenciar Criadores & Admins</h1>
                <Button>
                    <Icon path={mdiAccountPlus} size={0.8} />
                    Convidar Novo Criador
                </Button>
            </div>
            
            {loading ? (
                <Card><p className="text-center p-8 text-text-secondary">Carregando usuários...</p></Card>
            ) : (
                <div className="space-y-6">
                    <UsersTable users={creators} title="Criadores" />
                    <UsersTable users={admins} title="Administradores" />
                </div>
            )}
        </div>
    );
};

export default ManageCreators;