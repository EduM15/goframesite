import React, { useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendEmailVerification, updatePassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, serverTimestamp, collection, query, where, getDocs, addDoc } from 'firebase/firestore';

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
// FUNÇÕES UTILITÁRIAS
// ==================================================================================
const validateEmail = (email) => {
  const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return re.test(String(email).toLowerCase());
};

const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 3) return `(${phoneNumber}`;
    if (phoneNumberLength < 8) return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 7)}-${phoneNumber.slice(7, 11)}`;
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
    const [page, setPage] = useState('login');
    const navigate = (targetPage) => setPage(targetPage);
    switch (page) {
        case 'signup': return <SignUpPage navigateToLogin={() => navigate('login')} navigateToTerms={() => navigate('terms')} />;
        case 'terms': return <TermsPage navigateBack={() => navigate('signup')} />;
        default: return <LoginPage navigateToSignUp={() => navigate('signup')} />;
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
        if (id === 'email') setEmailError(value && !validateEmail(value) ? 'Por favor, insira um formato de e-mail válido.' : '');
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
        e.target.value = formatPhoneNumber(e.target.value);
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
            setTimeout(() => { setIsLoading(false); navigateToLogin(); }, 2000);
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
                <div className="prose prose-invert max-w-none h-96 overflow-y-auto pr-4 text-[#B3B3B3]"><h2 className="text-xl font-bold text-white">1. Visão Geral</h2><p>Este é um texto de exemplo...</p></div>
                <div className="text-center mt-8"><button onClick={navigateBack} className="p-4 w-full max-w-xs bg-[#FF4500] text-white rounded-md text-lg font-bold cursor-pointer transition-all hover:bg-[#e03e00]">Entendi, voltar</button></div>
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
            case 'events': return <EventsPage user={user} />;
            case 'upload': return <PlaceholderPage title="Upload de Mídia" />;
            case 'finance': return <PlaceholderPage title="Financeiro" />;
            case 'account': return <AccountPage user={user} creatorData={creatorData} />;
            default: return <DashboardOverview creatorData={creatorData} />;
        }
    };

    return (
        <div className="flex bg-[#121212] text-white min-h-screen" style={{ fontFamily: "'Poppins', sans-serif" }}>
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

const DashboardOverview = ({ creatorData }) => { /* ...código da Visão Geral... */ return (<div>Visão Geral...</div>) };
const EventsPage = ({ user }) => {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchEvents = async () => {
        setIsLoading(true);
        const q = query(collection(db, "events"), where("creatorId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const eventsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEvents(eventsList);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchEvents();
    }, [user]);

    const handleEventCreated = () => {
        fetchEvents(); // Re-busca os eventos após um novo ser criado
        setIsModalOpen(false);
    };

    return (
        <div>
            {isModalOpen && <CreateEventModal user={user} onClose={() => setIsModalOpen(false)} onEventCreated={handleEventCreated} />}
            <div className="flex justify-between items-center mb-8">
                <h1 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-6xl m-0 tracking-wider">Meus Eventos</h1>
                <button onClick={() => setIsModalOpen(true)} className="bg-[#FF4500] text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-[#e03e00] transition-colors"><svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" /></svg>Criar Novo Evento</button>
            </div>
            <div className="bg-[#1e1e1e] p-8 rounded-lg">
                {isLoading ? <p>Carregando eventos...</p> : (
                <table className="w-full text-left">
                    <thead>
                        <tr>
                            <th className="p-4 text-sm font-semibold text-[#B3B3B3] uppercase">Nome do Evento</th>
                            <th className="p-4 text-sm font-semibold text-[#B3B3B3] uppercase">Data</th>
                            <th className="p-4 text-sm font-semibold text-[#B3B3B3] uppercase">Status</th>
                            <th className="p-4 text-sm font-semibold text-[#B3B3B3] uppercase">Ações</th>
                        </tr>
                    </thead>
                    <tbody>{events.length > 0 ? events.map((event) => (
                        <tr key={event.id} className="border-t border-[#333] hover:bg-[#2a2a2a]">
                            <td className="p-4">{event.name}</td>
                            <td className="p-4">{new Date(event.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                            <td className="p-4"><span className={`px-3 py-1 text-xs font-bold rounded-full bg-green-500 text-white`}>Ativo</span></td>
                            <td className="p-4 flex gap-2">{/* Action buttons here */}</td>
                        </tr>
                    )) : <tr><td colSpan="4" className="text-center p-8 text-gray-500">Nenhum evento criado ainda.</td></tr>}</tbody>
                </table>
                )}
            </div>
        </div>
    );
};

const CreateEventModal = ({ user, onClose, onEventCreated }) => {
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!eventName || !eventDate) {
            setError('Por favor, preencha todos os campos.');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            await addDoc(collection(db, "events"), {
                creatorId: user.uid,
                name: eventName,
                date: eventDate,
                status: 'active',
                createdAt: serverTimestamp()
            });
            onEventCreated();
        } catch (err) {
            console.error("Erro ao criar evento:", err);
            setError('Ocorreu um erro ao criar o evento.');
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-[#1e1e1e] p-8 rounded-lg w-full max-w-md">
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-3xl tracking-wider text-[#FF4500] mt-0 mb-6">Criar Novo Evento</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-[#B3B3B3] mb-2">Nome do Evento</label>
                        <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} className="w-full p-3 bg-[#121212] border border-[#333] rounded-md"/>
                    </div>
                    <div>
                        <label className="block text-sm text-[#B3B3B3] mb-2">Data do Evento</label>
                        <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="w-full p-3 bg-[#121212] border border-[#333] rounded-md"/>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg">Cancelar</button>
                        <button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50">{isLoading ? 'Salvando...' : 'Salvar'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AccountPage = ({ user, creatorData }) => {
    const [accountData, setAccountData] = useState(creatorData);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setAccountData(prev => ({ ...prev, [id]: value }));
    };

    const handleWhatsAppChange = (e) => {
        e.target.value = formatPhoneNumber(e.target.value);
        handleChange(e);
    };

    return (
        <div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-6xl m-0 tracking-wider mb-8">Minha Conta</h1>
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="bg-[#1e1e1e] p-8 rounded-lg">
                    <h2 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-3xl tracking-wider text-[#FF4500] mt-0 mb-6">Informações Pessoais</h2>
                    <form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label className="block text-sm text-[#B3B3B3] mb-2">Nome Completo</label><input id="fullname" type="text" value={accountData.fullname} onChange={handleChange} className="w-full p-3 bg-[#121212] border border-[#333] rounded-md"/></div>
                            <div><label className="block text-sm text-[#B3B3B3] mb-2">Apelido / Nome de Exibição</label><input id="nickname" type="text" value={accountData.nickname} onChange={handleChange} className="w-full p-3 bg-[#121212] border border-[#333] rounded-md"/></div>
                            <div><label className="block text-sm text-[#B3B3B3] mb-2">E-mail</label><input type="email" value={accountData.email} readOnly className="w-full p-3 bg-[#2a2a2a] border border-[#333] rounded-md text-gray-400 cursor-not-allowed"/></div>
                            <div><label className="block text-sm text-[#B3B3B3] mb-2">WhatsApp</label><input id="whatsapp" type="tel" value={accountData.whatsapp} onChange={handleWhatsAppChange} className="w-full p-3 bg-[#121212] border border-[#333] rounded-md"/></div>
                        </div>
                        <div className="text-right pt-4"><button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg">Salvar</button></div>
                    </form>
                </div>
                {/* ... outros formulários ... */}
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
        const link1 = document.createElement('link'); link1.rel = 'preconnect'; link1.href = 'https://fonts.googleapis.com';
        const link2 = document.createElement('link'); link2.rel = 'preconnect'; link2.href = 'https://fonts.gstatic.com'; link2.crossOrigin = 'true';
        const link3 = document.createElement('link'); link3.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Poppins:wght@400;700&display=swap'; link3.rel = 'stylesheet';
        document.head.appendChild(link1); document.head.appendChild(link2); document.head.appendChild(link3);
    }, []);

  if (loading) { return <div className="bg-[#121212] text-white flex justify-center items-center min-h-screen">Carregando...</div>; }

  return user ? <CreatorDashboard user={user} /> : <AuthPage />;
}
