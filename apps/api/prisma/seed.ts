import { PrismaClient, UserRole, ProductStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create users
  const hashedPassword = await bcrypt.hash('123456', 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@marketplace.com' },
    update: {},
    create: {
      email: 'admin@marketplace.com',
      password: hashedPassword,
      name: 'Super Admin',
      role: UserRole.SUPER_ADMIN,
      isActive: true,
      isVerified: true,
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: 'manager@marketplace.com' },
    update: {},
    create: {
      email: 'manager@marketplace.com',
      password: hashedPassword,
      name: 'João Silva',
      role: UserRole.MANAGER,
      isActive: true,
      isVerified: true,
    },
  });

  const seller = await prisma.user.upsert({
    where: { email: 'seller@marketplace.com' },
    update: {},
    create: {
      email: 'seller@marketplace.com',
      password: hashedPassword,
      name: 'Maria Santos',
      role: UserRole.SELLER,
      isActive: true,
      isVerified: true,
    },
  });

  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@marketplace.com' },
    update: {},
    create: {
      email: 'buyer@marketplace.com',
      password: hashedPassword,
      name: 'Pedro Costa',
      role: UserRole.BUYER,
      isActive: true,
      isVerified: true,
    },
  });

  console.log('✅ Users created');

  // Create categories
  const electronics = await prisma.category.upsert({
    where: { slug: 'eletronicos' },
    update: {},
    create: {
      name: 'Eletrônicos',
      slug: 'eletronicos',
      description: 'Produtos eletrônicos e tecnologia',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&h=300&fit=crop',
    },
  });

  const computers = await prisma.category.upsert({
    where: { slug: 'informatica' },
    update: {},
    create: {
      name: 'Informática',
      slug: 'informatica',
      description: 'Computadores, notebooks e acessórios',
      image: 'https://images.unsplash.com/photo-1547119957-637f8679db1e?w=500&h=300&fit=crop',
    },
  });

  const sports = await prisma.category.upsert({
    where: { slug: 'esportes' },
    update: {},
    create: {
      name: 'Esportes',
      slug: 'esportes',
      description: 'Artigos esportivos e fitness',
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&h=300&fit=crop',
    },
  });

  const fashion = await prisma.category.upsert({
    where: { slug: 'moda' },
    update: {},
    create: {
      name: 'Moda',
      slug: 'moda',
      description: 'Roupas, calçados e acessórios',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=300&fit=crop',
    },
  });

  console.log('✅ Categories created');

  // Create products
  const smartphone = await prisma.product.create({
    data: {
      sellerId: seller.id,
      categoryId: electronics.id,
      title: 'iPhone 15 Pro Max',
      description: 'O mais avançado iPhone com chip A17 Pro, sistema de câmeras Pro com zoom óptico 5x e estrutura em titânio. Inclui tela Super Retina XDR de 6,7 polegadas, 256GB de armazenamento interno, resistência à água IP68 e bateria para o dia inteiro.',
      shortDescription: 'iPhone 15 Pro Max 256GB - Titânio Natural',
      price: 8999.99,
      comparePrice: 9999.99,
      cost: 7000.00,
      sku: 'IPHONE-15-PRO-MAX-256GB',
      barcode: '190199915847',
      stock: 25,
      lowStockThreshold: 5,
      weight: 0.221,
      status: ProductStatus.PUBLISHED,
      slug: 'iphone-15-pro-max-256gb',
      metaTitle: 'iPhone 15 Pro Max 256GB - Titânio Natural | CodeMarket',
      metaDescription: 'Compre o iPhone 15 Pro Max com 256GB de armazenamento. Chip A17 Pro, câmeras Pro e estrutura em titânio. Entrega rápida e segura.',
      tags: ['iphone', 'apple', 'smartphone', 'premium', 'titanio'],
      isFeatured: true,
      publishedAt: new Date(),
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&h=500&fit=crop',
            alt: 'iPhone 15 Pro Max - Vista frontal',
            position: 0,
          },
          {
            url: 'https://images.unsplash.com/photo-1695048071175-2ba3849b9bb7?w=500&h=500&fit=crop',
            alt: 'iPhone 15 Pro Max - Vista traseira',
            position: 1,
          },
        ],
      },
      dimensions: {
        create: {
          length: 15.99,
          width: 7.68,
          height: 0.83,
        },
      },
      attributes: {
        create: [
          { name: 'Marca', value: 'Apple' },
          { name: 'Modelo', value: 'iPhone 15 Pro Max' },
          { name: 'Armazenamento', value: '256GB' },
          { name: 'Cor', value: 'Titânio Natural' },
          { name: 'Tela', value: '6.7" Super Retina XDR' },
          { name: 'Chip', value: 'A17 Pro' },
        ],
      },
    },
  });

  const notebook = await prisma.product.create({
    data: {
      sellerId: seller.id,
      categoryId: computers.id,
      title: 'MacBook Pro 14" M3 Pro',
      description: 'MacBook Pro com chip M3 Pro de alta performance, 18GB de memória unificada, SSD de 512GB e tela Liquid Retina XDR de 14 polegadas. Perfeito para profissionais criativos e desenvolvedores.',
      shortDescription: 'MacBook Pro 14" M3 Pro 18GB 512GB - Cinza Espacial',
      price: 16999.99,
      comparePrice: 18999.99,
      cost: 14000.00,
      sku: 'MACBOOK-PRO-14-M3-PRO-18GB-512GB',
      barcode: '194253715847',
      stock: 12,
      lowStockThreshold: 3,
      weight: 1.6,
      status: ProductStatus.PUBLISHED,
      slug: 'macbook-pro-14-m3-pro-18gb-512gb',
      metaTitle: 'MacBook Pro 14" M3 Pro 18GB 512GB | CodeMarket',
      metaDescription: 'MacBook Pro com chip M3 Pro, 18GB RAM e 512GB SSD. Performance excepcional para profissionais. Compre com desconto.',
      tags: ['macbook', 'apple', 'notebook', 'm3-pro', 'profissional'],
      isFeatured: true,
      publishedAt: new Date(),
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=500&fit=crop',
            alt: 'MacBook Pro 14" - Vista aberto',
            position: 0,
          },
        ],
      },
      dimensions: {
        create: {
          length: 31.26,
          width: 22.12,
          height: 1.55,
        },
      },
      attributes: {
        create: [
          { name: 'Marca', value: 'Apple' },
          { name: 'Modelo', value: 'MacBook Pro 14"' },
          { name: 'Processador', value: 'M3 Pro' },
          { name: 'Memória', value: '18GB' },
          { name: 'Armazenamento', value: '512GB SSD' },
          { name: 'Tela', value: '14.2" Liquid Retina XDR' },
        ],
      },
    },
  });

  const sneakers = await prisma.product.create({
    data: {
      sellerId: seller.id,
      categoryId: sports.id,
      title: 'Nike Air Max 270 React',
      description: 'Tênis Nike Air Max 270 React com tecnologia de amortecimento inovadora. Design moderno e confortável para uso diário e atividades esportivas.',
      shortDescription: 'Tênis Nike Air Max 270 React - Preto/Branco',
      price: 699.99,
      comparePrice: 799.99,
      cost: 400.00,
      sku: 'NIKE-AIR-MAX-270-REACT-42',
      barcode: '194501234567',
      stock: 50,
      lowStockThreshold: 10,
      weight: 0.8,
      status: ProductStatus.PUBLISHED,
      slug: 'nike-air-max-270-react-preto-branco',
      metaTitle: 'Nike Air Max 270 React Preto/Branco | CodeMarket',
      metaDescription: 'Tênis Nike Air Max 270 React com amortecimento superior. Conforto e estilo para o dia a dia. Vários tamanhos disponíveis.',
      tags: ['nike', 'tenis', 'air-max', 'esporte', 'casual'],
      isFeatured: false,
      publishedAt: new Date(),
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
            alt: 'Nike Air Max 270 React - Vista lateral',
            position: 0,
          },
        ],
      },
      attributes: {
        create: [
          { name: 'Marca', value: 'Nike' },
          { name: 'Modelo', value: 'Air Max 270 React' },
          { name: 'Tamanho', value: '42' },
          { name: 'Cor', value: 'Preto/Branco' },
          { name: 'Material', value: 'Sintético' },
        ],
      },
      variants: {
        create: [
          { name: 'Tamanho', value: '38', stock: 8 },
          { name: 'Tamanho', value: '39', stock: 12 },
          { name: 'Tamanho', value: '40', stock: 15 },
          { name: 'Tamanho', value: '41', stock: 18 },
          { name: 'Tamanho', value: '42', stock: 20 },
          { name: 'Tamanho', value: '43', stock: 10 },
          { name: 'Tamanho', value: '44', stock: 7 },
        ],
      },
    },
  });

  console.log('✅ Products created');

  // Create system settings
  await prisma.systemSettings.createMany({
    data: [
      {
        key: 'marketplace.name',
        value: 'CodeMarket',
      },
      {
        key: 'marketplace.commission',
        value: 0.1,
      },
      {
        key: 'marketplace.currency',
        value: 'BRL',
      },
      {
        key: 'features.reviews',
        value: true,
      },
      {
        key: 'features.wishlist',
        value: true,
      },
      {
        key: 'features.dark_mode',
        value: true,
      },
      {
        key: 'shipping.free_shipping_threshold',
        value: 199.99,
      },
      {
        key: 'email.welcome_enabled',
        value: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ System settings created');

  // Create some sample reviews
  await prisma.review.create({
    data: {
      productId: smartphone.id,
      buyerId: buyer.id,
      rating: 5,
      title: 'Produto excepcional!',
      comment: 'iPhone incrível, chegou rapidinho e exatamente como descrito. A qualidade da câmera é impressionante e a bateria dura o dia todo. Super recomendo!',
      status: 'published',
      helpfulVotes: 15,
    },
  });

  await prisma.review.create({
    data: {
      productId: notebook.id,
      buyerId: buyer.id,
      rating: 5,
      title: 'Performance incrível',
      comment: 'MacBook perfeito para desenvolvimento. O chip M3 Pro é realmente rápido e a tela é linda. Vale cada centavo!',
      status: 'published',
      helpfulVotes: 8,
    },
  });

  console.log('✅ Reviews created');

  console.log('🎉 Database seeded successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
