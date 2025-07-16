import React from 'react';
import Modal from './Modal';
import Button from './ui/Button';
import { useCart } from '../contexts/CartContext';
import Icon from '@mdi/react';
import { mdiCartPlus, mdiCheck } from '@mdi/js';

const MediaViewerModal = ({ media, onClose }) => {
  const { addToCart, isItemInCart } = useCart();
  const isInCart = isItemInCart(media.id);

  if (!media) return null;

  return (
    <Modal isOpen={!!media} onClose={onClose} title={media.type === 'video' ? 'Visualizador de Vídeo' : 'Visualizador de Foto'}>
      <div>
        <div className="bg-background rounded-lg mb-4">
          <img 
            src={media.imageUrl} 
            alt={`Visualização da mídia ${media.id}`}
            className="max-h-[70vh] w-full object-contain"
          />
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-2xl font-bold text-primary">R$ {media.price.toFixed(2).replace('.', ',')}</p>
            <p className="text-sm text-text-secondary">Por: {media.creatorName}</p>
          </div>
          <Button onClick={() => addToCart(media)} disabled={isInCart}>
            <Icon path={isInCart ? mdiCheck : mdiCartPlus} size={1} />
            {isInCart ? 'Adicionado' : 'Adicionar ao Carrinho'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default MediaViewerModal;