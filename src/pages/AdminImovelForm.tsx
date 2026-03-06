import { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { ImoveisAPI, Imovel } from "@/lib/api";
import { formatPriceInput, parseCurrencyInput, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Building2, CheckCircle2, AlertCircle, Loader2, Image as ImageIcon, X, MoveUp, MoveDown, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TAGS_DISPONIVEIS, getTagConfig, TIPOS_IMOVEL, FINALIDADES } from "@/lib/constants";

const empty: Imovel = {
  titulo: "",
  descricao: "",
  preco: 0,
  tipo: "",
  finalidade: "",
  cidade: "",
  estado: "",
  bairro: "",
  logradouro: "",
  numero: "",
  cep: "",
  quartos: 0,
  banheiros: 0,
  garagem: 0,
  area_m2: 0,
  imagens: [],
  tags: [],
};

function normImg(raw: string) {
  if (!raw) return "";
  return raw;
}

function toNumber(v: string): number | null {
  const n = parseFloat(v);
  if (isNaN(n)) return null;
  return n;
}

function sanitize(f: Imovel): Partial<Imovel> {
  const out: Partial<Imovel> = { ...f };
  if (!out.titulo?.trim()) delete out.titulo;
  if (!out.descricao?.trim()) delete out.descricao;
  if (out.preco == null || out.preco === 0) delete out.preco;
  if (!out.tipo?.trim()) delete out.tipo;
  if (!out.finalidade?.trim()) delete out.finalidade;
  if (!out.cidade?.trim()) delete out.cidade;
  if (!out.estado?.trim()) delete out.estado;
  if (!out.bairro?.trim()) delete out.bairro;
  if (!out.logradouro?.trim()) delete out.logradouro;
  if (!out.numero?.trim()) delete out.numero;
  if (!out.cep?.trim()) delete out.cep;
  if (!out.quartos) delete out.quartos;
  if (!out.banheiros) delete out.banheiros;
  if (!out.garagem) delete out.garagem;
  if (!out.area_m2) delete out.area_m2;

  // Manter compatibilidade com schema antigo
  if (out.cidade || out.estado || out.bairro || out.logradouro || out.numero) {
    out.endereco = {
      cidade: out.cidade || "",
      estado: out.estado || "",
      bairro: out.bairro || "",
      logradouro: out.logradouro || "",
      numero: out.numero || "",
    };
  }
  if (out.quartos || out.banheiros || out.garagem || out.area_m2) {
    out.caracteristicas = {
      quartos: out.quartos || 0,
      banheiros: out.banheiros || 0,
      garagem: out.garagem || 0,
      area_m2: out.area_m2 || 0,
    };
  }

  if (out.imagens && Array.isArray(out.imagens)) {
    const filtered = (out.imagens as string[]).filter((u: string) => typeof u === "string" && u?.trim());
    if (filtered.length === 0) delete out.imagens;
    else out.imagens = filtered;
  }
  if (out.tags) {
    out.tags = out.tags.filter((t: string) => t?.trim());
    if (out.tags.length === 0) delete out.tags;
  }
  return out;
}

// Normaliza dados do backend para o form (suporte schemas antigo e novo)
function normalizeToForm(data: Imovel): Imovel {
  return {
    ...empty,
    ...data,
    cidade: data.cidade || data.endereco?.cidade || "",
    estado: data.estado || data.endereco?.estado || "",
    bairro: data.bairro || data.endereco?.bairro || "",
    logradouro: data.logradouro || data.endereco?.logradouro || "",
    numero: data.numero || String(data.endereco?.numero || ""),
    quartos: data.quartos ?? data.caracteristicas?.quartos ?? 0,
    banheiros: data.banheiros ?? data.caracteristicas?.banheiros ?? 0,
    garagem: data.garagem ?? data.caracteristicas?.garagem ?? 0,
    area_m2: data.area_m2 ?? data.caracteristicas?.area_m2 ?? data.area ?? 0,
    imagens: data.imagens || [],
    tags: data.tags || [],
  };
}

export default function AdminImovelForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const editing = Boolean(id);
  const stateImovel = location.state?.imovel as Imovel | undefined;

  const [form, setForm] = useState<Imovel>(empty);
  const [priceDisplay, setPriceDisplay] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (stateImovel) {
        const normalized = normalizeToForm(stateImovel);
        setForm(normalized);
        setPriceDisplay(normalized.preco ? formatPriceInput(String(normalized.preco)) : "");
      } else if (editing && id) {
        try {
          const data = await ImoveisAPI.getOne(id);
          if (data) {
            const normalized = normalizeToForm(data);
            setForm(normalized);
            setPriceDisplay(normalized.preco ? formatPriceInput(String(normalized.preco)) : "");
          }
        } catch (error) {
          setErr((error as Error)?.message || "Falha ao carregar");
        }
      }
    })();
  }, [editing, id, stateImovel]);

  const set = <K extends keyof Imovel>(k: K, v: Imovel[K]) => setForm((f) => ({ ...f, [k]: v }));

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formatted = formatPriceInput(raw);
    setPriceDisplay(formatted);
    set("preco", parseCurrencyInput(formatted));
  };

  const canSubmit = useMemo(() => (form.titulo?.trim() || "").length > 0, [form.titulo]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setErr(null);
    setSuccess(null);
    try {
      const payload = sanitize(form);
      if (editing && id) {
        await ImoveisAPI.update(id, payload);
        setSuccess("Imóvel atualizado com sucesso!");
        setTimeout(() => navigate("/admin"), 1500);
      } else {
        const created = await ImoveisAPI.create(payload);
        setSuccess("Imóvel criado com sucesso!");
        if (created?._id || created?.id) {
          const newId = String(created._id || created.id);
          setTimeout(() => navigate(`/admin/imoveis`, { replace: true }), 1500);
          return;
        }
      }
    } catch (error) {
      const e = error as Error & { response?: { data?: { message?: string } } };
      setErr(e?.response?.data?.message || e?.message || "Falha ao salvar");
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tag: string) => {
    const tags = form.tags || [];
    if (tags.includes(tag)) set("tags", tags.filter((t) => t !== tag));
    else set("tags", [...tags, tag]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">
                  {editing ? "Editar Imóvel" : "Novo Imóvel"}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {editing ? "Atualize as informações" : "Preencha os dados do imóvel"}
                </p>
              </div>
            </div>
            <Link to="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mx-auto max-w-4xl space-y-6 p-4 pb-12">
        {err && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{err}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Informações Básicas */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                placeholder="Ex: Apartamento 2 dormitórios no centro"
                value={form.titulo}
                onChange={(e) => set("titulo", e.target.value)}
                required
                className="mt-1.5"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="preco">Preço (R$)</Label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">R$</span>
                  <Input
                    id="preco"
                    type="text"
                    inputMode="numeric"
                    placeholder="350.000"
                    value={priceDisplay}
                    onChange={handlePriceChange}
                    className="pl-10"
                  />
                </div>
                {form.preco > 0 && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Valor: {formatCurrency(form.preco)}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="tipo">Tipo</Label>
                <Select value={form.tipo || ""} onValueChange={(v) => set("tipo", v)}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {TIPOS_IMOVEL.map(t => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="finalidade">Finalidade</Label>
                <Select value={form.finalidade || ""} onValueChange={(v) => set("finalidade", v)}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {FINALIDADES.map(f => (
                      <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                placeholder="Descreva as características e diferenciais..."
                rows={4}
                value={form.descricao ?? ""}
                onChange={(e) => set("descricao", e.target.value)}
                className="mt-1.5"
              />
            </div>
          </CardContent>
        </Card>

        {/* Localização */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Localização</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <Label>Cidade</Label>
                <Input placeholder="São Carlos" value={form.cidade ?? ""} onChange={(e) => set("cidade", e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label>Estado</Label>
                <Input placeholder="SP" maxLength={2} value={form.estado ?? ""} onChange={(e) => set("estado", e.target.value.toUpperCase())} className="mt-1.5" />
              </div>
              <div>
                <Label>CEP</Label>
                <Input placeholder="13560-000" value={form.cep ?? ""} onChange={(e) => set("cep", e.target.value)} className="mt-1.5" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <Label>Bairro</Label>
                <Input placeholder="Centro" value={form.bairro ?? ""} onChange={(e) => set("bairro", e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label>Logradouro</Label>
                <Input placeholder="Rua Principal" value={form.logradouro ?? ""} onChange={(e) => set("logradouro", e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label>Número</Label>
                <Input placeholder="123" value={form.numero ?? ""} onChange={(e) => set("numero", e.target.value)} className="mt-1.5" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Características */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Características</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <Label>Quartos</Label>
                <Input type="number" min="0" placeholder="2" value={form.quartos || ""} onChange={(e) => set("quartos", toNumber(e.target.value) ?? 0)} className="mt-1.5" />
              </div>
              <div>
                <Label>Banheiros</Label>
                <Input type="number" min="0" placeholder="1" value={form.banheiros || ""} onChange={(e) => set("banheiros", toNumber(e.target.value) ?? 0)} className="mt-1.5" />
              </div>
              <div>
                <Label>Vagas</Label>
                <Input type="number" min="0" placeholder="1" value={form.garagem || ""} onChange={(e) => set("garagem", toNumber(e.target.value) ?? 0)} className="mt-1.5" />
              </div>
              <div>
                <Label>Área (m²)</Label>
                <Input type="number" min="0" placeholder="80" value={form.area_m2 || ""} onChange={(e) => set("area_m2", toNumber(e.target.value) ?? 0)} className="mt-1.5" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Imagens */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Imagens</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const imgs = (form.imagens as string[]) || [];
                  set("imagens", [...imgs, ""] as string[]);
                }}
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Adicionar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {((form.imagens as string[]) || []).length === 0 ? (
              <div className="rounded-lg border-2 border-dashed p-8 text-center">
                <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground/40" />
                <p className="mt-2 text-sm text-muted-foreground">Nenhuma imagem</p>
              </div>
            ) : (
              <div className="space-y-3">
                {((form.imagens as string[]) || []).map((url: string, idx: number) => (
                  <div key={idx} className="flex gap-3 items-center rounded-lg border p-3">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
                      {url ? (
                        <img src={normImg(url)} alt={`Imagem ${idx + 1}`} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-muted-foreground/40" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="https://exemplo.com/imagem.jpg"
                          value={url}
                          onChange={(e) => {
                            const images = (form.imagens as string[]) || [];
                            set("imagens", images.map((u, i) => (i === idx ? e.target.value : u)) as string[]);
                          }}
                          className="h-8 text-sm"
                        />
                        {idx === 0 && <Badge variant="secondary" className="shrink-0 text-xs">Capa</Badge>}
                      </div>
                      <div className="flex gap-1">
                        <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs text-destructive" onClick={() => {
                          const images = (form.imagens as string[]) || [];
                          set("imagens", images.filter((_, i) => i !== idx) as string[]);
                        }}>
                          <X className="mr-1 h-3 w-3" />Remover
                        </Button>
                        <Button type="button" variant="ghost" size="sm" className="h-7 px-2" disabled={idx === 0} onClick={() => {
                          const arr = [...((form.imagens as string[]) || [])];
                          [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
                          set("imagens", arr as string[]);
                        }}>
                          <MoveUp className="h-3 w-3" />
                        </Button>
                        <Button type="button" variant="ghost" size="sm" className="h-7 px-2" disabled={idx >= ((form.imagens as string[])?.length || 0) - 1} onClick={() => {
                          const arr = [...((form.imagens as string[]) || [])];
                          [arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]];
                          set("imagens", arr as string[]);
                        }}>
                          <MoveDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Tags</CardTitle>
            <CardDescription>Selecione as características do imóvel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {TAGS_DISPONIVEIS.map((tag) => {
                const isSelected = (form.tags || []).includes(tag.value);
                return (
                  <button
                    key={tag.value}
                    type="button"
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border transition-all ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-secondary text-secondary-foreground border-border hover:border-primary/40"
                    }`}
                    onClick={() => toggleTag(tag.value)}
                  >
                    <span>{tag.icon}</span>
                    {tag.label}
                  </button>
                );
              })}
            </div>
            {(form.tags || []).length > 0 && (
              <p className="mt-3 text-xs text-muted-foreground">
                {form.tags!.length} tag{form.tags!.length > 1 ? "s" : ""} selecionada{form.tags!.length > 1 ? "s" : ""}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-between gap-4 rounded-lg border bg-card p-4">
          <div className="text-sm text-muted-foreground">
            {canSubmit ? (
              <span className="text-emerald-600 flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> Pronto para salvar</span>
            ) : (
              <span className="text-amber-600">Preencha o título para continuar</span>
            )}
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={loading}>Cancelar</Button>
            <Button type="submit" disabled={!canSubmit || loading}>
              {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Salvando...</>) : editing ? "Salvar Alterações" : "Criar Imóvel"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}