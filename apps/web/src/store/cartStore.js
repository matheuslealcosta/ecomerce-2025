import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1) => {
        const items = get().items;
        const existingItem = items.find(item => item.id === product.id);

        if (existingItem) {
          const newQuantity = existingItem.quantity + quantity;
          if (newQuantity > product.stock) {
            toast.error('Quantidade solicitada não disponível em estoque');
            return;
          }
          
          set({
            items: items.map(item =>
              item.id === product.id
                ? { ...item, quantity: newQuantity }
                : item
            ),
          });
          toast.success('Quantidade atualizada no carrinho');
        } else {
          if (quantity > product.stock) {
            toast.error('Quantidade solicitada não disponível em estoque');
            return;
          }
          
          set({
            items: [...items, { ...product, quantity }],
          });
          toast.success('Produto adicionado ao carrinho');
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter(item => item.id !== productId),
        });
        toast.success('Produto removido do carrinho');
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        const items = get().items;
        const item = items.find(item => item.id === productId);
        
        if (item && quantity > item.stock) {
          toast.error('Quantidade solicitada não disponível em estoque');
          return;
        }

        set({
          items: items.map(item =>
            item.id === productId
              ? { ...item, quantity }
              : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotal: () => {
        return get().items.reduce((total, item) => {
          return total + (item.price * item.quantity);
        }, 0);
      },

      getItemsCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      toggleCart: () => {
        set({ isOpen: !get().isOpen });
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);
