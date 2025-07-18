import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import EventCard from '../components/EventCard';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Icon from '@mdi/react';
import { mdiMagnify } from '@mdi/js';

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const eventsQuery = query(
      collection(db, "events"), 
      orderBy("date", "desc"),
      limit(60)
    );

    const unsubscribe = onSnapshot(eventsQuery, async (snapshot) => {
      const eventsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Para cada evento, buscar o apelido do criador
      const eventsWithCreators = await Promise.all(
        eventsData.map(async (event) => {
          if (!event.creatorId) return event;
          const creatorDoc = await getDoc(doc(db, 'creators', event.creatorId));
          const creatorNickname = creatorDoc.exists() ? creatorDoc.data().nickname : 'Anônimo';
          return { ...event, creatorNickname };
        })
      );
      
      setEvents(eventsWithCreators);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredEvents = events.filter(event => 
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.creatorNickname?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <section className="relative h-[75vh] flex justify-center items-center text-center overflow-hidden">
        <video autoPlay muted loop playsInline id="bg-video" className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover">
          <source src="https://www.coverr.co/s3_videos/mp4/Motorbike.mp4" type="video/mp4" />
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-0"></div>
        <div className="z-10 text-white px-4">
          <h1 className="font-bebas-neue text-6xl md:text-8xl tracking-wider">REVIVA A EMOÇÃO DA TRILHA</h1>
          <p className="text-lg md:text-xl text-text-secondary mb-8">Encontre os vídeos e fotos da sua aventura.</p>
          <div className="flex justify-center max-w-2xl mx-auto">
            <Input 
              type="text"
              placeholder="Digite o nome do evento ou criador..."
              className="rounded-r-none border-r-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="button" variant="primary" className="rounded-l-none">
              <Icon path={mdiMagnify} size={1} />
              <span className="hidden md:inline ml-2">BUSCAR</span>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-background py-16 px-5 text-center">
        <div className="container mx-auto">
          <h2 className="font-bebas-neue text-5xl tracking-wider mb-12">Últimos Eventos</h2>
          {loading ? (
            <p className="text-text-secondary">Carregando eventos...</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.length > 0 ? filteredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              )) : (
                <p className="text-text-secondary col-span-full">Nenhum evento encontrado.</p>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;