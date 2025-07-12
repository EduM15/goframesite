// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuração do Firebase com as credenciais fornecidas.
const firebaseConfig = {
  apiKey: "AIzaSyDVj1Pg-51DgCNwi_jPckKwHRHzbXz0z9E",
  authDomain: "goframesite.firebaseapp.com",
  projectId: "goframesite",
  storageBucket: "goframesite.appspot.com", // Corrigido para o formato padrão.
  messagingSenderId: "784091952713",
  appId: "1:784091952713:web:0eec3d538b5ea1c2633198",
  measurementId: "G-ZRR14VB8T4"
};

// NOTA DE SEGURANÇA: Estas chaves são visíveis no lado do cliente.
// Para produção, o ideal é usar as Regras de Segurança do Firebase para proteger
// seus dados e, se necessário, utilizar environment variables com prefixo REACT_APP_
// para maior segurança e flexibilidade entre ambientes.

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };