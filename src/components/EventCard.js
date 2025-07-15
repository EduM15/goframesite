import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  return (
    <Link 
      to={`/event/${event.id}`} 
      className="block bg-surface rounded-lg overflow-hidden text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20"
    >
      <img 
        src={event.imageUrl} 
        alt={`Capa do evento ${event.title}`}
        className="w-full h-48 object-cover" 
      />
      <div className="p-5">
        <h3 className="text-xl font-bold text-text-main">{event.title}</h3>
        <p className="text-text-secondary">{event.date}</p>
      </div>
    </Link>
  );
};

export default EventCard;