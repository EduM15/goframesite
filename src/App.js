import React, { useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendEmailVerification } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

// ==================================================================================
// CONFIGURAÇÃO E INICIALIZAÇÃO DO FIREBASE
// ==================================================================================
const firebaseConfig = {
  apiKey: "AIzaSyDVj1Pg-51DgCNwi_jPckKwHRHzbXz0z9E",
  authDomain: "goframesite.firebaseapp.com",
  projectId: "goframesite",
  storageBucket: "goframesite.firebasestorage.app",
  messagingSenderId: "784091952713",
  appId: "1:784091952713:web:0eec3d538b5ea1c2633198",
  measurementId: "G-ZRR14VB8T4"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

// ==================================================================================
// FUNÇÃO UTILITÁRIA DE VALIDAÇÃO
// ==================================================================================
const validateEmail = (email) => {
  const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return re.test(String(email).toLowerCase());
};

// ==================================================================================
// HOOK PERSONALIZADO PARA GERENCIAR AUTENTICAÇÃO
// ==================================================================================
const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);
    return { user, loading };
};

// ==================================================================================
// PÁGINA DE AUTENTICAÇÃO (Agrupa Login, Cadastro e Termos)
// ==================================================================================
const AuthPage = () => {
    const [page, setPage] = useState('login'); // login, signup, terms
    
    const navigate = (targetPage) => setPage(targetPage);

    switch (page) {
        case 'signup':
            return <SignUpPage navigateToLogin={() => navigate('login')} navigateToTerms={() => navigate('terms')} />;
        case 'terms':
            return <TermsPage navigateBack={() => navigate('signup')} />;
        case 'login':
        default:
            return <LoginPage navigateToSignUp={() => navigate('signup')} />;
    }
};

// ==================================================================================
// COMPONENTES DE AUTENTICAÇÃO (Login, Cadastro, Termos)
// ==================================================================================
const LoginPage = ({ navigateToSignUp }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [emailError, setEmailError] = useState('');

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        if (id === 'email') {
            setEmailError(value && !validateEmail(value) ? 'Por favor, insira um formato de e-mail válido.' : '');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (emailError) { setNotification({ message: 'Por favor, corrija os erros.', type: 'error' }); return; }
        if (!formData.email || !formData.password) { setNotification({ message: 'Por favor, preencha o e-mail e a senha.', type: 'error' }); return; }
        setIsLoading(true);
        setNotification({ message: '', type: '' });
        try {
            await signInWithEmailAndPassword(auth, formData.email, formData.password);
        } catch (error) {
            console.error("Erro no login:", error);
            setNotification({ message: 'E-mail ou senha inválidos.', type: 'error' });
            setIsLoading(false);
        }
    };

    return (
        <div style={{ fontFamily: "'Poppins', sans-serif" }} className="bg-[#121212] text-white flex justify-center items-center min-h-screen p-5">
            <div className="bg-[#1e1e1e] p-10 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.5)] w-full max-w-md text-center">
                <h1 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-6xl tracking-wider mb-2 cursor-pointer">Go<span className="text-[#FF4500]">Frame</span></h1>
                <h2 className="font-normal text-[#B3B3B3] mt-0 mb-8">Portal do Criador</h2>
                {notification.message && (<div className={`p-4 mb-5 rounded-md font-medium text-left ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>{notification.message}</div>)}
                <form onSubmit={handleSubmit} noValidate>
                    <div className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm text-[#B3B3B3] text-left">E-mail de Criador</label>
                            <input type="email" id="email" value={formData.email} onChange={handleChange} required className={`w-full p-3 bg-[#121212] border rounded-md text-white text-base font-['Poppins'] ${emailError ? 'border-red-500' : 'border-[#333]'}`}/>
                            {emailError && <p className="text-red-500 text-xs mt-1 text-left">{emailError}</p>}
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm text-[#B3B3B3] text-left">Senha</label>
                            <input type="password" id="password" value={formData.password} onChange={handleChange} required className="w-full p-3 bg-[#121212] border border-[#333] rounded-md text-white text-base font-['Poppins']"/>
                        </div>
                    </div>
                    <button type="submit" className="w-full p-4 mt-8 bg-[#FF4500] text-white rounded-md text-lg font-bold cursor-pointer transition-all hover:bg-[#e03e00] disabled:opacity-60 disabled:cursor-not-allowed" disabled={isLoading}>{isLoading ? 'ENTRANDO...' : 'ENTRAR NO PORTAL'}</button>
                </form>
                <div className="mt-6 text-sm flex justify-end"><a href="#" className="text-[#B3B3B3] border-b border-dashed border-[#B3B3B3] hover:text-[#FF4500] hover:border-[#FF4500]">Esqueceu sua senha?</a></div>
                <div className="mt-10 text-sm"><p>Não tem uma conta? <a href="#" onClick={(e) => { e.preventDefault(); navigateToSignUp(); }} className="text-[#FF4500] font-bold hover:underline">Cadastre-se</a></p></div>
            </div>
        </div>
    );
};

const SignUpPage = ({ navigateToLogin, navigateToTerms }) => {
    const [formData, setFormData] = useState({ fullname: '', nickname: '', whatsapp: '', email: '', password: '', passwordConfirm: '', terms: false });
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [emailError, setEmailError] = useState('');

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [id]: type === 'checkbox' ? checked : value }));
        if (id === 'email') { setEmailError(value && !validateEmail(value) ? 'Por favor, insira um formato de e-mail válido.' : ''); }
    };

    const handleWhatsAppChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
        e.target.value = value.slice(0, 15);
        handleChange(e);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (emailError) { setNotification({ message: 'Por favor, corrija os erros.', type: 'error' }); return; }
        if (Object.values(formData).some(val => val === '' && typeof val === 'string') || !formData.terms) { setNotification({ message: 'Por favor, preencha todos os campos e aceite os termos.', type: 'error' }); return; }
        if (formData.password !== formData.passwordConfirm) { setNotification({ message: 'As senhas não conferem.', type: 'error' }); return; }
        
        setIsLoading(true);
        setNotification({ message: '', type: '' });
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;
            await sendEmailVerification(user);
            await setDoc(doc(db, "creators", user.uid), {
                uid: user.uid, fullname: formData.fullname, nickname: formData.nickname,
                whatsapp: formData.whatsapp, email: formData.email, role: 'creator',
                createdAt: serverTimestamp()
            });
            setNotification({ message: 'Cadastro realizado com sucesso! Redirecionando para o login...', type: 'success' });
            setTimeout(() => {
                setIsLoading(false);
                navigateToLogin(); 
            }, 2000);
        } catch (error) {
            console.error("Erro no cadastro:", error);
            let msg = 'Ocorreu um erro ao realizar o cadastro.';
            if (error.code === 'auth/email-already-in-use') msg = 'Este e-mail já está em uso.';
            if (error.code === 'auth/weak-password') msg = 'A senha é muito fraca (mínimo 6 caracteres).';
            setNotification({ message: msg, type: 'error' });
            setIsLoading(false);
        }
    };

    return (
        <div style={{ fontFamily: "'Poppins', sans-serif" }} className="bg-[#121212] text-white flex justify-center items-center min-h-screen p-5">
            <div className="bg-[#1e1e1e] p-10 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.5)] w-full max-w-lg text-center">
                <h1 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-6xl tracking-wider mb-2">Go<span className="text-[#FF4500]">Frame</span></h1>
                <h2 className="font-normal text-[#B3B3B3] mt-0 mb-8">Cadastro de Novo Criador</h2>
                {notification.message && (<div className={`p-4 mb-5 rounded-md font-medium text-left ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>{notification.message}</div>)}
                <form onSubmit={handleSubmit} noValidate>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2"><label htmlFor="fullname" className="block mb-2 text-sm text-[#B3B3B3] text-left">Nome Completo</label><input type="text" id="fullname" value={formData.fullname} onChange={handleChange} required className="w-full p-3 bg-[#121212] border border-[#333] rounded-md text-white text-base font-['Poppins']"/></div>
                        <div><label htmlFor="nickname" className="block mb-2 text-sm text-[#B3B3B3] text-left">Apelido / Nome de Exibição</label><input type="text" id="nickname" value={formData.nickname} onChange={handleChange} required className="w-full p-3 bg-[#121212] border border-[#333] rounded-md text-white text-base font-['Poppins']"/></div>
                        <div><label htmlFor="whatsapp" className="block mb-2 text-sm text-[#B3B3B3] text-left">WhatsApp</label><input type="tel" id="whatsapp" placeholder="(XX) XXXXX-XXXX" value={formData.whatsapp} onChange={handleWhatsAppChange} required className="w-full p-3 bg-[#121212] border border-[#333] rounded-md text-white text-base font-['Poppins']"/></div>
                        <div className="md:col-span-2">
                            <label htmlFor="email" className="block mb-2 text-sm text-[#B3B3B3] text-left">E-mail de Acesso</label>
                            <input type="email" id="email" value={formData.email} onChange={handleChange} required className={`w-full p-3 bg-[#121212] border rounded-md text-white text-base font-['Poppins'] ${emailError ? 'border-red-500' : 'border-[#333]'}`}/>
                            {emailError && <p className="text-red-500 text-xs mt-1 text-left">{emailError}</p>}
                        </div>
                        <div><label htmlFor="password" className="block mb-2 text-sm text-[#B3B3B3] text-left">Crie uma Senha</label><input type="password" id="password" value={formData.password} onChange={handleChange} minLength="8" required className="w-full p-3 bg-[#121212] border border-[#333] rounded-md text-white text-base font-['Poppins']"/></div>
                        <div><label htmlFor="passwordConfirm" className="block mb-2 text-sm text-[#B3B3B3] text-left">Confirme a Senha</label><input type="password" id="passwordConfirm" value={formData.passwordConfirm} onChange={handleChange} minLength="8" required className="w-full p-3 bg-[#121212] border border-[#333] rounded-md text-white text-base font-['Poppins']"/>{formData.password && formData.passwordConfirm && formData.password !== formData.passwordConfirm && <p className="text-red-500 text-xs mt-1 text-left">As senhas não conferem.</p>}</div>
                    </div>
                    <div className="flex items-center gap-3 my-5 text-left text-sm text-[#B3B3B3]"><input type="checkbox" id="terms" className="w-5 h-5 accent-[#FF4500]" checked={formData.terms} onChange={handleChange} required /><label htmlFor="terms">Eu li e aceito os <a href="#" onClick={(e) => {e.preventDefault(); navigateToTerms()}} className="text-[#FF4500] underline">Termos de Serviço</a>.</label></div>
                    <button type="submit" className="w-full p-4 mt-2 bg-[#FF4500] text-white rounded-md text-lg font-bold cursor-pointer transition-all hover:bg-[#e03e00] disabled:opacity-60 disabled:cursor-not-allowed" disabled={isLoading}>{isLoading ? 'CADASTRANDO...' : 'FINALIZAR CADASTRO'}</button>
                </form>
                <div className="mt-6 text-sm"><p>Já tem uma conta? <a href="#" onClick={(e) => { e.preventDefault(); navigateToLogin(); }} className="text-[#FF4500] font-bold hover:underline">Faça o login</a></p></div>
            </div>
        </div>
    );
};

const TermsPage = ({ navigateBack }) => {
    return (
        <div style={{ fontFamily: "'Poppins', sans-serif" }} className="bg-[#121212] text-white flex justify-center items-center min-h-screen p-5">
            <div className="bg-[#1e1e1e] p-10 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.5)] w-full max-w-3xl text-left">
                <h1 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-5xl tracking-wider mb-6 text-center">Termos de <span className="text-[#FF4500]">Serviço</span></h1>
                <div className="prose prose-invert max-w-none h-96 overflow-y-auto pr-4 text-[#B3B3B3]">
                    <h2 className="text-xl font-bold text-white">1. Visão Geral</h2>
                    <p>Este é um texto de exemplo para os Termos de Serviço...</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
                    <h2 className="text-xl font-bold text-white mt-4">2. Contas de Usuário</h2>
                    <p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae...</p>
                    <h2 className="text-xl font-bold text-white mt-4">3. Conteúdo e Propriedade Intelectual</h2>
                    <p>Ao fazer upload de conteúdo (fotos, vídeos), você concede à GoFrame uma licença mundial...</p>
                    <p>Nullam dictum felis eu pede mollis pretium...</p>
                </div>
                <div className="text-center mt-8">
                    <button onClick={navigateBack} className="p-4 w-full max-w-xs bg-[#FF4500] text-white rounded-md text-lg font-bold cursor-pointer transition-all hover:bg-[#e03e00]">Entendi, voltar</button>
                </div>
            </div>
        </div>
    );
};


// ==================================================================================
// COMPONENTES DO PAINEL DO CRIADOR
// ==================================================================================
const CreatorDashboard = ({ user }) => {
    const [creatorData, setCreatorData] = useState(null);
    const [activePage, setActivePage] = useState('overview');

    useEffect(() => {
        const fetchCreatorData = async () => {
            const docRef = doc(db, "creators", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) { setCreatorData(docSnap.data()); }
        };
        fetchCreatorData();
    }, [user]);

    const handleSignOut = async () => { await signOut(auth); };

    if (!creatorData) { return <div className="bg-[#121212] text-white flex justify-center items-center min-h-screen">Carregando painel...</div>; }

    const renderPage = () => {
        switch (activePage) {
            case 'overview': return <DashboardOverview creatorData={creatorData} />;
            case 'events': return <EventsPage />;
            case 'upload': return <PlaceholderPage title="Upload de Mídia" />;
            case 'finance': return <PlaceholderPage title="Financeiro" />;
            case 'account': return <AccountPage creatorData={creatorData} />;
            default: return <DashboardOverview creatorData={creatorData} />;
        }
    };

    return (
        <div className="flex bg-[#121212] text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <Sidebar activePage={activePage} setActivePage={setActivePage} handleSignOut={handleSignOut} />
            <main className="flex-grow p-10 ml-[250px]">{renderPage()}</main>
        </div>
    );
};

const Sidebar = ({ activePage, setActivePage, handleSignOut }) => {
    const navItems = [
        { id: 'overview', label: 'Visão Geral', icon: <path d="M13,3V9H21V3M19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3H12V9H21V19A2,2 0 0,1 19,21Z"/> },
        { id: 'events', label: 'Meus Eventos', icon: <path d="M20.55,4.85L21.5,5.8L20.25,7.05L19.3,6.1M18.6,6.8L19.55,7.75L12.75,14.55L11.8,13.6M6,13.5L11.1,18.6C11.3,18.8 11.5,18.9 11.75,18.9H12V21H2V11H4.1C4.1,11.25 4.2,11.5 4.4,11.7L9.5,16.85L16.3,10L17.25,10.95L18.2,10M4,9V5A2,2 0 0,1 6,3H14A2,2 0 0,1 16,5V9H4Z"/> },
        { id: 'upload', label: 'Upload de Mídia', icon: <path d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z"/> },
        { id: 'finance', label: 'Financeiro', icon: <path d="M22,21H2V3H4V19H22V21M6,5H8V17H6V5M10,9H12V17H10V9M14,7H16V17H14V7M18,11H20V17H18V11Z"/> },
        { id: 'account', label: 'Minha Conta', icon: <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/> },
    ];
    return (
        <aside className="w-[250px] bg-[#1e1e1e] h-screen p-5 box-border flex flex-col fixed">
            <div style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-4xl text-center mb-10">Go<span className="text-[#FF4500]">Frame</span></div>
            <nav className="flex-grow">
                <ul>{navItems.map(item => (<li key={item.id}><a href="#" onClick={(e) => {e.preventDefault(); setActivePage(item.id)}} className={`flex items-center p-3 text-[#B3B3B3] rounded-md mb-2 transition-all ${activePage === item.id ? 'bg-[#FF4500] text-white' : 'hover:bg-[#FF4500] hover:text-white'}`}><svg className="w-6 h-6 mr-4 fill-current" viewBox="0 0 24 24">{item.icon}</svg>{item.label}</a></li>))}</ul>
            </nav>
            <div><a href="#" onClick={handleSignOut} className="flex items-center p-3 text-[#B3B3B3] rounded-md mb-2 transition-all hover:bg-[#FF4500] hover:text-white"><svg className="w-6 h-6 mr-4 fill-current" viewBox="0 0 24 24"><path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z"/></svg>Sair</a></div>
        </aside>
    );
};

const DashboardOverview = ({ creatorData }) => {
    const activityFeed = [
        { icon: 'sale', text: "Venda realizada! (Foto IMG_7812.JPG)", time: "Hoje, 15:02" },
        { icon: 'upload', text: "15 mídias enviadas para 'Trilha do Desafio'.", time: "Ontem, 11:34" },
        { icon: 'sale', text: "Venda realizada! (Vídeo DJI_0025.MP4)", time: "Ontem, 09:12" },
        { icon: 'event', text: "Evento 'Enduro das Cachoeiras' foi arquivado.", time: "2 dias atrás" },
    ];
    const icons = {
        sale: <svg viewBox="0 0 24 24"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,16.5L6.5,12L7.91,10.59L11,13.67L16.09,8.59L17.5,10L11,16.5Z" /></svg>,
        upload: <svg viewBox="0 0 24 24"><path d="M14,13V17H10V13H7L12,8L17,13H14M19.35,10.04C18.67,6.59 15.64,4 12,4C9.11,4 6.6,5.64 5.35,8.04C2.34,8.36 0,10.91 0,14A6,6 0 0,0 6,20H19A5,5 0 0,0 24,15C24,12.36 21.95,10.22 19.35,10.04Z" /></svg>,
        event: <svg viewBox="0 0 24 24"><path d="M20.55,4.85L21.5,5.8L20.25,7.05L19.3,6.1M18.6,6.8L19.55,7.75L12.75,14.55L11.8,13.6M6,13.5L11.1,18.6C11.3,18.8 11.5,18.9 11.75,18.9H12V21H2V11H4.1C4.1,11.25 4.2,11.5 4.4,11.7L9.5,16.85L16.3,10L17.25,10.95L18.2,10M4,9V5A2,2 0 0,1 6,3H14A2,2 0 0,1 16,5V9H4Z" /></svg>,
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2">
                <div className="mb-10">
                    <h1 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-6xl m-0 tracking-wider">Bem-vindo de volta,</h1>
                    <p className="text-2xl text-[#B3B3B3] mt-1">{creatorData.nickname}!</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                    <div className="kpi-card"><div className="title">SALDO A RECEBER</div><div className="value positive">R$ 755,60</div></div>
                    <div className="kpi-card"><div className="title">VENDAS (7 DIAS)</div><div className="value">R$ 310,80</div></div>
                </div>
                <div className="bg-[#1e1e1e] p-8 rounded-lg">
                    <h2 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-3xl tracking-wider mt-0 mb-5">Ações Rápidas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <a href="#" className="quick-action-btn"><svg viewBox="0 0 24 24"><path d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z" /></svg> Fazer Novo Upload</a>
                        <a href="#" className="quick-action-btn"><svg viewBox="0 0 24 24"><path d="M20.55,4.85L21.5,5.8L20.25,7.05L19.3,6.1M18.6,6.8L19.55,7.75L12.75,14.55L11.8,13.6M6,13.5L11.1,18.6C11.3,18.8 11.5,18.9 11.75,18.9H12V21H2V11H4.1C4.1,11.25 4.2,11.5 4.4,11.7L9.5,16.85L16.3,10L17.25,10.95L18.2,10M4,9V5A2,2 0 0,1 6,3H14A2,2 0 0,1 16,5V9H4Z" /></svg> Gerenciar Eventos</a>
                    </div>
                </div>
            </div>
            <div className="bg-[#1e1e1e] p-8 rounded-lg">
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-3xl tracking-wider mt-0 mb-5">Atividade Recente</h2>
                <ul>{activityFeed.map((item, index) => (
                    <li key={index} className="flex items-center gap-4 py-3 border-b border-[#333] last:border-b-0">
                        <div className="bg-[#333] rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0"><svg className="w-5 h-5 fill-current text-[#B3B3B3]" viewBox="0 0 24 24">{icons[item.icon]}</svg></div>
                        <div><p className="m-0">{item.text}</p><p className="text-xs text-[#B3B3B3] m-0">{item.time}</p></div>
                    </li>
                ))}</ul>
            </div>
            <style jsx>{`
                .kpi-card { background-color: #1e1e1e; padding: 20px; border-radius: 8px; text-align: center; }
                .kpi-card .title { font-size: 1rem; color: #B3B3B3; margin-bottom: 10px; }
                .kpi-card .value { font-size: 2.5rem; font-weight: 700; }
                .kpi-card .value.positive { color: #4caf50; }
                .quick-action-btn { background-color: #121212; border: 1px solid #333; color: white; padding: 20px; border-radius: 8px; text-align: center; font-size: 1.1rem; font-weight: 500; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; transition: all 0.2s; }
                .quick-action-btn:hover { border-color: #FF4500; color: #FF4500; }
                .quick-action-btn svg { width: 32px; height: 32px; fill: currentColor; }
            `}</style>
        </div>
    );
};

const EventsPage = () => {
    const events = [
        { name: 'Trilha do Desafio - Serra Azul', date: '29/06/2025', media: '15 Vídeos, 33 Fotos', sales: 'R$ 1.250,00', status: 'Ativo' },
        { name: 'Enduro das Cachoeiras', date: '15/06/2025', media: '8 Vídeos, 12 Fotos', sales: 'R$ 870,50', status: 'Ativo' },
        { name: 'Trilha de Inverno', date: '12/05/2025', media: '22 Fotos', sales: 'R$ 450,00', status: 'Arquivado' },
    ];
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-6xl m-0 tracking-wider">Meus Eventos</h1>
                <button className="bg-[#FF4500] text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-[#e03e00] transition-colors"><svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" /></svg>Criar Novo Evento</button>
            </div>
            <div className="bg-[#1e1e1e] p-8 rounded-lg">
                <table className="w-full text-left">
                    <thead>
                        <tr>
                            <th className="p-4 text-sm font-semibold text-[#B3B3B3] uppercase">Nome do Evento</th>
                            <th className="p-4 text-sm font-semibold text-[#B3B3B3] uppercase">Data</th>
                            <th className="p-4 text-sm font-semibold text-[#B3B3B3] uppercase">Mídias</th>
                            <th className="p-4 text-sm font-semibold text-[#B3B3B3] uppercase">Vendas</th>
                            <th className="p-4 text-sm font-semibold text-[#B3B3B3] uppercase">Status</th>
                            <th className="p-4 text-sm font-semibold text-[#B3B3B3] uppercase">Ações</th>
                        </tr>
                    </thead>
                    <tbody>{events.map((event, index) => (
                        <tr key={index} className="border-t border-[#333] hover:bg-[#2a2a2a]">
                            <td className="p-4">{event.name}</td>
                            <td className="p-4">{event.date}</td>
                            <td className="p-4">{event.media}</td>
                            <td className="p-4">{event.sales}</td>
                            <td className="p-4"><span className={`px-3 py-1 text-xs font-bold rounded-full ${event.status === 'Ativo' ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-200'}`}>{event.status}</span></td>
                            <td className="p-4 flex gap-2">{/* Action buttons here */}</td>
                        </tr>
                    ))}</tbody>
                </table>
            </div>
        </div>
    );
};

const AccountPage = ({ creatorData }) => {
    return (
        <div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-6xl m-0 tracking-wider mb-8">Minha Conta</h1>
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="bg-[#1e1e1e] p-8 rounded-lg">
                    <h2 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-3xl tracking-wider text-[#FF4500] mt-0 mb-6">Informações Pessoais</h2>
                    <form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label className="block text-sm text-[#B3B3B3] mb-2">Nome Completo</label><input type="text" defaultValue={creatorData.fullname} className="w-full p-3 bg-[#121212] border border-[#333] rounded-md"/></div>
                            <div><label className="block text-sm text-[#B3B3B3] mb-2">Apelido / Nome de Exibição</label><input type="text" defaultValue={creatorData.nickname} className="w-full p-3 bg-[#121212] border border-[#333] rounded-md"/></div>
                            <div><label className="block text-sm text-[#B3B3B3] mb-2">E-mail</label><input type="email" defaultValue={creatorData.email} readOnly className="w-full p-3 bg-[#2a2a2a] border border-[#333] rounded-md text-gray-400 cursor-not-allowed"/></div>
                            <div><label className="block text-sm text-[#B3B3B3] mb-2">WhatsApp</label><input type="tel" defaultValue={creatorData.whatsapp} className="w-full p-3 bg-[#121212] border border-[#333] rounded-md"/></div>
                        </div>
                        <div className="text-right pt-4"><button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg">Salvar</button></div>
                    </form>
                </div>
                <div className="bg-[#1e1e1e] p-8 rounded-lg">
                    <h2 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-3xl tracking-wider text-[#FF4500] mt-0 mb-6">Alterar Senha</h2>
                    <form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div><label className="block text-sm text-[#B3B3B3] mb-2">Senha Atual</label><input type="password" className="w-full p-3 bg-[#121212] border border-[#333] rounded-md"/></div>
                            <div><label className="block text-sm text-[#B3B3B3] mb-2">Nova Senha</label><input type="password" className="w-full p-3 bg-[#121212] border border-[#333] rounded-md"/></div>
                            <div><label className="block text-sm text-[#B3B3B3] mb-2">Confirmar Nova Senha</label><input type="password" className="w-full p-3 bg-[#121212] border border-[#333] rounded-md"/></div>
                        </div>
                        <div className="text-right pt-4"><button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg">Alterar Senha</button></div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const PlaceholderPage = ({ title }) => (
    <div>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-6xl m-0 tracking-wider mb-4">{title}</h1>
        <div className="bg-[#1e1e1e] p-8 rounded-lg text-center">
            <p className="text-xl text-[#B3B3B3]">Esta página está em construção.</p>
            <p>Volte em breve para ver as novidades!</p>
        </div>
    </div>
);

// ==================================================================================
// COMPONENTE PRINCIPAL DA APLICAÇÃO (App.js)
// ==================================================================================
export default function App() {
  const { user, loading } = useAuth();

  useEffect(() => {
        const link1 = document.createElement('link');
        link1.rel = 'preconnect';
        link1.href = 'https://fonts.googleapis.com';
        const link2 = document.createElement('link');
        link2.rel = 'preconnect';
        link2.href = 'https://fonts.gstatic.com';
        link2.crossOrigin = 'true';
        const link3 = document.createElement('link');
        link3.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Poppins:wght@400;700&display=swap';
        link3.rel = 'stylesheet';
        document.head.appendChild(link1);
        document.head.appendChild(link2);
        document.head.appendChild(link3);
    }, []);

  if (loading) {
      return <div className="bg-[#121212] text-white flex justify-center items-center min-h-screen">Carregando...</div>;
  }

  return user ? <CreatorDashboard user={user} /> : <AuthPage />;
}
