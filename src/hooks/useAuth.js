import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Usuário está logado. Buscar dados adicionais no Firestore.
        const userDocRef = doc(db, 'creators', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          // Combina os dados de autenticação com os dados do Firestore
          setUser({ ...firebaseUser, ...userDoc.data() });
        } else {
          // Caso o usuário exista na autenticação mas não no Firestore (caso raro)
          setUser(firebaseUser);
        }
      } else {
        // Usuário deslogado
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}