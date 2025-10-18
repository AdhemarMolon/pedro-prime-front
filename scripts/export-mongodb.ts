// scripts/export-mongodb.ts
// Script para exportar dados do MongoDB atual para backup-imoveis.json

const API_URL = 'https://fullstack-imoveis-api.onrender.com';

async function exportData() {
  console.log('📥 Exportando dados do MongoDB...\n');

  try {
    // Buscar todos os imóveis
    const response = await fetch(`${API_URL}/api/imoveis?limit=1000`);
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    const imoveis = data.data || data;

    console.log(`✅ Encontrados ${imoveis.length} imóveis`);

    // Salvar em arquivo JSON
    const fs = await import('fs');
    const path = await import('path');
    
    const backupPath = path.join(process.cwd(), 'backup-imoveis.json');
    fs.writeFileSync(backupPath, JSON.stringify(imoveis, null, 2));

    console.log(`\n💾 Backup salvo em: ${backupPath}`);
    console.log(`\n📊 Resumo dos dados:`);
    console.log(`   - Total de imóveis: ${imoveis.length}`);
    
    // Estatísticas
    interface ImovelMongo {
      tipo?: string;
      endereco?: { cidade?: string };
    }
    
    const tipos = [...new Set(imoveis.map((i: ImovelMongo) => i.tipo).filter(Boolean))];
    const cidades = [...new Set(imoveis.map((i: ImovelMongo) => i.endereco?.cidade).filter(Boolean))];
    
    console.log(`   - Tipos: ${tipos.join(', ')}`);
    console.log(`   - Cidades: ${cidades.join(', ')}`);
    
    console.log('\n✅ Exportação concluída!');
    console.log('\n🚀 Próximo passo: npm run migrate');

  } catch (error) {
    console.error('❌ Erro ao exportar dados:', error);
    process.exit(1);
  }
}

exportData();
