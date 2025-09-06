import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Building2,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { imoveis, type Imovel } from '@/mocks/imoveis';
import Pagination from '@/components/Pagination';

const AdminImoveis = () => {
  const { toast } = useToast();
  const [imoveisList, setImoveisList] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const imoveisPorPagina = 10;

  useEffect(() => {
    // Simular carregamento dos dados
    const carregarDados = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setImoveisList([...imoveis]);
      setLoading(false);
    };

    carregarDados();
  }, []);

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

  // Filtrar imóveis
  const imoveisFiltrados = imoveisList.filter(imovel => {
    const matchSearch = searchTerm === '' || 
      imovel.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      imovel.endereco.cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      imovel.endereco.bairro.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStatus = statusFilter === '' || imovel.status === statusFilter;
    
    return matchSearch && matchStatus;
  });

  // Paginação
  const totalPages = Math.ceil(imoveisFiltrados.length / imoveisPorPagina);
  const startIndex = (currentPage - 1) * imoveisPorPagina;
  const imoveisPaginados = imoveisFiltrados.slice(startIndex, startIndex + imoveisPorPagina);

  const handleExcluir = (id: string, titulo: string) => {
    // Simular exclusão
    toast({
      title: "Imóvel excluído",
      description: `"${titulo}" foi removido com sucesso.`,
    });
    
    // Remover da lista local (simulação)
    setImoveisList(prev => prev.filter(imovel => imovel._id !== id));
  };

  const handleDuplicar = (imovel: Imovel) => {
    // Simular duplicação
    const novoImovel = {
      ...imovel,
      _id: `${imovel._id}_copy_${Date.now()}`,
      titulo: `${imovel.titulo} - Cópia`
    };
    
    setImoveisList(prev => [novoImovel, ...prev]);
    
    toast({
      title: "Imóvel duplicado",
      description: `Uma cópia de "${imovel.titulo}" foi criada.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-64"></div>
            <div className="h-10 bg-muted rounded"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Building2 className="h-8 w-8 text-brand-blue" />
              Gerenciar Imóveis
            </h1>
            <p className="text-muted-foreground mt-1">
              {imoveisFiltrados.length} {imoveisFiltrados.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
            </p>
          </div>
          
          <Button asChild className="bg-brand-amber hover:bg-brand-amber/90">
            <Link to="/admin/imoveis/novo">
              <Plus className="mr-2 h-4 w-4" />
              Novo Imóvel
            </Link>
          </Button>
        </div>

        {/* Filtros */}
        <div className="bg-card rounded-xl shadow-soft border border-border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por título, cidade ou bairro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os status</SelectItem>
                <SelectItem value="disponivel">Disponível</SelectItem>
                <SelectItem value="vendido">Vendido</SelectItem>
                <SelectItem value="alugado">Alugado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-card rounded-xl shadow-soft border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imóvel</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Características</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {imoveisPaginados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {searchTerm || statusFilter 
                      ? 'Nenhum imóvel encontrado com os filtros aplicados.'
                      : 'Nenhum imóvel cadastrado ainda.'
                    }
                  </TableCell>
                </TableRow>
              ) : (
                imoveisPaginados.map((imovel) => (
                  <TableRow key={imovel._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          {imovel.imagens[0] ? (
                            <img 
                              src={imovel.imagens[0].url} 
                              alt={imovel.titulo}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Building2 className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-foreground truncate max-w-48">
                            {imovel.titulo}
                          </div>
                          <div className="text-sm text-muted-foreground capitalize">
                            {imovel.tipo}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{imovel.endereco.cidade}</div>
                        <div className="text-muted-foreground">{imovel.endereco.bairro}</div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="font-semibold text-brand-blue">
                        {formatarPreco(imovel.preco)}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant={getStatusVariant(imovel.status)}>
                        {getStatusLabel(imovel.status)}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {imovel.tipo !== 'terreno' && imovel.caracteristicas.quartos > 0 && 
                          `${imovel.caracteristicas.quartos}Q • `
                        }
                        {imovel.tipo !== 'terreno' && imovel.caracteristicas.banheiros > 0 && 
                          `${imovel.caracteristicas.banheiros}B • `
                        }
                        {imovel.caracteristicas.area_m2}m²
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/imovel/${imovel._id}`} target="_blank">
                              <Eye className="mr-2 h-4 w-4" />
                              Ver no Site
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/imoveis/${imovel._id}/editar`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicar(imovel)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleExcluir(imovel._id, imovel.titulo)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default AdminImoveis;