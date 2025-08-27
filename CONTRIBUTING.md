# Contributing to CodeMarket

## 🎯 Como Contribuir

Obrigado por considerar contribuir com o CodeMarket! Este documento explica como você pode ajudar a melhorar nossa plataforma.

## 📋 Processo de Contribuição

### 1. Fork & Clone
```bash
# Fork no GitHub, depois:
git clone https://github.com/seu-usuario/matheuslealcosta-ecommerce.git
cd matheuslealcosta-ecommerce
```

### 2. Configuração Local
```bash
npm install
cd apps/api && npx prisma generate
npm run dev
```

### 3. Criação de Branch
```bash
git checkout -b feature/nome-da-feature
# ou
git checkout -b fix/nome-do-fix
# ou  
git checkout -b docs/atualizacao-documentacao
```

### 4. Desenvolvimento
- ✅ Escreva código limpo e bem documentado
- ✅ Adicione testes quando necessário
- ✅ Siga os padrões de código estabelecidos
- ✅ Execute `npm run lint` antes de commit

### 5. Commit & Push
```bash
# Use Conventional Commits
git commit -m "feat: adiciona sistema de cupons de desconto"
git push origin feature/nome-da-feature
```

### 6. Pull Request
- 📝 Descreva claramente o que foi alterado
- 🎯 Explique a motivação da mudança
- 📸 Adicione screenshots se relevante
- 🧪 Confirme que todos os testes passam

## 🏗️ Padrões de Código

### Backend (NestJS)
```typescript
// ✅ Bom
@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}
  
  async findAll(filters: ProductFiltersDto): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: this.buildWhereClause(filters),
    });
  }
}

// ❌ Evitar
export class ProductsService {
  findAll() {
    // sem tipos, sem injeção de dependência
  }
}
```

### Frontend (React)
```typescript
// ✅ Bom
interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* ... */}
    </div>
  );
};

// ❌ Evitar
export const ProductCard = ({ product }) => {
  // sem tipos, sem interface
};
```

## 🧪 Testes

### Backend Tests
```bash
cd apps/api
npm run test          # unit tests
npm run test:e2e      # integration tests
npm run test:cov      # coverage report
```

### Frontend Tests
```bash
cd apps/web
npm run test          # jest tests
npm run test:coverage # coverage report
```

## 📝 Tipos de Contribuição

### 🐛 Bug Reports
Use o template de issue para bugs:
- Descrição clara do problema
- Passos para reproduzir
- Comportamento esperado vs atual
- Screenshots/logs relevantes
- Informações do ambiente

### ✨ Feature Requests
Use o template de issue para features:
- Problema que a feature resolve
- Solução proposta
- Alternativas consideradas
- Impacto nos usuários

### 📚 Documentação
- Correções de typos
- Esclarecimentos
- Novos exemplos
- Traduções

### 🔧 Melhorias Técnicas
- Refatorações
- Performance improvements
- Atualizações de dependências
- Melhorias na arquitetura

## 🏆 Reconhecimento

Todos os contribuidores são reconhecidos no projeto:
- Nome na lista de contributors
- Badge no README
- Menção em releases
- Acesso ao Discord VIP

## ❓ Dúvidas

- 💬 Discord: [CodeMarket Community]
- 📧 Email: contribute@codemarket.dev  
- 📱 WhatsApp: +55 (32) 99999-9999

## 📋 Checklist para PRs

- [ ] Código segue os padrões estabelecidos
- [ ] Testes passam (`npm run test`)
- [ ] Lint passa (`npm run lint`)
- [ ] Type check passa (`npm run type-check`)
- [ ] Documentação atualizada se necessário
- [ ] Changelog atualizado (para features)
- [ ] Screenshots adicionados (para UI)
- [ ] Performance testada
- [ ] Acessibilidade verificada
- [ ] Mobile responsiveness testada

## 🎉 Obrigado!

Cada contribuição, por menor que seja, faz diferença. Obrigado por ajudar a fazer do CodeMarket uma plataforma melhor! 🚀
