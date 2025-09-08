import React, { useEffect, useMemo, useState } from "react";
import { Search, Building2, MapPin, Grid3X3, List } from "lucide-react";
import CardImovel from "../components/CardImovel";
import { ImoveisAPI, ImovelType } from "../lib/api";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

/** Helpers para campos com nomes diferentes */
const getPreco = (i: any) => Number(i?.preco ?? i?.valor ?? i?.price ?? 0);
const getArea = (i: any) => Number(i?.area ?? i?.areaUtil ?? i?.m2 ?? i?.area_m2 ?? 0);

export default function Home() {
  const [items, setItems] = useState<ImovelType[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // ÚNICO "filtro" mantido: ordenação local
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

      // Normaliza diferentes formatos de retorno
      const list: ImovelType[] = Array.isArray(res)
        ? res
        : (res as any).items ?? (res as any).data ?? [];

      const tot =
        (typeof (res as any)?.total === "number" ? (res as any).total : undefined) ??
        list.length;

      setItems(list);
      setTotal(tot);
    } catch (e: any) {
      setError(e?.message || "Erro ao carregar imóveis");
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Ordenação em memória
  const orderedItems = useMemo(() => {
    const list = [...items];
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
  }, [items, sortBy]);

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

            {/* Controles de visualização e ordenação (único "filtro" mantido) */}
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
                key={(item as any)._id ?? (item as any).id}
                i={item as any}
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
