// src/pages/MyEvents.js
import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';
import Modal from '../components/Modal';
import { Plus, Trash2 } from 'lucide-react';

// O EventForm foi movido para dentro de MyEvents.js por simplicidade,
// mas poderia ser um componente separado.
const EventForm = ({ onSave, onCancel, initialData = {} }) => {
    const [formData, setFormData] = useState({
        name: initialData.name || '',
        date: initialData.date || '',
        description: initialData.description || '',
        thumbnailUrl: initialData.thumbnailUrl || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" placeholder="Nome do Evento" value={formData.name} onChange={handleChange} className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg p-3 text-text-main focus:ring-primary focus:border-primary" required />
            <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg p-3 text-text-main focus:ring-primary focus:border-primary" required />
            <textarea name="description" placeholder="Descrição (opcional)" value={formData.description} onChange={handleChange} className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg p-3 h-24 text-text-main focus:ring-primary focus:border-primary"></textarea>
            <input type="url" name="thumbnailUrl" placeholder="URL da Miniatura (opcional)" value={formData.thumbnailUrl} onChange={handleChange} className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg p-3 text-text-main focus:ring-primary focus:border-primary" />
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 transition-colors">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-primary hover:opacity-90 transition-opacity font-bold">Salvar Evento</button>
            </div>
        </form>
    );
};


const MyEvents = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);

    useEffect(() => {
        if (!user) return;
        setIsLoading(true);
        const q = query(collection(db, "events"), where("creatorId", "==", user.uid), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setIsLoading(false);
        }, () => setIsLoading(false));
        return () => unsubscribe();
    }, [user]);

    const handleCreateEvent = async (formData) => {
        if (!user) return;
        await addDoc(collection(db, "events"), { ...formData, creatorId: user.uid, createdAt: serverTimestamp() });
        setIsModalOpen(false);
    };
    
    const handleDeleteEvent = async () => {
        if (!eventToDelete) return;
        await deleteDoc(doc(db, "events", eventToDelete.id));
        setEventToDelete(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold font-bebas-neue">Meus Eventos</h1>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center bg-primary text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity">
                    <Plus size={20} className="mr-2" />
                    Criar Novo Evento
                </button>
            </div>

            <div className="bg-surface rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-opacity-20 bg-white">
                            <tr>
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
                                <tr key={event.id} className="border-b border-background hover:bg-opacity-10 hover:bg-white">
                                    <td className="p-4 text-text-main">{event.name}</td>
                                    <td className="p-4 text-text-main">{new Date(event.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                                    <td className="p-4 text-text-main">0</td>
                                    <td className="p-4">
                                        <button onClick={() => setEventToDelete(event)} className="text-danger hover:opacity-80 transition-opacity">
                                            <Trash2 size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Criar Novo Evento">
                <EventForm onSave={handleCreateEvent} onCancel={() => setIsModalOpen(false)} />
            </Modal>

            <Modal isOpen={!!eventToDelete} onClose={() => setEventToDelete(null)} title="Confirmar Exclusão">
                <p>Você tem certeza que deseja excluir o evento "<strong>{eventToDelete?.name}</strong>"?</p>
                <p className="text-sm text-danger mt-2">Esta ação não pode ser desfeita.</p>
                <div className="flex justify-end space-x-3 pt-6">
                    <button onClick={() => setEventToDelete(null)} className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 transition-colors">Cancelar</button>
                    <button onClick={handleDeleteEvent} className="px-4 py-2 rounded-lg bg-danger hover:opacity-90 transition-opacity font-bold">Excluir</button>
                </div>
            </Modal>
        </div>
    );
};

export default MyEvents;