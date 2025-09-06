import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FiltrosProps {
  onFiltrosChange: (filtros: {
    cidade?: string;
    quartos?: number;
    precoMin?: number;
    precoMax?: number;
    busca?: string;
  }) => void;
  loading?: boolean;
}

const Filtros = ({ onFiltrosChange, loading }: FiltrosProps) => {
  const [filtros, setFiltros] = useState({
    cidade: '',
    quartos: '',
    precoMin: '',
    precoMax: '',
    busca: ''
  });

  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    const novosFiltros = { ...filtros, [field]: value };
    setFiltros(novosFiltros);
    
    // Aplicar filtros automaticamente
    const filtrosFormatados = {
      cidade: novosFiltros.cidade || undefined,
      quartos: novosFiltros.quartos ? parseInt(novosFiltros.quartos) : undefined,
      precoMin: novosFiltros.precoMin ? parseInt(novosFiltros.precoMin) : undefined,
      precoMax: novosFiltros.precoMax ? parseInt(novosFiltros.precoMax) : undefined,
      busca: novosFiltros.busca || undefined,
    };
    
    onFiltrosChange(filtrosFormatados);
  };

  const limparFiltros = () => {
    const filtrosLimpos = {
      cidade: '',
      quartos: '',
      precoMin: '',
      precoMax: '',
      busca: ''
    };
    setFiltros(filtrosLimpos);
    onFiltrosChange({});
  };

  const temFiltrosAtivos = Object.values(filtros).some(valor => valor !== '');

  return (
    <div className="bg-white rounded-xl shadow-medium p-6 -mt-8 relative z-20 mx-4 md:mx-8">
      {/* Busca principal */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por cidade, bairro ou tipo de imóvel..."
            value={filtros.busca}
            onChange={(e) => handleInputChange('busca', e.target.value)}
            className="pl-10 h-12 text-base"
            disabled={loading}
          />
        </div>
        
        <Button
          variant="outline"
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
          className="h-12 px-6 flex items-center gap-2"
          disabled={loading}
        >
          <Filter className="h-4 w-4" />
          Filtros Avançados
          {temFiltrosAtivos && (
            <span className="bg-brand-amber text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              !
            </span>
          )}
        </Button>
      </div>

      {/* Filtros avançados */}
      {mostrarFiltros && (
        <div className="border-t pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Cidade
              </label>
              <Select 
                value={filtros.cidade} 
                onValueChange={(value) => handleInputChange('cidade', value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas as cidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as cidades</SelectItem>
                  <SelectItem value="São Paulo">São Paulo</SelectItem>
                  <SelectItem value="Rio de Janeiro">Rio de Janeiro</SelectItem>
                  <SelectItem value="Campinas">Campinas</SelectItem>
                  <SelectItem value="Guarujá">Guarujá</SelectItem>
                  <SelectItem value="Barueri">Barueri</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Quartos
              </label>
              <Select 
                value={filtros.quartos} 
                onValueChange={(value) => handleInputChange('quartos', value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Qualquer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Qualquer</SelectItem>
                  <SelectItem value="1">1+ quarto</SelectItem>
                  <SelectItem value="2">2+ quartos</SelectItem>
                  <SelectItem value="3">3+ quartos</SelectItem>
                  <SelectItem value="4">4+ quartos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Preço Mínimo
              </label>
              <Input
                type="number"
                placeholder="R$ 0"
                value={filtros.precoMin}
                onChange={(e) => handleInputChange('precoMin', e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Preço Máximo
              </label>
              <Input
                type="number"
                placeholder="R$ 999.999.999"
                value={filtros.precoMax}
                onChange={(e) => handleInputChange('precoMax', e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {temFiltrosAtivos && (
            <div className="flex justify-end">
              <Button 
                variant="ghost" 
                onClick={limparFiltros}
                className="text-muted-foreground hover:text-foreground flex items-center gap-2"
                disabled={loading}
              >
                <X className="h-4 w-4" />
                Limpar Filtros
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Filtros;