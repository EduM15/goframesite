import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
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

  // Busca os eventos do Firestore
  useEffect(() => {
    const q = query(
      collection(db, "events"), 
      orderBy("date", "desc"), // Ordena pelos mais recentes
      limit(60) // Limita a 60 eventos (3 colunas x 20 linhas)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(eventsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filtra os eventos com base no termo de busca
  const filteredEvents = events.filter(event => 
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <section className="relative h-[75vh] flex justify-center items-center text-center overflow-hidden">
        {/* ... (vídeo de fundo) ... */}
        <div className="z-10 text-white px-4">
          <h1 className="font-bebas-neue text-6xl md:text-8xl tracking-wider">REVIVA A EMOÇÃO DA TRILHA</h1>
          <p className="text-lg md:text-xl text-text-secondary mb-8">Encontre os vídeos e fotos da sua aventura.</p>
          <div className="flex justify-center max-w-2xl mx-auto">
            <Input 
              type="text"
              placeholder="Digite o nome do evento..."
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
              {filteredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;