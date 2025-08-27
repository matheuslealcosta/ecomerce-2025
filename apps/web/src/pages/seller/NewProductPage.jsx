import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, X, Plus } from 'lucide-react';
import { productsService } from '../../services/productsService';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import toast from 'react-hot-toast';

const productSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  price: z.number().min(0.01, 'Preço deve ser maior que zero'),
  stock: z.number().int().min(0, 'Estoque não pode ser negativo'),
  sku: z.string().min(1, 'SKU é obrigatório'),
  category: z.string().min(1, 'Categoria é obrigatória'),
});

const NewProductPage = () => {
  const [categories, setCategories] = useState([]);
  // const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState(['']);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      price: 0,
      stock: 0,
    },
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const categoriesData = await productsService.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      toast.error('Erro ao carregar categorias');
    }
  };

  const addImageUrl = () => {
    setImageUrls([...imageUrls, '']);
  };

  const removeImageUrl = (index) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls);
  };

  const updateImageUrl = (index, value) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      // Filtrar URLs de imagens válidas
      const validImageUrls = imageUrls.filter(url => url.trim() !== '');
      
      if (validImageUrls.length === 0) {
        toast.error('Adicione pelo menos uma imagem do produto');
        return;
      }

      const productData = {
        ...data,
        sellerId: user.id,
        images: validImageUrls,
        price: Number(data.price),
        stock: Number(data.stock),
      };

      await productsService.createProduct(productData);
      toast.success('Produto criado com sucesso!');
      navigate('/vendedor/produtos');
    } catch (error) {
      toast.error(error.message || 'Erro ao criar produto');
    } finally {
      setLoading(false);
    }
  };

  const generateSKU = () => {
    const title = watch('title') || '';
    const randomNum = Math.random().toString(36).substring(2, 8).toUpperCase();
    const sku = `${title.substring(0, 3).toUpperCase()}-${randomNum}`;
    setValue('sku', sku);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/vendedor/produtos')}
            className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-500 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar aos produtos</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Criar Novo Produto</h1>
          <p className="text-gray-600 mt-1">
            Preencha as informações do seu produto
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Product Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <Card.Header>
                  <Card.Title>Informações Básicas</Card.Title>
                </Card.Header>
                <Card.Content className="space-y-4">
                  <Input
                    label="Título do Produto"
                    {...register('title')}
                    error={errors.title?.message}
                    placeholder="Ex: Smartphone Galaxy Pro Max"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição
                    </label>
                    <textarea
                      {...register('description')}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      placeholder="Descreva detalhadamente seu produto..."
                    />
                    {errors.description && (
                      <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Categoria
                      </label>
                      <select
                        {...register('category')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="">Selecione uma categoria</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-sm font-medium text-gray-700">
                          SKU
                        </label>
                        <button
                          type="button"
                          onClick={generateSKU}
                          className="text-xs text-indigo-600 hover:text-indigo-500"
                        >
                          Gerar automaticamente
                        </button>
                      </div>
                      <Input
                        {...register('sku')}
                        error={errors.sku?.message}
                        placeholder="Ex: GAL-ABC123"
                      />
                    </div>
                  </div>
                </Card.Content>
              </Card>

              <Card>
                <Card.Header>
                  <Card.Title>Preço e Estoque</Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preço (R$)
                      </label>
                      <input
                        {...register('price', { valueAsNumber: true })}
                        type="number"
                        step="0.01"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="0,00"
                      />
                      {errors.price && (
                        <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estoque
                      </label>
                      <input
                        {...register('stock', { valueAsNumber: true })}
                        type="number"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="0"
                      />
                      {errors.stock && (
                        <p className="text-sm text-red-600 mt-1">{errors.stock.message}</p>
                      )}
                    </div>
                  </div>
                </Card.Content>
              </Card>
            </div>

            {/* Images and Actions */}
            <div className="space-y-6">
              <Card>
                <Card.Header>
                  <Card.Title>Imagens do Produto</Card.Title>
                </Card.Header>
                <Card.Content className="space-y-4">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">
                          Imagem {index + 1}
                        </label>
                        {imageUrls.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeImageUrl(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => updateImageUrl(index, e.target.value)}
                        placeholder="https://exemplo.com/imagem.jpg"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                      />
                      {url && (
                        <div className="mt-2">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                            onLoad={(e) => {
                              e.target.style.display = 'block';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addImageUrl}
                    className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-indigo-500 hover:text-indigo-500 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar outra imagem</span>
                  </button>

                  <div className="text-xs text-gray-500">
                    <p>• Use URLs de imagens públicas</p>
                    <p>• Recomendado: 500x500px ou maior</p>
                    <p>• Formatos: JPG, PNG, WebP</p>
                  </div>
                </Card.Content>
              </Card>

              <Card>
                <Card.Header>
                  <Card.Title>Status do Produto</Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-700">
                      📋 <strong>Rascunho:</strong> O produto será salvo como rascunho. 
                      Você poderá editá-lo e enviá-lo para aprovação posteriormente.
                    </p>
                  </div>
                </Card.Content>
              </Card>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  type="submit"
                  isLoading={loading}
                  className="w-full"
                  size="lg"
                >
                  Criar Produto
                </Button>
                
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate('/vendedor/produtos')}
                  className="w-full"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProductPage;
