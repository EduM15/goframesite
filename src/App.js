import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendEmailVerification, updatePassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, serverTimestamp, collection, query, where, getDocs, addDoc, updateDoc } from 'firebase/firestore';

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
const LoginPage = ({ navigateToSignUp }) => { /* ...código da página de login... */ return (<div>Login...</div>); };
const SignUpPage = ({ navigateToLogin, navigateToTerms }) => { /* ...código da página de cadastro... */ return (<div>Cadastro...</div>); };
const TermsPage = ({ navigateBack }) => { /* ...código da página de termos... */ return (<div>Termos...</div>); };


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
            case 'overview': return <DashboardOverview creatorData={creatorData} setActivePage={setActivePage} />;
            case 'events': return <EventsPage user={user} />;
            case 'upload': return <UploadPage user={user} />;
            case 'finance': return <PlaceholderPage title="Financeiro" />;
            case 'account': return <AccountPage user={user} creatorData={creatorData} />;
            default: return <DashboardOverview creatorData={creatorData} setActivePage={setActivePage} />;
        }
    };

    return (
        <div className="flex bg-[#121212] text-white min-h-screen" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <Sidebar activePage={activePage} setActivePage={setActivePage} handleSignOut={handleSignOut} />
            <main className="flex-grow p-10 ml-[250px] w-full">{renderPage()}</main>
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

const DashboardOverview = ({ creatorData, setActivePage }) => { /* ...código da Visão Geral... */ return (<div>Visão Geral...</div>) };
const EventsPage = ({ user }) => { /* ...código da página de Eventos... */ return (<div>Meus Eventos...</div>) };
const AccountPage = ({ user, creatorData }) => { /* ...código da página Minha Conta... */ return (<div>Minha Conta...</div>) };
const PlaceholderPage = ({ title }) => (
    <div>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-6xl m-0 tracking-wider mb-4">{title}</h1>
        <div className="bg-[#1e1e1e] p-8 rounded-lg text-center">
            <p className="text-xl text-[#B3B3B3]">Esta página está em construção.</p>
        </div>
    </div>
);

const UploadPage = ({ user }) => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState('');
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            const q = query(collection(db, "events"), where("creatorId", "==", user.uid));
            const querySnapshot = await getDocs(q);
            const eventsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setEvents(eventsList);
            if (eventsList.length > 0) {
                setSelectedEvent(eventsList[0].id);
            }
        };
        fetchEvents();
    }, [user]);

    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const newFiles = selectedFiles.map(file => ({
            file,
            id: `${file.name}-${file.lastModified}`,
            progress: 0,
            status: 'Aguardando'
        }));
        setFiles(prev => [...prev, ...newFiles]);
    };

    const handleDragEvents = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFiles = Array.from(e.dataTransfer.files);
            const newFiles = droppedFiles.map(file => ({
                file,
                id: `${file.name}-${file.lastModified}`,
                progress: 0,
                status: 'Aguardando'
            }));
            setFiles(prev => [...prev, ...newFiles]);
            e.dataTransfer.clearData();
        }
    };

    return (
        <div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-6xl m-0 tracking-wider mb-8">Upload de Mídia</h1>
            <div className="bg-[#1e1e1e] p-8 rounded-lg">
                <div className="flex items-center gap-4 mb-8">
                    <label htmlFor="event" className="text-lg flex-shrink-0">Selecione o Evento:</label>
                    <select id="event" value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)} className="flex-grow p-3 bg-[#121212] border border-[#333] rounded-md text-white text-base">
                        {events.map(event => <option key={event.id} value={event.id}>{event.name}</option>)}
                    </select>
                    <button className="bg-[#FF4500] text-white font-bold py-3 px-5 rounded-lg hover:bg-[#e03e00] transition-colors">+ Criar Novo Evento</button>
                </div>
                
                <div 
                    onDragEnter={handleDragEvents}
                    onDragOver={handleDragEvents}
                    onDragLeave={handleDragEvents}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed  rounded-lg p-12 text-center transition-colors cursor-pointer ${isDragging ? 'border-[#FF4500] bg-[#2a2a2a]' : 'border-[#333]'}`}
                    onClick={() => document.getElementById('fileInput').click()}
                >
                    <input type="file" id="fileInput" multiple onChange={handleFileSelect} className="hidden" />
                    <p className="text-2xl text-[#B3B3B3]">Arraste e solte seus arquivos aqui</p>
                    <p className="text-lg text-[#B3B3B3]">ou <span className="text-[#FF4500] font-bold">clique para selecionar</span></p>
                </div>

                <div className="mt-8 space-y-4">
                    {files.map(fileWrapper => (
                        <div key={fileWrapper.id} className="flex items-center bg-[#121212] p-4 rounded-md">
                            <div className="w-12 h-12 bg-gray-500 rounded-md mr-4 flex-shrink-0"></div>
                            <div className="flex-grow">
                                <p className="font-semibold">{fileWrapper.file.name}</p>
                                <p className="text-sm text-gray-400">{(fileWrapper.file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <div className="w-40 mx-4">
                                <div className="w-full bg-[#333] rounded-full h-2.5">
                                    <div className="bg-[#FF4500] h-2.5 rounded-full" style={{ width: `${fileWrapper.progress}%` }}></div>
                                </div>
                            </div>
                            <p className="w-24 text-center text-gray-400">{fileWrapper.status}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

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
