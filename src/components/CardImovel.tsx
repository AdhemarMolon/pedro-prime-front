import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Car, Square, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Imovel } from '@/mocks/imoveis';

interface CardImovelProps {
  imovel: Imovel;
}

const CardImovel = ({ imovel }: CardImovelProps) => {
  const formatarPreco = (preco: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(preco);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'disponivel':
        return 'default';
      case 'vendido':
        return 'destructive';
      case 'alugado':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'disponivel':
        return 'Disponível';
      case 'vendido':
        return 'Vendido';
      case 'alugado':
        return 'Alugado';
      default:
        return status;
    }
  };

  const imagemPrincipal = imovel.imagens[0]?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400';

  return (
    <div className="group bg-card rounded-xl shadow-soft hover:shadow-large transition-all duration-300 overflow-hidden border border-border">
      {/* Imagem */}
      <div className="relative overflow-hidden">
        <img
          src={imagemPrincipal}
          alt={imovel.imagens[0]?.alt || imovel.titulo}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Badge de status */}
        <div className="absolute top-3 left-3">
          <Badge variant={getStatusVariant(imovel.status)} className="font-medium">
            {getStatusLabel(imovel.status)}
          </Badge>
        </div>

        {/* Preço em destaque */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1">
          <span className="text-lg font-bold text-brand-blue">
            {formatarPreco(imovel.preco)}
          </span>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-5">
        <h3 className="text-lg font-semibold mb-2 text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
          {imovel.titulo}
        </h3>

        <div className="flex items-center text-muted-foreground mb-3">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="text-sm truncate">
            {imovel.endereco.bairro}, {imovel.endereco.cidade} - {imovel.endereco.estado}
          </span>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {imovel.descricao}
        </p>

        {/* Características */}
        {imovel.tipo !== 'terreno' && (
          <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
            {imovel.caracteristicas.quartos > 0 && (
              <div className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                <span>{imovel.caracteristicas.quartos}</span>
              </div>
            )}
            {imovel.caracteristicas.banheiros > 0 && (
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                <span>{imovel.caracteristicas.banheiros}</span>
              </div>
            )}
            {imovel.caracteristicas.garagem > 0 && (
              <div className="flex items-center gap-1">
                <Car className="h-4 w-4" />
                <span>{imovel.caracteristicas.garagem}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4" />
              <span>{imovel.caracteristicas.area_m2}m²</span>
            </div>
          </div>
        )}

        {imovel.tipo === 'terreno' && (
          <div className="flex items-center gap-1 mb-4 text-sm text-muted-foreground">
            <Square className="h-4 w-4" />
            <span>{imovel.caracteristicas.area_m2}m²</span>
          </div>
        )}

        {/* Botão Ver Detalhes */}
        <Button
          asChild
          variant="outline"
          className="w-full group/btn hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <Link to={`/imovel/${imovel._id}`}>
            <Eye className="mr-2 h-4 w-4" />
            Ver Detalhes
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default CardImovel;