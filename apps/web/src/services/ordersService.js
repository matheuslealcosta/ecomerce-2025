import api from './api';

export const ordersService = {
  async getOrders(filters = {}) {
    try {
      const response = await api.get('/orders');
      let orders = response.data;

      // Aplicar filtros
      if (filters.status) {
        orders = orders.filter(o => o.status === filters.status);
      }

      if (filters.buyerId) {
        orders = orders.filter(o => o.buyerId === filters.buyerId);
      }

      if (filters.sellerId) {
        orders = orders.filter(o => 
          o.items.some(item => item.sellerId === filters.sellerId)
        );
      }

      // Ordenar por data (mais recentes primeiro)
      orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return orders;
    } catch (error) {
      throw new Error('Erro ao buscar pedidos');
    }
  },

  async getOrderById(id) {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Pedido não encontrado');
    }
  },

  async createOrder(orderData) {
    try {
      const newOrder = {
        ...orderData,
        id: String(Date.now()),
        status: 'created',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const response = await api.post('/orders', newOrder);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao criar pedido');
    }
  },

  async updateOrderStatus(id, status) {
    try {
      const response = await api.patch(`/orders/${id}`, {
        status,
        updatedAt: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      throw new Error('Erro ao atualizar status do pedido');
    }
  },

  async getBuyerOrders(buyerId) {
    try {
      const orders = await this.getOrders({ buyerId });
      return orders;
    } catch (error) {
      throw new Error('Erro ao buscar pedidos do comprador');
    }
  },

  async getSellerOrders(sellerId) {
    try {
      const orders = await this.getOrders({ sellerId });
      return orders;
    } catch (error) {
      throw new Error('Erro ao buscar pedidos do vendedor');
    }
  },

  async cancelOrder(id, reason) {
    try {
      const response = await api.patch(`/orders/${id}`, {
        status: 'canceled',
        cancelReason: reason,
        updatedAt: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      throw new Error('Erro ao cancelar pedido');
    }
  },

  async refundOrder(id, reason) {
    try {
      const response = await api.patch(`/orders/${id}`, {
        status: 'refunded',
        refundReason: reason,
        updatedAt: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      throw new Error('Erro ao reembolsar pedido');
    }
  },

  // Métodos para relatórios
  async getOrderStats(filters = {}) {
    try {
      const orders = await this.getOrders(filters);
      
      const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        paid: orders.filter(o => o.status === 'paid').length,
        canceled: orders.filter(o => o.status === 'canceled').length,
        refunded: orders.filter(o => o.status === 'refunded').length,
        totalRevenue: orders
          .filter(o => o.status === 'paid')
          .reduce((sum, order) => sum + order.total, 0),
      };

      return stats;
    } catch (error) {
      throw new Error('Erro ao calcular estatísticas de pedidos');
    }
  },

  async getSalesData(sellerId, period = '6months') {
    try {
      const orders = await this.getSellerOrders(sellerId);
      const paidOrders = orders.filter(o => o.status === 'paid');

      // Agrupar por mês (mock implementation)
      const salesByMonth = {};
      paidOrders.forEach(order => {
        const month = new Date(order.createdAt).toISOString().slice(0, 7); // YYYY-MM
        if (!salesByMonth[month]) {
          salesByMonth[month] = 0;
        }
        salesByMonth[month] += order.total;
      });

      // Converter para array ordenado
      const salesData = Object.entries(salesByMonth)
        .map(([month, total]) => ({
          month: new Date(month).toLocaleDateString('pt-BR', { 
            month: 'short',
            year: 'numeric' 
          }),
          vendas: total,
        }))
        .sort((a, b) => new Date(a.month) - new Date(b.month));

      return salesData;
    } catch (error) {
      throw new Error('Erro ao obter dados de vendas');
    }
  },
};
