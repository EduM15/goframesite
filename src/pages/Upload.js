import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../hooks/useAuth';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Icon from '@mdi/react';
import { mdiUpload, mdiFileCheck, mdiAlertCircle, mdiFileImageOutline, mdiVideoOutline } from '@mdi/js';

// Componente para um único item na fila de upload
const FileQueueItem = ({ file, progress, status }) => {
    const isError = status === 'error';
    const isSuccess = status === 'success';

    return (
        <div className={`flex items-center bg-background p-3 rounded-lg gap-4 ${isError ? 'border border-danger' : ''}`}>
            <div className="flex-shrink-0 bg-surface p-2 rounded-md">
                <Icon path={file.type.startsWith('video/') ? mdiVideoOutline : mdiFileImageOutline} size={1.5} className="text-text-secondary" />
            </div>
            <div className="flex-grow overflow-hidden">
                <p className="truncate font-semibold">{file.name}</p>
                <p className="text-sm text-text-secondary">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <div className="w-1/3 mx-4">
                {!isError && (
                    <div className="w-full bg-surface rounded-full h-2.5">
                        <div 
                            className={`h-2.5 rounded-full transition-all duration-300 ${isSuccess ? 'bg-success' : 'bg-primary'}`} 
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                )}
            </div>
            <div className="w-24 text-right flex items-center justify-end gap-2">
                {isSuccess && <Icon path={mdiFileCheck} size={1} className="text-success" />}
                {isError && <Icon path={mdiAlertCircle} size={1} className="text-danger" />}
                <span className={`${isSuccess ? 'text-success' : ''} ${isError ? 'text-danger' : 'text-text-secondary'}`}>
                    {status}
                </span>
            </div>
        </div>
    );
};


const Upload = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState('');
    const [files, setFiles] = useState([]);

    // Busca os eventos do criador para popular o seletor
    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, "events"), where("creatorId", "==", user.uid), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const eventsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setEvents(eventsData);
            if (eventsData.length > 0) {
                setSelectedEvent(eventsData[0].id); // Seleciona o evento mais recente por padrão
            }
        });
        return () => unsubscribe();
    }, [user]);

    // Lógica do Dropzone
    const onDrop = useCallback((acceptedFiles) => {
        const preparedFiles = acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file),
            progress: 0,
            status: 'pending'
        }));
        setFiles(prev => [...prev, ...preparedFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.png', '.jpg'], 'video/*': ['.mp4'] }
    });
    
    // NOTA: A lógica de upload real para o Firebase Storage será implementada em uma fase futura.
    // Por enquanto, este componente simula o processo.
    const handleUpload = () => {
        if (files.length === 0 || !selectedEvent) {
            alert("Selecione um evento e ao menos um arquivo.");
            return;
        }
        
        // Simulação de Upload
        files.forEach((file, index) => {
            if(file.status !== 'pending') return;

            // Simula o progresso do upload
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                setFiles(prev => prev.map((f, i) => i === index ? { ...f, progress } : f));
                if (progress >= 100) {
                    clearInterval(interval);
                    // Simula o sucesso do upload
                    setFiles(prev => prev.map((f, i) => i === index ? { ...f, status: 'success' } : f));
                }
            }, 200);
        });
    };

    return (
        <div>
            <h1 className="text-4xl font-bold mb-6 font-bebas-neue text-primary">Upload de Mídia</h1>
            <Card>
                <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-gray-700">
                    <label htmlFor="event" className="font-semibold text-lg">Selecione o Evento:</label>
                    <select 
                        id="event"
                        value={selectedEvent}
                        onChange={(e) => setSelectedEvent(e.target.value)}
                        className="flex-grow bg-surface border border-gray-600 rounded-lg p-3 focus:ring-primary focus:border-primary"
                    >
                        {events.length === 0 && <option>Nenhum evento criado</option>}
                        {events.map(event => (
                            <option key={event.id} value={event.id}>{event.name}</option>
                        ))}
                    </select>
                </div>

                <div 
                    {...getRootProps()} 
                    className={`p-10 text-center border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300
                        ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-600 hover:border-primary'}`}
                >
                    <input {...getInputProps()} />
                    <Icon path={mdiUpload} size={3} className="mx-auto text-text-secondary" />
                    <p className="mt-4 text-xl">Arraste e solte seus arquivos de vídeo e foto aqui</p>
                    <p className="text-text-secondary">ou <span className="text-primary font-semibold">clique para selecionar</span></p>
                    <p className="text-xs text-text-secondary mt-2">Suporte para: JPG, PNG, MP4</p>
                </div>

                {files.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-xl font-bebas-neue text-primary mb-4">Fila de Upload</h3>
                        <div className="space-y-3">
                            {files.map((file, index) => (
                                <FileQueueItem key={index} file={file} progress={file.progress} status={file.status} />
                            ))}
                        </div>
                        <div className="flex justify-end mt-6">
                            <Button onClick={handleUpload}>Iniciar Upload de {files.filter(f => f.status === 'pending').length} Arquivos</Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default Upload;