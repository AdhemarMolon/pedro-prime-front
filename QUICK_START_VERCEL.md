# ⚡ Quick Start - Deploy no Vercel

## 🎯 Resumo em 5 Passos

### 1️⃣ Fazer Push do Código
```bash
git add .
git commit -m "feat: migração para Neon + Prisma"
git push origin main
```

### 2️⃣ Importar no Vercel
1. Acesse: https://vercel.com/new
2. Selecione repositório: `pedro-prime-front`
3. Clique em "Import"

### 3️⃣ Configurar Variáveis de Ambiente

**No Vercel Dashboard > Settings > Environment Variables**

Adicione estas 5 variáveis:

```bash
# 1. Database (Neon PostgreSQL)
DATABASE_URL_POOLED="postgresql://neondb_owner:npg_xdgRyDfNqt83@ep-restless-math-acxcj9t3-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true&connect_timeout=15"

# 2. JWT Secret (⚠️ GERE UM NOVO EM: https://generate-secret.vercel.app/32)
JWT_SECRET="[cole-o-secret-gerado-aqui]"

# 3. Site URL (preencha após o primeiro deploy)
VITE_SITE_URL="https://seu-dominio.vercel.app"

# 4. API URL (deixe vazio)
VITE_API_URL=""

# 5. Node Environment
NODE_ENV="production"
```

**Importante:** Marque todas as variáveis para:
- ✅ Production
- ✅ Preview  
- ✅ Development

### 4️⃣ Deploy
Clique em **"Deploy"** e aguarde 1-3 minutos.

### 5️⃣ Atualizar VITE_SITE_URL
1. Copie o domínio gerado (ex: `https://pedro-prime-front.vercel.app`)
2. Volte em **Settings > Environment Variables**
3. Edite `VITE_SITE_URL` e cole o domínio real
4. Clique em **"Redeploy"**

---

## ✅ Testar

- **Site:** https://seu-dominio.vercel.app
- **Admin:** https://seu-dominio.vercel.app/admin/login
  - Email: `admin@pedro.com`
  - Senha: `admin123`

---

## 📚 Documentação Completa

Veja `DEPLOY_VERCEL.md` para:
- Troubleshooting detalhado
- Configuração de domínio personalizado
- Monitoramento e analytics
- Checklist completo

---

**Pronto!** 🚀 Seu site estará no ar em minutos!
