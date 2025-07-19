import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'; // <-- CORREÇÃO: 'onSnapshot' adicionado e 'getDoc' removido
import { db } from '../../config/firebase';

import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Modal from '../../components/Modal';
import Notification from '../../components/Notification';
import Icon from '@mdi/react';
import { mdiPencil, mdiContentSave, mdiClose } from '@mdi/js';

const CreatorDetail = () => {
    const { creatorId } = useParams();
    const [creator, setCreator] = useState(null);
    const [formData, setFormData] = useState({ fullname: '', nickname: '', whatsapp: '' });
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '' });

    useEffect(() => {
        if (!creatorId) {
            setLoading(false);
            return;
        }
        
        const docRef = doc(db, 'creators', creatorId);
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = { id: docSnap.id, ...docSnap.data() };
                setCreator(data);
                setFormData({ fullname: data.fullname || '', nickname: data.nickname || '', whatsapp: data.whatsapp || '' });
            } else {
                console.error("Criador não encontrado!");
                setCreator(null);
            }
            setLoading(false);
        }, (error) => {
            console.error("Erro ao buscar criador:", error);
            setLoading(false);
        });

        return () => unsubscribe(); // Limpa a escuta em tempo real ao sair da página
    }, [creatorId]);
    
    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 4000);
    };
    
    const handleFormChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSaveChanges = async () => {
        setIsConfirmModalOpen(false);
        try {
            const docRef = doc(db, 'creators', creatorId);
            await updateDoc(docRef, {
                fullname: formData.fullname,
                nickname: formData.nickname,
                whatsapp: formData.whatsapp,
            });
            showNotification('Dados atualizados com sucesso!', 'success');
            setIsEditing(false);
        } catch (error) {
            showNotification('Erro ao atualizar os dados.', 'danger');
            console.error("Erro ao salvar dados:", error);
        }
    };
    
    const cancelEdit = () => {
        setFormData({ fullname: creator.fullname, nickname: creator.nickname, whatsapp: creator.whatsapp });
        setIsEditing(false);
    };

    if (loading) { return <Card><p className="text-center p-8 text-text-secondary">Carregando...</p></Card>; }
    if (!creator) { return <Card><p className="text-center p-8 text-danger">Criador não encontrado.</p></Card>; }

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
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bebas-neue text-primary">Informações Pessoais</h2>
                            {!isEditing && (
                                <Button variant="secondary" onClick={() => setIsEditing(true)}>
                                    <Icon path={mdiPencil} size={0.8} /> Editar
                                </Button>
                            )}
                        </div>
                        {isEditing ? (
                            <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                                <div><label className="block text-sm text-text-secondary mb-1">Nome Completo</label><Input name="fullname" value={formData.fullname} onChange={handleFormChange} /></div>
                                <div><label className="block text-sm text-text-secondary mb-1">Apelido</label><Input name="nickname" value={formData.nickname} onChange={handleFormChange} /></div>
                                <div><label className="block text-sm text-text-secondary mb-1">WhatsApp</label><Input name="whatsapp" value={formData.whatsapp} onChange={handleFormChange} /></div>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                                <div><label className="block text-sm text-text-secondary mb-1">Nome Completo</label><div className="font-semibold">{creator.fullname}</div></div>
                                <div><label className="block text-sm text-text-secondary mb-1">Apelido</label><div className="font-semibold">{creator.nickname}</div></div>
                                <div><label className="block text-sm text-text-secondary mb-1">Email</label><div className="font-semibold">{creator.email}</div></div>
                                <div><label className="block text-sm text-text-secondary mb-1">WhatsApp</label><div className="font-semibold">{creator.whatsapp}</div></div>
                            </div>
                        )}
                        {isEditing && (
                            <div className="flex justify-end gap-4 mt-6">
                                <Button variant="secondary" onClick={cancelEdit}><Icon path={mdiClose} size={0.8}/> Cancelar</Button>
                                <Button onClick={() => setIsConfirmModalOpen(true)}><Icon path={mdiContentSave} size={0.8}/> Salvar Alterações</Button>
                            </div>
                        )}
                    </Card>
                     <Card>
                        <h2 className="text-2xl font-bebas-neue text-primary mb-4">Informações de Repasse</h2>
                         <p className="text-text-secondary"> (A ser implementado no painel do criador)</p>
                    </Card>
                </div>
                {/* ... coluna da direita ... */}
            </div>

            <Modal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} title="Confirmar Alterações">
                <p>Você tem certeza que deseja salvar as novas informações para este usuário?</p>
                <div className="flex justify-end space-x-3 pt-6">
                    <Button variant="secondary" onClick={() => setIsConfirmModalOpen(false)}>Cancelar</Button>
                    <Button variant="danger" onClick={handleSaveChanges}>Sim, Salvar</Button>
                </div>
            </Modal>
        </div>
    );
};

export default CreatorDetail;