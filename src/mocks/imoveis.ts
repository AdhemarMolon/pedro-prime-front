export interface Imovel {
  _id: string;
  titulo: string;
  descricao: string;
  preco: number;
  endereco: {
    cidade: string;
    estado: string;
    bairro: string;
    rua: string;
  };
  caracteristicas: {
    quartos: number;
    banheiros: number;
    garagem: number;
    area_m2: number;
    andar?: number;
  };
  status: 'disponivel' | 'vendido' | 'alugado';
  imagens: Array<{
    url: string;
    alt: string;
  }>;
  tipo: 'casa' | 'apartamento' | 'terreno';
}

export const imoveis: Imovel[] = [
  {
    _id: '1',
    titulo: 'Casa Moderna com Piscina',
    descricao: 'Belíssima casa em condomínio fechado com área de lazer completa, piscina, churrasqueira e jardim. Acabamento de primeira qualidade.',
    preco: 850000,
    endereco: {
      cidade: 'São Paulo',
      estado: 'SP',
      bairro: 'Vila Madalena',
      rua: 'Rua das Flores, 123'
    },
    caracteristicas: {
      quartos: 4,
      banheiros: 3,
      garagem: 2,
      area_m2: 280
    },
    status: 'disponivel',
    tipo: 'casa',
    imagens: [
      {
        url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        alt: 'Fachada da casa moderna'
      },
      {
        url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
        alt: 'Sala de estar'
      },
      {
        url: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800',
        alt: 'Cozinha moderna'
      }
    ]
  },
  {
    _id: '2',
    titulo: 'Apartamento Alto Padrão Centro',
    descricao: 'Apartamento luxuoso no centro da cidade com vista panorâmica, mobiliado e decorado por arquitetos renomados.',
    preco: 1200000,
    endereco: {
      cidade: 'São Paulo',
      estado: 'SP',
      bairro: 'Centro',
      rua: 'Avenida Paulista, 1500'
    },
    caracteristicas: {
      quartos: 3,
      banheiros: 2,
      garagem: 2,
      area_m2: 120,
      andar: 15
    },
    status: 'disponivel',
    tipo: 'apartamento',
    imagens: [
      {
        url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
        alt: 'Apartamento moderno'
      },
      {
        url: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800',
        alt: 'Sala com vista'
      }
    ]
  },
  {
    _id: '3',
    titulo: 'Casa de Campo Aconchegante',
    descricao: 'Casa rústica com muito charme, ideal para quem busca tranquilidade. Amplo terreno com árvores frutíferas.',
    preco: 650000,
    endereco: {
      cidade: 'Campinas',
      estado: 'SP',
      bairro: 'Sousas',
      rua: 'Estrada Rural, km 5'
    },
    caracteristicas: {
      quartos: 3,
      banheiros: 2,
      garagem: 3,
      area_m2: 200
    },
    status: 'disponivel',
    tipo: 'casa',
    imagens: [
      {
        url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
        alt: 'Casa de campo'
      }
    ]
  },
  {
    _id: '4',
    titulo: 'Cobertura Duplex Ipanema',
    descricao: 'Magnífica cobertura duplex com terraço privativo, piscina e vista mar. Localização privilegiada.',
    preco: 2500000,
    endereco: {
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      bairro: 'Ipanema',
      rua: 'Rua Visconde de Pirajá, 800'
    },
    caracteristicas: {
      quartos: 4,
      banheiros: 4,
      garagem: 3,
      area_m2: 350,
      andar: 20
    },
    status: 'vendido',
    tipo: 'apartamento',
    imagens: [
      {
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
        alt: 'Cobertura luxuosa'
      }
    ]
  },
  {
    _id: '5',
    titulo: 'Apartamento Familiar Jardins',
    descricao: 'Apartamento espaçoso em prédio tradicional dos Jardins. Próximo a escolas, parques e comércio.',
    preco: 980000,
    endereco: {
      cidade: 'São Paulo',
      estado: 'SP',
      bairro: 'Jardins',
      rua: 'Rua Oscar Freire, 456'
    },
    caracteristicas: {
      quartos: 3,
      banheiros: 2,
      garagem: 1,
      area_m2: 95,
      andar: 8
    },
    status: 'disponivel',
    tipo: 'apartamento',
    imagens: [
      {
        url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        alt: 'Apartamento familiar'
      }
    ]
  },
  {
    _id: '6',
    titulo: 'Casa Térrea Vila Olímpia',
    descricao: 'Casa térrea reformada com quintal amplo e churrasqueira. Ideal para famílias com crianças.',
    preco: 720000,
    endereco: {
      cidade: 'São Paulo',
      estado: 'SP',
      bairro: 'Vila Olímpia',
      rua: 'Rua dos Pinheiros, 789'
    },
    caracteristicas: {
      quartos: 3,
      banheiros: 2,
      garagem: 2,
      area_m2: 180
    },
    status: 'disponivel',
    tipo: 'casa',
    imagens: [
      {
        url: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800',
        alt: 'Casa térrea'
      }
    ]
  },
  {
    _id: '7',
    titulo: 'Loft Industrial Vila Madalena',
    descricao: 'Loft moderno com pé direito alto, tijolo aparente e muito charme. Perfeito para jovens profissionais.',
    preco: 550000,
    endereco: {
      cidade: 'São Paulo',
      estado: 'SP',
      bairro: 'Vila Madalena',
      rua: 'Rua Harmonia, 321'
    },
    caracteristicas: {
      quartos: 1,
      banheiros: 1,
      garagem: 1,
      area_m2: 65,
      andar: 2
    },
    status: 'alugado',
    tipo: 'apartamento',
    imagens: [
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
        alt: 'Loft industrial'
      }
    ]
  },
  {
    _id: '8',
    titulo: 'Mansão Alto da Boa Vista',
    descricao: 'Imponente mansão com arquitetura clássica, piscina olímpica, quadra de tênis e amplo jardim.',
    preco: 4500000,
    endereco: {
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      bairro: 'Alto da Boa Vista',
      rua: 'Estrada da Boa Vista, 100'
    },
    caracteristicas: {
      quartos: 6,
      banheiros: 5,
      garagem: 4,
      area_m2: 800
    },
    status: 'disponivel',
    tipo: 'casa',
    imagens: [
      {
        url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
        alt: 'Mansão luxuosa'
      }
    ]
  },
  {
    _id: '9',
    titulo: 'Studio Compacto Bela Vista',
    descricao: 'Studio bem aproveitado e completamente mobiliado. Ideal para investimento ou primeiro imóvel.',
    preco: 280000,
    endereco: {
      cidade: 'São Paulo',
      estado: 'SP',
      bairro: 'Bela Vista',
      rua: 'Rua Augusta, 2000'
    },
    caracteristicas: {
      quartos: 1,
      banheiros: 1,
      garagem: 0,
      area_m2: 32,
      andar: 5
    },
    status: 'disponivel',
    tipo: 'apartamento',
    imagens: [
      {
        url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
        alt: 'Studio compacto'
      }
    ]
  },
  {
    _id: '10',
    titulo: 'Terreno Condomínio Alphaville',
    descricao: 'Excelente terreno plano em condomínio de alto padrão. Pronto para construir a casa dos seus sonhos.',
    preco: 320000,
    endereco: {
      cidade: 'Barueri',
      estado: 'SP',
      bairro: 'Alphaville',
      rua: 'Alameda dos Eucaliptos, lote 45'
    },
    caracteristicas: {
      quartos: 0,
      banheiros: 0,
      garagem: 0,
      area_m2: 600
    },
    status: 'disponivel',
    tipo: 'terreno',
    imagens: [
      {
        url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
        alt: 'Terreno no condomínio'
      }
    ]
  },
  {
    _id: '11',
    titulo: 'Penthouse Moema Premium',
    descricao: 'Penthouse exclusivo com acabamentos importados, adega climatizada e heliponto privativo.',
    preco: 3200000,
    endereco: {
      cidade: 'São Paulo',
      estado: 'SP',
      bairro: 'Moema',
      rua: 'Avenida Ibirapuera, 3000'
    },
    caracteristicas: {
      quartos: 5,
      banheiros: 4,
      garagem: 4,
      area_m2: 420,
      andar: 25
    },
    status: 'disponivel',
    tipo: 'apartamento',
    imagens: [
      {
        url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800',
        alt: 'Penthouse luxuoso'
      }
    ]
  },
  {
    _id: '12',
    titulo: 'Casa de Praia Guarujá',
    descricao: 'Casa de veraneio a poucos metros da praia, com deck, churrasqueira e vista para o mar.',
    preco: 1100000,
    endereco: {
      cidade: 'Guarujá',
      estado: 'SP',
      bairro: 'Enseada',
      rua: 'Rua da Praia, 88'
    },
    caracteristicas: {
      quartos: 4,
      banheiros: 3,
      garagem: 2,
      area_m2: 220
    },
    status: 'disponivel',
    tipo: 'casa',
    imagens: [
      {
        url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
        alt: 'Casa de praia'
      }
    ]
  }
];

// Funções utilitárias para os mocks
export const getImovelById = (id: string): Imovel | undefined => {
  return imoveis.find(imovel => imovel._id === id);
};

export const getImoveisPaginados = (page: number = 1, limit: number = 6) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  return {
    imoveis: imoveis.slice(startIndex, endIndex),
    totalPages: Math.ceil(imoveis.length / limit),
    currentPage: page,
    total: imoveis.length
  };
};

export const filtrarImoveis = (filtros: {
  cidade?: string;
  quartos?: number;
  precoMin?: number;
  precoMax?: number;
  busca?: string;
  status?: string;
}) => {
  return imoveis.filter(imovel => {
    if (filtros.cidade && !imovel.endereco.cidade.toLowerCase().includes(filtros.cidade.toLowerCase())) {
      return false;
    }
    if (filtros.quartos && imovel.caracteristicas.quartos < filtros.quartos) {
      return false;
    }
    if (filtros.precoMin && imovel.preco < filtros.precoMin) {
      return false;
    }
    if (filtros.precoMax && imovel.preco > filtros.precoMax) {
      return false;
    }
    if (filtros.status && imovel.status !== filtros.status) {
      return false;
    }
    if (filtros.busca) {
      const busca = filtros.busca.toLowerCase();
      return (
        imovel.titulo.toLowerCase().includes(busca) ||
        imovel.descricao.toLowerCase().includes(busca) ||
        imovel.endereco.cidade.toLowerCase().includes(busca) ||
        imovel.endereco.bairro.toLowerCase().includes(busca)
      );
    }
    return true;
  });
};