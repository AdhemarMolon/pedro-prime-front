# 🚀 Guia de Deploy no Vercel com Neon PostgreSQL

## 📋 Pré-requisitos

- ✅ Conta no [Vercel](https://vercel.com)
- ✅ Conta no [Neon](https://neon.tech) (já configurada)
- ✅ Repositório no GitHub com o código
- ✅ Dados migrados para o Neon PostgreSQL

---

## 🎯 Passo 1: Preparar o Projeto

### 1.1 Commit e Push do código

```bash
git add .
git commit -m "feat: migração para Neon PostgreSQL com Prisma"
git push origin main
```

### 1.2 Verificar vercel.json

O arquivo `vercel.json` já está configurado:

```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "/api/:path*" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    }
  ]
}
```

---

## 🌐 Passo 2: Deploy no Vercel

### 2.1 Importar Projeto

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Clique em **"Import Git Repository"**
3. Selecione seu repositório: `AdhemarMolon/pedro-prime-front`
4. Clique em **"Import"**

### 2.2 Configurar Build Settings

O Vercel detecta automaticamente:
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

✅ **Não precisa alterar nada!**

---

## 🔐 Passo 3: Configurar Variáveis de Ambiente

### 3.1 Ir para Environment Variables

1. No Vercel Dashboard, clique no projeto
2. Vá em **Settings** → **Environment Variables**

### 3.2 Adicionar Variáveis (COPIE EXATAMENTE)

Adicione **TODAS** estas variáveis:

#### 🗄️ Database (Neon)

**Nome:** `DATABASE_URL_POOLED`  
**Valor:**
```
postgresql://neondb_owner:npg_xdgRyDfNqt83@ep-restless-math-acxcj9t3-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true&connect_timeout=15
```
**Environments:** ✅ Production, ✅ Preview, ✅ Development

---

#### 🔐 JWT Secret

**⚠️ IMPORTANTE:** Gere um secret aleatório seguro!

**Opção 1:** Use o gerador online
- Acesse: https://generate-secret.vercel.app/32
- Copie o secret gerado

**Opção 2:** Gere via terminal (PowerShell)
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Nome:** `JWT_SECRET`  
**Valor:** `[cole o secret gerado acima]`  
**Environments:** ✅ Production, ✅ Preview, ✅ Development

---

#### 🌐 Site URL

**Nome:** `VITE_SITE_URL`  
**Valor:** `https://seu-dominio.vercel.app` *(você receberá este domínio após o primeiro deploy)*  
**Environments:** ✅ Production

---

#### 🔧 API URL

**Nome:** `VITE_API_URL`  
**Valor:** `` (deixe VAZIO - usa o mesmo domínio)  
**Environments:** ✅ Production, ✅ Preview

---

#### 📦 Node Environment

**Nome:** `NODE_ENV`  
**Valor:** `production`  
**Environments:** ✅ Production

---

### 3.3 Resumo das Variáveis

Você deve ter **5 variáveis** configuradas:

| Nome | Valor | Environments |
|------|-------|--------------|
| `DATABASE_URL_POOLED` | Connection string do Neon (pooled) | All |
| `JWT_SECRET` | Secret aleatório gerado | All |
| `VITE_SITE_URL` | `https://seu-dominio.vercel.app` | Production |
| `VITE_API_URL` | `` (vazio) | Production, Preview |
| `NODE_ENV` | `production` | Production |

---

## 🚀 Passo 4: Deploy

### 4.1 Fazer o Deploy

1. Clique em **"Deploy"**
2. Aguarde o build (1-3 minutos)
3. ✅ Deploy concluído!

### 4.2 Obter o Domínio

Após o deploy, você receberá um domínio tipo:
```
https://pedro-prime-front.vercel.app
```

### 4.3 Atualizar VITE_SITE_URL

1. Copie o domínio do Vercel
2. Volte em **Settings** → **Environment Variables**
3. Edite `VITE_SITE_URL`
4. Cole o domínio real
5. Clique em **"Save"**
6. Faça um **Redeploy** (vai aparecer um botão)

---

## 🔍 Passo 5: Verificar se Funcionou

### 5.1 Testar o Site

Acesse: `https://seu-dominio.vercel.app`

Deve carregar a página inicial com os imóveis!

### 5.2 Testar a API

Acesse: `https://seu-dominio.vercel.app/api/imoveis`

Deve retornar JSON com os imóveis do Neon.

### 5.3 Testar o Admin

1. Acesse: `https://seu-dominio.vercel.app/admin/login`
2. Login:
   - **Email:** `admin@pedro.com`
   - **Senha:** `admin123`
3. Deve fazer login com sucesso!

---

## 🐛 Troubleshooting

### ❌ Erro "Database connection failed"

**Solução:** Verifique se `DATABASE_URL_POOLED` está correta:
- Deve ter `-pooler` no host
- Deve ter `&pgbouncer=true`
- Deve ter `&connect_timeout=15`

### ❌ Erro "JWT malformed" no login

**Solução:** Verifique se `JWT_SECRET` está configurada e não está vazia.

### ❌ Imóveis não aparecem

**Solução 1:** Verifique se migrou os dados:
```bash
npm run migrate
```

**Solução 2:** Acesse Prisma Studio localmente:
```bash
npm run db:studio
```
Veja se tem imóveis cadastrados.

### ❌ Erro de CORS

**Solução:** Verifique se `VITE_API_URL` está VAZIO em produção.

---

## 🎨 Passo 6: Domínio Personalizado (Opcional)

### 6.1 Adicionar Domínio

1. No Vercel Dashboard: **Settings** → **Domains**
2. Clique em **"Add"**
3. Digite seu domínio: `pedrotoledo.com.br`
4. Siga as instruções para configurar DNS

### 6.2 Atualizar Variáveis

Após configurar o domínio:
1. Edite `VITE_SITE_URL` para `https://pedrotoledo.com.br`
2. Faça um **Redeploy**

---

## 📊 Monitoramento

### Logs em Tempo Real

1. Vercel Dashboard → Seu Projeto
2. Aba **"Deployments"**
3. Clique em um deployment
4. Aba **"Functions"** → Ver logs das API routes

### Analytics

1. Vercel Dashboard → Seu Projeto
2. Aba **"Analytics"**
3. Veja visitantes, pageviews, etc.

---

## ✅ Checklist Final

Antes de considerar o deploy concluído:

- [ ] Site carrega em `https://seu-dominio.vercel.app`
- [ ] Imóveis aparecem na Home
- [ ] Busca funciona
- [ ] Filtros funcionam
- [ ] Página de detalhes do imóvel abre
- [ ] Botão WhatsApp funciona
- [ ] Login admin funciona
- [ ] Criar/Editar imóvel no admin funciona
- [ ] Tags aparecem nos imóveis
- [ ] Sem erros no console do navegador

---

## 🔄 Atualizações Futuras

Para fazer deploy de novas alterações:

```bash
git add .
git commit -m "feat: nova funcionalidade"
git push origin main
```

O Vercel faz deploy automático a cada push! 🚀

---

## 📞 Suporte

- **Vercel Docs:** https://vercel.com/docs
- **Neon Docs:** https://neon.tech/docs
- **Prisma Docs:** https://www.prisma.io/docs

---

**Pronto!** Seu site está no ar com Neon PostgreSQL + Vercel! 🎉
