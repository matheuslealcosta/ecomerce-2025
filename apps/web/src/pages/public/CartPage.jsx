import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Plus, Minus, Trash2, ArrowLeft } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const CartPage = () => {
  const { items, updateQuantity, removeItem, getTotal, getItemsCount } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Seu carrinho está vazio
            </h2>
            <p className="text-gray-600 mb-8">
              Adicione alguns produtos incríveis ao seu carrinho.
            </p>
            <Link to="/">
              <Button className="inline-flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Continuar comprando</span>
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-500 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continuar comprando</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Carrinho de Compras ({getItemsCount()} {getItemsCount() === 1 ? 'item' : 'itens'})
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items List */}
          <div className="lg:col-span-2">
            <Card className="divide-y divide-gray-200">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <Card.Header>
                <Card.Title>Resumo do Pedido</Card.Title>
              </Card.Header>

              <Card.Content>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(getTotal())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frete</span>
                    <span className="font-medium">Calculado no checkout</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-indigo-600">{formatPrice(getTotal())}</span>
                    </div>
                  </div>
                </div>
              </Card.Content>

              <Card.Footer>
                <Button
                  onClick={handleCheckout}
                  className="w-full"
                  size="lg"
                >
                  {isAuthenticated ? 'Finalizar Compra' : 'Fazer Login e Comprar'}
                </Button>
                
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500">
                    Frete e impostos calculados no checkout
                  </p>
                </div>
              </Card.Footer>
            </Card>

            {/* Security Badge */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                🔒 Compra 100% segura
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const itemTotal = item.price * item.quantity;

  return (
    <div className="p-6">
      <div className="flex items-start space-x-4">
        {/* Product Image */}
        <div className="w-20 h-20 flex-shrink-0">
          <img
            src={item.images[0]}
            alt={item.title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <Link
            to={`/produto/${item.id}`}
            className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
          >
            {item.title}
          </Link>
          <p className="text-sm text-gray-600 mt-1">{item.category}</p>
          <p className="text-lg font-bold text-indigo-600 mt-2">
            {formatPrice(item.price)}
          </p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
              className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-50"
              disabled={item.quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 text-sm font-medium min-w-[3rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, Math.min(item.stock, item.quantity + 1))}
              className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-50"
              disabled={item.quantity >= item.stock}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <button
            onClick={() => onRemove(item.id)}
            className="p-1 text-red-600 hover:text-red-700"
            title="Remover item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Item Total & Stock Info */}
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {item.stock > item.quantity ? (
            <span>✅ {item.stock - item.quantity} disponíveis</span>
          ) : item.stock === item.quantity ? (
            <span className="text-yellow-600">⚠️ Último(s) em estoque</span>
          ) : (
            <span className="text-red-600">❌ Estoque insuficiente</span>
          )}
        </div>
        
        <div className="text-lg font-bold text-gray-900">
          Total: {formatPrice(itemTotal)}
        </div>
      </div>

      {item.quantity > item.stock && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">
            ⚠️ Quantidade solicitada ({item.quantity}) excede o estoque disponível ({item.stock}).
            Ajuste a quantidade antes de finalizar a compra.
          </p>
        </div>
      )}
    </div>
  );
};

export default CartPage;
