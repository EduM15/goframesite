import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // <-- 'Link' foi adicionado aqui
import { collection, query, where, onSnapshot, doc, getDoc, orderBy } from 'firebase/firestore'; // <-- 'orderBy' foi adicionado aqui
import { db } from '../config/firebase';

import MediaCard from '../components/MediaCard';
import MediaViewerModal from '../components/MediaViewerModal';
import Button from '../components/ui/Button';
import Icon from '@mdi/react';
import { mdiViewGrid, mdiViewGridCompact } from '@mdi/js';

const EventPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [viewingMedia, setViewingMedia] = useState(null);
  const [viewMode, setViewMode] = useState('large');

  useEffect(() => {
    if (!eventId) return;
    setLoading(true);

    const eventDocRef = doc(db, 'events', eventId);
    getDoc(eventDocRef).then(docSnap => {
      if (docSnap.exists()) {
        setEvent({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.error("No such event!");
        setLoading(false);
      }
    });

    const mediaQuery = query(
      collection(db, "media"), 
      where("eventId", "==", eventId),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(mediaQuery, (snapshot) => {
      const mediaData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMediaItems(mediaData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching media:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [eventId]);

  const filteredMedia = mediaItems.filter(m => {
    if (filter === 'all') return true;
    return m.fileType?.startsWith(filter);
  });

  if (loading) {
    return <div className="text-center p-10"><h1>Carregando evento...</h1></div>;
  }

  if (!event) {
    return <div className="text-center p-10"><h1>Evento não encontrado.</h1></div>;
  }

  const gridClasses = {
    large: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    compact: 'grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
  };

  return (
    <div>
      <section 
        className="text-center p-10 bg-cover bg-center" 
        style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${event.thumbnailUrl || 'https://images.pexels.com/photos/1162963/pexels-photo-1162963.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'})`}}
      >
        <h1 className="font-bebas-neue text-6xl">{event.name}</h1>
        <p className="text-text-secondary text-xl">{new Date(event.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
      </section>

      <div className="bg-background py-3 px-5 border-b border-surface sticky top-[88px] z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex gap-2">
            <Button variant={filter === 'all' ? 'primary' : 'secondary'} onClick={() => setFilter('all')}>Ver Tudo</Button>
            <Button variant={filter === 'video' ? 'primary' : 'secondary'} onClick={() => setFilter('video')}>Apenas Vídeos</Button>
            <Button variant={filter === 'image' ? 'primary' : 'secondary'} onClick={() => setFilter('image')}>Apenas Fotos</Button>
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

      <main className="p-8">
        <div className={`container mx-auto grid ${gridClasses[viewMode]} gap-6`}>
          {filteredMedia.length > 0 ? (
            filteredMedia.map(media => (
              <MediaCard 
                key={media.id} 
                media={{...media, imageUrl: media.downloadURL, price: media.price || 19.90, creatorName: media.creatorNickname || 'GoFrame Creator'}} // Adicionados valores padrão
                onImageClick={setViewingMedia} 
              />
            ))
          ) : (
            <div className="col-span-full text-center text-text-secondary py-10">
              <p className="text-lg">Nenhuma mídia encontrada para este evento.</p>
              <p>Se você é o criador, <Link to="/creator/upload" className="text-primary underline">envie suas mídias agora</Link>.</p>
            </div>
          )}
        </div>
      </main>

      {viewingMedia && (
        <MediaViewerModal 
          media={{...viewingMedia, imageUrl: viewingMedia.downloadURL, price: viewingMedia.price || 19.90, creatorName: viewingMedia.creatorNickname || 'GoFrame Creator'}} // Adicionados valores padrão
          onClose={() => setViewingMedia(null)}
        />
      )}
    </div>
  );
};

export default EventPage;