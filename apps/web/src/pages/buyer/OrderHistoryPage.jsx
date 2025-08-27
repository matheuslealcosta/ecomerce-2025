import React from 'react';
import Card from '../../components/ui/Card';

const OrderHistoryPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Meus Pedidos</h1>
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600">
              Histórico de pedidos será implementado em breve.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OrderHistoryPage;
