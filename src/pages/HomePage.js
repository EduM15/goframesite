import React from 'react';
import EventCard from '../components/EventCard';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Icon from '@mdi/react'; // Importação da nova biblioteca de ícones
import { mdiMagnify } from '@mdi/js'; // Importação do ícone de busca

// NOTA: Estes dados são estáticos (mock). Em uma fase futura, eles serão carregados do Firestore.
const recentEvents = [
  { id: 'trilha-do-desafio', title: 'Trilha do Desafio - Serra Azul', date: '29 de Junho, 2025', imageUrl: 'https://images.pexels.com/photos/1162963/pexels-photo-1162963.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 'enduro-das-cachoeiras', title: 'Enduro das Cachoeiras', date: '15 de Junho, 2025', imageUrl: 'https://images.pexels.com/photos/259695/pexels-photo-259695.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 'king-of-the-hill', title: 'King of The Hill', date: '01 de Junho, 2025', imageUrl: 'https://images.pexels.com/photos/1039083/pexels-photo-1039083.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
];

const HomePage = () => {
  return (
    <div>
      {/* Seção Hero */}
      <section className="relative h-[75vh] flex justify-center items-center text-center overflow-hidden">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          id="bg-video"
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover"
        >
          <source src="https://www.coverr.co/s3_videos/mp4/Motorbike.mp4" type="video/mp4" />
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-0"></div>
        <div className="z-10 text-white px-4">
          <h1 className="font-bebas-neue text-6xl md:text-8xl tracking-wider">REVIVA A EMOÇÃO DA TRILHA</h1>
          <p className="text-lg md:text-xl text-text-secondary mb-8">Encontre os vídeos e fotos da sua aventura.</p>
          <form className="flex justify-center max-w-2xl mx-auto">
            <Input 
              type="text"
              placeholder="Digite o nome ou data do evento..."
              className="rounded-r-none border-r-0"
            />
            <Button type="submit" variant="primary" className="rounded-l-none">
              <Icon path={mdiMagnify} size={1} />
              <span className="hidden md:inline ml-2">BUSCAR</span>
            </Button>
          </form>
        </div>
      </section>

      {/* Seção de Eventos */}
      <section className="bg-background py-16 px-5 text-center">
        <div className="container mx-auto">
          <h2 className="font-bebas-neue text-5xl tracking-wider mb-12">Últimos Eventos</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;