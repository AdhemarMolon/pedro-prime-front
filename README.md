# Pedro de Toledo Imóveis

Site imobiliário moderno e responsivo desenvolvido com React, TypeScript, Tailwind CSS e PostgreSQL (Neon). Interface completa para busca de imóveis com sistema de tags e painel administrativo.

## 🚀 Tecnologias

### Frontend
- **React 18** - Framework frontend
- **TypeScript** - Tipagem estática
- **Vite** - Build tool ultrarrápido
- **Tailwind CSS** - Framework de estilos utilitários
- **React Router** - Roteamento do lado do cliente
- **Shadcn/ui** - Componentes de interface
- **Lucide React** - Ícones modernos

### Backend & Database
- **Neon PostgreSQL** - Banco de dados serverless (região: São Paulo)
- **Prisma ORM** - Client type-safe para banco de dados
- **Vercel** - Hosting e deploy automático

## 🎨 Design System

- **Fonte**: Inter (Google Fonts)
- **Cores principais**:
  - `--brand-blue`: #1f3fae (azul principal)
  - `--brand-amber`: #f59e0b (CTA laranja/âmbar)
- **Estilo**: Clean, profissional, cards grandes com sombras sutis

## 📱 Funcionalidades

### Área Pública
- **Home**: Hero section com busca, filtros avançados, grid de imóveis com paginação
- **Detalhes do Imóvel**: Galeria de imagens, características completas, tags, compartilhamento social
- **Busca e Filtros**: Por tipo, cidade, bairro, quartos, preço, área, tags
- **Sistema de Tags**: 18 tags predefinidas (Destaque, Lançamento, Aceita Financiamento, etc.)
- **WhatsApp**: Botão flutuante + CTAs diretos para contato
- **SEO**: Meta tags completas, Open Graph, Twitter Cards, Schema.org
- **Breadcrumbs**: Navegação facilitada
- **Estados visuais**: Loading skeletons, estado vazio, tratamento de erro

### Área Administrativa
- **Login**: Autenticação com JWT
- **Lista de Imóveis**: Tabela com todos os imóveis (incluindo rascunhos e vendidos)
- **Formulário**: Criar/editar imóveis com seletor visual de tags
- **Upload de Imagens**: Múltiplas imagens por imóvel
- **Logs de Ações**: Rastreamento de alterações

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (shadcn)
│   ├── Nav.tsx         # Navegação principal
│   ├── Hero.tsx        # Hero com busca
│   ├── CardImovel.tsx  # Card de imóvel
│   ├── Filtros.tsx     # Filtros avançados
│   ├── FormContato.tsx # Formulário de contato
│   ├── TagSelector.tsx # Seletor visual de tags
│   ├── WhatsAppButton.tsx # Botão flutuante
│   ├── Breadcrumbs.tsx # Navegação breadcrumb
│   └── ShareButtons.tsx # Compartilhamento social
├── pages/              # Páginas da aplicação
│   ├── Home.tsx        # Página inicial com filtros
│   ├── Imovel.tsx      # Detalhes do imóvel
│   ├── Sobre.tsx       # Sobre o corretor
│   ├── AdminLogin.tsx  # Login administrativo
│   ├── AdminImoveis.tsx # Lista admin
│   └── AdminImovelForm.tsx # Formulário admin
├── lib/                # Utilitários
│   ├── api.ts          # Client de API
│   ├── utils.ts        # Funções auxiliares
│   └── constants.ts    # Tags e enums centralizados
├── hooks/              # Custom hooks
└── context/            # Contexts React

prisma/
├── schema.prisma       # Schema do banco (Imovel, Admin, LogAcao)
└── migrations/         # Histórico de migrations

scripts/
├── migrate-data.ts     # Migração MongoDB → PostgreSQL
└── export-mongodb.ts   # Exportar dados do MongoDB
```

## 🚀 Como executar

### Pré-requisitos
- Node.js 18+ 
- npm ou bun
- Conta no [Neon](https://neon.tech) (PostgreSQL)

### Instalação Local

```bash
# Clone o repositório
git clone https://github.com/AdhemarMolon/pedro-prime-front.git
cd pedro-prime-front

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais do Neon

# Gere o Prisma Client
npm run db:generate

# Execute as migrations
npm run db:migrate

# (Opcional) Migre dados existentes
npm run export  # Exporta do MongoDB
npm run migrate # Migra para Neon

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse: http://localhost:5173

### 🌐 Deploy no Vercel

**Quick Start:**
```bash
# 1. Commit e push
git push origin main

# 2. Importe no Vercel
# https://vercel.com/new

# 3. Configure variáveis de ambiente
# DATABASE_URL_POOLED, JWT_SECRET, etc.
```

**Documentação completa:** Veja `QUICK_START_VERCEL.md` e `DEPLOY_VERCEL.md`

## 📚 Documentação Adicional

- 📖 **[GUIA_MIGRACAO.md](./GUIA_MIGRACAO.md)** - Guia completo de migração MongoDB → PostgreSQL
- 📄 **[RESUMO_SQL_TAGS.md](./RESUMO_SQL_TAGS.md)** - Resumo executivo da migração
- 🚀 **[QUICK_START_VERCEL.md](./QUICK_START_VERCEL.md)** - Deploy rápido no Vercel
- 📘 **[DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md)** - Documentação completa de deploy
git clone <URL_DO_REPOSITORIO>

# Entre na pasta do projeto
cd pedro-de-toledo-imoveis

# Instale as dependências
npm install

# Execute o projeto em modo desenvolvimento
npm run dev
```

O projeto estará disponível em `http://localhost:8080`

### Outros comandos

```bash
# Build para produção
npm run build

# Preview da build
npm run preview

# Lint do código
npm run lint
```

## 🔐 Credenciais de Demonstração

Para acessar o painel administrativo:

- **Email**: admin@pedrodetoledo.com
- **Senha**: admin123

## 📋 Páginas e Rotas

- `/` - Home pública
- `/imovel/:id` - Detalhes do imóvel
- `/admin/login` - Login administrativo
- `/admin/imoveis` - Lista de imóveis (admin)
- `/admin/imoveis/novo` - Novo imóvel (admin)
- `/admin/imoveis/:id/editar` - Editar imóvel (admin)

## 🎯 Características Técnicas

### Responsividade
- Design mobile-first
- Breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Grid adaptável: 1-2-3 colunas

### Acessibilidade
- Navegação por teclado
- Labels associadas
- Atributos ARIA
- Alto contraste

### Performance
- Lazy loading de imagens
- Skeletons durante carregamento
- Componentes otimizados
- Bundle size reduzido

### SEO
- Meta tags otimizadas
- Estrutura semântica
- URLs amigáveis
- Open Graph tags

## 🔧 Funcionalidades Simuladas

Como este é um projeto frontend puro, algumas funcionalidades são simuladas:

- **Dados**: Mock estático de 12 imóveis
- **Autenticação**: Validação local apenas
- **Formulários**: Envio simulado com feedback
- **Loading states**: Delays artificiais
- **Estados de erro**: Probabilidade configurável

## 🎨 Customização do Design

O design system está centralizado em:
- `src/index.css` - Variáveis CSS e tokens de design
- `tailwind.config.ts` - Configuração do Tailwind
- Componentes shadcn customizáveis

Para alterar cores, fontes ou espaçamentos, edite as variáveis CSS no arquivo `index.css`.

## 📱 Recursos Mobile

- Interface totalmente responsiva
- Touch gestures na galeria
- Botões dimensionados para mobile
- Menu hambúrguer (se necessário)
- CTAs otimizados para celular

## 🔮 Possíveis Melhorias

- [ ] PWA (Progressive Web App)
- [ ] Modo escuro
- [ ] Internacionalização (i18n)
- [ ] Testes unitários
- [ ] Storybook para componentes
- [ ] Animações com Framer Motion
- [ ] Integração com APIs reais
- [ ] Sistema de favoritos persistente

## 📄 Licença

Este projeto foi desenvolvido como demonstração técnica.

---

**Pedro de Toledo Imóveis** - Encontre o imóvel dos seus sonhos! 🏠