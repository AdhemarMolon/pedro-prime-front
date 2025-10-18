import { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { ImoveisAPI, Imovel } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Building2, CheckCircle2, AlertCircle, Loader2, Image as ImageIcon, X, MoveUp, MoveDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Modelo vazio de imóvel
const empty: Imovel = {
  titulo: "",
  descricao: "",
  preco: 0,
  tipo: "",
  finalidade: "",
  endereco: {
    cidade: "",
    estado: "",
    bairro: "",
    logradouro: "",
    numero: "",
  },
  caracteristicas: {
    quartos: 0,
    banheiros: 0,
    garagem: 0,
    area_m2: 0,
  },
  imagens: [],
  tags: [],
};

// Normaliza URLs de imagem
function normImg(raw: string) {
  if (!raw) return "";
  if (raw.startsWith("http")) return raw;
  return raw;
}

// Converte string para número
function toNumber(v: string): number | null {
  const n = parseFloat(v);
  if (isNaN(n)) return null;
  return n;
}

// Remove campos vazios antes de salvar
function sanitize(f: Imovel): Partial<Imovel> {
  const out: Partial<Imovel> = { ...f };
  if (!out.titulo?.trim()) delete out.titulo;
  if (!out.descricao?.trim()) delete out.descricao;
  if (out.preco == null || out.preco === 0) delete out.preco;
  if (!out.tipo?.trim()) delete out.tipo;
  if (!out.finalidade?.trim()) delete out.finalidade;

  if (out.endereco) {
    Object.keys(out.endereco).forEach((k) => {
      const key = k as keyof typeof out.endereco;
      if (!out.endereco?.[key]) delete out.endereco[key];
    });
    if (Object.keys(out.endereco).length === 0) delete out.endereco;
  }

  if (out.caracteristicas) {
    Object.keys(out.caracteristicas).forEach((k) => {
      const key = k as keyof typeof out.caracteristicas;
      if (out.caracteristicas?.[key] == null || out.caracteristicas[key] === 0) delete out.caracteristicas[key];
    });
    if (Object.keys(out.caracteristicas).length === 0) delete out.caracteristicas;
  }

  if (out.imagens && Array.isArray(out.imagens)) {
    const filtered = (out.imagens as string[]).filter((u: string) => typeof u === 'string' && u?.trim());
    if (filtered.length === 0) delete out.imagens;
    else out.imagens = filtered;
  }

  if (out.tags) {
    out.tags = out.tags.filter((t: string) => t?.trim());
    if (out.tags.length === 0) delete out.tags;
  }

  return out;
}

// Tags disponíveis no Prisma
const AVAILABLE_TAGS = [
  "CASA",
  "APARTAMENTO",
  "COMERCIAL",
  "TERRENO",
  "VENDA",
  "LOCACAO",
  "TEMPORADA",
  "NOVO",
  "FINANCIAVEL",
  "PISCINA",
  "CHURRASQUEIRA",
  "AR_CONDICIONADO",
  "MOBILIADO",
  "PORTARIA_24H",
  "QUADRA_ESPORTIVA",
  "SALAO_FESTAS",
  "ACADEMIA",
  "PET_FRIENDLY",
];

const TAG_LABELS: Record<string, string> = {
  CASA: "Casa",
  APARTAMENTO: "Apartamento",
  COMERCIAL: "Comercial",
  TERRENO: "Terreno",
  VENDA: "Venda",
  LOCACAO: "Locação",
  TEMPORADA: "Temporada",
  NOVO: "Novo",
  FINANCIAVEL: "Financiável",
  PISCINA: "Piscina",
  CHURRASQUEIRA: "Churrasqueira",
  AR_CONDICIONADO: "Ar Condicionado",
  MOBILIADO: "Mobiliado",
  PORTARIA_24H: "Portaria 24h",
  QUADRA_ESPORTIVA: "Quadra Esportiva",
  SALAO_FESTAS: "Salão de Festas",
  ACADEMIA: "Academia",
  PET_FRIENDLY: "Pet Friendly",
};

export default function AdminImovelForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const editing = Boolean(id);
  const stateImovel = location.state?.imovel as Imovel | undefined;

  const [form, setForm] = useState<Imovel>(empty);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Carrega dados se for edição
  useEffect(() => {
    (async () => {
      if (stateImovel) {
        setForm(stateImovel);
      } else if (editing && id) {
        try {
          const data = await ImoveisAPI.getOne(id);
          if (data) setForm(data);
        } catch (error) {
          const e = error as Error;
          setErr(e?.message || "Falha ao carregar imóvel");
        }
      }
    })();
  }, [editing, id, stateImovel]);

  const set = <K extends keyof Imovel>(k: K, v: Imovel[K]) => setForm((f) => ({ ...f, [k]: v }));

  const canSubmit = useMemo(() => {
    return (form.titulo?.trim() || "").length > 0;
  }, [form.titulo]);

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
          setTimeout(() => navigate(`/imoveis/${encodeURIComponent(newId)}`, { replace: true }), 1500);
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
    if (tags.includes(tag)) {
      set("tags", tags.filter((t) => t !== tag));
    } else {
      set("tags", [...tags, tag]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header fixo */}
      <div className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {editing ? "Editar Imóvel" : "Novo Imóvel"}
                </h1>
                <p className="text-sm text-gray-500">
                  {editing ? "Atualize as informações do imóvel" : "Preencha os dados do novo imóvel"}
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

      {/* Formulário */}
      <form onSubmit={onSubmit} className="mx-auto max-w-5xl space-y-6 p-4 pb-12">
        {/* Alertas */}
        {err && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{err}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-500 bg-green-50 text-green-900">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>Título, preço e descrição do imóvel</CardDescription>
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
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="preco">Preço (R$)</Label>
                <Input
                  id="preco"
                  type="number"
                  placeholder="250000"
                  value={form.preco || ""}
                  onChange={(e) => set("preco", toNumber(e.target.value) ?? 0)}
                />
              </div>

              <div>
                <Label htmlFor="tipo">Tipo / Finalidade</Label>
                <Input
                  id="tipo"
                  placeholder="Ex: Apartamento - Venda"
                  value={form.tipo || form.finalidade || ""}
                  onChange={(e) => {
                    set("tipo", e.target.value);
                    set("finalidade", e.target.value);
                  }}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                placeholder="Descreva as características e diferenciais do imóvel..."
                rows={4}
                value={form.descricao ?? ""}
                onChange={(e) => set("descricao", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Localização */}
        <Card>
          <CardHeader>
            <CardTitle>Localização</CardTitle>
            <CardDescription>Endereço completo do imóvel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  placeholder="Pedro de Toledo"
                  value={form.endereco?.cidade ?? ""}
                  onChange={(e) => set("endereco", { ...(form.endereco || {}), cidade: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  placeholder="SP"
                  value={form.endereco?.estado ?? ""}
                  onChange={(e) => set("endereco", { ...(form.endereco || {}), estado: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="bairro">Bairro</Label>
                <Input
                  id="bairro"
                  placeholder="Centro"
                  value={form.endereco?.bairro ?? ""}
                  onChange={(e) => set("endereco", { ...(form.endereco || {}), bairro: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="logradouro">Logradouro</Label>
                <Input
                  id="logradouro"
                  placeholder="Rua Principal"
                  value={form.endereco?.logradouro ?? ""}
                  onChange={(e) => set("endereco", { ...(form.endereco || {}), logradouro: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="numero">Número</Label>
                <Input
                  id="numero"
                  placeholder="123"
                  value={form.endereco?.numero ?? ""}
                  onChange={(e) => set("endereco", { ...(form.endereco || {}), numero: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Características */}
        <Card>
          <CardHeader>
            <CardTitle>Características</CardTitle>
            <CardDescription>Quartos, banheiros, área e vagas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <Label htmlFor="quartos">Quartos</Label>
                <Input
                  id="quartos"
                  type="number"
                  min="0"
                  placeholder="2"
                  value={form.caracteristicas?.quartos ?? 0}
                  onChange={(e) =>
                    set("caracteristicas", {
                      ...(form.caracteristicas || {}),
                      quartos: toNumber(e.target.value) ?? 0,
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="banheiros">Banheiros</Label>
                <Input
                  id="banheiros"
                  type="number"
                  min="0"
                  placeholder="1"
                  value={form.caracteristicas?.banheiros ?? 0}
                  onChange={(e) =>
                    set("caracteristicas", {
                      ...(form.caracteristicas || {}),
                      banheiros: toNumber(e.target.value) ?? 0,
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="garagem">Vagas</Label>
                <Input
                  id="garagem"
                  type="number"
                  min="0"
                  placeholder="1"
                  value={form.caracteristicas?.garagem ?? 0}
                  onChange={(e) =>
                    set("caracteristicas", {
                      ...(form.caracteristicas || {}),
                      garagem: toNumber(e.target.value) ?? 0,
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="area">Área (m²)</Label>
                <Input
                  id="area"
                  type="number"
                  min="0"
                  placeholder="80"
                  value={form.caracteristicas?.area_m2 ?? 0}
                  onChange={(e) =>
                    set("caracteristicas", {
                      ...(form.caracteristicas || {}),
                      area_m2: toNumber(e.target.value) ?? 0,
                    })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Imagens */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Imagens</CardTitle>
                <CardDescription>URLs das fotos do imóvel (a primeira será a capa)</CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const currentImages = form.imagens || [];
                  const isStringArray = currentImages.length === 0 || typeof currentImages[0] === 'string';
                  set("imagens", isStringArray ? [...(currentImages as string[]), ""] : currentImages);
                }}
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Adicionar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {((form.imagens as string[]) || []).length === 0 ? (
              <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Nenhuma imagem adicionada</p>
                <p className="text-xs text-gray-400">Clique em "Adicionar" para incluir fotos</p>
              </div>
            ) : (
              <div className="space-y-4">
                {((form.imagens as string[]) || []).map((url: string, idx: number) => (
                  <div key={idx} className="flex gap-4 rounded-lg border p-4">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      {url ? (
                        <img src={normImg(url)} alt={`Imagem ${idx + 1}`} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="flex items-start gap-2">
                        <Input
                          placeholder="https://exemplo.com/imagem.jpg"
                          value={url}
                          onChange={(e) => {
                            const v = e.target.value;
                            const images = (form.imagens as string[]) || [];
                            set("imagens", images.map((u, i) => (i === idx ? v : u)) as string[]);
                          }}
                        />
                        {idx === 0 && <Badge variant="secondary">Capa</Badge>}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const images = (form.imagens as string[]) || [];
                            set("imagens", images.filter((_, i) => i !== idx) as string[]);
                          }}
                        >
                          <X className="mr-1 h-3 w-3" />
                          Remover
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (idx === 0) return;
                            const arr = [...((form.imagens as string[]) || [])];
                            [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
                            set("imagens", arr as string[]);
                          }}
                          disabled={idx === 0}
                        >
                          <MoveUp className="h-3 w-3" />
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const arr = [...((form.imagens as string[]) || [])];
                            if (idx >= arr.length - 1) return;
                            [arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]];
                            set("imagens", arr as string[]);
                          }}
                          disabled={idx >= ((form.imagens as string[])?.length || 0) - 1}
                        >
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
          <CardHeader>
            <CardTitle>Tags</CardTitle>
            <CardDescription>Selecione as características que se aplicam ao imóvel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TAGS.map((tag) => {
                const isSelected = (form.tags || []).includes(tag);
                return (
                  <Badge
                    key={tag}
                    variant={isSelected ? "default" : "outline"}
                    className={`cursor-pointer transition-all ${
                      isSelected
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "hover:border-blue-600 hover:text-blue-600"
                    }`}
                    onClick={() => toggleTag(tag)}
                  >
                    {TAG_LABELS[tag] || tag}
                  </Badge>
                );
              })}
            </div>
            {(form.tags || []).length > 0 && (
              <p className="mt-3 text-sm text-gray-500">
                {form.tags.length} tag{form.tags.length > 1 ? "s" : ""} selecionada{form.tags.length > 1 ? "s" : ""}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Botões de ação */}
        <div className="flex items-center justify-between gap-4 rounded-lg border bg-white p-4">
          <div className="text-sm text-gray-500">
            {canSubmit ? (
              <span className="text-green-600">✓ Pronto para salvar</span>
            ) : (
              <span className="text-amber-600">⚠ Preencha o título para continuar</span>
            )}
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={loading}>
              Cancelar
            </Button>

            <Button type="submit" disabled={!canSubmit || loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : editing ? (
                "Salvar Alterações"
              ) : (
                "Criar Imóvel"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
