import React, { useEffect, useMemo, useState } from "react";
import { Search, Building2, SlidersHorizontal, X, Grid3X3, List } from "lucide-react";
import CardImovel from "../components/CardImovel";
import { ImoveisAPI, Imovel } from "../lib/api";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

const getPreco = (i: Imovel) => Number(i?.preco ?? 0);
const getArea = (i: Imovel) => Number(i?.area_m2 ?? i?.caracteristicas?.area_m2 ?? 0);
const getQuartos = (i: Imovel) => Number(i?.quartos ?? i?.caracteristicas?.quartos ?? 0);
const getTipo = (i: Imovel) => String(i?.tipo ?? "").toLowerCase();
const getCidade = (i: Imovel) => String(i?.cidade ?? i?.endereco?.cidade ?? "").toLowerCase();

export default function Home() {
  const [items, setItems] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Busca e filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("relevancia");
  const [filterCidade, setFilterCidade] = useState("todos");
  const [filterPrecoMin, setFilterPrecoMin] = useState("");
  const [filterPrecoMax, setFilterPrecoMax] = useState("");
  const [filterQuartos, setFilterQuartos] = useState("todos");
  const [filterAreaMin, setFilterAreaMin] = useState("");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ImoveisAPI.list();
      setItems(res.data ?? []);
    } catch (e) {
      setError((e as Error)?.message || "Erro ao carregar imóveis");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Opções únicas para filtros
  const cidadesDisponiveis = useMemo(() => {
    const cidades = new Set(items.map(getCidade).filter(Boolean));
    return Array.from(cidades).sort();
  }, [items]);

  // Filtros e ordenação
  const filteredItems = useMemo(() => {
    let result = [...items];

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      result = result.filter(item =>
        item.titulo?.toLowerCase().includes(search) ||
        getTipo(item).includes(search) ||
        getCidade(item).includes(search) ||
        item.descricao?.toLowerCase().includes(search)
      );
    }

    if (filterCidade !== "todos") {
      result = result.filter(item => getCidade(item) === filterCidade);
    }

    if (filterPrecoMin) {
      result = result.filter(item => getPreco(item) >= Number(filterPrecoMin));
    }

    if (filterPrecoMax) {
      result = result.filter(item => getPreco(item) <= Number(filterPrecoMax));
    }

    if (filterQuartos !== "todos") {
      result = result.filter(item => getQuartos(item) >= Number(filterQuartos));
    }

    if (filterAreaMin) {
      result = result.filter(item => getArea(item) >= Number(filterAreaMin));
    }

    // Ordenação
    switch (sortBy) {
      case "mais-recente":
        result.sort((a, b) => {
          const dateA = a._id || a.id || "";
          const dateB = b._id || b.id || "";
          return String(dateB).localeCompare(String(dateA));
        });
        break;
      case "mais-antigo":
        result.sort((a, b) => {
          const dateA = a._id || a.id || "";
          const dateB = b._id || b.id || "";
          return String(dateA).localeCompare(String(dateB));
        });
        break;
      case "menor-preco":
        result.sort((a, b) => getPreco(a) - getPreco(b));
        break;
      case "maior-preco":
        result.sort((a, b) => getPreco(b) - getPreco(a));
        break;
      case "menor-area":
        result.sort((a, b) => getArea(a) - getArea(b));
        break;
      case "maior-area":
        result.sort((a, b) => getArea(b) - getArea(a));
        break;
      default:
        // relevancia - sem ordenação específica
        break;
    }

    return result;
  }, [items, searchTerm, sortBy, filterCidade, filterPrecoMin, filterPrecoMax, filterQuartos, filterAreaMin]);

  const hasActiveFilters = sortBy !== "relevancia" || filterCidade !== "todos" || filterPrecoMin || filterPrecoMax || filterQuartos !== "todos" || filterAreaMin;

  const clearFilters = () => {
    setSortBy("relevancia");
    setFilterCidade("todos");
    setFilterPrecoMin("");
    setFilterPrecoMax("");
    setFilterQuartos("todos");
    setFilterAreaMin("");
  };

  const activeFiltersCount = [
    sortBy !== "relevancia",
    filterCidade !== "todos",
    filterPrecoMin,
    filterPrecoMax,
    filterQuartos !== "todos",
    filterAreaMin
  ].filter(Boolean).length;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-red-200 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <X className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Erro ao carregar</h3>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="text-center space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Encontre seu{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
                imóvel ideal
              </span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
              Descubra as melhores oportunidades imobiliárias
            </p>

            {/* Barra de Busca Única */}
            <div className="max-w-3xl mx-auto mt-8">
              <div className="flex flex-col sm:flex-row gap-3 bg-white rounded-2xl p-3 shadow-2xl">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Busque por cidade, bairro ou tipo de imóvel..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 border-0 focus-visible:ring-2 focus-visible:ring-amber-500"
                  />
                </div>
                <Button
                  type="button"
                  size="lg"
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold px-6 md:px-8 rounded-xl shadow-lg hover:shadow-xl transition-all h-12 relative"
                >
                  <SlidersHorizontal className="mr-2 h-5 w-5" />
                  Filtros
                  {activeFiltersCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-red-500 text-white border-2 border-white h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Painel de Filtros */}
        {showFilters && (
          <Card className="mb-6 border-blue-200 shadow-lg animate-in slide-in-from-top-4 duration-300">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5 text-blue-600" />
                  Filtros Avançados
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowFilters(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Ordenar por */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Ordenar por</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevancia">Relevância</SelectItem>
                      <SelectItem value="mais-recente">Mais Recentes</SelectItem>
                      <SelectItem value="mais-antigo">Mais Antigos</SelectItem>
                      <SelectItem value="menor-preco">Menor Preço</SelectItem>
                      <SelectItem value="maior-preco">Maior Preço</SelectItem>
                      <SelectItem value="menor-area">Menor Área</SelectItem>
                      <SelectItem value="maior-area">Maior Área</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Cidade */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Cidade</label>
                  <Select value={filterCidade} onValueChange={setFilterCidade}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todas</SelectItem>
                      {cidadesDisponiveis.map(cidade => (
                        <SelectItem key={cidade} value={cidade} className="capitalize">
                          {cidade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Quartos */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Quartos (mín)</label>
                  <Select value={filterQuartos} onValueChange={setFilterQuartos}>
                    <SelectTrigger>
                      <SelectValue />
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

                {/* Preço Mínimo */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Preço Mínimo</label>
                  <Input
                    type="number"
                    placeholder="R$ 0"
                    value={filterPrecoMin}
                    onChange={(e) => setFilterPrecoMin(e.target.value)}
                  />
                </div>

                {/* Preço Máximo */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Preço Máximo</label>
                  <Input
                    type="number"
                    placeholder="R$ 0"
                    value={filterPrecoMax}
                    onChange={(e) => setFilterPrecoMax(e.target.value)}
                  />
                </div>

                {/* Área Mínima */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Área Mínima (m²)</label>
                  <Input
                    type="number"
                    placeholder="0 m²"
                    value={filterAreaMin}
                    onChange={(e) => setFilterAreaMin(e.target.value)}
                  />
                </div>
              </div>

              {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {activeFiltersCount} filtro{activeFiltersCount > 1 ? 's' : ''} ativo{activeFiltersCount > 1 ? 's' : ''}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Limpar Filtros
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Resultados */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {loading ? "Carregando..." : `${filteredItems.length} ${filteredItems.length === 1 ? 'imóvel' : 'imóveis'}`}
            </h2>
            {searchTerm && !loading && (
              <p className="text-sm text-gray-600 mt-1">
                Resultados para "<span className="font-medium">{searchTerm}</span>"
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Grid de Imóveis */}
        {loading ? (
          <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full p-6 mb-6">
              <Building2 className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-800">
              Nenhum imóvel encontrado
            </h3>
            <p className="text-gray-600 max-w-md mb-6">
              {searchTerm || hasActiveFilters 
                ? "Tente ajustar os filtros ou buscar por outros termos."
                : "Não há imóveis disponíveis no momento."}
            </p>
            {(searchTerm || hasActiveFilters) && (
              <Button
                onClick={() => {
                  setSearchTerm("");
                  clearFilters();
                }}
                variant="outline"
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                Limpar Busca
              </Button>
            )}
          </div>
        ) : (
          <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
            {filteredItems.map(item => (
              <CardImovel key={item.id || item._id} imovel={item} viewMode={viewMode} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
