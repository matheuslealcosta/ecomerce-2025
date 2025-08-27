import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await authService.login(email, password);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
          toast.success(`Bem-vindo, ${response.user.name}!`);
          return response;
        } catch (error) {
          set({ isLoading: false });
          toast.error(error.message || 'Erro ao fazer login');
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        toast.success('Logout realizado com sucesso');
      },

      register: async (userData) => {
        set({ isLoading: true });
        try {
          const response = await authService.register(userData);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
          toast.success('Conta criada com sucesso!');
          return response;
        } catch (error) {
          set({ isLoading: false });
          toast.error(error.message || 'Erro ao criar conta');
          throw error;
        }
      },

      updateUser: (userData) => {
        const currentUser = get().user;
        set({
          user: { ...currentUser, ...userData },
        });
      },

      clearError: () => {
        // Limpar erros se houver
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
