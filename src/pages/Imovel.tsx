import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, MapPin, Ruler, Bed, Bath, Car, Building2, ImageIcon,
  Heart, Phone, MessageCircle, Eye, Star, CheckCircle, X,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import type { Imovel } from "../lib/api";
import { ImoveisAPI } from "../lib/api";
import { formatCurrency } from "../lib/utils";
import { getTagConfig } from "../lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import ShareButtons from "../components/ShareButtons";

const CORRETOR = {
  nome: "Pedro de Toledo",
  whatsapp: "5516996137532",
  telefoneDisplay: "(16) 99613-7532",
  email: "pedro.toledo@creci.org.br",
};
const whatsLink = (text: string) => `https://wa.me/${CORRETOR.whatsapp}?text=${encodeURIComponent(text)}`;
const telLink = () => `tel:+${CORRETOR.whatsapp}`;

type NormalizedImg = { url: string; legenda: string };

function normalizeImovel(raw: Imovel | null): (Imovel & { imagens: NormalizedImg[] }) | null {
  if (!raw) return null;
  const imgs = Array.isArray(raw.imagens)
    ? raw.imagens.map((i) => (typeof i === "string" ? { url: i, legenda: "" } : { url: i?.url ?? "", legenda: i?.legenda ?? "" }))
    : [];
  return { ...raw, imagens: imgs };
}

function getVal(i: Imovel, k: string) {
  const flat = (i as Record<string, unknown>)[k];
  const nested = (i.caracteristicas as Record<string, unknown> | undefined)?.[k];
  return Number(flat ?? nested ?? 0);
}

export default function ImovelPage() {
  const { id } = useParams();
  const [item, setItem] = useState<(Imovel & { imagens: NormalizedImg[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const [modal, setModal] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    if (modal) {
      const orig = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = orig; };
    }
  }, [modal]);

  const next = useCallback(() => { if (item?.imagens?.length) setImgIdx((p) => (p + 1) % item.imagens.length); }, [item]);
  const prev = useCallback(() => { if (item?.imagens?.length) setImgIdx((p) => (p - 1 + item.imagens.length) % item.imagens.length); }, [item]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (!modal) return;
      if (e.key === "Escape") setModal(false);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [modal, next, prev]);

  useEffect(() => {
    if (!id) return;
    let c = false;
    (async () => {
      setLoading(true);
      try {
        let data: Imovel | null = null;
        try { data = await ImoveisAPI.get(id); } catch {}
        if (!data) try { data = await ImoveisAPI.getOne(id); } catch {}
        if (!c) setItem(normalizeImovel(data));
      } catch {
        if (!c) setItem(null);
      } finally {
        if (!c) setLoading(false);
      }
    })();
    return () => { c = true; };
  }, [id]);

  // Loading / error states
  if (!id || loading || !item) {
    const title = !id ? "ID não informado" : loading ? "Carregando..." : "Imóvel não encontrado";
    const desc = !id ? "Não foi possível identificar o imóvel." : loading ? "Aguarde um momento" : "O imóvel não existe ou foi removido.";
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-sm w-full text-center">
          <CardContent className="p-8">
            <div className="mx-auto mb-4 h-14 w-14 flex items-center justify-center rounded-2xl bg-secondary">
              {loading ? (
                <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-r-transparent" />
              ) : (
                <Building2 className="h-7 w-7 text-muted-foreground" />
              )}
            </div>
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <p className="text-muted-foreground mb-6 text-sm">{desc}</p>
            {!loading && <Button asChild><Link to="/">Voltar à busca</Link></Button>}
          </CardContent>
        </Card>
      </div>
    );
  }

  const cidade = item.cidade || item.endereco?.cidade || "";
  const area = getVal(item, "area_m2") || item.area || 0;
  const quartos = getVal(item, "quartos");
  const banheiros = getVal(item, "banheiros");
  const garagem = getVal(item, "garagem");
  const features = [
    { icon: Ruler, label: "Área", value: area ? `${area} m²` : null },
    { icon: Bed, label: "Quartos", value: quartos || null },
    { icon: Bath, label: "Banheiros", value: banheiros || null },
    { icon: Car, label: "Vagas", value: garagem || null },
  ].filter((f) => f.value);

  const handleWhatsApp = () => {
    window.open(whatsLink(`Olá, ${CORRETOR.nome}! Tenho interesse no imóvel "${item.titulo}". Gostaria de mais informações.`), "_blank");
  };

  const handleForm = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = [`Olá, ${CORRETOR.nome}! `, `Tenho interesse no imóvel: "${item.titulo}".`];
    if (mensagem.trim()) lines.push("", "Mensagem:", mensagem.trim());
    lines.push("", "Dados para contato:");
    if (nome.trim()) lines.push(` Nome: ${nome.trim()}`);
    if (email.trim()) lines.push(` E-mail: ${email.trim()}`);
    if (telefone.trim()) lines.push(` Telefone: ${telefone.trim()}`);
    window.open(whatsLink(lines.join("\n")), "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card/95 backdrop-blur-sm border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild><Link to="/"><ArrowLeft className="h-4 w-4 mr-1.5" />Voltar</Link></Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsFavorited(!isFavorited)} className={isFavorited ? "text-red-500 border-red-200 bg-red-50" : ""}>
                <Heart className={`h-4 w-4 mr-1.5 ${isFavorited ? "fill-current" : ""}`} />{isFavorited ? "Favoritado" : "Favoritar"}
              </Button>
              <ShareButtons title={item.titulo} description={`${item.tipo ? item.tipo + " - " : ""}${cidade}. ${formatCurrency(item.preco || 0)}`} />
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title + Price */}
            <div className="bg-card rounded-xl border p-5">
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-3">{item.titulo}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary/70" />{cidade}</span>
                {item.tipo && <Badge variant="secondary">{item.tipo}</Badge>}
                {item.finalidade && <Badge variant="outline">{item.finalidade}</Badge>}
              </div>
              <div className="text-3xl font-bold text-primary">{item.preco ? formatCurrency(item.preco) : "Consulte"}</div>
              {area > 0 && item.preco && (
                <p className="text-xs text-muted-foreground mt-1">R$ {Math.round(item.preco / area).toLocaleString("pt-BR")}/m²</p>
              )}

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {item.tags.map(tag => {
                    const cfg = getTagConfig(tag);
                    return (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {cfg?.icon && <span className="mr-1">{cfg.icon}</span>}
                        {cfg?.label || tag}
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Gallery */}
            {item.imagens.length > 0 ? (
              <div className="bg-card rounded-xl border overflow-hidden">
                <button type="button" onClick={() => { setImgIdx(imgIdx); setModal(true); }} className="relative w-full block group">
                  <img src={item.imagens[imgIdx]?.url} alt={item.titulo} className="w-full h-80 lg:h-96 object-cover transition-transform group-hover:scale-[1.02]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  <Badge className="absolute top-3 right-3 bg-black/50 text-white border-0"><ImageIcon className="h-3 w-3 mr-1" />{imgIdx + 1}/{item.imagens.length}</Badge>
                </button>
                {item.imagens.length > 1 && (
                  <div className="flex gap-1.5 p-3 overflow-x-auto">
                    {item.imagens.map((img, idx) => (
                      <button key={idx} onClick={() => setImgIdx(idx)} className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${idx === imgIdx ? "border-primary scale-105" : "border-transparent hover:border-muted-foreground/30"}`}>
                        <img src={img.url} alt={img.legenda || `Imagem ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-card rounded-xl border p-8">
                <div className="h-40 flex items-center justify-center text-muted-foreground/40">
                  <ImageIcon className="h-10 w-10 mr-2" /><span>Sem imagens</span>
                </div>
              </div>
            )}

            {/* Features */}
            {features.length > 0 && (
              <Card>
                <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-600" />Características</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {features.map((f, i) => {
                      const Icon = f.icon;
                      return (
                        <div key={i} className="flex flex-col items-center text-center p-4 rounded-xl bg-secondary/50 border">
                          <div className="bg-primary rounded-full p-2.5 mb-2"><Icon className="h-5 w-5 text-primary-foreground" /></div>
                          <span className="font-bold text-lg">{f.value}</span>
                          <span className="text-xs text-muted-foreground">{f.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Description */}
            {item.descricao && (
              <Card>
                <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Eye className="h-4 w-4 text-primary" />Descrição</CardTitle></CardHeader>
                <CardContent><p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{item.descricao}</p></CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-sm">Contato</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-full bg-emerald-50 flex items-center justify-center"><Phone className="h-4 w-4 text-emerald-600" /></div>
                  <span className="font-medium text-sm">{CORRETOR.telefoneDisplay}</span>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleWhatsApp} size="sm" className="bg-emerald-600 hover:bg-emerald-700 flex-1">WhatsApp</Button>
                  <a href={telLink()}><Button variant="outline" size="sm">Ligar</Button></a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Star className="h-4 w-4 text-amber-500" />Info. Rápidas</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center p-2.5 bg-secondary/50 rounded-lg text-sm"><span className="text-muted-foreground">Tipo</span><Badge variant="secondary">{item.tipo || "N/I"}</Badge></div>
                <div className="flex justify-between items-center p-2.5 bg-secondary/50 rounded-lg text-sm"><span className="text-muted-foreground">Cidade</span><span className="font-medium">{cidade || "N/I"}</span></div>
                {area > 0 && <div className="flex justify-between items-center p-2.5 bg-secondary/50 rounded-lg text-sm"><span className="text-muted-foreground">Área</span><span className="font-medium">{area} m²</span></div>}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><MessageCircle className="h-4 w-4 text-emerald-600" />Mensagem</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleForm} className="space-y-3">
                  <Input placeholder="Seu nome" value={nome} onChange={e => setNome(e.target.value)} required className="h-9 text-sm" />
                  <Input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required className="h-9 text-sm" />
                  <Input placeholder="Telefone" value={telefone} onChange={e => setTelefone(e.target.value)} className="h-9 text-sm" />
                  <Textarea placeholder={`Tenho interesse no imóvel "${item.titulo}".`} value={mensagem} onChange={e => setMensagem(e.target.value)} rows={3} className="text-sm" />
                  <Button type="submit" className="w-full" size="sm"><MessageCircle className="mr-1.5 h-4 w-4" />Enviar via WhatsApp</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Lightbox */}
      {modal && item.imagens.length > 0 && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center" onClick={() => setModal(false)}>
          <button onClick={e => { e.stopPropagation(); setModal(false); }} className="absolute top-4 right-4 text-white/80 hover:text-white p-2"><X className="w-6 h-6" /></button>
          {item.imagens.length > 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); prev(); }} className="absolute left-3 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"><ChevronLeft className="w-6 h-6" /></button>
              <button onClick={e => { e.stopPropagation(); next(); }} className="absolute right-3 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"><ChevronRight className="w-6 h-6" /></button>
            </>
          )}
          <div className="max-w-[95vw] max-h-[92vh]" onClick={e => e.stopPropagation()}>
            <img src={item.imagens[imgIdx]?.url} alt={item.titulo} className="object-contain max-w-[95vw] max-h-[92vh] rounded-lg" draggable={false} />
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm bg-white/10 px-3 py-1 rounded-full">{imgIdx + 1} / {item.imagens.length}</div>
        </div>
      )}
    </div>
  );
}