import api from './api';

export const productsService = {
  async getProducts(filters = {}) {
    try {
      const response = await api.get('/products');
      let products = response.data;

      // Aplicar filtros
      if (filters.status) {
        products = products.filter(p => p.status === filters.status);
      }

      if (filters.category) {
        products = products.filter(p => p.category.toLowerCase().includes(filters.category.toLowerCase()));
      }

      if (filters.sellerId) {
        products = products.filter(p => p.sellerId === filters.sellerId);
      }

      if (filters.search) {
        const search = filters.search.toLowerCase();
        products = products.filter(p => 
          p.title.toLowerCase().includes(search) || 
          p.description.toLowerCase().includes(search)
        );
      }

      if (filters.minPrice) {
        products = products.filter(p => p.price >= filters.minPrice);
      }

      if (filters.maxPrice) {
        products = products.filter(p => p.price <= filters.maxPrice);
      }

      // Ordenação
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'price_asc':
            products.sort((a, b) => a.price - b.price);
            break;
          case 'price_desc':
            products.sort((a, b) => b.price - a.price);
            break;
          case 'name':
            products.sort((a, b) => a.title.localeCompare(b.title));
            break;
          case 'newest':
            products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
          default:
            break;
        }
      }

      return products;
    } catch (error) {
      throw new Error('Erro ao buscar produtos');
    }
  },

  async getProductById(id) {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Produto não encontrado');
    }
  },

  async createProduct(productData) {
    try {
      const newProduct = {
        ...productData,
        id: String(Date.now()),
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const response = await api.post('/products', newProduct);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao criar produto');
    }
  },

  async updateProduct(id, productData) {
    try {
      const updatedProduct = {
        ...productData,
        updatedAt: new Date().toISOString(),
      };

      const response = await api.put(`/products/${id}`, updatedProduct);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao atualizar produto');
    }
  },

  async deleteProduct(id) {
    try {
      await api.delete(`/products/${id}`);
    } catch (error) {
      throw new Error('Erro ao deletar produto');
    }
  },

  async submitForApproval(id) {
    try {
      const response = await api.patch(`/products/${id}`, {
        status: 'submitted',
        updatedAt: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      throw new Error('Erro ao enviar produto para aprovação');
    }
  },

  async approveProduct(id) {
    try {
      const response = await api.patch(`/products/${id}`, {
        status: 'approved',
        updatedAt: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      throw new Error('Erro ao aprovar produto');
    }
  },

  async rejectProduct(id, reason) {
    try {
      const response = await api.patch(`/products/${id}`, {
        status: 'rejected',
        rejectionReason: reason,
        updatedAt: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      throw new Error('Erro ao rejeitar produto');
    }
  },

  async publishProduct(id) {
    try {
      const response = await api.patch(`/products/${id}`, {
        status: 'published',
        updatedAt: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      throw new Error('Erro ao publicar produto');
    }
  },

  async getCategories() {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar categorias');
    }
  },
};
