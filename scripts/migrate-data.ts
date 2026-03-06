// scripts/migrate-data.ts
// Script para migrar dados do MongoDB (backup JSON) para Neon PostgreSQL

import { PrismaClient, TipoImovel, FinalidadeImovel, TagImovel } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/*  helpers de mapeamento  */

function mapTipo(raw: string): TipoImovel {
  const t = (raw || '').toUpperCase();
  if (t.includes('APARTAMENTO')) return 'APARTAMENTO';
  if (t.includes('SOBRADO'))     return 'SOBRADO';
  if (t.includes('KITNET'))      return 'KITNET';
  if (t.includes('CHACARA') || t.includes('CHÁCARA') || t.includes('SÍTIO') || t.includes('SITIO')) return 'CHACARA';
  if (t.includes('TERRENO') || t.includes('ÁREA') || t.includes('AREA')) return 'TERRENO';
  if (t.includes('COMERCIAL') || t.includes('SALÃO') || t.includes('SALAO') || t.includes('GALPÃO') || t.includes('GALPAO')) return 'COMERCIAL';
  if (t.includes('RURAL'))       return 'RURAL';
  if (t.includes('CASA'))        return 'CASA';
  // default
  return 'CASA';
}

function mapFinalidade(raw: string): FinalidadeImovel {
  const f = (raw || '').toUpperCase();
  if (f.includes('ALUGUEL') && f.includes('VENDA')) return 'VENDA_ALUGUEL';
  if (f.includes('ALUGUEL') || f.includes('LOCAÇÃO') || f.includes('LOCACAO')) return 'ALUGUEL';
  return 'VENDA';
}

function inferTags(imovel: any): TagImovel[] {
  const tags: TagImovel[] = [];
  const desc = ((imovel.descricao || '') + ' ' + (imovel.titulo || '')).toUpperCase();

  if (desc.includes('FINANC'))     tags.push('ACEITA_FINANCIAMENTO');
  if (desc.includes('PERMUTA'))    tags.push('ACEITA_PERMUTA');
  if (desc.includes('MOBILIA'))    tags.push('MOBILIADO');
  if (desc.includes('PISCINA'))    tags.push('PISCINA');
  if (desc.includes('GOURMET'))    tags.push('AREA_GOURMET');
  if (desc.includes('QUINTAL'))    tags.push('QUINTAL');
  if (desc.includes('PET'))        tags.push('PET_FRIENDLY');
  if (desc.includes('SOLAR'))      tags.push('ENERGIA_SOLAR');
  if (desc.includes('CONDOMÍNIO') || desc.includes('CONDOMINIO')) tags.push('CONDOMINIO_FECHADO');

  return tags;
}

/*  main  */

async function migrate() {
  console.log(' Iniciando migração de dados para Neon...\n');

  try {
    // 1. Ler backup
    const backupPath = path.join(process.cwd(), 'backup-imoveis.json');
    if (!fs.existsSync(backupPath)) {
      console.log(' backup-imoveis.json não encontrado!');
      return;
    }

    const rawData = fs.readFileSync(backupPath, 'utf-8');
    const imoveisAntigos = JSON.parse(rawData);
    console.log(` ${imoveisAntigos.length} imóveis para migrar\n`);

    // 2. Criar admin padrão
    const adminExists = await prisma.admin.findUnique({ where: { email: 'admin@pedro.com' } });
    if (!adminExists) {
      const senhaCriptografada = await bcrypt.hash('admin123', 10);
      await prisma.admin.create({
        data: { nome: 'Pedro de Toledo', email: 'admin@pedro.com', senha: senhaCriptografada },
      });
      console.log(' Admin criado: admin@pedro.com / admin123\n');
    } else {
      console.log('ℹ  Admin já existe\n');
    }

    // 3. Migrar imóveis
    let ok = 0, erros = 0;

    for (const old of imoveisAntigos) {
      try {
        // Normalizar imagens
        let imagens: string[] = [];
        if (old.imagens && Array.isArray(old.imagens)) {
          imagens = old.imagens
            .map((img: any) => (typeof img === 'string' ? img : img?.url || ''))
            .filter((u: string) => u);
        }

        // Mapear tipo e finalidade
        const tipo = mapTipo(old.tipo || old.titulo || '');
        const finalidade = mapFinalidade(old.finalidade || old.tipo || '');
        const tags = inferTags(old);

        // Extrair dados (flat ou nested)
        const cidade    = old.endereco?.cidade   || old.cidade    || 'São Carlos';
        const estado    = old.endereco?.estado   || old.estado    || 'SP';
        const bairro    = old.endereco?.bairro   || old.bairro    || '';
        const logradouro= old.endereco?.logradouro || old.logradouro || '';
        const numero    = String(old.endereco?.numero || old.numero || '');
        const cep       = old.endereco?.cep      || old.cep       || '';
        const quartos   = parseInt(old.caracteristicas?.quartos   || old.quartos   || '0') || 0;
        const banheiros = parseInt(old.caracteristicas?.banheiros || old.banheiros || '0') || 0;
        const garagem   = parseInt(old.caracteristicas?.garagem   || old.garagem   || old.vagas || '0') || 0;
        const suites    = parseInt(old.caracteristicas?.suites    || old.suites    || '0') || 0;
        const area_m2   = parseFloat(old.caracteristicas?.area_m2 || old.area_m2 || old.area || '0') || 0;

        // Preço - manter como está (em reais)
        const preco = parseFloat(old.preco || '0') || 0;

        await prisma.imovel.create({
          data: {
            titulo: old.titulo || 'Imóvel sem título',
            descricao: old.descricao || '',
            preco,
            tipo,
            finalidade,
            tags,
            cidade,
            estado,
            bairro,
            logradouro,
            numero,
            cep,
            quartos:   quartos   || null,
            banheiros: banheiros || null,
            suites:    suites    || null,
            garagem:   garagem   || null,
            area_m2:   area_m2   || null,
            imagens,
            createdAt: old.createdAt ? new Date(old.createdAt) : new Date(),
            ativo: true,
          },
        });

        ok++;
        console.log(`   ${ok}/${imoveisAntigos.length} - [${tipo}] ${old.titulo}`);
      } catch (error: any) {
        erros++;
        console.log(`   Erro: ${old.titulo}  ${error.message}`);
      }
    }

    console.log(`\n Migração concluída: ${ok}  | ${erros} `);

    // 4. Verificar
    const total = await prisma.imovel.count();
    const admins = await prisma.admin.count();
    console.log(`\n  Neon: ${total} imóveis, ${admins} admin(s)`);

  } catch (error) {
    console.error(' Erro na migração:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrate();