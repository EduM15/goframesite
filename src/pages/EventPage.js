import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MediaCard from '../components/MediaCard';
import MediaViewerModal from '../components/MediaViewerModal'; // Importar o novo modal
import Icon from '@mdi/react';
import { mdiViewGrid, mdiViewGridCompact } from '@mdi/js';

// ... (MOCK_EVENT_DATA continua o mesmo de antes)
const MOCK_EVENT_DATA = { /* ... */ };

const EventPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [filter, setFilter] = useState('all');
  const [viewingMedia, setViewingMedia] = useState(null); // Estado para controlar o modal
  const [viewMode, setViewMode] = useState('large'); // 'large' ou 'compact'

  useEffect(() => {
    setEvent(MOCK_EVENT_DATA[eventId] || null);
  }, [eventId]);

  const filteredMedia = event?.media.filter(m => (filter === 'all' ? true : m.type === filter));

  if (!event) { return <div className="text-center p-10"><h1>Evento não encontrado.</h1></div>; }

  const gridClasses = {
    large: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    compact: 'grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
  };

  return (
    <div>
      {/* Banner do Evento (sem alteração) */}
      <section 
        className="text-center p-10 bg-cover bg-center" 
        style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${event.bannerUrl})`}}
      >
        <h1 className="font-bebas-neue text-6xl">{event.name}</h1>
        <p className="text-text-secondary text-xl">{event.date}</p>
      </section>

      {/* Barra de Ferramentas com novos controles */}
      <div className="bg-background py-3 px-5 border-b border-surface sticky top-[88px] z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex gap-2">
            {/* Botões de Filtro */}
          </div>
          <div className="flex gap-2">
            <button title="Visão Ampla" onClick={() => setViewMode('large')} className={`p-2 rounded-md ${viewMode === 'large' ? 'bg-primary text-white' : 'bg-surface text-text-secondary'}`}>
              <Icon path={mdiViewGrid} size={1} />
            </button>
            <button title="Visão Compacta" onClick={() => setViewMode('compact')} className={`p-2 rounded-md ${viewMode === 'compact' ? 'bg-primary text-white' : 'bg-surface text-text-secondary'}`}>
              <Icon path={mdiViewGridCompact} size={1} />
            </button>
          </div>
        </div>
      </div>

      {/* Grade de Mídias */}
      <main className="p-8">
        <div className={`container mx-auto grid ${gridClasses[viewMode]} gap-6`}>
          {filteredMedia?.map(media => (
            <MediaCard key={media.id} media={media} onImageClick={setViewingMedia} />
          ))}
        </div>
      </main>

      {/* O Modal de Visualização */}
      {viewingMedia && (
        <MediaViewerModal 
          media={viewingMedia} 
          onClose={() => setViewingMedia(null)}
        />
      )}
    </div>
  );
};
// Adicione a definição de MOCK_EVENT_DATA aqui se ela não estiver no escopo.
// const MOCK_EVENT_DATA = { 'trilha-do-desafio': { ... } };

export default EventPage;