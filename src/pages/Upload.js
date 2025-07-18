import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../hooks/useAuth';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, getDownloadURL } from "firebase/storage";
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
            <div className="flex-shrink-0 bg-surface p-2 rounded-md"><Icon path={file.file.type?.startsWith('video/') ? mdiVideoOutline : mdiFileImageOutline} size={1.5} className="text-text-secondary" /></div>
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
        if (!selectedEvent || filesToUpload.length === 0 || !user) return;
        setIsUploading(true);
        
        const uploadPromises = filesToUpload.map(queueItem => {
            const { file } = queueItem;
            // Define o status inicial para 'obtendo URL'
            setFiles(prev => prev.map(f => f.id === queueItem.id ? { ...f, status: 'obtendo url...' } : f));

            // 1. Pedir a URL assinada para a nossa API
            return fetch('/api/generate-upload-url', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileName: file.name, fileType: file.type, creatorId: user.uid, eventId: selectedEvent }),
            })
            .then(res => {
                if(!res.ok) {
                    throw new Error('Falha ao obter URL de upload do servidor.');
                }
                return res.json();
            })
            .then(async ({ signedUrl, filePath }) => {
                if (!signedUrl) throw new Error('URL de upload não foi gerada.');
                
                setFiles(prev => prev.map(f => f.id === queueItem.id ? { ...f, status: 'enviando...', progress: 50 } : f));
                
                // 2. Enviar o arquivo diretamente para a URL assinada do Google Storage
                await fetch(signedUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
                
                // 3. Salvar os metadados no Firestore
                const storageRef = ref(storage, filePath);
                const downloadURL = await getDownloadURL(storageRef);
                await addDoc(collection(db, "media"), { eventId: selectedEvent, creatorId: user.uid, fileName: file.name, fileType: file.type, fileSize: file.size, storagePath: filePath, downloadURL, status: 'processing', createdAt: serverTimestamp() });

                setFiles(prev => prev.map(f => f.id === queueItem.id ? { ...f, progress: 100, status: 'sucesso' } : f));
            })
            .catch(error => {
                console.error("Erro no processo de upload:", error);
                setFiles(prev => prev.map(f => f.id === queueItem.id ? { ...f, status: 'erro', error: error.message || 'Falha crítica' } : f));
            });
        });

        try { await Promise.all(uploadPromises); }
        finally { setIsUploading(false); }
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

export default Upload;