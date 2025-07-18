import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  const imageUrl = event.thumbnailUrl || 'https://images.pexels.com/photos/1162963/pexels-photo-1162963.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';

  return (
    <Link 
      to={`/event/${event.id}`} 
      className="block bg-surface rounded-lg overflow-hidden text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20"
    >
      <img 
        src={imageUrl} 
        alt={`Capa do evento ${event.name}`}
        className="w-full h-48 object-cover" 
      />
      <div className="p-5">
        {/* CORREÇÃO: Fonte do título alterada */}
        <h3 className="font-bebas-neue text-2xl text-text-main truncate" title={event.name}>{event.name}</h3>
        <p className="text-sm text-text-secondary">
          {new Date(event.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
        </p>
        {event.creatorNickname && (
          <p className="text-sm text-primary font-semibold mt-2">
            Por: {event.creatorNickname}
          </p>
        )}
      </div>
    </Link>
  );
};

export default EventCard;