import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Plus, 
  TrendingUp, 
  DollarSign, 
  Eye,
  Clock,
  CheckCircle,
  // XCircle,
  // AlertCircle
} from 'lucide-react';
import { productsService } from '../../services/productsService';
import { ordersService } from '../../services/ordersService';
import { useAuthStore } from '../../store/authStore';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SellerDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    publishedProducts: 0,
    pendingProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    monthlyRevenue: 0
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    loadDashboardData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [products, orders] = await Promise.all([
        productsService.getProducts({ sellerId: user.id }),
        ordersService.getSellerOrders(user.id)
      ]);

      // Calculate stats
      const publishedProducts = products.filter(p => p.status === 'published').length;
      const pendingProducts = products.filter(p => p.status === 'submitted').length;
      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
      
      // Mock monthly sales data
      const mockSalesData = [
        { month: 'Jan', vendas: 2400 },
        { month: 'Fev', vendas: 1398 },
        { month: 'Mar', vendas: 9800 },
        { month: 'Abr', vendas: 3908 },
        { month: 'Mai', vendas: 4800 },
        { month: 'Jun', vendas: 3800 },
      ];

      setStats({
        totalProducts: products.length,
        publishedProducts,
        pendingProducts,
        totalOrders: orders.length,
        totalRevenue,
        monthlyRevenue: 3800 // Mock value
      });

      setRecentProducts(products.slice(0, 5));
      setRecentOrders(orders.slice(0, 5));
      setSalesData(mockSalesData);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getStatusBadge = (status) => {
    const variants = {
      draft: { variant: 'default', label: 'Rascunho' },
      submitted: { variant: 'warning', label: 'Em análise' },
      approved: { variant: 'info', label: 'Aprovado' },
      published: { variant: 'success', label: 'Publicado' },
      rejected: { variant: 'error', label: 'Rejeitado' }
    };
    
    const config = variants[status] || { variant: 'default', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getOrderStatusBadge = (status) => {
    const variants = {
      created: { variant: 'default', label: 'Criado' },
      pending: { variant: 'warning', label: 'Pendente' },
      paid: { variant: 'success', label: 'Pago' },
      canceled: { variant: 'error', label: 'Cancelado' },
      refunded: { variant: 'error', label: 'Reembolsado' }
    };
    
    const config = variants[status] || { variant: 'default', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Painel do Vendedor
            </h1>
            <p className="text-gray-600 mt-1">
              Gerencie seus produtos e acompanhe suas vendas
            </p>
          </div>
          <Link to="/vendedor/produtos/novo">
            <Button className="inline-flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Novo Produto</span>
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Package className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total de Produtos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Produtos Publicados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.publishedProducts}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Aguardando Aprovação</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingProducts}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalRevenue)}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sales Chart */}
          <Card>
            <Card.Header>
              <Card.Title>Vendas dos Últimos Meses</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [formatPrice(value), 'Vendas']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="vendas" 
                      stroke="#6366f1" 
                      strokeWidth={2}
                      dot={{ fill: '#6366f1' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card.Content>
          </Card>

          {/* Recent Products */}
          <Card>
            <Card.Header className="flex justify-between items-center">
              <Card.Title>Produtos Recentes</Card.Title>
              <Link to="/vendedor/produtos">
                <Button variant="ghost" size="sm">
                  Ver todos
                </Button>
              </Link>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {recentProducts.map(product => (
                  <div key={product.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-1">
                          {product.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(product.status)}
                      <Link to={`/vendedor/produtos/${product.id}/editar`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
                
                {recentProducts.length === 0 && (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">Nenhum produto encontrado</p>
                    <Link to="/vendedor/produtos/novo" className="mt-2 inline-block">
                      <Button size="sm">Criar primeiro produto</Button>
                    </Link>
                  </div>
                )}
              </div>
            </Card.Content>
          </Card>

          {/* Recent Orders */}
          <Card className="lg:col-span-2">
            <Card.Header className="flex justify-between items-center">
              <Card.Title>Pedidos Recentes</Card.Title>
              <Link to="/vendedor/vendas">
                <Button variant="ghost" size="sm">
                  Ver todos
                </Button>
              </Link>
            </Card.Header>
            <Card.Content>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Pedido</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Cliente</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Valor</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map(order => (
                      <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-indigo-600">
                          #{order.id}
                        </td>
                        <td className="py-3 px-4 text-gray-900">
                          Cliente #{order.buyerId}
                        </td>
                        <td className="py-3 px-4 text-gray-900">
                          {formatPrice(order.total)}
                        </td>
                        <td className="py-3 px-4">
                          {getOrderStatusBadge(order.status)}
                        </td>
                        <td className="py-3 px-4 text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {recentOrders.length === 0 && (
                  <div className="text-center py-8">
                    <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">Nenhum pedido encontrado</p>
                  </div>
                )}
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
