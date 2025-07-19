import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Link } from 'react-router-dom';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Icon from '@mdi/react';
import { mdiAccountPlus } from '@mdi/js';

const ManageCreators = () => {
    const [creators, setCreators] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "creators"), where("role", "==", "creator"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const creatorsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCreators(creatorsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold font-bebas-neue text-primary">Gerenciar Criadores</h1>
                <Button>
                    <Icon path={mdiAccountPlus} size={0.8} />
                    Convidar Novo Criador
                </Button>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-gray-700">
                            <tr>
                                <th className="p-4 font-semibold text-text-secondary">Nome de Exibição</th>
                                <th className="p-4 font-semibold text-text-secondary">Email</th>
                                <th className="p-4 font-semibold text-text-secondary">Vendas Totais</th>
                                <th className="p-4 font-semibold text-text-secondary">Mídias</th>
                                <th className="p-4 font-semibold text-text-secondary">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="text-center p-8 text-text-secondary">Carregando criadores...</td></tr>
                            ) : creators.length === 0 ? (
                                <tr><td colSpan="5" className="text-center p-8 text-text-secondary">Nenhum criador encontrado.</td></tr>
                            ) : (
                                creators.map(creator => (
                                    <tr key={creator.id} className="border-b border-gray-800 hover:bg-background">
                                        <td className="p-4 font-bold">{creator.nickname}</td>
                                        <td className="p-4 text-text-secondary">{creator.email}</td>
                                        {/* NOTA: Dados financeiros e de mídias são placeholders. */}
                                        <td className="p-4">R$ 0,00</td>
                                        <td className="p-4">0</td>
                                        <td className="p-4">
                                            <Link to={`/admin/creators/${creator.id}`}>
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
        </div>
    );
};

export default ManageCreators;