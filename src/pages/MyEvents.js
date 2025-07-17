import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';

import Modal from '../components/Modal';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Notification from '../components/Notification'; // Importar o componente de notificação
import Icon from '@mdi/react';
import { mdiPlus, mdiTrashCanOutline } from '@mdi/js';

const EventForm = ({ onSave, onCancel }) => {
    const [formData, setFormData] = useState({ name: '', date: '', description: '', thumbnailUrl: '' });
    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input type="text" name="name" placeholder="Nome do Evento" value={formData.name} onChange={handleChange} required />
            <Input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full" required />
            <textarea name="description" placeholder="Descrição (opcional)" value={formData.description} onChange={handleChange} className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg p-3 h-24 text-text-main focus:ring-primary focus:border-primary"></textarea>
            <Input type="url" name="thumbnailUrl" placeholder="URL da Miniatura (opcional)" value={formData.thumbnailUrl} onChange={handleChange} />
            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
                <Button type="submit">Salvar Evento</Button>
            </div>
        </form>
    );
};


const MyEvents = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);
    const [notification, setNotification] = useState({ message: '', type: '' });

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 4000);
    };

    useEffect(() => {
        if (!user) return;
        setIsLoading(true);
        const q = query(collection(db, "events"), where("creatorId", "==", user.uid), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setIsLoading(false);
        }, () => {
            setIsLoading(false);
            showNotification('Erro ao buscar eventos.', 'danger');
        });
        return () => unsubscribe();
    }, [user]);

    const handleCreateEvent = async (formData) => {
        if (!user) return;
        try {
            await addDoc(collection(db, "events"), { ...formData, creatorId: user.uid, createdAt: serverTimestamp() });
            showNotification('Evento criado com sucesso!', 'success');
            setIsCreateModalOpen(false);
        } catch (error) {
            showNotification('Falha ao criar evento. Verifique as permissões.', 'danger');
        }
    };
    
    const handleDeleteEvent = async () => {
        if (!eventToDelete) return;
        try {
            await deleteDoc(doc(db, "events", eventToDelete.id));
            showNotification('Evento excluído com sucesso.', 'success');
            setEventToDelete(null);
        } catch (error) {
            showNotification('Falha ao excluir evento.', 'danger');
        }
    };

    return (
        <div>
            <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: '', type: '' })} />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold font-bebas-neue text-primary">Meus Eventos</h1>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Icon path={mdiPlus} size={0.8} />
                    Criar Novo Evento
                </Button>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="p-4 font-semibold text-text-secondary">Nome do Evento</th>
                                <th className="p-4 font-semibold text-text-secondary">Data</th>
                                <th className="p-4 font-semibold text-text-secondary">Mídias</th>
                                <th className="p-4 font-semibold text-text-secondary">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && (<tr><td colSpan="4" className="text-center p-8 text-text-secondary">Carregando eventos...</td></tr>)}
                            {!isLoading && events.length === 0 && (<tr><td colSpan="4" className="text-center p-8 text-text-secondary">Nenhum evento encontrado.</td></tr>)}
                            {events.map(event => (
                                <tr key={event.id} className="border-b border-gray-800 hover:bg-background">
                                    <td className="p-4 text-text-main">{event.name}</td>
                                    <td className="p-4 text-text-main">{new Date(event.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                                    <td className="p-4 text-text-main">0</td>
                                    <td className="p-4">
                                        <button onClick={() => setEventToDelete(event)} className="text-danger hover:opacity-80 transition-opacity">
                                            <Icon path={mdiTrashCanOutline} size={1} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Criar Novo Evento">
                <EventForm onSave={handleCreateEvent} onCancel={() => setIsCreateModalOpen(false)} />
            </Modal>

            <Modal isOpen={!!eventToDelete} onClose={() => setEventToDelete(null)} title="Confirmar Exclusão">
                <p>Você tem certeza que deseja excluir o evento "<strong>{eventToDelete?.name}</strong>"?</p>
                <p className="text-sm text-danger mt-2">Esta ação não pode ser desfeita.</p>
                <div className="flex justify-end space-x-3 pt-6">
                    <Button variant="secondary" onClick={() => setEventToDelete(null)}>Cancelar</Button>
                    <Button variant="danger" onClick={handleDeleteEvent}>Excluir</Button>
                </div>
            </Modal>
        </div>
    );
};

export default MyEvents;