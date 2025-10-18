// scripts/migrate-data.ts
// Script para migrar dados do MongoDB para Neon PostgreSQL

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function migrate() {
  console.log('🚀 Iniciando migração de dados...\n');

  try {
    // 1. Ler arquivo de backup
    const backupPath = path.join(process.cwd(), 'backup-imoveis.json');
    
    if (!fs.existsSync(backupPath)) {
      console.log('❌ Arquivo backup-imoveis.json não encontrado!');
      console.log('💡 Exporte os dados do MongoDB e salve em backup-imoveis.json');
      return;
    }

    const rawData = fs.readFileSync(backupPath, 'utf-8');
    const imoveisAntigos = JSON.parse(rawData);

    console.log(`📦 Encontrados ${imoveisAntigos.length} imóveis para migrar\n`);

    // 2. Criar usuário admin se não existir
    const adminExists = await prisma.admin.findUnique({
      where: { email: 'admin@pedro.com' },
    });

    if (!adminExists) {
      const senhaCriptografada = await bcrypt.hash('admin123', 10);
      
      await prisma.admin.create({
        data: {
          nome: 'Pedro de Toledo',
          email: 'admin@pedro.com',
          senha: senhaCriptografada,
        },
      });
      
      console.log('✅ Usuário admin criado');
      console.log('   Email: admin@pedro.com');
      console.log('   Senha: admin123\n');
    } else {
      console.log('ℹ️  Usuário admin já existe\n');
    }

    // 3. Migrar imóveis
    let sucessos = 0;
    let erros = 0;

    for (const imovelAntigo of imoveisAntigos) {
      try {
        // Normalizar imagens
        let imagens: string[] = [];
        if (imovelAntigo.imagens && Array.isArray(imovelAntigo.imagens)) {
          imagens = imovelAntigo.imagens.map((img: string | { url: string }) => {
            if (typeof img === 'string') return img;
            return img.url || '';
          }).filter((url: string) => url);
        }

        // Criar imóvel
        await prisma.imovel.create({
          data: {
            titulo: imovelAntigo.titulo || 'Imóvel sem título',
            descricao: imovelAntigo.descricao || '',
            preco: parseFloat(imovelAntigo.preco || 0),
            tipo: 'CASA', // Padrão - usuário pode alterar no admin
            finalidade: 'VENDA', // Padrão - usuário pode alterar no admin
            cidade: imovelAntigo.endereco?.cidade || imovelAntigo.cidade || 'Não informada',
            estado: imovelAntigo.endereco?.estado || 'SP',
            bairro: imovelAntigo.endereco?.bairro || '',
            logradouro: imovelAntigo.endereco?.logradouro || '',
            numero: imovelAntigo.endereco?.numero || '',
            cep: imovelAntigo.endereco?.cep || '',
            quartos: parseInt(imovelAntigo.caracteristicas?.quartos || imovelAntigo.quartos || 0),
            banheiros: parseInt(imovelAntigo.caracteristicas?.banheiros || imovelAntigo.banheiros || 0),
            garagem: parseInt(imovelAntigo.caracteristicas?.garagem || imovelAntigo.garagem || imovelAntigo.vagas || 0),
            area_m2: parseFloat(imovelAntigo.caracteristicas?.area_m2 || imovelAntigo.area || imovelAntigo.area_m2 || 0),
            imagens: imagens,
            tags: [], // Usuário pode adicionar tags manualmente via admin
          },
        });

        sucessos++;
        console.log(`✅ ${sucessos}/${imoveisAntigos.length} - ${imovelAntigo.titulo}`);
      } catch (error) {
        erros++;
        console.log(`❌ Erro ao migrar: ${imovelAntigo.titulo}`);
        console.error(error);
      }
    }

    console.log('\n📊 Migração concluída!');
    console.log(`   ✅ Sucessos: ${sucessos}`);
    console.log(`   ❌ Erros: ${erros}`);
    console.log(`\n🎯 Próximo passo: npm run db:studio (para visualizar os dados)`);

  } catch (error) {
    console.error('❌ Erro na migração:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrate();
