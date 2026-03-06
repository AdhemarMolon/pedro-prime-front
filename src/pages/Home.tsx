import { useEffect, useMemo, useState } from "react";
import { Search, Building2, SlidersHorizontal, X, Grid3X3, List } from "lucide-react";
import CardImovel from "../components/CardImovel";
import { ImoveisAPI, Imovel } from "../lib/api";
import { Card, CardContent } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

const getPreco = (i: Imovel) => Number(i?.preco ?? 0);
const getArea = (i: Imovel) => Number(i?.area_m2 ?? i?.caracteristicas?.area_m2 ?? 0);
const getQuartos = (i: Imovel) => Number(i?.quartos ?? i?.caracteristicas?.quartos ?? 0);
const getTipo = (i: Imovel) => String(i?.tipo ?? "");
const getFinalidade = (i: Imovel) => String(i?.finalidade ?? "");
const getCidade = (i: Imovel) => String(i?.cidade ?? i?.endereco?.cidade ?? "");

export default function Home() {
  const [items, setItems] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("relevancia");
  const [filterCidade, setFilterCidade] = useState("todos");
  const [filterQuartos, setFilterQuartos] = useState("todos");
  const [filterAreaMin, setFilterAreaMin] = useState("");
  const [filterTipo, setFilterTipo] = useState("todos");
  const [filterFinalidade, setFilterFinalidade] = useState("todos");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ImoveisAPI.list();
      setItems(res.data ?? []);
    } catch (e) {
      setError((e as Error)?.message || "Erro ao carregar");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const cidadesDisponiveis = useMemo(() => {
    const map = new Map<string, string>();
    items.forEach(i => {
      const raw = getCidade(i);
      if (raw) map.set(raw.toLowerCase(), raw);
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [items]);

  const tiposDisponiveis = useMemo(() => {
    const set = new Set(items.map(getTipo).filter(Boolean));
    return Array.from(set).sort();
  }, [items]);

  const finalidadesDisponiveis = useMemo(() => {
    const set = new Set(items.map(getFinalidade).filter(Boolean));
    return Array.from(set).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    let result = [...items];
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      result = result.filter(item =>
        item.titulo?.toLowerCase().includes(search) ||
        getTipo(item).toLowerCase().includes(search) ||
        getCidade(item).toLowerCase().includes(search) ||
        item.descricao?.toLowerCase().includes(search)
      );
    }
    if (filterCidade !== "todos") result = result.filter(item => getCidade(item).toLowerCase() === filterCidade);
    if (filterTipo !== "todos") result = result.filter(item => getTipo(item) === filterTipo);
    if (filterFinalidade !== "todos") result = result.filter(item => getFinalidade(item) === filterFinalidade);
    if (filterQuartos !== "todos") result = result.filter(item => getQuartos(item) >= Number(filterQuartos));
    if (filterAreaMin) result = result.filter(item => getArea(item) >= Number(filterAreaMin));

    switch (sortBy) {
      case "mais-recente": result.sort((a, b) => String(b._id || b.id || "").localeCompare(String(a._id || a.id || ""))); break;
      case "mais-antigo": result.sort((a, b) => String(a._id || a.id || "").localeCompare(String(b._id || b.id || ""))); break;
      case "menor-preco": result.sort((a, b) => getPreco(a) - getPreco(b)); break;
      case "maior-preco": result.sort((a, b) => getPreco(b) - getPreco(a)); break;
      case "menor-area": result.sort((a, b) => getArea(a) - getArea(b)); break;
      case "maior-area": result.sort((a, b) => getArea(b) - getArea(a)); break;
    }
    return result;
  }, [items, searchTerm, sortBy, filterCidade, filterTipo, filterFinalidade, filterQuartos, filterAreaMin]);

  const hasActiveFilters = sortBy !== "relevancia" || filterCidade !== "todos" || filterTipo !== "todos" || filterFinalidade !== "todos" || filterQuartos !== "todos" || filterAreaMin;
  const clearFilters = () => { setSortBy("relevancia"); setFilterCidade("todos"); setFilterTipo("todos"); setFilterFinalidade("todos"); setFilterQuartos("todos"); setFilterAreaMin(""); };
  const activeFiltersCount = [sortBy !== "relevancia", filterCidade !== "todos", filterTipo !== "todos", filterFinalidade !== "todos", filterQuartos !== "todos", filterAreaMin].filter(Boolean).length;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Erro ao carregar</h3>
            <p className="text-sm text-muted-foreground mb-6">{error}</p>
            <Button onClick={load}>Tentar Novamente</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(201,160,80,0.12),_transparent_60%)]" />
        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">
              Encontre o imóvel{" "}
              <span className="text-accent">ideal</span>
            </h1>
            <p className="text-lg text-white/70 max-w-lg">
              As melhores oportunidades imobiliárias em São Carlos e região, com atendimento personalizado.
            </p>
          </div>

          <div className="mt-10 max-w-2xl">
            <div className="flex gap-2 bg-card rounded-xl p-1.5 shadow-xl">
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Busque por cidade, bairro ou tipo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground"
                />
              </div>
              <Button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="h-11 px-4 gap-2 relative border-border text-foreground"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Filtros</span>
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-accent text-accent-foreground text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {showFilters && (
          <Card className="mb-6 animate-slide-down">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">Filtros</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Ordenar</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevancia">Relevância</SelectItem>
                      <SelectItem value="mais-recente">Mais recentes</SelectItem>
                      <SelectItem value="menor-preco">Menor preço</SelectItem>
                      <SelectItem value="maior-preco">Maior preço</SelectItem>
                      <SelectItem value="menor-area">Menor área</SelectItem>
                      <SelectItem value="maior-area">Maior área</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Cidade</label>
                  <Select value={filterCidade} onValueChange={setFilterCidade}>
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todas</SelectItem>
                      {cidadesDisponiveis.map(([key, display]) => (<SelectItem key={key} value={key}>{display}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Tipo</label>
                  <Select value={filterTipo} onValueChange={setFilterTipo}>
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      {tiposDisponiveis.map(t => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Finalidade</label>
                  <Select value={filterFinalidade} onValueChange={setFilterFinalidade}>
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todas</SelectItem>
                      {finalidadesDisponiveis.map(f => (<SelectItem key={f} value={f}>{f}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Quartos (mín)</label>
                  <Select value={filterQuartos} onValueChange={setFilterQuartos}>
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Qualquer</SelectItem>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Área mínima (m²)</label>
                  <Input type="number" placeholder="0" value={filterAreaMin} onChange={(e) => setFilterAreaMin(e.target.value)} className="h-9" />
                </div>
              </div>
              {hasActiveFilters && (
                <div className="mt-4 pt-3 border-t flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{activeFiltersCount} filtro(s) ativo(s)</span>
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-destructive hover:text-destructive">
                    <X className="h-3 w-3 mr-1" />Limpar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {loading ? "Carregando..." : `${filteredItems.length} ${filteredItems.length === 1 ? "imóvel" : "imóveis"}`}
            </h2>
            {searchTerm && !loading && (
              <p className="text-sm text-muted-foreground mt-0.5">
                Resultados para "<span className="font-medium text-foreground">{searchTerm}</span>"
              </p>
            )}
          </div>
          <div className="flex gap-1">
            <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="sm" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {loading ? (
          <div className={`grid gap-5 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum imóvel encontrado</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-6">
              {searchTerm || hasActiveFilters ? "Tente ajustar os filtros ou buscar por outros termos." : "Não há imóveis disponíveis no momento."}
            </p>
            {(searchTerm || hasActiveFilters) && (
              <Button variant="outline" size="sm" onClick={() => { setSearchTerm(""); clearFilters(); }}>Limpar busca</Button>
            )}
          </div>
        ) : (
          <div className={`grid gap-5 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
            {filteredItems.map(item => (
              <CardImovel key={item.id || item._id} imovel={item} viewMode={viewMode} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}