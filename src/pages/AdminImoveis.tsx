import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus, LogOut, Search, Edit, Trash2, Home,
  MapPin, Bed, Eye, X, Building2, AlertCircle
} from "lucide-react";
import { ImoveisAPI, Imovel } from "../lib/api";
import { useAdmin } from "../context/AdminContext";
import { formatCurrency } from "../lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function getId(i: Imovel) { return i.id || i._id || ""; }
function getPreco(i: Imovel) { return Number(i.preco ?? 0); }
function getCidade(i: Imovel) { return i.cidade || i.endereco?.cidade || "-"; }
function getQuartos(i: Imovel) { return i.quartos ?? i.caracteristicas?.quartos ?? 0; }

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

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!searchTerm.trim()) { setFilteredItems(items); return; }
    const s = searchTerm.toLowerCase();
    setFilteredItems(items.filter(i =>
      i.titulo?.toLowerCase().includes(s) ||
      getCidade(i).toLowerCase().includes(s) ||
      i.tipo?.toLowerCase().includes(s)
    ));
  }, [searchTerm, items]);

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await ImoveisAPI.remove(deleteId);
      setItems(p => p.filter(i => getId(i) !== deleteId));
      setFilteredItems(p => p.filter(i => getId(i) !== deleteId));
      setDeleteId(null);
    } catch (e) {
      alert("Erro ao excluir: " + (e as Error).message);
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-primary border-r-transparent mb-4" />
          <p className="text-muted-foreground">Carregando imóveis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-destructive/30">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">Erro ao Carregar</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={load}>Tentar Novamente</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 bg-primary rounded-lg">
                <Building2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Painel Administrativo</h1>
                <p className="text-xs text-muted-foreground">{filteredItems.length} imóve{filteredItems.length === 1 ? "l" : "is"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => navigate("/")} variant="outline" size="sm"><Home className="mr-1.5 h-4 w-4" /><span className="hidden sm:inline">Ver Site</span></Button>
              <Button onClick={() => navigate("/admin/imoveis/novo")} size="sm"><Plus className="mr-1.5 h-4 w-4" />Novo Imóvel</Button>
              <Button onClick={logout} variant="outline" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10"><LogOut className="mr-1.5 h-4 w-4" /><span className="hidden sm:inline">Sair</span></Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Buscar por título, cidade ou tipo..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 h-10" />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
          )}
        </div>

        {filteredItems.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Building2 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">{searchTerm ? "Nenhum resultado" : "Nenhum imóvel cadastrado"}</h3>
              <p className="text-muted-foreground mb-6">{searchTerm ? "Tente buscar com outros termos" : "Comece cadastrando seu primeiro imóvel"}</p>
              {searchTerm ? (
                <Button onClick={() => setSearchTerm("")} variant="outline">Limpar Busca</Button>
              ) : (
                <Button onClick={() => navigate("/admin/imoveis/novo")}><Plus className="mr-2 h-4 w-4" />Cadastrar Primeiro Imóvel</Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/50">
                    <TableHead className="font-semibold">Imóvel</TableHead>
                    <TableHead className="font-semibold">Preço</TableHead>
                    <TableHead className="font-semibold">Localização</TableHead>
                    <TableHead className="font-semibold text-center">Quartos</TableHead>
                    <TableHead className="font-semibold">Tipo</TableHead>
                    <TableHead className="font-semibold text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map(item => {
                    const id = getId(item);
                    const preco = getPreco(item);
                    const cidade = getCidade(item);
                    const quartos = getQuartos(item);
                    return (
                      <TableRow key={id} className="hover:bg-secondary/30 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {item.imagens && item.imagens.length > 0 ? (
                              <img src={typeof item.imagens[0] === "string" ? item.imagens[0] : item.imagens[0]?.url} alt={item.titulo} className="w-11 h-11 rounded-lg object-cover" />
                            ) : (
                              <div className="w-11 h-11 rounded-lg bg-secondary flex items-center justify-center"><Building2 className="h-5 w-5 text-muted-foreground/40" /></div>
                            )}
                            <div className="min-w-0">
                              <p className="font-medium text-foreground truncate max-w-[200px]">{item.titulo}</p>
                              {item.tags && item.tags.length > 0 && (
                                <div className="flex gap-1 mt-1">{item.tags.slice(0, 2).map(t => <Badge key={t} variant="secondary" className="text-[10px] px-1.5 py-0">{t}</Badge>)}</div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><span className="font-semibold text-emerald-700">{formatCurrency(preco)}</span></TableCell>
                        <TableCell><div className="flex items-center gap-1.5 text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{cidade}</div></TableCell>
                        <TableCell className="text-center">{quartos > 0 ? <span className="inline-flex items-center gap-1"><Bed className="h-3.5 w-3.5 text-muted-foreground" />{quartos}</span> : <span className="text-muted-foreground">-</span>}</TableCell>
                        <TableCell><Badge variant="outline" className="capitalize text-xs">{item.tipo || item.finalidade || "-"}</Badge></TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button onClick={() => window.open(`/imoveis/${id}`, "_blank")} variant="ghost" size="sm" className="h-8 w-8 p-0"><Eye className="h-4 w-4" /></Button>
                            <Button onClick={() => navigate(`/admin/imoveis/${id}`)} variant="ghost" size="sm" className="h-8 w-8 p-0"><Edit className="h-4 w-4" /></Button>
                            <Button onClick={() => setDeleteId(id)} variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
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

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>Tem certeza que deseja excluir este imóvel? Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">{deleting ? "Excluindo..." : "Excluir"}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}