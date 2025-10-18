# 🔐 Atualização de Credenciais Admin

## ⚠️ IMPORTANTE: Atualizar no Backend

As credenciais de login foram alteradas no frontend, mas você precisa atualizar no **BACKEND** também!

### Novas Credenciais:
- **Email:** `teste@gmail.com`
- **Senha:** `Batata`

---

## 📝 Como Atualizar no Backend (Prisma)

Você tem 2 opções:

### Opção 1: Via Prisma Studio (Mais Fácil)
```bash
# No seu repositório do backend
npx prisma studio

# Depois:
# 1. Vá na tabela "Admin" ou "User"
# 2. Edite o registro do admin
# 3. Atualize email para: teste@gmail.com
# 4. Atualize senha (hash bcrypt de "Batata")
```

### Opção 2: Via Script SQL
```bash
# No seu repositório do backend, crie um arquivo update-admin.ts:
```

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('Batata', 10);
  
  await prisma.admin.upsert({
    where: { email: 'admin@pedro.com' },
    update: {
      email: 'teste@gmail.com',
      password: hashedPassword,
    },
    create: {
      email: 'teste@gmail.com',
      password: hashedPassword,
      nome: 'Admin',
    },
  });
  
  console.log('✅ Credenciais atualizadas!');
  console.log('   Email: teste@gmail.com');
  console.log('   Senha: Batata');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

```bash
# Execute:
npx tsx update-admin.ts
```

---

## 🚨 Checklist

- [ ] Atualizar credenciais no banco de dados do backend
- [ ] Testar login com `teste@gmail.com` / `Batata`
- [ ] Remover script `update-admin.ts` após execução (segurança)
- [ ] ✅ Frontend já está atualizado (sem exposição de credenciais)

---

## 📍 Localização do Backend

Seu backend está em: **https://fullstack-imoveis-api.onrender.com**

Você precisa acessar o repositório do backend no GitHub e fazer essa atualização lá.

---

## 🔒 Segurança

✅ **O que foi removido do frontend:**
- Box com credenciais visíveis removido
- Placeholder genérico no campo email
- Nenhuma exposição de senha na UI

⚠️ **Ainda precisa fazer no backend:**
- Atualizar email e senha no banco de dados
- Testar autenticação com novas credenciais
