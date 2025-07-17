import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../hooks/useAuth';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from '../config/firebase';

import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Icon from '@mdi/react';
import { mdiUpload, mdiFileCheck, mdiAlertCircle, mdiFileImageOutline, mdiVideoOutline, mdiCloseCircle } from '@mdi/js';

// ... (Componente FileQueueItem não precisa de alterações)
const FileQueueItem = ({ file, onRemove }) => { /* ...código existente... */ };


const Upload = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState('');
    const [files, setFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, "events"), where("creatorId", "==", user.uid), orderBy("createdAt", "desc"));
        const unsub = onSnapshot(q, (snap) => {
            const eventsData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setEvents(eventsData);
            if (eventsData.length > 0 && !selectedEvent) {
                setSelectedEvent(eventsData[0].id);
            }
        });
        return unsub;
    }, [user, selectedEvent]);

    const onDrop = useCallback((accepted, rejected) => { /* ...código existente... */ }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/jpeg': [], 'image/png': [], 'video/mp4': [] } });
    
    const handleRemoveFile = (fileToRemove) => setFiles(prev => prev.filter(f => f.id !== fileToRemove.id));

    const handleUpload = async () => {
        const filesToUpload = files.filter(f => f.status === 'pending');
        console.log('[DIAGNÓSTICO] Clicou em Iniciar Upload. Arquivos pendentes:', filesToUpload.length);
        if (!selectedEvent || filesToUpload.length === 0 || !user) {
            console.log('[DIAGNÓSTICO] Upload abortado: sem evento selecionado ou sem arquivos.');
            return;
        }

        setIsUploading(true);

        const uploadPromises = filesToUpload.map(queueItem => {
            return new Promise((resolve, reject) => {
                const { file } = queueItem;
                const storagePath = `media/${user.uid}/${selectedEvent}/${Date.now()}-${file.name}`;
                console.log(`[DIAGNÓSTICO] Preparando para enviar: ${file.name} para ${storagePath}`);
                const storageRef = ref(storage, storagePath);
                const uploadTask = uploadBytesResumable(storageRef, file);

                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log(`[DIAGNÓSTICO] Progresso de ${file.name}: ${progress.toFixed(2)}%`);
                        setFiles(prev => prev.map(f => f.id === queueItem.id ? { ...f, progress, status: 'uploading' } : f));
                    },
                    (error) => {
                        console.error(`[DIAGNÓSTICO] ERRO no upload de ${file.name}:`, error.code, error.message);
                        let errorMessage = 'Falha no upload';
                        switch (error.code) {
                            case 'storage/unauthorized': errorMessage = 'Permissão negada no Storage.'; break;
                            case 'storage/canceled': errorMessage = 'Upload cancelado.'; break;
                            case 'storage/unknown': errorMessage = 'Erro desconhecido no Storage.'; break;
                        }
                        setFiles(prev => prev.map(f => f.id === queueItem.id ? { ...f, status: 'error', error: errorMessage } : f));
                        reject(error);
                    },
                    async () => {
                        console.log(`[DIAGNÓSTICO] Sucesso no upload de ${file.name} para o Storage. Obtendo URL...`);
                        try {
                            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            console.log(`[DIAGNÓSTICO] URL obtida. Salvando metadados no Firestore...`);
                            await addDoc(collection(db, "media"), {
                                eventId: selectedEvent, creatorId: user.uid, fileName: file.name,
                                fileType: file.type, fileSize: file.size, storagePath,
                                downloadURL, status: 'processing', createdAt: serverTimestamp(),
                            });
                            console.log(`[DIAGNÓSTICO] Metadados de ${file.name} salvos no Firestore.`);
                            setFiles(prev => prev.map(f => f.id === queueItem.id ? { ...f, progress: 100, status: 'success' } : f));
                            resolve();
                        } catch (dbError) {
                            console.error(`[DIAGNÓSTICO] ERRO ao salvar ${file.name} no Firestore:`, dbError);
                            setFiles(prev => prev.map(f => f.id === queueItem.id ? { ...f, status: 'error', error: 'Falha ao salvar dados' } : f));
                            reject(dbError);
                        }
                    }
                );
            });
        });
        try {
            await Promise.allSettled(uploadPromises);
            console.log('[DIAGNÓSTICO] Todos os uploads foram processados.');
        } finally {
            setIsUploading(false);
            console.log('[DIAGNÓSTICO] Estado de "isUploading" definido como false.');
        }
    };

    return (
        // O JSX da página permanece o mesmo
        <div>
            {/* ...código JSX existente... */}
        </div>
    );
};

// Cole o JSX completo do retorno e o componente FileQueueItem da minha resposta anterior aqui.
// O código é muito longo, mas a única alteração necessária é na função handleUpload.