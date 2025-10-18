// Constantes de Tags do Sistema

export const TAGS_DISPONIVEIS = [
  { value: 'DESTAQUE', label: 'Destaque', color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: '⭐' },
  { value: 'LANCAMENTO', label: 'Lançamento', color: 'bg-blue-100 text-blue-800 border-blue-300', icon: '🆕' },
  { value: 'OPORTUNIDADE', label: 'Oportunidade', color: 'bg-green-100 text-green-800 border-green-300', icon: '💰' },
  { value: 'ACEITA_FINANCIAMENTO', label: 'Aceita Financiamento', color: 'bg-purple-100 text-purple-800 border-purple-300', icon: '🏦' },
  { value: 'ACEITA_PERMUTA', label: 'Aceita Permuta', color: 'bg-indigo-100 text-indigo-800 border-indigo-300', icon: '🔄' },
  { value: 'PRONTO_MORAR', label: 'Pronto p/ Morar', color: 'bg-teal-100 text-teal-800 border-teal-300', icon: '✅' },
  { value: 'NA_PLANTA', label: 'Na Planta', color: 'bg-cyan-100 text-cyan-800 border-cyan-300', icon: '📐' },
  { value: 'MOBILIADO', label: 'Mobiliado', color: 'bg-orange-100 text-orange-800 border-orange-300', icon: '🛋️' },
  { value: 'PISCINA', label: 'Piscina', color: 'bg-sky-100 text-sky-800 border-sky-300', icon: '🏊' },
  { value: 'AREA_GOURMET', label: 'Área Gourmet', color: 'bg-amber-100 text-amber-800 border-amber-300', icon: '🍖' },
  { value: 'QUINTAL', label: 'Quintal', color: 'bg-lime-100 text-lime-800 border-lime-300', icon: '🌳' },
  { value: 'GARAGEM_COBERTA', label: 'Garagem Coberta', color: 'bg-slate-100 text-slate-800 border-slate-300', icon: '🚗' },
  { value: 'PROXIMO_METRO', label: 'Próximo ao Metrô', color: 'bg-red-100 text-red-800 border-red-300', icon: '🚇' },
  { value: 'CONDOMINIO_FECHADO', label: 'Condomínio Fechado', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', icon: '🏢' },
  { value: 'VISTA_MAR', label: 'Vista para o Mar', color: 'bg-blue-100 text-blue-800 border-blue-300', icon: '🌊' },
  { value: 'VISTA_MONTANHA', label: 'Vista Montanha', color: 'bg-stone-100 text-stone-800 border-stone-300', icon: '⛰️' },
  { value: 'PET_FRIENDLY', label: 'Pet Friendly', color: 'bg-pink-100 text-pink-800 border-pink-300', icon: '🐾' },
  { value: 'ENERGIA_SOLAR', label: 'Energia Solar', color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: '☀️' },
] as const;

export type TagValue = typeof TAGS_DISPONIVEIS[number]['value'];

export const getTagConfig = (value: string) => {
  return TAGS_DISPONIVEIS.find(t => t.value === value) || { 
    value, 
    label: value, 
    color: 'bg-gray-100 text-gray-800 border-gray-300',
    icon: '🏠'
  };
};

// Enums do Prisma
export const TIPOS_IMOVEL = [
  { value: 'CASA', label: 'Casa' },
  { value: 'APARTAMENTO', label: 'Apartamento' },
  { value: 'TERRENO', label: 'Terreno' },
  { value: 'COMERCIAL', label: 'Comercial' },
  { value: 'RURAL', label: 'Rural' },
  { value: 'SOBRADO', label: 'Sobrado' },
  { value: 'KITNET', label: 'Kitnet' },
  { value: 'CHACARA', label: 'Chácara' },
] as const;

export const FINALIDADES = [
  { value: 'VENDA', label: 'Venda' },
  { value: 'ALUGUEL', label: 'Aluguel' },
  { value: 'VENDA_ALUGUEL', label: 'Venda/Aluguel' },
] as const;

export const STATUS_IMOVEL = [
  { value: 'DISPONIVEL', label: 'Disponível', color: 'bg-green-100 text-green-800' },
  { value: 'VENDIDO', label: 'Vendido', color: 'bg-gray-100 text-gray-800' },
  { value: 'ALUGADO', label: 'Alugado', color: 'bg-blue-100 text-blue-800' },
  { value: 'RESERVADO', label: 'Reservado', color: 'bg-yellow-100 text-yellow-800' },
] as const;
