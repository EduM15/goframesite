import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MediaCard from '../components/MediaCard';
import Button from '../components/ui/Button';

// DADOS MOCK: Simula os dados que viriam do Firestore.
const MOCK_EVENT_DATA = {
  'trilha-do-desafio': {
    name: 'Trilha do Desafio - Serra Azul',
    date: '29 de Junho, 2025',
    bannerUrl: 'https://images.pexels.com/photos/1162963/pexels-photo-1162963.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    media: [
      { id: 'vid1', type: 'video', imageUrl: 'https://images.pexels.com/photos/1799236/pexels-photo-1799236.jpeg?auto=compress&cs=tinysrgb&w=600', price: 29.90, creatorName: 'DroneMaster Edu' },
      { id: 'img1', type: 'photo', imageUrl: 'https://images.pexels.com/photos/21014/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600', price: 19.90, creatorName: 'DroneMaster Edu' },
      { id: 'img2', type: 'photo', imageUrl: 'https://images.pexels.com/photos/1200632/pexels-photo-1200632.jpeg?auto=compress&cs=tinysrgb&w=600', price: 19.90, creatorName: 'DroneMaster Edu' },
      { id: 'vid2', type: 'video', imageUrl: 'https://images.pexels.com/photos/3807282/pexels-photo-3807282.jpeg?auto=compress&cs=tinysrgb&w=600', price: 29.90, creatorName: 'DroneMaster Edu' },
      { id: 'img3', type: 'photo', imageUrl: 'https://images.pexels.com/photos/1414643/pexels-photo-1414643.jpeg?auto=compress&cs=tinysrgb&w=600', price: 19.90, creatorName: 'DroneMaster Edu' },
    ]
  }
};

const EventPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'photo', 'video'

  useEffect(() => {
    // Simula a busca de dados do evento
    setEvent(MOCK_EVENT_DATA[eventId] || null);
  }, [eventId]);

  const filteredMedia = event?.media.filter(m => {
    if (filter === 'all') return true;
    return m.type === filter;
  });

  if (!event) {
    return <div className="text-center p-10"><h1>Evento não encontrado.</h1></div>;
  }

  return (
    <div>
      {/* Banner do Evento */}
      <section 
        className="text-center p-10 bg-cover bg-center" 
        style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${event.bannerUrl})`}}
      >
        <h1 className="font-bebas-neue text-6xl">{event.name}</h1>
        <p className="text-text-secondary text-xl">{event.date}</p>
      </section>

      {/* Barra de Ferramentas da Galeria */}
      <div className="bg-background py-3 px-5 border-b border-surface sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex gap-2">
            <Button variant={filter === 'all' ? 'primary' : 'secondary'} onClick={() => setFilter('all')}>Ver Tudo</Button>
            <Button variant={filter === 'video' ? 'primary' : 'secondary'} onClick={() => setFilter('video')}>Apenas Vídeos</Button>
            <Button variant={filter === 'photo' ? 'primary' : 'secondary'} onClick={() => setFilter('photo')}>Apenas Fotos</Button>
          </div>
        </div>
      </div>

      {/* Grade de Mídias */}
      <main className="p-8">
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMedia?.map(media => (
            <MediaCard key={media.id} media={media} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default EventPage;