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

const FileQueueItem = ({ file, onRemove }) => {
    const { status, error, progress } = file;
    const isError = status === 'error';
    const isSuccess = status === 'success';
    const canBeRemoved = status === 'pending' || isError;

    return (
        <div className={`flex items-center bg-background p-3 rounded-lg gap-4 ${isError ? 'border border-danger' : ''}`}>
            <div className="flex-shrink-0 bg-surface p-2 rounded-md">
                <Icon path={file.file.type?.startsWith('video/') ? mdiVideoOutline : mdiFileImageOutline} size={1.5} className="text-text-secondary" />
            </div>
            <div className="flex-grow overflow-hidden">
                <p className="truncate font-semibold">{file.file.name}</p>
                <p className="text-sm text-text-secondary">{isError ? error : `${(file.file.size / 1024 / 1024).toFixed(2)} MB`}</p>
            </div>
            <div className="w-1/3 mx-4">
                {!isError && <div className="w-full bg-surface rounded-full h-2.5"><div className={`h-2.5 rounded-full transition-all duration-300 ${isSuccess ? 'bg-success' : 'bg-primary'}`} style={{ width: `${progress || 0}%` }}></div></div>}
            </div>
            <div className="w-32 text-right flex items-center justify-end gap-2">
                {isSuccess && <Icon path={mdiFileCheck} size={1} className="text-success" />}
                {isError && <Icon path={mdiAlertCircle} size={1} className="text-danger" />}
                <span className={`flex-grow text-center ${isSuccess ? 'text-success' : ''} ${isError ? 'text-danger' : 'text-text-secondary'}`}>{status}</span>
                {canBeRemoved && <button onClick={() => onRemove(file)} className="text-text-secondary hover:text-danger" title="Remover da fila"><Icon path={mdiCloseCircle} size={0.9} /></button>}
            </div>
        </div>
    );
};


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

    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
        const uniqueId = () => `file_${Date.now()}_${Math.random()}`;
        const prepared = acceptedFiles.map(f => ({ file: f, id: uniqueId(), progress: 0, status: 'pending' }));
        const preparedRejected = rejectedFiles.map(r => ({ file: r.file, id: uniqueId(), progress: 0, status: 'error', error: 'Tipo de arquivo inválido' }));
        setFiles(prev => [...prev, ...prepared, ...preparedRejected]);
    }, []);

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
                            await addDoc(collection(db, "media"), { eventId: selectedEvent, creatorId: user.uid, fileName: file.name, fileType: file.type, fileSize: file.size, storagePath, downloadURL, status: 'processing', createdAt: serverTimestamp() });
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
        try { await Promise.allSettled(uploadPromises); } finally { setIsUploading(false); console.log('[DIAGNÓSTICO] Todos os uploads foram processados.'); }
    };

    return (
        <div>
            <h1 className="text-4xl font-bold mb-6 font-bebas-neue text-primary">Upload de Mídia</h1>
            <Card>
                <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-gray-700">
                    <label htmlFor="event" className="font-semibold text-lg">Enviar para o Evento:</label>
                    <select id="event" value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)} className="flex-grow bg-surface border border-gray-600 rounded-lg p-3 focus:ring-primary focus:border-primary">
                        {events.length === 0 ? <option>Crie um evento primeiro</option> : events.map(event => <option key={event.id} value={event.id}>{event.name}</option>)}
                    </select>
                </div>
                <div {...getRootProps()} className={`p-10 text-center border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-600 hover:border-primary'}`}>
                    <input {...getInputProps()} />
                    <Icon path={mdiUpload} size={3} className="mx-auto text-text-secondary" />
                    <p className="mt-4 text-xl">Arraste e solte seus arquivos</p>
                    <p className="text-text-secondary">ou <span className="text-primary font-semibold">clique para selecionar</span></p>
                    <p className="text-xs text-text-secondary mt-2">Suporte: JPG, PNG, MP4</p>
                </div>
                {files.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-xl font-bebas-neue text-primary mb-4">Fila de Upload</h3>
                        <div className="space-y-3">
                            {files.map((queueItem) => (
                                <FileQueueItem key={queueItem.id} file={queueItem} onRemove={handleRemoveFile} />
                            ))}
                        </div>
                        <div className="flex justify-end mt-6">
                            <Button onClick={handleUpload} disabled={isUploading || files.filter(f => f.status === 'pending').length === 0}>
                                {isUploading ? 'Enviando...' : `Iniciar Upload de ${files.filter(f => f.status === 'pending').length} Arquivos`}
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default Upload; // <-- A linha que faltava