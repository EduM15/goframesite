import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword, sendPasswordResetEmail } from 'firebase/auth';

import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Modal from '../components/Modal';
import Notification from '../components/Notification';

const Account = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        fullname: '',
        nickname: '',
        whatsapp: '',
        defaultPhotoPrice: 0,
        defaultVideoPrice: 0,
    });
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [isPassModalOpen, setIsPassModalOpen] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '' });

    useEffect(() => {
        if (user) {
            const userDocRef = doc(db, 'creators', user.uid);
            getDoc(userDocRef).then(docSnap => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setFormData({
                        fullname: data.fullname || '', nickname: data.nickname || '',
                        whatsapp: data.whatsapp || '', defaultPhotoPrice: data.defaultPhotoPrice || 10,
                        defaultVideoPrice: data.defaultVideoPrice || 15,
                    });
                }
            });
        }
    }, [user]);

    // Função para máscara de WhatsApp
    const handleWhatsappChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
        setFormData(prev => ({ ...prev, whatsapp: value.slice(0, 15) }));
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        if (name === 'whatsapp') {
            handleWhatsappChange(e);
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 4000);
    };

    const handleSave = async (dataToSave) => {
        if (!user) return;
        setIsLoading(true);
        try {
            await updateDoc(doc(db, 'creators', user.uid), dataToSave);
            showNotification('Informações salvas com sucesso!', 'success');
        } catch (error) {
            showNotification('Erro ao salvar as informações.', 'danger');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            showNotification('A nova senha e a confirmação não coincidem.', 'danger');
            return;
        }
        if (passwords.new.length < 8) {
            showNotification('A nova senha deve ter no mínimo 8 caracteres.', 'danger');
            return;
        }
        setIsLoading(true);
        try {
            const credential = EmailAuthProvider.credential(user.email, passwords.current);
            await reauthenticateWithCredential(auth.currentUser, credential);
            await updatePassword(auth.currentUser, passwords.new);
            showNotification('Senha alterada com sucesso!', 'success');
            setPasswords({ current: '', new: '', confirm: '' });
            setIsPassModalOpen(false);
        } catch (error) {
            showNotification(error.code === 'auth/wrong-password' ? 'A senha atual está incorreta.' : 'Erro ao alterar a senha.', 'danger');
        } finally {
            setIsLoading(false);
        }
    };

    // Função para redefinir senha por e-mail
    const handleForgotPassword = () => {
        if (!user.email) return;
        sendPasswordResetEmail(auth, user.email)
            .then(() => {
                showNotification('E-mail de redefinição de senha enviado!', 'success');
                setIsPassModalOpen(false);
            })
            .catch(() => {
                showNotification('Erro ao enviar e-mail de redefinição.', 'danger');
            });
    };

    return (
        <div>
            <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: '', type: '' })} />
            <h1 className="text-4xl font-bold mb-6 font-bebas-neue text-primary">Minha Conta</h1>
            
            <div className="space-y-6 max-w-4xl">
                <Card>
                    <h2 className="text-2xl font-bebas-neue text-primary mb-4">Informações Pessoais</h2>
                    <form onSubmit={(e) => { e.preventDefault(); handleSave({ fullname: formData.fullname, nickname: formData.nickname, whatsapp: formData.whatsapp }); }}>
                        <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                            <div><label className="block text-sm text-text-secondary mb-1">Nome Completo</label><Input name="fullname" value={formData.fullname} onChange={handleFormChange} /></div>
                            <div><label className="block text-sm text-text-secondary mb-1">Apelido / Nome de Exibição</label><Input name="nickname" value={formData.nickname} onChange={handleFormChange} /></div>
                            <div><label className="block text-sm text-text-secondary mb-1">WhatsApp</label><Input name="whatsapp" value={formData.whatsapp} onChange={handleFormChange} /></div>
                        </div>
                        <div className="text-right mt-4"><Button type="submit" disabled={isLoading}>{isLoading ? 'Salvando...' : 'Salvar Informações'}</Button></div>
                    </form>
                </Card>

                <Card>
                    <h2 className="text-2xl font-bebas-neue text-primary mb-4">Preços Padrão</h2>
                     <form onSubmit={(e) => { e.preventDefault(); handleSave({ defaultPhotoPrice: Number(formData.defaultPhotoPrice), defaultVideoPrice: Number(formData.defaultVideoPrice) }); }}>
                        <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                            <div><label className="block text-sm text-text-secondary mb-1">Preço Padrão - Foto (R$)</label><Input name="defaultPhotoPrice" type="number" value={formData.defaultPhotoPrice} onChange={handleFormChange} /></div>
                            <div><label className="block text-sm text-text-secondary mb-1">Preço Padrão - Vídeo (R$)</label><Input name="defaultVideoPrice" type="number" value={formData.defaultVideoPrice} onChange={handleFormChange} /></div>
                        </div>
                         <div className="text-right mt-4"><Button type="submit" disabled={isLoading}>{isLoading ? 'Salvando...' : 'Salvar Preços'}</Button></div>
                    </form>
                </Card>

                <Card>
                    <h2 className="text-2xl font-bebas-neue text-primary mb-4">Segurança</h2>
                    <div className="flex justify-between items-center"><p className="text-text-secondary">Altere sua senha de acesso.</p><Button variant="danger" onClick={() => setIsPassModalOpen(true)}>Alterar Senha</Button></div>
                </Card>
            </div>

            <Modal isOpen={isPassModalOpen} onClose={() => setIsPassModalOpen(false)} title="Alterar Senha">
                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div><label className="block text-sm text-text-secondary mb-1">Senha Atual</label><Input type="password" name="current" value={passwords.current} onChange={handlePasswordChange} required /></div>
                    <div><label className="block text-sm text-text-secondary mb-1">Nova Senha</label><Input type="password" name="new" value={passwords.new} onChange={handlePasswordChange} required minLength="8" /></div>
                    <div><label className="block text-sm text-text-secondary mb-1">Confirmar Nova Senha</label><Input type="password" name="confirm" value={passwords.confirm} onChange={handlePasswordChange} required minLength="8" /></div>
                    <div className="flex justify-between items-center pt-4">
                        <button type="button" onClick={handleForgotPassword} className="text-sm text-primary hover:underline">Esqueci minha senha</button>
                        <div className="flex gap-3">
                            <Button type="button" variant="secondary" onClick={() => setIsPassModalOpen(false)}>Cancelar</Button>
                            <Button type="submit" variant="danger" disabled={isLoading}>{isLoading ? 'Alterando...' : 'Confirmar Alteração'}</Button>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Account;