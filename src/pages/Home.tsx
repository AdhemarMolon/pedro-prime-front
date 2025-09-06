import { useState, useEffect } from 'react';
import { AlertCircle, Home as HomeIcon } from 'lucide-react';
import Hero from '@/components/Hero';
import Filtros from '@/components/Filtros';
import CardImovel from '@/components/CardImovel';
import Pagination from '@/components/Pagination';
import { GridSkeleton } from '@/components/Skeletons';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { filtrarImoveis, getImoveisPaginados, type Imovel } from '@/mocks/imoveis';

const Home = () => {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filtros, setFiltros] = useState<any>({});
  const [imoveisVisibles, setImoveisVisibles] = useState<Imovel[]>([]);

  const imoveisPorPagina = 6;

  // Simular carregamento inicial
  useEffect(() => {
    const carregarImoveis = async () => {
      setLoading(true);
      setError(false);

      try {
        // Simular delay de carregamento
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Simular erro ocasional (5% de chance)
        if (Math.random() < 0.05) {
          throw new Error('Erro simulado');
        }

        const resultado = getImoveisPaginados(1, imoveisPorPagina);
        setImoveis(resultado.imoveis);
        setImoveisVisibles(resultado.imoveis);
        setTotalPages(resultado.totalPages);
        setCurrentPage(1);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    carregarImoveis();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    if (Object.keys(filtros).length === 0) {
      // Sem filtros, mostrar paginação normal
      const resultado = getImoveisPaginados(currentPage, imoveisPorPagina);
      setImoveisVisibles(resultado.imoveis);
      setTotalPages(resultado.totalPages);
    } else {
      // Com filtros, filtrar e paginar
      const imoveisFiltrados = filtrarImoveis(filtros);
      const totalFiltrados = imoveisFiltrados.length;
      const totalPagesFiltradas = Math.ceil(totalFiltrados / imoveisPorPagina);
      
      const startIndex = (currentPage - 1) * imoveisPorPagina;
      const endIndex = startIndex + imoveisPorPagina;
      const imoveisPaginados = imoveisFiltrados.slice(startIndex, endIndex);
      
      setImoveisVisibles(imoveisPaginados);
      setTotalPages(totalPagesFiltradas);
      
      // Se a página atual for maior que o total de páginas, voltar para a primeira
      if (currentPage > totalPagesFiltradas && totalPagesFiltradas > 0) {
        setCurrentPage(1);
      }
    }
  }, [filtros, currentPage]);

  const handleFiltrosChange = (novosFiltros: any) => {
    setFiltros(novosFiltros);
    setCurrentPage(1); // Resetar para primeira página ao filtrar
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll suave para o topo da seção de resultados
    document.querySelector('#resultados')?.scrollIntoView({ behavior: 'smooth' });
  };

  const tentarNovamente = () => {
    setError(false);
    setLoading(true);
    
    // Recarregar após 500ms
    setTimeout(() => {
      const resultado = getImoveisPaginados(1, imoveisPorPagina);
      setImoveis(resultado.imoveis);
      setImoveisVisibles(resultado.imoveis);
      setTotalPages(resultado.totalPages);
      setCurrentPage(1);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <Hero />

      {/* Filtros */}
      <div className="container mx-auto">
        <Filtros onFiltrosChange={handleFiltrosChange} loading={loading} />
      </div>

      {/* Resultados */}
      <section id="resultados" className="container mx-auto px-4 py-12">
        {loading && <GridSkeleton count={6} />}
        
        {error && (
          <div className="text-center py-12">
            <Alert className="max-w-md mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Ops! Ocorreu um erro ao carregar os imóveis. 
                Verifique sua conexão e tente novamente.
              </AlertDescription>
            </Alert>
            <Button 
              onClick={tentarNovamente} 
              className="mt-4"
              variant="outline"
            >
              Tentar Novamente
            </Button>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Contador de resultados */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2 text-muted-foreground">
                <HomeIcon className="h-4 w-4" />
                <span>
                  {imoveisVisibles.length === 0 
                    ? 'Nenhum imóvel encontrado' 
                    : `${imoveisVisibles.length} ${imoveisVisibles.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}`
                  }
                </span>
              </div>
              
              {Object.keys(filtros).length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleFiltrosChange({})}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Limpar filtros
                </Button>
              )}
            </div>

            {/* Grid de imóveis */}
            {imoveisVisibles.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {imoveisVisibles.map((imovel) => (
                    <CardImovel key={imovel._id} imovel={imovel} />
                  ))}
                </div>

                {/* Paginação */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  loading={loading}
                />
              </>
            ) : (
              // Estado vazio
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                    <HomeIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Nenhum imóvel encontrado
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Não encontramos imóveis que correspondam aos seus critérios de busca. 
                    Tente ajustar os filtros ou fazer uma nova pesquisa.
                  </p>
                  <Button 
                    onClick={() => handleFiltrosChange({})}
                    variant="outline"
                  >
                    Limpar Filtros
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Home;