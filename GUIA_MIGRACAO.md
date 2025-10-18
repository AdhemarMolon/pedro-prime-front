# 🚀 Guia Completo de Migração: MongoDB → Neon PostgreSQL

## 📋 Índice
1. [Preparação](#preparação)
2. [Configuração do Neon](#configuração-do-neon)
3. [Instalação das Dependências](#instalação-das-dependências)
4. [Configuração do Prisma](#configuração-do-prisma)
5. [Migração dos Dados](#migração-dos-dados)
6. [Atualização do Frontend](#atualização-do-frontend)
7. [Deploy no Vercel](#deploy-no-vercel)

---

## 1. Preparação

### 1.1 Backup dos Dados Atuais

**Exporte os imóveis do MongoDB:**
```bash
# Se usar MongoDB Atlas, baixe via interface ou:
mongoexport --uri="sua-connection-string" --collection=imoveis --out=backup-imoveis.json
```

**Ou use a API atual para exportar:**
```javascript
// Execute no console do navegador na página de admin
const exportData = async () => {
  const res = await fetch('https://sua-api.com/api/imoveis?limit=1000');
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
  // Copie e salve em arquivo backup-imoveis.json
};
exportData();
```

---

## 2. Configuração do Neon

### 2.1 Criar Conta no Neon

1. Acesse: https://neon.tech
2. Faça login com GitHub
3. Clique em "Create Project"
4. Nome do projeto: `pedro-imoveis`
5. Região: escolha a mais próxima (ex: `US East`)

### 2.2 Obter Connection String

Após criar o projeto, você verá:
```
postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

**Copie esta string!** Você vai precisar dela.

### 2.3 Configurar Pooling (Importante para Vercel)

No dashboard do Neon:
1. Vá em "Connection Details"
2. Ative "Pooled connection"
3. Copie também a connection string pooled:
```
postgresql://user:password@ep-xxx-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
```

---

## 3. Instalação das Dependências

### 3.1 Instalar Prisma e Dependências

```bash
# No diretório do projeto frontend
npm install prisma @prisma/client
npm install -D prisma

# Para variáveis de ambiente
npm install dotenv
```

### 3.2 Criar arquivo .env

Crie `.env` na raiz do projeto:

```env
# Neon Database (Direct connection - para migrations)
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Neon Database (Pooled connection - para produção)
DATABASE_URL_POOLED="postgresql://user:password@ep-xxx-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&pgbouncer=true"

# Secret para JWT (gere um aleatório)
JWT_SECRET="seu-secret-super-secreto-aqui"

# API Base URL
VITE_API_BASE="http://localhost:3000"
```

**⚠️ IMPORTANTE:** Adicione `.env` ao `.gitignore`!

```gitignore
# .gitignore
.env
.env.local
.env.production
```

---

## 4. Configuração do Prisma

### 4.1 Inicializar Prisma

O schema já foi criado em `prisma/schema.prisma`

### 4.2 Gerar Cliente Prisma

```bash
npx prisma generate
```

### 4.3 Criar e Aplicar Migrations

```bash
# Criar a primeira migration
npx prisma migrate dev --name init

# Isso vai:
# 1. Criar as tabelas no Neon
# 2. Gerar o Prisma Client
# 3. Aplicar o schema
```

### 4.4 Verificar no Neon

Abra o Neon Studio:
```bash
npx prisma studio
```

Ou verifique no dashboard do Neon que as tabelas foram criadas.

---

## 5. Migração dos Dados

### 5.1 Criar Script de Migração

Crie `scripts/migrate-data.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Mapeamento de tipos
const mapTipo = (tipo: string): string => {
  const map: Record<string, string> = {
    'casa': 'CASA',
    'apartamento': 'APARTAMENTO',
    'terreno': 'TERRENO',
    'comercial': 'COMERCIAL',
    'rural': 'RURAL',
    'sobrado': 'SOBRADO',
    'kitnet': 'KITNET',
    'chacara': 'CHACARA',
  };
  return map[tipo.toLowerCase()] || 'APARTAMENTO';
};

const mapFinalidade = (finalidade: string): string => {
  const map: Record<string, string> = {
    'venda': 'VENDA',
    'aluguel': 'ALUGUEL',
    'venda/aluguel': 'VENDA_ALUGUEL',
  };
  return map[finalidade.toLowerCase()] || 'VENDA';
};

// Mapear tags baseado em características
const detectTags = (imovel: any): string[] => {
  const tags: string[] = [];
  
  if (imovel.destaque) tags.push('DESTAQUE');
  if (imovel.lancamento) tags.push('LANCAMENTO');
  if (imovel.mobiliado) tags.push('MOBILIADO');
  if (imovel.piscina || (imovel.caracteristicas && imovel.caracteristicas.includes('piscina'))) {
    tags.push('PISCINA');
  }
  if (imovel.garagem > 0) tags.push('GARAGEM_COBERTA');
  if (imovel.preco < 200000) tags.push('OPORTUNIDADE');
  
  // Adicione mais lógica conforme necessário
  tags.push('ACEITA_FINANCIAMENTO'); // Default
  
  return tags;
};

async function migrateData() {
  try {
    // 1. Ler arquivo de backup
    const backupPath = path.join(process.cwd(), 'backup-imoveis.json');
    const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
    
    console.log(`📦 Encontrados ${backupData.length} imóveis para migrar`);

    // 2. Criar admin padrão
    const admin = await prisma.admin.upsert({
      where: { email: 'pedro.toledo@creci.org.br' },
      update: {},
      create: {
        nome: 'Pedro de Toledo',
        email: 'pedro.toledo@creci.org.br',
        senha: '$2a$10$hashed_password_here', // Use bcrypt para hash
        ativo: true,
      },
    });

    console.log('✅ Admin criado/atualizado');

    // 3. Migrar cada imóvel
    let migrados = 0;
    for (const imovelAntigo of backupData) {
      try {
        // Preparar imagens
        let imagens = [];
        if (Array.isArray(imovelAntigo.imagens)) {
          imagens = imovelAntigo.imagens.map((img: any) => 
            typeof img === 'string' ? img : img.url
          );
        }

        // Criar imóvel
        await prisma.imovel.create({
          data: {
            titulo: imovelAntigo.titulo || 'Imóvel',
            descricao: imovelAntigo.descricao || '',
            preco: imovelAntigo.preco || 0,
            tipo: mapTipo(imovelAntigo.tipo || 'apartamento'),
            finalidade: mapFinalidade(imovelAntigo.finalidade || 'venda'),
            status: 'DISPONIVEL',
            tags: detectTags(imovelAntigo),
            
            // Endereço
            logradouro: imovelAntigo.endereco?.logradouro,
            numero: imovelAntigo.endereco?.numero,
            bairro: imovelAntigo.endereco?.bairro || imovelAntigo.bairro || 'Centro',
            cidade: imovelAntigo.endereco?.cidade || imovelAntigo.cidade || 'São Paulo',
            estado: imovelAntigo.endereco?.estado || 'SP',
            cep: imovelAntigo.endereco?.cep,
            
            // Características
            quartos: imovelAntigo.caracteristicas?.quartos || imovelAntigo.quartos,
            banheiros: imovelAntigo.caracteristicas?.banheiros || imovelAntigo.banheiros,
            garagem: imovelAntigo.caracteristicas?.garagem || imovelAntigo.garagem || imovelAntigo.vagas,
            area_m2: imovelAntigo.caracteristicas?.area_m2 || imovelAntigo.area,
            
            // Imagens
            imagens: JSON.stringify(imagens),
            
            // Admin
            createdBy: admin.id,
            ativo: true,
          },
        });

        migrados++;
        console.log(`✅ Migrado: ${imovelAntigo.titulo} (${migrados}/${backupData.length})`);
      } catch (error) {
        console.error(`❌ Erro ao migrar ${imovelAntigo.titulo}:`, error);
      }
    }

    console.log(`\n🎉 Migração concluída! ${migrados} imóveis migrados com sucesso!`);

  } catch (error) {
    console.error('❌ Erro na migração:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateData();
```

### 5.2 Executar Migração

```bash
# Instalar ts-node se necessário
npm install -D ts-node @types/node

# Executar script
npx ts-node scripts/migrate-data.ts
```

### 5.3 Verificar Dados

```bash
npx prisma studio
# Abra o navegador e verifique se os dados estão lá
```

---

## 6. Atualização do Backend/API

Se você tem um backend separado, atualize para usar Prisma.

### 6.1 Criar API Routes (se usar Next.js)

Ou configure o backend para usar:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Exemplo: Listar imóveis
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');
  const skip = (page - 1) * limit;

  const [imoveis, total] = await Promise.all([
    prisma.imovel.findMany({
      where: { ativo: true },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.imovel.count({ where: { ativo: true } }),
  ]);

  return Response.json({
    data: imoveis,
    total,
    page,
    limit,
  });
}
```

---

## 7. Deploy no Vercel

### 7.1 Configurar Variáveis de Ambiente

No Vercel Dashboard:
1. Vá em Settings > Environment Variables
2. Adicione:
   - `DATABASE_URL_POOLED` = (sua connection string pooled)
   - `JWT_SECRET` = (seu secret)

### 7.2 Atualizar vercel.json

```json
{
  "buildCommand": "prisma generate && npm run build",
  "env": {
    "DATABASE_URL": "@database_url_pooled"
  }
}
```

### 7.3 Deploy

```bash
git add .
git commit -m "Migração para PostgreSQL com Neon"
git push origin main
```

O Vercel vai fazer deploy automaticamente!

---

## 8. Checklist Final

- [ ] Backup dos dados antigos criado
- [ ] Neon database configurado
- [ ] Prisma schema criado
- [ ] Migrations executadas
- [ ] Dados migrados com sucesso
- [ ] Prisma Client gerado
- [ ] API atualizada para usar Prisma
- [ ] Frontend testado localmente
- [ ] Variáveis de ambiente no Vercel
- [ ] Deploy realizado
- [ ] Testes em produção

---

## 🆘 Troubleshooting

### Erro: "Can't reach database server"
- Verifique se a connection string está correta
- Verifique se o IP está permitido no Neon (geralmente é liberado)

### Erro: "Too many connections"
- Use a connection string POOLED em produção
- Configure o Prisma Client corretamente

### Dados não aparecem
- Verifique `ativo: true` nos filtros
- Verifique se a migração foi completa no Prisma Studio

---

## 📚 Recursos Úteis

- [Neon Docs](https://neon.tech/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Vercel + Prisma](https://vercel.com/guides/nextjs-prisma-postgres)

---

## 💡 Próximos Passos Após Migração

1. ✅ Implementar filtros por tags
2. ✅ Melhorar área admin
3. ✅ Adicionar analytics
4. ✅ Configurar backups automáticos no Neon
5. ✅ Otimizar queries com índices

---

**✨ Pronto! Seu banco agora é relacional, escalável e rápido!**
