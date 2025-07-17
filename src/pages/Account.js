import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';

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
    const [passwords, setPasswords] = useState({ current: '', new: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [isPassModalOpen, setIsPassModalOpen] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '' });

    // Efeito para buscar os dados do usuário quando a página carrega
    useEffect(() => {
        if (user) {
            const userDocRef = doc(db, 'creators', user.uid);
            getDoc(userDocRef).then(docSnap => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setFormData({
                        fullname: data.fullname || '',
                        nickname: data.nickname || '',
                        whatsapp: data.whatsapp || '',
                        defaultPhotoPrice: data.defaultPhotoPrice || 10,
                        defaultVideoPrice: data.defaultVideoPrice || 15,
                    });
                }
            });
        }
    }, [user]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 4000);
    };

    // Função para salvar informações pessoais e preços
    const handleSave = async (dataToSave) => {
        if (!user) return;
        setIsLoading(true);
        try {
            const userDocRef = doc(db, 'creators', user.uid);
            await updateDoc(userDocRef, dataToSave);
            showNotification('Informações salvas com sucesso!', 'success');
        } catch (error) {
            showNotification('Erro ao salvar as informações.', 'danger');
        } finally {
            setIsLoading(false);
        }
    };

    // Função para alterar a senha
    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!passwords.current || !passwords.new) {
            showNotification('Por favor, preencha todos os campos de senha.', 'danger');
            return;
        }
        setIsLoading(true);
        try {
            const credential = EmailAuthProvider.credential(user.email, passwords.current);
            // Reautenticação é necessária para ações sensíveis como alterar senha
            await reauthenticateWithCredential(auth.currentUser, credential);
            await updatePassword(auth.currentUser, passwords.new);
            
            showNotification('Senha alterada com sucesso!', 'success');
            setPasswords({ current: '', new: '' });
            setIsPassModalOpen(false);
        } catch (error) {
            if (error.code === 'auth/wrong-password') {
                showNotification('A senha atual está incorreta.', 'danger');
            } else {
                showNotification('Erro ao alterar a senha.', 'danger');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: '', type: '' })} />
            <h1 className="text-4xl font-bold mb-6 font-bebas-neue text-primary">Minha Conta</h1>
            
            <div className="space-y-6 max-w-4xl">
                {/* Card de Informações Pessoais */}
                <Card>
                    <h2 className="text-2xl font-bebas-neue text-primary mb-4">Informações Pessoais</h2>
                    <form onSubmit={(e) => { e.preventDefault(); handleSave({ fullname: formData.fullname, nickname: formData.nickname, whatsapp: formData.whatsapp }); }}>
                        <div className="grid md:grid-cols-2 gap-4">
                            <Input name="fullname" placeholder="Nome Completo" value={formData.fullname} onChange={handleFormChange} />
                            <Input name="nickname" placeholder="Apelido / Nome de Exibição" value={formData.nickname} onChange={handleFormChange} />
                            <Input name="whatsapp" placeholder="WhatsApp" value={formData.whatsapp} onChange={handleFormChange} />
                        </div>
                        <div className="text-right mt-4">
                            <Button type="submit" disabled={isLoading}>{isLoading ? 'Salvando...' : 'Salvar Informações'}</Button>
                        </div>
                    </form>
                </Card>

                {/* Card de Preços Padrão */}
                <Card>
                    <h2 className="text-2xl font-bebas-neue text-primary mb-4">Preços Padrão</h2>
                     <form onSubmit={(e) => { e.preventDefault(); handleSave({ defaultPhotoPrice: Number(formData.defaultPhotoPrice), defaultVideoPrice: Number(formData.defaultVideoPrice) }); }}>
                        <div className="grid md:grid-cols-2 gap-4">
                            <Input name="defaultPhotoPrice" type="number" placeholder="Preço Foto (R$)" value={formData.defaultPhotoPrice} onChange={handleFormChange} />
                            <Input name="defaultVideoPrice" type="number" placeholder="Preço Vídeo (R$)" value={formData.defaultVideoPrice} onChange={handleFormChange} />
                        </div>
                         <div className="text-right mt-4">
                            <Button type="submit" disabled={isLoading}>{isLoading ? 'Salvando...' : 'Salvar Preços'}</Button>
                        </div>
                    </form>
                </Card>

                {/* Card de Alteração de Senha */}
                <Card>
                    <h2 className="text-2xl font-bebas-neue text-primary mb-4">Segurança</h2>
                    <div className="flex justify-between items-center">
                        <p className="text-text-secondary">Altere sua senha de acesso.</p>
                        <Button variant="danger" onClick={() => setIsPassModalOpen(true)}>Alterar Senha</Button>
                    </div>
                </Card>
            </div>

            {/* Modal para Alterar a Senha */}
            <Modal isOpen={isPassModalOpen} onClose={() => setIsPassModalOpen(false)} title="Alterar Senha">
                <form onSubmit={handleChangePassword} className="space-y-4">
                    <Input type="password" name="current" placeholder="Senha Atual" value={passwords.current} onChange={handlePasswordChange} required />
                    <Input type="password" name="new" placeholder="Nova Senha (mín. 8 caracteres)" value={passwords.new} onChange={handlePasswordChange} required minLength="8" />
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="secondary" onClick={() => setIsPassModalOpen(false)}>Cancelar</Button>
                        <Button type="submit" variant="danger" disabled={isLoading}>{isLoading ? 'Alterando...' : 'Confirmar Alteração'}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Account;