import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Ruler,
  Bed,
  Bath,
  Car,
  Building2,
  ImageIcon,
  Share2,
  Heart,
  Phone,
  MessageCircle,
  Calendar,
  Eye,
  Star,
  CheckCircle,
} from "lucide-react";
import { ImoveisAPI, ImovelType } from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import FormContato from "../components/FormContato";

/**
 * Página de detalhes do imóvel.
 * Agora com fallback entre endpoints e normalização de shape (flat/nested),
 * evitando o "Imóvel não encontrado" por causa de ID/shape divergente.
 */

// Normaliza qualquer shape vindo da API (flat ou nested) para ImovelType usado na UI
function normalizeImovel(raw: any | null | undefined): ImovelType | null {
  if (!raw) return null;

  // Ids possíveis
  const id = raw._id ?? raw.id ?? raw.uuid ?? raw.slug ?? null;

  // Endereço / cidade
  const cidade = raw.cidade ?? raw?.endereco?.cidade ?? raw?.localidade ?? "";

  // Características
  const area =
    raw.area ??
    raw?.caracteristicas?.area_m2 ??
    raw?.caracteristicas?.area ??
    undefined;

  const quartos =
    raw.quartos ?? raw?.caracteristicas?.quartos ?? undefined;

  const banheiros =
    raw.banheiros ?? raw?.caracteristicas?.banheiros ?? undefined;

  const vagas =
    raw.vagas ?? raw?.caracteristicas?.garagem ?? raw?.garagem ?? undefined;

  // Imagens (aceita diferentes chaves e normaliza para [{url, legenda}])
  const imagensRaw = raw.imagens ?? raw.fotos ?? raw.images ?? [];
  const imagens =
    Array.isArray(imagensRaw)
      ? imagensRaw.map((img: any) =>
          typeof img === "string"
            ? { url: img, legenda: "" }
            : { url: img?.url ?? img?.src ?? "", legenda: img?.legenda ?? "" }
        )
      : [];

  return {
    // mantém tudo que já veio
    ...raw,
    // sobrescreve/garante o que a UI espera
    _id: raw._id ?? id ?? undefined,
    id: id ?? undefined,
    titulo: raw.titulo ?? raw.nome ?? raw.title ?? "Imóvel",
    preco: Number(raw.preco ?? raw.valor ?? 0),
    cidade,
    area,
    quartos,
    banheiros,
    vagas,
    imagens,
    // compat: alguns lugares usam 'tipo'
    tipo: raw.tipo ?? raw.categoria ?? raw.finalidade,
  } as ImovelType;
}

export default function Imovel() {
  const { id } = useParams();
  const [item, setItem] = useState<ImovelType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        // 1) Tenta o endpoint principal
        let data: any = null;
        try {
          data = await ImoveisAPI.get(id);
        } catch {
          // ignora e tenta fallback
        }

        // 2) Se vier vazio, tenta fallback usado no Admin
        if (!data) {
          try {
            data = await ImoveisAPI.getOne(id);
          } catch {
            // se falhar também, data permanece null
          }
        }

        const normalized = normalizeImovel(data);

        if (!cancelled) {
          setItem(normalized);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Erro ao carregar imóvel:", error);
          setItem(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center shadow-xl border-0">
          <CardContent className="p-8">
            <div className="bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full p-6 mx-auto mb-6 w-fit">
              <Building2 className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-gray-800">ID não informado</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Não foi possível identificar qual imóvel você deseja visualizar.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
            >
              <Link to="/">Voltar à busca</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardContent className="p-8 text-center">
            <div className="relative mx-auto mb-6 w-16 h-16">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
              <Building2 className="absolute inset-0 m-auto h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Carregando detalhes</h3>
            <p className="text-gray-600">Aguarde um momento...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-wd text-center shadow-xl border-0">
          <CardContent className="p-8">
            <div className="bg-gradient-to-br from-red-100 to-orange-200 rounded-full p-6 mx-auto mb-6 w-fit">
              <Building2 className="h-12 w-12 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-gray-800">Imóvel não encontrado</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              O imóvel que você procura não existe ou foi removido do nosso catálogo.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
            >
              <Link to="/">Voltar à busca</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatPrice = (price?: number) => {
    if (!price) return "Preço não informado";
    return `R$ ${price.toLocaleString("pt-BR")}`;
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = "5511999999999";
    const message = encodeURIComponent(
      `Olá! Tenho interesse no imóvel "${item.titulo}". Gostaria de mais informações.`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.titulo,
          text: `Confira este imóvel: ${item.titulo}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Erro ao compartilhar:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const propertyFeatures = [
    { icon: Ruler, label: "Área", value: item.area ? `${item.area} m²` : null },
    { icon: Bed, label: "Quartos", value: item.quartos || null },
    { icon: Bath, label: "Banheiros", value: item.banheiros || null },
    { icon: Car, label: "Vagas", value: item.vagas || null },
  ].filter((feature) => feature.value !== null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar à busca
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFavorited(!isFavorited)}
                className={`hover:scale-105 transition-all duration-200 ${
                  isFavorited ? "bg-red-50 border-red-200 text-red-600" : "hover:bg-gray-50"
                }`}
              >
                <Heart className={`h-4 w-4 mr-2 ${isFavorited ? "fill-current" : ""}`} />
                {isFavorited ? "Favoritado" : "Favoritar"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="hover:bg-blue-50 hover:text-blue-700 hover:scale-105 transition-all duration-200"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-6 pb-0">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-3 leading-tight">
                      {item.titulo}
                    </h1>
                    <div className="flex items-center gap-3 text-gray-600 mb-4">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <span className="text-lg">{item.cidade}</span>
                      {item.tipo && (
                        <>
                          <span className="text-gray-400">•</span>
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-800 px-3 py-1"
                          >
                            {item.tipo}
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {formatPrice(item.preco)}
                  </div>
                  {item.area && (
                    <div className="text-gray-500">
                      <span className="text-sm">
                        R$ {((item.preco || 0) / item.area).toFixed(0)}/m²
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Image Gallery */}
              {item.imagens && item.imagens.length > 0 && (
                <div className="px-6 pb-6">
                  <div className="relative rounded-2xl overflow-hidden">
                    <img
                      src={item.imagens[currentImageIndex]?.url || item.imagens[0]?.url}
                      alt={item.titulo}
                      className="w-full h-96 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-black/50 text-white border-0">
                        <ImageIcon className="h-3 w-3 mr-1" />
                        {currentImageIndex + 1}/{item.imagens.length}
                      </Badge>
                    </div>
                  </div>

                  {item.imagens.length > 1 && (
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                      {item.imagens.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                            idx === currentImageIndex
                              ? "border-blue-500 scale-105"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <img
                            src={img.url}
                            alt={img.legenda || item.titulo}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Features */}
            {propertyFeatures.length > 0 && (
              <Card className="shadow-xl border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Características
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {propertyFeatures.map((feature, index) => {
                      const Icon = feature.icon;
                      return (
                        <div key={index} className="group">
                          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 hover:scale-105">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full p-3 mb-3 group-hover:scale-110 transition-transform duration-300">
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                            <span className="font-bold text-xl text-gray-800 mb-1">
                              {feature.value}
                            </span>
                            <span className="text-sm text-gray-600 font-medium">
                              {feature.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Description */}
            {item.descricao && (
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Eye className="h-5 w-5 text-blue-600" />
                    Descrição
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                      {item.descricao}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card className="shadow-xl border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Valor do Imóvel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                    {formatPrice(item.preco)}
                  </div>
                  {item.area && (
                    <p className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full inline-block">
                      R$ {((item.preco || 0) / item.area).toFixed(0)}/m²
                    </p>
                  )}
                </div>

                <Separator />

                <div className="space-y-3">
                  <Button className="w-full" size="lg" onClick={handleWhatsAppClick}>
                    <MessageCircle className="mr-2 h-5 w-5" />
                    WhatsApp
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <Phone className="mr-2 h-4 w-4" />
                    Ligar Agora
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <Calendar className="mr-2 h-4 w-4" />
                    Agendar Visita
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-500" />
                  Informações Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Tipo:</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {item.tipo || "Não informado"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Cidade:</span>
                  <span className="font-semibold text-gray-800">{item.cidade}</span>
                </div>
                {item.area && (
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">Área:</span>
                    <span className="font-semibold text-gray-800">{item.area} m²</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Form */}
            <FormContato imovelTitulo={item.titulo} />
          </div>
        </div>
      </main>
    </div>
  );
}
