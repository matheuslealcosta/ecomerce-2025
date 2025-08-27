import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  // Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Send,
  AlertCircle
} from 'lucide-react';
import { productsService } from '../../services/productsService';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';

const SellerProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: '',
  });
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadProducts();
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        productsService.getProducts({ sellerId: user.id }),
        productsService.getCategories()
      ]);
      
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const productsData = await productsService.getProducts({
        sellerId: user.id,
        ...filters
      });
      setProducts(productsData);
    } catch (error) {
      toast.error('Erro ao carregar produtos');
    }
  };

  const handleSubmitForApproval = async (productId) => {
    try {
      setActionLoading(true);
      await productsService.submitForApproval(productId);
      toast.success('Produto enviado para aprovação');
      loadProducts();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      setActionLoading(true);
      await productsService.deleteProduct(selectedProduct.id);
      toast.success('Produto excluído com sucesso');
      setShowDeleteModal(false);
      setSelectedProduct(null);
      loadProducts();
    } catch (error) {
      toast.error('Erro ao excluir produto');
    } finally {
      setActionLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
              ))}
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
            <h1 className="text-3xl font-bold text-gray-900">Meus Produtos</h1>
            <p className="text-gray-600 mt-1">Gerencie seus produtos e status</p>
          </div>
          <Link to="/vendedor/produtos/novo">
            <Button className="inline-flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Novo Produto</span>
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="">Todos os status</option>
              <option value="draft">Rascunho</option>
              <option value="submitted">Em análise</option>
              <option value="approved">Aprovado</option>
              <option value="published">Publicado</option>
              <option value="rejected">Rejeitado</option>
            </select>

            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="">Todas as categorias</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </Card>

        {/* Products Grid */}
        {products.length === 0 ? (
          <Card className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filters.search || filters.status || filters.category 
                ? 'Nenhum produto encontrado' 
                : 'Você ainda não tem produtos cadastrados'
              }
            </h3>
            <p className="text-gray-500 mb-8">
              {filters.search || filters.status || filters.category
                ? 'Tente ajustar os filtros para encontrar seus produtos.'
                : 'Comece criando seu primeiro produto para vender na plataforma.'
              }
            </p>
            <Link to="/vendedor/produtos/novo">
              <Button>Criar primeiro produto</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onSubmit={() => handleSubmitForApproval(product.id)}
                onDelete={(product) => {
                  setSelectedProduct(product);
                  setShowDeleteModal(true);
                }}
                isSubmitting={actionLoading}
              />
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedProduct(null);
          }}
          title="Excluir Produto"
        >
          {selectedProduct && (
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <AlertCircle className="w-12 h-12 text-red-500" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Tem certeza que deseja excluir este produto?
                  </h3>
                  <p className="text-gray-600">Esta ação não pode ser desfeita.</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedProduct.images[0]}
                    alt={selectedProduct.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedProduct.title}</h4>
                    <p className="text-sm text-gray-500">{selectedProduct.category}</p>
                    <p className="text-sm font-semibold text-indigo-600">
                      {formatPrice(selectedProduct.price)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedProduct(null);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="error"
                  onClick={handleDeleteProduct}
                  isLoading={actionLoading}
                >
                  Excluir Produto
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

const ProductCard = ({ product, onSubmit, onDelete, isSubmitting }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const statusInfo = {
    draft: { variant: 'default', label: 'Rascunho', canSubmit: true, canEdit: true, canDelete: true },
    submitted: { variant: 'warning', label: 'Em Análise', canSubmit: false, canEdit: false, canDelete: false },
    approved: { variant: 'info', label: 'Aprovado', canSubmit: false, canEdit: false, canDelete: false },
    published: { variant: 'success', label: 'Publicado', canSubmit: false, canEdit: true, canDelete: false },
    rejected: { variant: 'error', label: 'Rejeitado', canSubmit: false, canEdit: true, canDelete: true }
  }[product.status];

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-48 object-cover"
        />
        <Badge 
          variant={statusInfo.variant} 
          className="absolute top-2 right-2"
        >
          {statusInfo.label}
        </Badge>
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Badge variant="error">Sem estoque</Badge>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
          {product.title}
        </h3>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-bold text-indigo-600">
            {formatPrice(product.price)}
          </span>
          <span className="text-sm text-gray-500">
            Estoque: {product.stock}
          </span>
        </div>

        {product.status === 'rejected' && product.rejectionReason && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-700">
              <strong>Motivo da rejeição:</strong> {product.rejectionReason}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Link to={`/produto/${product.id}`}>
            <Button variant="ghost" size="sm" className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>Ver</span>
            </Button>
          </Link>

          {statusInfo.canEdit && (
            <Link to={`/vendedor/produtos/${product.id}/editar`}>
              <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                <Edit className="w-3 h-3" />
                <span>Editar</span>
              </Button>
            </Link>
          )}

          {statusInfo.canSubmit && (
            <Button
              size="sm"
              onClick={onSubmit}
              isLoading={isSubmitting}
              className="flex items-center space-x-1"
            >
              <Send className="w-3 h-3" />
              <span>Enviar</span>
            </Button>
          )}

          {statusInfo.canDelete && (
            <Button
              variant="error"
              size="sm"
              onClick={() => onDelete(product)}
              className="flex items-center space-x-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Excluir</span>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default SellerProductsPage;
