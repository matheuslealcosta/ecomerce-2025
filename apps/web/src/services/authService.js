import api from './api';

export const authService = {
  async login(email, password) {
    try {
      // Simular login com os dados mockados
      const usersResponse = await api.get('/users');
      const users = usersResponse.data;
      
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Credenciais inválidas');
      }

      // Remover senha da resposta
      const { password: _, ...userWithoutPassword } = user;
      
      // Gerar token simulado
      const token = `mock-token-${user.id}-${Date.now()}`;
      
      return {
        user: userWithoutPassword,
        token,
      };
    } catch (error) {
      throw new Error(error.message || 'Erro ao fazer login');
    }
  },

  async register(userData) {
    try {
      // Verificar se email já existe
      const usersResponse = await api.get('/users');
      const users = usersResponse.data;
      
      const existingUser = users.find(u => u.email === userData.email);
      
      if (existingUser) {
        throw new Error('Email já está em uso');
      }

      // Criar novo usuário
      const newUser = {
        id: String(Date.now()),
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'comprador',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=3b82f6&color=fff`,
        createdAt: new Date().toISOString(),
      };

      const response = await api.post('/users', newUser);
      
      // Remover senha da resposta
      const { password: _, ...userWithoutPassword } = response.data;
      
      // Gerar token simulado
      const token = `mock-token-${newUser.id}-${Date.now()}`;

      return {
        user: userWithoutPassword,
        token,
      };
    } catch (error) {
      throw new Error(error.message || 'Erro ao criar conta');
    }
  },

  async getCurrentUser() {
    // Em um app real, isso validaria o token no backend
    const authData = localStorage.getItem('auth-storage');
    if (authData) {
      try {
        const { state } = JSON.parse(authData);
        return state.user;
      } catch (error) {
        return null;
      }
    }
    return null;
  },

  logout() {
    localStorage.removeItem('auth-storage');
  },
};
