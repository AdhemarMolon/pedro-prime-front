import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Plus, LogOut, Search, Edit, Trash2, Home, 
  DollarSign, MapPin, Bed, Eye, Filter, X,
  Building2, AlertCircle
} from "lucide-react";
import { ImoveisAPI, Imovel } from "../lib/api";
import { useAdmin } from "../context/AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminImoveis() {
  const { logout } = useAdmin();
  const navigate = useNavigate();
  const [items, setItems] = useState<Imovel[]>([]);
  const [filteredItems, setFilteredItems] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await ImoveisAPI.list({ limit: 1000 });
      setItems(data);
      setFilteredItems(data);
    } catch (e) {
      setError((e as Error)?.message || "Erro ao carregar imóveis");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Filtro de busca
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredItems(items);
      return;
    }

    const search = searchTerm.toLowerCase();
    const filtered = items.filter(item =>
      item.titulo?.toLowerCase().includes(search) ||
      item.cidade?.toLowerCase().includes(search) ||
      item.endereco?.cidade?.toLowerCase().includes(search) ||
      item.tipo?.toLowerCase().includes(search)
    );
    setFilteredItems(filtered);
  }, [searchTerm, items]);

  async function handleDelete() {
    if (!deleteId) return;
    
    setDeleting(true);
    try {
      await ImoveisAPI.remove(deleteId);
      setItems(prev => prev.filter(i => (i.id || i._id) !== deleteId));
      setFilteredItems(prev => prev.filter(i => (i.id || i._id) !== deleteId));
      setDeleteId(null);
    } catch (e) {
      alert("Erro ao excluir: " + (e as Error).message);
    } finally {
      setDeleting(false);
    }
  }

  function getPreco(item: Imovel) {
    return Number(item.preco ?? 0);
  }

  function getCidade(item: Imovel) {
    return item.cidade || item.endereco?.cidade || '-';
  }

  function getQuartos(item: Imovel) {
    return item.quartos ?? item.caracteristicas?.quartos ?? 0;
  }

  function getId(item: Imovel) {
    return item.id || item._id || '';
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
          <p className="text-gray-600">Carregando imóveis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-red-200">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2 text-gray-900">Erro ao Carregar</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={load} className="bg-blue-600 hover:bg-blue-700">
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
                <p className="text-sm text-gray-600">{filteredItems.length} {filteredItems.length === 1 ? 'imóvel' : 'imóveis'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Ver Site</span>
              </Button>
              <Button
                onClick={() => navigate("/admin/imoveis/novo")}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 gap-2"
              >
                <Plus className="h-4 w-4" />
                Novo Imóvel
              </Button>
              <Button
                onClick={logout}
                variant="outline"
                className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Busca */}
        <Card className="mb-6 border-0 shadow-md">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Buscar por título, cidade ou tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Imóveis */}
        {filteredItems.length === 0 ? (
          <Card className="border-0 shadow-md">
            <CardContent className="p-12 text-center">
              <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {searchTerm ? "Nenhum imóvel encontrado" : "Nenhum imóvel cadastrado"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? "Tente buscar com outros termos"
                  : "Comece cadastrando seu primeiro imóvel"}
              </p>
              {searchTerm ? (
                <Button 
                  onClick={() => setSearchTerm("")} 
                  variant="outline"
                >
                  Limpar Busca
                </Button>
              ) : (
                <Button
                  onClick={() => navigate("/admin/imoveis/novo")}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Cadastrar Primeiro Imóvel
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Imóvel</TableHead>
                    <TableHead className="font-semibold">Preço</TableHead>
                    <TableHead className="font-semibold">Localização</TableHead>
                    <TableHead className="font-semibold text-center">Quartos</TableHead>
                    <TableHead className="font-semibold">Tipo</TableHead>
                    <TableHead className="font-semibold text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => {
                    const id = getId(item);
                    const preco = getPreco(item);
                    const cidade = getCidade(item);
                    const quartos = getQuartos(item);
                    
                    return (
                      <TableRow key={id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            {item.imagens && item.imagens.length > 0 ? (
                              <img
                                src={typeof item.imagens[0] === 'string' ? item.imagens[0] : item.imagens[0]?.url}
                                alt={item.titulo}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                                <Building2 className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 truncate">{item.titulo}</p>
                              {item.tags && item.tags.length > 0 && (
                                <div className="flex gap-1 mt-1">
                                  {item.tags.slice(0, 2).map(tag => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-green-600 font-semibold">
                            <DollarSign className="h-4 w-4" />
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                              minimumFractionDigits: 0,
                            }).format(preco)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-gray-700">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            {cidade}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {quartos > 0 ? (
                            <div className="inline-flex items-center gap-1 text-gray-700">
                              <Bed className="h-4 w-4 text-gray-400" />
                              {quartos}
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {item.tipo || item.finalidade || '-'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              onClick={() => window.open(`/imovel/${id}`, '_blank')}
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              title="Visualizar"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => navigate(`/admin/imoveis/${id}`)}
                              variant="ghost"
                              size="sm"
                              className="text-gray-600 hover:text-gray-700 hover:bg-gray-100"
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => setDeleteId(id)}
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              title="Excluir"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}
      </div>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este imóvel? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
