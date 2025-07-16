import React from 'react';
import { useCart } from '../contexts/CartContext';
import Button from '../components/ui/Button';
import Icon from '@mdi/react';
import { mdiTrashCanOutline } from '@mdi/js';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { cartItems, removeFromCart, cartItemCount } = useCart();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="container mx-auto p-8">
      <h1 className="font-bebas-neue text-6xl text-center mb-12">Carrinho de Compras</h1>

      {cartItemCount === 0 ? (
        <div className="text-center bg-surface p-10 rounded-lg">
          <p className="text-2xl text-text-secondary">Seu carrinho está vazio.</p>
          <Link to="/">
            <Button className="mt-6">Voltar para a Página Inicial</Button>
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Coluna de Itens */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center bg-surface p-4 rounded-lg">
                <img src={item.imageUrl} alt={item.title} className="w-32 h-20 object-cover rounded-md mr-4" />
                <div className="flex-grow">
                  <h3 className="text-lg font-bold">{item.type === 'video' ? 'Vídeo' : 'Foto'} - {item.id}</h3>
                  <p className="text-sm text-text-secondary">Por: {item.creatorName}</p>
                </div>
                <p className="text-lg font-bold mx-6">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                <button onClick={() => removeFromCart(item.id)} className="text-text-secondary hover:text-danger">
                  <Icon path={mdiTrashCanOutline} size={1} />
                </button>
              </div>
            ))}
          </div>

          {/* Coluna de Resumo */}
          <aside className="bg-surface p-6 rounded-lg h-fit sticky top-24">
            <h2 className="font-bebas-neue text-3xl text-center mb-6">Resumo do Pedido</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal ({cartItemCount} {cartItemCount > 1 ? 'itens' : 'item'})</span>
                <span className="font-bold">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxas</span>
                <span className="font-bold">R$ 0,00</span>
              </div>
              <div className="border-t border-gray-700 my-4"></div>
              <div className="flex justify-between text-2xl font-bold">
                <span>Total</span>
                <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
              <Button className="w-full mt-4">Ir para o Pagamento</Button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default CartPage;