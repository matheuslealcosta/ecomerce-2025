# 🧪 Guia de Teste - CodeMarket

## 🚀 Iniciando o Projeto

### 1. Instalação
```bash
npm install
```

### 2. Executar em desenvolvimento
```bash
npm run dev
```

Isso iniciará:
- ✅ React App: http://localhost:3000
- ✅ JSON Server API: http://localhost:3001

## 👥 Testando por Papel de Usuário

### 🔧 Super Admin
**Login**: `admin@marketplace.com` / `admin123`

**O que testar:**
- ✅ Acesso a todos os módulos
- ✅ Dashboard com métricas globais
- 🚧 Gerenciar usuários (em desenvolvimento)
- 🚧 Configurações do Mercado Pago (em desenvolvimento)
- 🚧 Relatórios avançados (em desenvolvimento)

**Fluxo de teste:**
1. Fazer login como admin
2. Verificar se navbar mostra "Painel Admin"
3. Navegar para `/admin` - deve permitir acesso
4. Tentar acessar outras rotas de outros roles

---

### 👨‍💼 Gestor
**Login**: `gestor@marketplace.com` / `gestor123`

**O que testar:**
- ✅ Dashboard do gestor
- 🚧 Fila de aprovação de produtos (em desenvolvimento)
- 🚧 Gerenciar catálogo (em desenvolvimento) 
- 🚧 Sistema de moderação (em desenvolvimento)

**Fluxo de teste:**
1. Fazer login como gestor
2. Verificar se navbar mostra "Painel Gestor"
3. Navegar para `/gestor` - deve permitir acesso
4. Verificar se não consegue acessar `/admin` (deve redirecionar)

---

### 🛒 Vendedor
**Login**: `vendedor@marketplace.com` / `vendedor123`

**O que testar:**
- ✅ Dashboard do vendedor com métricas
- ✅ Lista de produtos próprios
- ✅ Criar novo produto
- ✅ Filtros e busca de produtos
- ✅ Estados dos produtos (draft, submitted, published, etc.)
- 🚧 Editar produtos (em desenvolvimento)
- 🚧 Histórico de vendas (em desenvolvimento)

**Fluxo de teste completo:**
1. Fazer login como vendedor
2. Ir para "Painel do Vendedor"
3. **Verificar dashboard:**
   - Métricas de produtos
   - Gráfico de vendas
   - Lista de produtos recentes
4. **Ir para "Meus Produtos":**
   - Ver produtos existentes
   - Testar filtros (status, categoria, busca)
5. **Criar novo produto:**
   - Clicar em "Novo Produto"
   - Preencher formulário completo
   - Adicionar múltiplas imagens (URLs)
   - Usar gerador automático de SKU
   - Salvar produto
6. **Gerenciar produtos:**
   - Enviar produto para aprovação
   - Tentar excluir produto

---

### 🛍️ Comprador
**Login**: `comprador@marketplace.com` / `comprador123`

**O que testar:**
- ✅ Navegar na vitrine (home)
- ✅ Sistema de busca e filtros
- ✅ Adicionar produtos ao carrinho
- ✅ Gerenciar carrinho
- 🚧 Visualizar produto individual (em desenvolvimento)
- 🚧 Finalizar compra/checkout (em desenvolvimento)
- 🚧 Histórico de pedidos (em desenvolvimento)

**Fluxo de teste completo:**
1. **Como visitante (sem login):**
   - Navegar na home
   - Ver produtos publicados
   - Usar busca e filtros
   - Adicionar produtos ao carrinho
   - Carrinho deve persistir ao recarregar página
2. **Fazer login como comprador:**
   - Carrinho deve permanecer
   - Ir para "Meus Pedidos"
3. **Testar carrinho:**
   - Adicionar/remover produtos
   - Alterar quantidades
   - Verificar cálculos
   - Tentar checkout (redireciona para login se não logado)

---

## 🔄 Fluxos de Integração

### Fluxo Completo: Produto → Venda

1. **Vendedor cria produto** (`vendedor@marketplace.com`)
   - Login → Criar produto → Salvar como draft

2. **Vendedor envia para aprovação**
   - Meus Produtos → Enviar para aprovação
   - Status muda para "Em análise"

3. **Gestor aprova produto** (`gestor@marketplace.com`)
   - 🚧 Login → Fila de aprovação → Aprovar
   - Status muda para "Aprovado"

4. **Gestor publica produto**
   - 🚧 Catálogo → Publicar
   - Status muda para "Publicado"
   - Produto aparece na vitrine pública

5. **Comprador compra produto** (`comprador@marketplace.com`)
   - ✅ Home → Adicionar ao carrinho
   - 🚧 Checkout → Finalizar compra

### Fluxo de Carrinho Persistente

1. **Como visitante:**
   - Adicionar produtos ao carrinho
   - Recarregar página → carrinho permanece
   - Fazer login → carrinho ainda está lá

2. **Gerenciar estoque:**
   - Tentar adicionar mais do que o estoque disponível
   - Ver avisos de estoque baixo

---

## 🐛 Casos de Teste Específicos

### Autenticação & Autorização
- [ ] Login com credenciais inválidas
- [ ] Logout funciona corretamente
- [ ] Sessão persiste após reload
- [ ] Rotas protegidas redirecionam para login
- [ ] Guards de role funcionam (vendedor não acessa admin)

### Produtos
- [ ] Criar produto sem campos obrigatórios
- [ ] Criar produto sem imagens
- [ ] Gerador de SKU automático
- [ ] Filtros funcionam corretamente
- [ ] Estados de produto estão corretos

### Carrinho
- [ ] Adicionar produto sem estoque
- [ ] Adicionar mais do que disponível
- [ ] Carrinho persiste entre sessões
- [ ] Cálculos de total estão corretos
- [ ] Remover produtos funciona

### UI/UX
- [ ] Layout responsivo (mobile/desktop)
- [ ] Loading states aparecem
- [ ] Mensagens de erro/sucesso
- [ ] Navegação funciona em mobile
- [ ] Formulários validam corretamente

---

## 🗄️ Dados de Teste

### Produtos Pré-cadastrados
- **Smartphone Galaxy Pro Max** (Publicado - Vendedor Maria)
- **Notebook Gamer RGB** (Publicado - Vendedor Maria)  
- **Tênis Esportivo Premium** (Publicado - Vendedor Ana)
- **Relógio Inteligente** (Em análise - Vendedor Maria)
- **Fone Bluetooth Premium** (Rascunho - Vendedor Ana)

### Pedidos de Exemplo
- Pedido #1: Smartphone comprado por Pedro (Pago)
- Pedido #2: Tênis comprado por Pedro (Pendente)

---

## 🔧 Troubleshooting

### Problemas Comuns

**API não inicia:**
```bash
# Verificar se porta 3001 está livre
lsof -i :3001
# Matar processo se necessário
kill -9 <PID>
```

**React não carrega:**
```bash
# Limpar cache
npm start -- --reset-cache
# ou
rm -rf node_modules package-lock.json
npm install
```

**Estilos não aplicam:**
```bash
# Verificar se Tailwind está buildando
npm run build
```

### Logs Importantes
- Browser Console: erros de JavaScript
- Network Tab: falhas de API
- Terminal API: erros do JSON Server
- Terminal React: erros de build

---

## ✅ Checklist de Funcionalidades

### Core Features
- [x] Autenticação completa
- [x] RBAC com guards
- [x] Carrinho persistente
- [x] CRUD de produtos
- [x] Dashboard vendedor
- [x] Vitrine com filtros
- [ ] Página produto individual
- [ ] Checkout Mercado Pago
- [ ] Fila de aprovação (gestor)
- [ ] Dashboard admin

### UI/UX
- [x] Design responsivo
- [x] Loading states
- [x] Validação formulários
- [x] Toasts de feedback
- [x] Navegação intuitiva
- [x] Estados vazios
- [ ] Dark mode toggle

### Advanced
- [ ] Sistema de reviews
- [ ] Chat comprador-vendedor
- [ ] Cálculo de frete
- [ ] Cupons desconto
- [ ] Relatórios avançados
- [ ] Auditoria de ações

---

## 📊 Métricas de Teste

**Performance esperada:**
- ⚡ Carregamento inicial < 3s
- 🔄 Navegação entre páginas < 1s
- 📱 Mobile responsive 100%
- ♿ Acessibilidade básica

**Compatibilidade:**
- ✅ Chrome/Edge (moderno)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

---

## 🎯 Próximos Testes

1. **Integração Mercado Pago**
   - Sandbox checkout
   - Webhooks
   - Status de pagamento

2. **Fluxo Gestor**  
   - Aprovação produtos
   - Moderação reviews
   - Relatórios

3. **Admin Dashboard**
   - Gestão usuários
   - Configurações
   - KPIs marketplace

---

**🔍 Encontrou um bug?** 
Documente: URL, passos para reproduzir, comportamento esperado vs atual, browser/device.
