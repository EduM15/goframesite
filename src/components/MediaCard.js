import React from 'react';
import { useCart } from '../contexts/CartContext'; // Importar o hook do carrinho
import Icon from '@mdi/react';
import { mdiPlayCircle, mdiCheck } from '@mdi/js';

const MediaCard = ({ media }) => {
  const { addToCart, removeFromCart, isItemInCart } = useCart();
  const isInCart = isItemInCart(media.id);

  const handleToggleCart = () => {
    if (isInCart) {
      removeFromCart(media.id);
    } else {
      addToCart(media);
    }
  };

  return (
    <div className="group bg-surface rounded-lg overflow-hidden relative cursor-pointer" onClick={handleToggleCart}>
      <img
        src={media.imageUrl}
        alt={`Mídia do evento ${media.id}`}
        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <p className="text-xl font-bold text-white">R$ {media.price.toFixed(2).replace('.', ',')}</p>
        <p className="text-sm text-text-secondary">Por: {media.creatorName}</p>
      </div>

      {media.type === 'video' && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Icon path={mdiPlayCircle} size={3} className="text-primary bg-white/20 rounded-full" />
        </div>
      )}

      <div className={`absolute top-3 right-3 w-7 h-7 rounded-md border-2 border-white flex items-center justify-center transition-all duration-200 ${isInCart ? 'bg-primary border-primary' : 'bg-black/50'}`}>
        {isInCart && <Icon path={mdiCheck} size={1} className="text-white" />}
      </div>
    </div>
  );
};

export default MediaCard;