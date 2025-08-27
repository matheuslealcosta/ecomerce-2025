import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Grid, List, ShoppingCart } from 'lucide-react';
import { productsService } from '../../services/productsService';
import { useCartStore } from '../../store/cartStore';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sortBy: 'newest',
    minPrice: '',
    maxPrice: '',
  });
  const [viewMode, setViewMode] = useState('grid');
  const [searchParams] = useSearchParams();
  // const navigate = useNavigate();
  const { addItem } = useCartStore();

  useEffect(() => {
    // Aplicar filtro de busca da URL
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setFilters(prev => ({ ...prev, search: searchQuery }));
    }
    
    loadData();
  }, [searchParams]);

  useEffect(() => {
    loadProducts();
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        productsService.getProducts({ status: 'published' }),
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
        status: 'published',
        ...filters
      });
      setProducts(productsData);
    } catch (error) {
      toast.error('Erro ao carregar produtos');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleAddToCart = (product) => {
    addItem(product, 1);
  };

  // const formatPrice = (price) => {
  //   return new Intl.NumberFormat('pt-BR', {
  //     style: 'currency',
  //     currency: 'BRL'
  //   }).format(price);
  // };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Loading Skeleton */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="h-12 bg-white/20 rounded-lg w-96 mx-auto mb-4 animate-pulse"></div>
              <div className="h-6 bg-white/20 rounded-lg w-64 mx-auto animate-pulse"></div>
            </div>
          </div>
        </div>
        
        {/* Products Loading Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Bem-vindo ao <span className="text-yellow-400">CodeMarket</span>
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 mb-8">
              Descubra produtos incríveis de vendedores verificados
            </p>
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="O que você está procurando?"
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Sort */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="">Todas as categorias</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>

              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Preço min"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="w-24 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Preço máx"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-24 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                />
              </div>
            </div>

            {/* Sort & View Mode */}
            <div className="flex items-center space-x-4">
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="newest">Mais recentes</option>
                <option value="price_asc">Menor preço</option>
                <option value="price_desc">Maior preço</option>
                <option value="name">Nome A-Z</option>
              </select>

              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="text-gray-500">
              Tente ajustar os filtros ou buscar por outros termos.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Produtos ({products.length})
              </h2>
            </div>

            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {products.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  viewMode={viewMode}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

const ProductCard = ({ product, viewMode, onAddToCart }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  if (viewMode === 'list') {
    return (
      <Card className="flex flex-col md:flex-row overflow-hidden">
        <div className="md:w-64 h-64 md:h-48">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 p-6">
          <div className="flex justify-between items-start mb-2">
            <Link
              to={`/produto/${product.id}`}
              className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
            >
              {product.title}
            </Link>
            <Badge variant="primary">{product.category}</Badge>
          </div>
          
          <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-indigo-600">
                {formatPrice(product.price)}
              </span>
              <p className="text-sm text-gray-500">
                {product.stock > 0 ? `${product.stock} disponíveis` : 'Sem estoque'}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Link to={`/produto/${product.id}`}>
                <Button variant="ghost">Ver detalhes</Button>
              </Link>
              <Button
                onClick={() => onAddToCart(product)}
                disabled={product.stock === 0}
                className="flex items-center space-x-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Adicionar</span>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Badge 
          variant="primary" 
          className="absolute top-2 left-2"
        >
          {product.category}
        </Badge>
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Badge variant="error">Sem estoque</Badge>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <Link
          to={`/produto/${product.id}`}
          className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-2"
        >
          {product.title}
        </Link>
        
        <p className="text-gray-600 mt-2 text-sm line-clamp-2">{product.description}</p>
        
        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-indigo-600">
              {formatPrice(product.price)}
            </span>
            <p className="text-xs text-gray-500">
              {product.stock > 0 ? `${product.stock} disponíveis` : 'Sem estoque'}
            </p>
          </div>
          
          <Button
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
            size="sm"
            className="flex items-center space-x-1"
          >
            <ShoppingCart className="w-3 h-3" />
            <span className="hidden sm:inline">Comprar</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default HomePage;
