import api from './api';

export const mercadoPagoService = {
  async createPreference(orderData) {
    try {
      // Simulação da criação de preferência do Mercado Pago
      const preference = {
        id: `MP-PREF-${Date.now()}`,
        items: orderData.items.map(item => ({
          id: item.productId,
          title: item.title,
          unit_price: item.price,
          quantity: item.qty,
          currency_id: 'BRL',
        })),
        payer: {
          name: orderData.buyerName,
          email: orderData.buyerEmail,
        },
        back_urls: {
          success: `${window.location.origin}/checkout/success`,
          failure: `${window.location.origin}/checkout/failure`,
          pending: `${window.location.origin}/checkout/pending`,
        },
        auto_return: 'approved',
        external_reference: orderData.orderId,
        notification_url: `${process.env.REACT_APP_API_URL}/payments/webhook`,
      };

      // Em um cenário real, isso seria enviado para o backend
      // que criaria a preferência no Mercado Pago
      console.log('Preferência criada (mock):', preference);
      
      return {
        preferenceId: preference.id,
        initPoint: `https://sandbox.mercadopago.com.br/checkout/v1/redirect?preference-id=${preference.id}`,
      };
    } catch (error) {
      throw new Error('Erro ao criar preferência de pagamento');
    }
  },

  async getPaymentStatus(paymentId) {
    try {
      // Simulação de consulta de status de pagamento
      // Em um app real, isso seria feito no backend
      const mockStatuses = ['pending', 'approved', 'rejected'];
      const randomStatus = mockStatuses[Math.floor(Math.random() * mockStatuses.length)];
      
      return {
        id: paymentId,
        status: randomStatus,
        status_detail: randomStatus === 'approved' ? 'accredited' : 'pending_contingency',
        transaction_amount: 100.00,
        currency_id: 'BRL',
      };
    } catch (error) {
      throw new Error('Erro ao consultar status do pagamento');
    }
  },

  async processWebhook(webhookData) {
    try {
      // Simulação do processamento de webhook
      console.log('Webhook recebido:', webhookData);
      
      // Atualizar status do pedido baseado no webhook
      if (webhookData.type === 'payment') {
        const paymentStatus = await this.getPaymentStatus(webhookData.data.id);
        
        // Mapear status do MP para status do pedido
        let orderStatus = 'pending';
        if (paymentStatus.status === 'approved') {
          orderStatus = 'paid';
        } else if (paymentStatus.status === 'rejected') {
          orderStatus = 'canceled';
        }

        return {
          orderId: webhookData.external_reference,
          status: orderStatus,
          paymentData: paymentStatus,
        };
      }

      return null;
    } catch (error) {
      throw new Error('Erro ao processar webhook');
    }
  },

  // Função auxiliar para simular redirecionamento para checkout
  redirectToCheckout(preferenceId) {
    // Em produção, usaria o SDK do Mercado Pago
    const checkoutUrl = `https://sandbox.mercadopago.com.br/checkout/v1/redirect?preference-id=${preferenceId}`;
    
    // Simulação: abrir em nova janela ou redirecionar
    if (process.env.NODE_ENV === 'development') {
      // Em desenvolvimento, simular sucesso após 3 segundos
      console.log('Simulando checkout do Mercado Pago...');
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            status: 'approved',
            payment_id: `MP-${Date.now()}`,
            collection_id: `COL-${Date.now()}`,
          });
        }, 3000);
      });
    } else {
      window.open(checkoutUrl, '_blank');
    }
  },
};
