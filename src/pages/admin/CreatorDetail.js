import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Notification from '../../components/Notification';

const CreatorDetail = () => {
    const { creatorId } = useParams();
    const [creator, setCreator] = useState(null);
    const [loading, setLoading] = useState(true);
    const [commission, setCommission] = useState(20); // Valor padrão
    const [notification, setNotification] = useState({ message: '', type: '' });

    useEffect(() => {
        if (creatorId) {
            const docRef = doc(db, 'creators', creatorId);
            getDoc(docRef).then(docSnap => {
                if (docSnap.exists()) {
                    setCreator({ id: docSnap.id, ...docSnap.data() });
                    // Se o criador tiver uma comissão customizada, use-a.
                    if (docSnap.data().commission) {
                        setCommission(docSnap.data().commission);
                    }
                } else {
                    console.error("Criador não encontrado!");
                }
                setLoading(false);
            });
        }
    }, [creatorId]);
    
    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 4000);
    };

    const handleSaveCommission = async () => {
        try {
            const docRef = doc(db, 'creators', creatorId);
            await updateDoc(docRef, { commission: Number(commission) });
            showNotification('Comissão atualizada com sucesso!', 'success');
        } catch (error) {
            showNotification('Erro ao atualizar a comissão.', 'danger');
            console.error("Erro ao salvar comissão:", error);
        }
    };
    
    if (loading) {
        return <Card><p className="text-center p-8 text-text-secondary">Carregando detalhes do criador...</p></Card>;
    }

    if (!creator) {
        return <Card><p className="text-center p-8 text-danger">Criador não encontrado.</p></Card>;
    }

    return (
        <div>
            <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: '', type: '' })} />
            <div className="mb-4 text-sm text-text-secondary">
                <Link to="/admin/creators" className="hover:text-primary">Gerenciar Criadores</Link>
                <span className="mx-2">/</span>
                <span>{creator.nickname}</span>
            </div>
            <h1 className="text-4xl font-bold mb-6 font-bebas-neue">
                Gerenciando: <span className="text-primary">{creator.nickname}</span>
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Coluna Esquerda */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <h2 className="text-2xl font-bebas-neue text-primary mb-4">Informações Pessoais</h2>
                        <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                            <div><label className="block text-sm text-text-secondary mb-1">Nome Completo</label><div className="font-semibold">{creator.fullname}</div></div>
                            <div><label className="block text-sm text-text-secondary mb-1">Apelido</label><div className="font-semibold">{creator.nickname}</div></div>
                            <div><label className="block text-sm text-text-secondary mb-1">Email</label><div className="font-semibold">{creator.email}</div></div>
                            <div><label className="block text-sm text-text-secondary mb-1">WhatsApp</label><div className="font-semibold">{creator.whatsapp}</div></div>
                        </div>
                    </Card>
                    <Card>
                        <h2 className="text-2xl font-bebas-neue text-primary mb-4">Informações de Repasse</h2>
                         <p className="text-text-secondary"> (A ser implementado no painel do criador)</p>
                    </Card>
                </div>

                {/* Coluna Direita */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <h2 className="text-2xl font-bebas-neue text-primary mb-4">Configuração Financeira</h2>
                        <div>
                            <label className="block text-sm text-text-secondary mb-1">Comissão da Plataforma (%)</label>
                            <div className="flex items-center gap-4">
                                <Input type="number" value={commission} onChange={(e) => setCommission(e.target.value)} className="w-24 text-center" />
                                <Button onClick={handleSaveCommission}>Salvar</Button>
                            </div>
                        </div>
                    </Card>
                    <Card>
                         <h2 className="text-2xl font-bebas-neue text-primary mb-4">Ações Críticas</h2>
                         <Button variant="danger" className="w-full" onClick={() => alert('Funcionalidade de desativação a ser implementada.')}>
                            Desativar Conta de Criador
                         </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CreatorDetail;