import React, { useEffect, useMemo, useState } from "react";
import { Search, Building2, MapPin, Grid3X3, List, SlidersHorizontal, X } from "lucide-react";
import CardImovel from "../components/CardImovel";
import { ImoveisAPI, Imovel } from "../lib/api";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

/** Helpers para campos com nomes diferentes */
const getPreco = (i: Imovel) => Number(i?.preco ?? 0);
const getArea = (i: Imovel) => Number(i?.caracteristicas?.area_m2 ?? 0);
const getQuartos = (i: Imovel) => Number(i?.caracteristicas?.quartos ?? 0);
const getTipo = (i: Imovel) => String(i?.tipo ?? i?.finalidade ?? "").toLowerCase();
const getCidade = (i: Imovel) => String(i?.endereco?.cidade ?? "").toLowerCase();
const getBairro = (i: Imovel) => String(i?.endereco?.bairro ?? "").toLowerCase();

export default function Home() {
  const [items, setItems] = useState<Imovel[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Estados de busca e filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterTipo, setFilterTipo] = useState("todos");
  const [filterCidade, setFilterCidade] = useState("todos");
  const [filterPrecoMin, setFilterPrecoMin] = useState("");
  const [filterPrecoMax, setFilterPrecoMax] = useState("");
  const [filterQuartos, setFilterQuartos] = useState("todos");
  const [filterAreaMin, setFilterAreaMin] = useState("");

  const [sortBy, setSortBy] = useState("recent");
  const sortOptions = [
    { value: "recent", label: "Mais Recentes" },
    { value: "price-asc", label: "Menor Preço" },
    { value: "price-desc", label: "Maior Preço" },
    { value: "area", label: "Maior Área" },
  ];

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ImoveisAPI.list();
      const list: Imovel[] = res.data ?? [];
      const tot = res.total ?? list.length;

      setItems(list);
      setTotal(tot);
    } catch (e) {
      const error = e as Error;
      setError(error?.message || "Erro ao carregar imóveis");
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Extrair opções únicas para filtros
  const tiposDisponiveis = useMemo(() => {
    const tipos = new Set<string>();
    items.forEach(item => {
      const tipo = getTipo(item);
      if (tipo) tipos.add(tipo);
    });
    return Array.from(tipos).sort();
  }, [items]);

  const cidadesDisponiveis = useMemo(() => {
    const cidades = new Set<string>();
    items.forEach(item => {
      const cidade = getCidade(item);
      if (cidade) cidades.add(cidade);
    });
    return Array.from(cidades).sort();
  }, [items]);

  // Aplicar busca e filtros
  const filteredItems = useMemo(() => {
    let result = [...items];

    // Busca por texto
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      result = result.filter(item => {
        const titulo = String((item as Record<string, unknown>)?.titulo ?? (item as Record<string, unknown>)?.nome ?? "").toLowerCase();
        const tipo = getTipo(item);
        const cidade = getCidade(item);
        const bairro = getBairro(item);
        
        return titulo.includes(search) || 
               tipo.includes(search) || 
               cidade.includes(search) || 
               bairro.includes(search);
      });
    }

    // Filtro por tipo
    if (filterTipo !== "todos") {
      result = result.filter(item => getTipo(item) === filterTipo);
    }

    // Filtro por cidade
    if (filterCidade !== "todos") {
      result = result.filter(item => getCidade(item) === filterCidade);
    }

    // Filtro por preço mínimo
    if (filterPrecoMin) {
      const min = Number(filterPrecoMin);
      result = result.filter(item => getPreco(item) >= min);
    }

    // Filtro por preço máximo
    if (filterPrecoMax) {
      const max = Number(filterPrecoMax);
      result = result.filter(item => getPreco(item) <= max);
    }

    // Filtro por quartos
    if (filterQuartos !== "todos") {
      const quartos = Number(filterQuartos);
      result = result.filter(item => getQuartos(item) >= quartos);
    }

    // Filtro por área mínima
    if (filterAreaMin) {
      const min = Number(filterAreaMin);
      result = result.filter(item => getArea(item) >= min);
    }

    return result;
  }, [items, searchTerm, filterTipo, filterCidade, filterPrecoMin, filterPrecoMax, filterQuartos, filterAreaMin]);

  // Ordenação em memória
  const orderedItems = useMemo(() => {
    const list = [...filteredItems];
    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => getPreco(a) - getPreco(b));
        break;
      case "price-desc":
        list.sort((a, b) => getPreco(b) - getPreco(a));
        break;
      case "area":
        list.sort((a, b) => getArea(b) - getArea(a));
        break;
      case "recent":
      default:
        // Se quiser realmente ordenar por data aqui, adicione createdAt nos itens e faça o sort.
        break;
    }
    return list;
  }, [filteredItems, sortBy]);

  const hasActiveFilters = searchTerm || filterTipo !== "todos" || filterCidade !== "todos" || 
                          filterPrecoMin || filterPrecoMax || filterQuartos !== "todos" || filterAreaMin;

  const clearFilters = () => {
    setSearchTerm("");
    setFilterTipo("todos");
    setFilterCidade("todos");
    setFilterPrecoMin("");
    setFilterPrecoMax("");
    setFilterQuartos("todos");
    setFilterAreaMin("");
  };

  const LoadingSkeleton = () => (
    <div
      className={`grid gap-6 ${
        viewMode === "grid"
          ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : "grid-cols-1"
      }`}
    >
      {[...Array(8)].map((_, i) => (
        <Card key={i} className="overflow-hidden border-0 shadow-md">
          <Skeleton className="h-48 w-full" />
          <CardContent className="p-4 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full p-6 mb-6">
        <Building2 className="h-12 w-12 text-blue-600" />
      </div>
      <h3 className="text-2xl font-bold mb-3 text-gray-800">
        Nenhum imóvel encontrado
      </h3>
      <p className="text-gray-600 max-w-md mb-6">
        Não há imóveis disponíveis no momento. Tente novamente mais tarde.
      </p>
      <Button
        onClick={() => load()}
        variant="outline"
        className="border-blue-200 text-blue-600 hover:bg-blue-50"
      >
        Recarregar
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header / Hero */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white border-b shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Encontre seu{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
                imóvel ideal
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Descubra as melhores oportunidades imobiliárias
            </p>

            {/* Barra de Busca no Hero */}
            <div className="max-w-2xl mx-auto mt-8">
              <form onSubmit={(e) => { e.preventDefault(); }} className="flex flex-col sm:flex-row gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Digite o bairro, cidade ou tipo de imóvel..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 bg-transparent border-none text-white placeholder:text-white/70 focus:ring-2 focus:ring-amber-400 h-12"
                  />
                </div>
                <Button
                  type="button"
                  size="lg"
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold px-8 py-3 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 h-12"
                >
                  <SlidersHorizontal className="mr-2 h-5 w-5" />
                  Filtros
                </Button>
              </form>
            </div>

            <div className="flex flex-wrap justify-center gap-8 mt-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
                <span className="text-blue-100">Preços competitivos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                <span className="text-blue-100">Suporte especializado</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Painel de Filtros Avançados */}
        {showFilters && (
          <Card className="mb-6 border-blue-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5 text-blue-600" />
                  Filtros Avançados
                </h3>
                {hasActiveFilters && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Limpar Filtros
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Filtro Tipo */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Tipo de Imóvel</label>
                  <Select value={filterTipo} onValueChange={setFilterTipo}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Todos os tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os tipos</SelectItem>
                      {tiposDisponiveis.map(tipo => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtro Cidade */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Cidade</label>
                  <Select value={filterCidade} onValueChange={setFilterCidade}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Todas as cidades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todas as cidades</SelectItem>
                      {cidadesDisponiveis.map(cidade => (
                        <SelectItem key={cidade} value={cidade}>
                          {cidade.charAt(0).toUpperCase() + cidade.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtro Quartos */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Quartos (mínimo)</label>
                  <Select value={filterQuartos} onValueChange={setFilterQuartos}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Qualquer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Qualquer</SelectItem>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtro Área */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Área mínima (m²)</label>
                  <Input
                    type="number"
                    placeholder="Ex: 50"
                    value={filterAreaMin}
                    onChange={(e) => setFilterAreaMin(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Filtro Preço Mínimo */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Preço mínimo (R$)</label>
                  <Input
                    type="number"
                    placeholder="Ex: 100000"
                    value={filterPrecoMin}
                    onChange={(e) => setFilterPrecoMin(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Filtro Preço Máximo */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Preço máximo (R$)</label>
                  <Input
                    type="number"
                    placeholder="Ex: 500000"
                    value={filterPrecoMax}
                    onChange={(e) => setFilterPrecoMax(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {searchTerm && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Busca: "{searchTerm}"
                      </Badge>
                    )}
                    {filterTipo !== "todos" && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Tipo: {filterTipo}
                      </Badge>
                    )}
                    {filterCidade !== "todos" && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Cidade: {filterCidade}
                      </Badge>
                    )}
                    {filterQuartos !== "todos" && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Quartos: {filterQuartos}+
                      </Badge>
                    )}
                    {filterAreaMin && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Área: {filterAreaMin}m²+
                      </Badge>
                    )}
                    {filterPrecoMin && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Preço: R$ {Number(filterPrecoMin).toLocaleString('pt-BR')}+
                      </Badge>
                    )}
                    {filterPrecoMax && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Até: R$ {Number(filterPrecoMax).toLocaleString('pt-BR')}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Barra de controles */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-600" />
                <span className="text-lg font-semibold text-gray-800">
                  Resultados
                </span>
              </div>

              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-800 px-3 py-1.5 font-medium"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                    Carregando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    {orderedItems.length} de {total} imóvel
                    {total !== 1 ? "s" : ""} encontrado
                    {total !== 1 ? "s" : ""}
                  </div>
                )}
              </Badge>
            </div>

            {/* Controles de visualização e ordenação */}
            <div className="flex items-center gap-3">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-44 border-gray-300">
                  <SelectValue placeholder="Ordenar" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="border-l border-gray-300 pl-3 flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="px-3"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="px-3"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Erro */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 rounded-full p-2">
                  <Search className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-800">
                    Erro ao carregar imóveis
                  </h3>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Conteúdo */}
        {loading ? (
          <LoadingSkeleton />
        ) : orderedItems.length === 0 ? (
          <EmptyState />
        ) : (
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
                : "grid-cols-1"
            }`}
          >
            {orderedItems.map((item) => (
              <CardImovel
                key={item._id ?? item.id}
                i={item}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}

        {/* Rodapé simples */}
        {!loading && orderedItems.length > 0 && (
          <div className="text-center mt-12">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 inline-block">
              <p className="text-gray-600">
                Mostrando{" "}
                <span className="font-semibold text-blue-600">
                  {orderedItems.length}
                </span>{" "}
                de{" "}
                <span className="font-semibold text-blue-600">{total}</span>{" "}
                imóveis
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
