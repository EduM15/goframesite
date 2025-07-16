import React, { useState } from 'react';
import Icon from '@mdi/react';
import { mdiPlayCircle } from '@mdi/js';

const MediaCard = ({ media }) => {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <div className="group bg-surface rounded-lg overflow-hidden relative cursor-pointer" onClick={() => setIsSelected(!isSelected)}>
      <img
        src={media.imageUrl}
        alt={`Mídia do evento ${media.id}`}
        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
      />
      
      {/* Overlay que aparece no hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <p className="text-xl font-bold text-white">R$ {media.price.toFixed(2).replace('.', ',')}</p>
        <p className="text-sm text-text-secondary">Por: {media.creatorName}</p>
      </div>

      {/* Ícone de Play para vídeos */}
      {media.type === 'video' && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Icon path={mdiPlayCircle} size={3} className="text-primary bg-white/20 rounded-full" />
        </div>
      )}

      {/* Checkbox de Seleção */}
      <div className={`absolute top-3 right-3 w-6 h-6 rounded-md border-2 border-white transition-all duration-200 ${isSelected ? 'bg-primary border-primary' : 'bg-black/50'}`}>
        {isSelected && (
          <svg className="w-full h-full text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
    </div>
  );
};

export default MediaCard;