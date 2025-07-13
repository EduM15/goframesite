import React, { useState, useEffect, useCallback } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';
import Modal from '../components/Modal';
import { Plus, Trash2, Edit, MoreVertical } from 'lucide-react';

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
            <input type="text" name="name" placeholder="Nome do Evento" value={formData.name} onChange={handleChange} className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg p-3" required />
            <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg p-3" required />
            <textarea name="description" placeholder="Descrição (opcional)" value={formData.description} onChange={handleChange} className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg p-3 h-24"></textarea>
            <input type="url" name="thumbnailUrl" placeholder="URL da Miniatura (opcional)" value={formData.thumbnailUrl} onChange={handleChange} className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg p-3" />
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 transition-colors">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-brand-orange hover:bg-orange-600 transition-colors font-bold">Salvar Evento</button>
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
        const q = query(
            collection(db, "events"), 
            where("creatorId", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const eventsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setEvents(eventsData);
            setIsLoading(false);
        }, (error) => {
            console.error("Erro ao buscar eventos:", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const handleCreateEvent = async (formData) => {
        if (!user) return;
        try {
            await addDoc(collection(db, "events"), {
                ...formData,
                creatorId: user.uid,
                createdAt: serverTimestamp()
            });
            setIsModalOpen(false);
        } catch (error) {
            console.error("Erro ao criar evento: ", error);
        }
    };
    
    const handleDeleteEvent = async () => {
        if (!eventToDelete) return;
        try {
            await deleteDoc(doc(db, "events", eventToDelete.id));
            setEventToDelete(null); // Fecha o modal de confirmação
        } catch (error) {
            console.error("Erro ao deletar evento: ", error);
        }
    };

    const openDeleteConfirmation = (event) => {
        setEventToDelete(event);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold font-bebas-neue">Meus Eventos</h1>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center bg-brand-orange text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">
                    <Plus size={20} className="mr-2" />
                    Criar Novo Evento
                </button>
            </div>

            <div className="bg-[#121212] rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#1e1e1e]">
                            <tr>
                                <th className="p-4 font-semibold">Nome do Evento</th>
                                <th className="p-4 font-semibold">Data</th>
                                <th className="p-4 font-semibold">Mídias</th>
                                <th className="p-4 font-semibold">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan="4" className="text-center p-8">Carregando eventos...</td></tr>
                            ) : events.length === 0 ? (
                                <tr><td colSpan="4" className="text-center p-8 text-gray-400">Nenhum evento encontrado.</td></tr>
                            ) : (
                                events.map(event => (
                                    <tr key={event.id} className="border-b border-gray-800 hover:bg-[#1e1e1e]">
                                        <td className="p-4">{event.name}</td>
                                        <td className="p-4">{new Date(event.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                                        <td className="p-4">0</td>
                                        <td className="p-4">
                                            <button onClick={() => openDeleteConfirmation(event)} className="text-red-500 hover:text-red-400">
                                                <Trash2 size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal para Criar Evento */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Criar Novo Evento">
                <EventForm onSave={handleCreateEvent} onCancel={() => setIsModalOpen(false)} />
            </Modal>

            {/* Modal para Confirmar Exclusão */}
            <Modal isOpen={!!eventToDelete} onClose={() => setEventToDelete(null)} title="Confirmar Exclusão">
                <p>Você tem certeza que deseja excluir o evento "<strong>{eventToDelete?.name}</strong>"?</p>
                <p className="text-sm text-red-400 mt-2">Esta ação não pode ser desfeita.</p>
                <div className="flex justify-end space-x-3 pt-6">
                    <button onClick={() => setEventToDelete(null)} className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 transition-colors">Cancelar</button>
                    <button onClick={handleDeleteEvent} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors font-bold">Excluir</button>
                </div>
            </Modal>
        </div>
    );
};

export default MyEvents;