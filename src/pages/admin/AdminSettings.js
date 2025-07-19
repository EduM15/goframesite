import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Notification from '../../components/Notification';

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        platformCommission: 20,
        defaultPhotoPrice: 19.90,
        defaultVideoPrice: 29.90,
    });
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '' });

    // As configurações serão salvas em um único documento: `settings/platform`
    const settingsDocRef = doc(db, 'settings', 'platform');

    useEffect(() => {
        const fetchSettings = async () => {
            const docSnap = await getDoc(settingsDocRef);
            if (docSnap.exists()) {
                setSettings(docSnap.data());
            } else {
                console.log("Nenhum documento de configurações encontrado, usando valores padrão.");
            }
            setLoading(false);
        };
        fetchSettings();
    }, []);
    
    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 4000);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            // Usamos setDoc com merge: true para criar o documento se ele não existir, ou atualizá-lo se existir.
            await setDoc(settingsDocRef, settings, { merge: true });
            showNotification('Configurações salvas com sucesso!', 'success');
        } catch (error) {
            showNotification('Erro ao salvar configurações.', 'danger');
            console.error("Erro ao salvar configurações:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: Number(value) }));
    };

    if (loading) {
        return <Card><p className="text-center p-8">Carregando configurações...</p></Card>;
    }

    return (
        <div>
            <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: '', type: '' })} />
            <h1 className="text-4xl font-bold mb-6 font-bebas-neue text-primary">Configurações da Plataforma</h1>
            <form onSubmit={handleSave}>
                <div className="space-y-6 max-w-2xl">
                    <Card>
                        <h2 className="text-2xl font-bebas-neue text-primary mb-2">Comissão da Plataforma</h2>
                        <p className="text-text-secondary text-sm mb-4">Este valor será descontado de cada venda realizada por um criador parceiro.</p>
                        <label className="block text-sm text-text-secondary mb-1">Percentual de Comissão (%)</label>
                        <Input type="number" name="platformCommission" value={settings.platformCommission} onChange={handleChange} className="max-w-xs" />
                    </Card>

                    <Card>
                        <h2 className="text-2xl font-bebas-neue text-primary mb-2">Preços Padrão</h2>
                        <p className="text-text-secondary text-sm mb-4">Valores padrão para novas mídias. O criador poderá alterar individualmente.</p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-text-secondary mb-1">Preço Padrão - Foto (R$)</label>
                                <Input type="number" name="defaultPhotoPrice" value={settings.defaultPhotoPrice} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-sm text-text-secondary mb-1">Preço Padrão - Vídeo (R$)</label>
                                <Input type="number" name="defaultVideoPrice" value={settings.defaultVideoPrice} onChange={handleChange} />
                            </div>
                        </div>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AdminSettings;