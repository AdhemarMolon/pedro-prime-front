# Pedro de Toledo Imóveis

Site imobiliário moderno e responsivo desenvolvido com React, TypeScript e Tailwind CSS. Interface completa para busca de imóveis e painel administrativo.

## 🚀 Tecnologias

- **React 18** - Framework frontend
- **TypeScript** - Tipagem estática
- **Vite** - Build tool ultrarrápido
- **Tailwind CSS** - Framework de estilos utilitários
- **React Router** - Roteamento do lado do cliente
- **Shadcn/ui** - Componentes de interface
- **Lucide React** - Ícones modernos

## 🎨 Design System

- **Fonte**: Inter (Google Fonts)
- **Cores principais**:
  - `--brand-blue`: #1f3fae (azul principal)
  - `--brand-amber`: #f59e0b (CTA laranja/âmbar)
- **Estilo**: Clean, profissional, cards grandes com sombras sutis

## 📱 Funcionalidades

### Área Pública
- **Home**: Hero section, filtros avançados, grid de imóveis com paginação
- **Detalhes do Imóvel**: Galeria de imagens, características completas, formulário de contato
- **Busca e Filtros**: Por cidade, quartos, preço, texto livre
- **Estados visuais**: Loading skeletons, estado vazio, tratamento de erro
- **Integração WhatsApp**: CTAs diretos para contato

### Área Administrativa
- **Login**: Tela de autenticação (credenciais de demo)
- **Lista de Imóveis**: Tabela com busca, filtros e ações
- **Formulário**: Criar/editar imóveis com validação completa
- **Estados simulados**: Loading, sucesso, erro

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (shadcn)
│   ├── Nav.tsx         # Navegação principal
│   ├── Hero.tsx        # Seção hero
│   ├── CardImovel.tsx  # Card de imóvel
│   ├── Filtros.tsx     # Filtros de busca
│   ├── FormContato.tsx # Formulário de contato
│   └── ...
├── pages/              # Páginas da aplicação
│   ├── Home.tsx        # Página inicial
│   ├── Imovel.tsx      # Detalhes do imóvel
│   ├── AdminLogin.tsx  # Login administrativo
│   ├── AdminImoveis.tsx # Lista admin
│   └── AdminImovelForm.tsx # Formulário admin
├── mocks/              # Dados simulados
│   └── imoveis.ts      # Mock de imóveis
├── hooks/              # Custom hooks
└── lib/                # Utilitários
```

## 🚀 Como executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação

```bash
# Clone o repositório
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