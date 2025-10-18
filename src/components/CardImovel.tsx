import { Link } from "react-router-dom";
import { MapPin, DollarSign, Ruler, Bed, Bath, Car, ImageIcon, Tag } from "lucide-react";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import type { Imovel } from "../lib/api";

type ViewMode = "grid" | "list";

type CardImovelProps = {
  imovel: Imovel;
  viewMode?: ViewMode;
};

// Helpers
function getId(i: Imovel) {
  return i.id || i._id || '';
}

function getPreco(i: Imovel) {
  return Number(i.preco ?? 0);
}

function getArea(i: Imovel) {
  return Number(i.area_m2 ?? i.caracteristicas?.area_m2 ?? 0);
}

function getQuartos(i: Imovel) {
  return Number(i.quartos ?? i.caracteristicas?.quartos ?? 0);
}

function getBanheiros(i: Imovel) {
  return Number(i.banheiros ?? i.caracteristicas?.banheiros ?? 0);
}

function getGaragem(i: Imovel) {
  return Number(i.garagem ?? i.caracteristicas?.garagem ?? 0);
}

function getCidade(i: Imovel) {
  return i.cidade || i.endereco?.cidade || '';
}

function getBairro(i: Imovel) {
  return i.bairro || i.endereco?.bairro || '';
}

function getImagem(i: Imovel): string {
  if (!i.imagens || i.imagens.length === 0) return '';
  const img = i.imagens[0];
  if (typeof img === 'string') return img;
  return img?.url || '';
}

function getTipo(i: Imovel): string {
  const tipo = i.tipo || '';
  const map: Record<string, string> = {
    'CASA': 'Casa',
    'APARTAMENTO': 'Apartamento',
    'TERRENO': 'Terreno',
    'SITIO': 'Sítio',
    'COMERCIAL': 'Comercial',
    'GALPAO': 'Galpão',
  };
  return map[tipo.toUpperCase()] || tipo;
}

function getFinalidade(i: Imovel): string {
  const finalidade = i.finalidade || '';
  const map: Record<string, string> = {
    'VENDA': 'Venda',
    'ALUGUEL': 'Aluguel',
  };
  return map[finalidade.toUpperCase()] || finalidade;
}

// Tags com labels amigáveis
const TAG_LABELS: Record<string, string> = {
  'DESTAQUE': 'Destaque',
  'LANCAMENTO': 'Lançamento',
  'OPORTUNIDADE': 'Oportunidade',
  'ACEITA_FINANCIAMENTO': 'Aceita Financiamento',
  'ACEITA_PERMUTA': 'Aceita Permuta',
  'PRONTO_MORAR': 'Pronto para Morar',
  'NA_PLANTA': 'Na Planta',
  'MOBILIADO': 'Mobiliado',
  'PISCINA': 'Piscina',
  'AREA_GOURMET': 'Área Gourmet',
  'QUINTAL': 'Quintal',
  'GARAGEM_COBERTA': 'Garagem Coberta',
  'PROXIMO_METRO': 'Próximo ao Metrô',
  'CONDOMINIO_FECHADO': 'Condomínio Fechado',
  'VISTA_MAR': 'Vista Mar',
  'VISTA_MONTANHA': 'Vista Montanha',
  'PET_FRIENDLY': 'Pet Friendly',
  'ENERGIA_SOLAR': 'Energia Solar',
};

export default function CardImovel({ imovel, viewMode = "grid" }: CardImovelProps) {
  const id = getId(imovel);
  const titulo = imovel.titulo || 'Sem título';
  const preco = getPreco(imovel);
  const area = getArea(imovel);
  const quartos = getQuartos(imovel);
  const banheiros = getBanheiros(imovel);
  const garagem = getGaragem(imovel);
  const cidade = getCidade(imovel);
  const bairro = getBairro(imovel);
  const imgUrl = getImagem(imovel);
  const tipo = getTipo(imovel);
  const finalidade = getFinalidade(imovel);
  const tags = imovel.tags || [];

  const localStr = [bairro, cidade].filter(Boolean).join(', ');
  const isList = viewMode === "list";

  // Exibir apenas as 2 primeiras tags para evitar poluição visual
  const displayTags = tags.slice(0, 2);

  return (
    <Link to={`/imoveis/${id}`} className="block group">
      <Card className={`
        overflow-hidden border-0 shadow-md transition-all duration-300 bg-white
        hover:shadow-xl hover:-translate-y-1
        ${isList ? 'flex flex-row' : 'rounded-xl'}
      `}>
        {/* IMAGEM */}
        <div className={`relative shrink-0 overflow-hidden ${isList ? 'w-40 sm:w-48 md:w-56' : 'w-full'}`}>
          <div className={`${isList ? 'h-full min-h-[180px]' : 'aspect-[4/3]'} w-full`}>
            {imgUrl ? (
              <img
                src={imgUrl}
                alt={titulo}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <ImageIcon className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>

          {/* Tipo e Finalidade - apenas na imagem, não duplicado */}
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {finalidade && (
              <Badge className="bg-blue-600 text-white shadow-lg border-0">
                {finalidade}
              </Badge>
            )}
            {tipo && (
              <Badge variant="secondary" className="bg-white/95 backdrop-blur-sm text-gray-700 shadow-md">
                {tipo}
              </Badge>
            )}
          </div>

          {/* Tags (max 2) */}
          {displayTags.length > 0 && (
            <div className="absolute right-3 top-3 flex flex-wrap gap-1 max-w-[50%] justify-end">
              {displayTags.map(tag => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="bg-amber-500/90 backdrop-blur-sm text-white border-0 shadow-md text-xs"
                >
                  {TAG_LABELS[tag] || tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* CONTEÚDO */}
        <CardContent className={`${isList ? 'flex-1 p-4 md:p-5' : 'p-4 md:p-5'}`}>
          <div className="space-y-3">
            {/* Título */}
            <h3 className="font-bold text-lg md:text-xl text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {titulo}
            </h3>

            {/* Localização */}
            {localStr && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 flex-shrink-0 text-blue-600" />
                <span className="truncate">{localStr}</span>
              </div>
            )}

            {/* Preço */}
            {preco > 0 && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold text-green-600">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    minimumFractionDigits: 0,
                  }).format(preco)}
                </span>
              </div>
            )}

            {/* Características */}
            <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100">
              {area > 0 && (
                <div className="flex items-center gap-1.5 text-sm text-gray-700">
                  <Ruler className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{area} m²</span>
                </div>
              )}
              {quartos > 0 && (
                <div className="flex items-center gap-1.5 text-sm text-gray-700">
                  <Bed className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{quartos}</span>
                </div>
              )}
              {banheiros > 0 && (
                <div className="flex items-center gap-1.5 text-sm text-gray-700">
                  <Bath className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{banheiros}</span>
                </div>
              )}
              {garagem > 0 && (
                <div className="flex items-center gap-1.5 text-sm text-gray-700">
                  <Car className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{garagem}</span>
                </div>
              )}
            </div>

            {/* Contador de mais tags se houver */}
            {tags.length > 2 && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Tag className="h-3 w-3" />
                <span>+{tags.length - 2} {tags.length - 2 === 1 ? 'tag' : 'tags'}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
