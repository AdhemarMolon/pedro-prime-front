// src/pages/AdminImovelForm.tsx
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ImoveisAPI, Imovel } from "../lib/api";

/* -----------------------------------------------------------
 * Helpers
 * --------------------------------------------------------- */
const empty: Imovel = {
  titulo: "",
  preco: 0,
  descricao: "",
  endereco: { cidade: "", estado: "", bairro: "", logradouro: "", numero: "" },
  caracteristicas: { quartos: 0, banheiros: 0, garagem: 0, area_m2: 0 },
  imagens: [],
  tipo: "",
  finalidade: "",
};

const toNumber = (v: any): number | undefined => {
  if (v === "" || v === null || v === undefined) return undefined;
  const n = Number(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : undefined;
};

const fromGoogleImgRes = (u: string): string => {
  try {
    const url = new URL(u);
    if (url.hostname.includes("google.") && url.pathname.includes("/imgres")) {
      const raw = url.searchParams.get("imgurl");
      if (raw) return decodeURIComponent(raw);
    }
  } catch {}
  return u;
};

const normImg = (s: string) => fromGoogleImgRes(s.trim());

/** Remove vazios/normaliza antes de enviar */
function sanitize(raw: Imovel): Partial<Imovel> {
  const { _id, ...rest } = raw as any;

  const endereco = Object.fromEntries(
    Object.entries(rest.endereco || {}).filter(([, v]) => v !== "" && v !== null && v !== undefined)
  );

  const caracteristicas = {
    ...(rest.caracteristicas || {}),
    quartos: toNumber(rest.caracteristicas?.quartos) ?? 0,
    banheiros: toNumber(rest.caracteristicas?.banheiros) ?? 0,
    garagem: toNumber(rest.caracteristicas?.garagem) ?? 0,
    area_m2: toNumber(rest.caracteristicas?.area_m2) ?? 0,
  };

  const imagens = (rest.imagens || [])
    .map((u) => normImg(u))
    .filter((u) => u && u.trim() !== "");

  return {
    ...rest,
    preco: toNumber(rest.preco) ?? 0,
    endereco,
    caracteristicas,
    imagens,
  };
}

/* -----------------------------------------------------------
 * Componente
 * --------------------------------------------------------- */
export default function AdminImovelForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const { state } = useLocation() as { state?: { imovel?: Imovel } };
  const stateImovel = state?.imovel;

  const [form, setForm] = useState<Imovel>(stateImovel ? { ...empty, ...stateImovel } : empty);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Prefill se veio do state (lista)
  useEffect(() => {
    if (stateImovel) setForm({ ...empty, ...stateImovel });
  }, [stateImovel]);

  // Carrega do backend se for edição e não veio do state
  useEffect(() => {
    if (!editing || !id) return;
    (async () => {
      try {
        const data = await ImoveisAPI.getOne(id);
        setForm({ ...empty, ...data });
        setErr(null);
      } catch (e: any) {
        if (!stateImovel) {
          setErr(e?.response?.data?.message || e?.message || "Erro ao carregar");
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
      } else {
        const created = await ImoveisAPI.create(payload);
        setSuccess("Imóvel criado com sucesso!");
        if (created?._id || created?.id) {
          // volta para o show
          const newId = String(created._id || created.id);
          navigate(`/imoveis/${encodeURIComponent(newId)}`, { replace: true });
          return;
        }
      }
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || "Falha ao salvar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mx-auto grid w-full max-w-4xl grid-cols-2 gap-4 p-4" onSubmit={onSubmit}>
      <div className="col-span-2 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{editing ? "Editar imóvel" : "Novo imóvel"}</h1>
        <Link to="/admin" className="text-blue-600 hover:underline">
          Voltar
        </Link>
      </div>

      {err && (
        <div className="col-span-2 rounded border border-red-300 bg-red-50 p-3 text-red-700">
          {err}
        </div>
      )}

      {/* Título */}
      <div className="col-span-2">
        <label className="mb-1 block font-medium">Título</label>
        <input
          className="w-full rounded border p-2"
          value={form.titulo}
          onChange={(e) => set("titulo", e.target.value)}
          placeholder="Apartamento aconchegante no centro"
          required
        />
      </div>

      {/* Preço */}
      <div>
        <label className="mb-1 block font-medium">Preço (R$)</label>
        <input
          className="w-full rounded border p-2"
          inputMode="decimal"
          value={form.preco ?? ""}
          onChange={(e) => set("preco", toNumber(e.target.value) ?? 0)}
          placeholder="250000"
        />
      </div>

      {/* Tipo / Finalidade */}
      <div>
        <label className="mb-1 block font-medium">Tipo / Finalidade</label>
        <input
          className="w-full rounded border p-2"
          value={form.tipo || form.finalidade || ""}
          onChange={(e) => {
            set("tipo", e.target.value);
            set("finalidade", e.target.value);
          }}
          placeholder="Apartamento - Venda"
        />
      </div>

      {/* Descrição */}
      <div className="col-span-2">
        <label className="mb-1 block font-medium">Descrição</label>
        <textarea
          className="min-h-28 w-full rounded border p-2"
          value={form.descricao ?? ""}
          onChange={(e) => set("descricao", e.target.value)}
        />
      </div>

      {/* Endereço */}
      <div>
        <label className="mb-1 block font-medium">Cidade</label>
        <input
          className="w-full rounded border p-2"
          value={form.endereco?.cidade ?? ""}
          onChange={(e) => set("endereco", { ...(form.endereco || {}), cidade: e.target.value })}
        />
      </div>
      <div>
        <label className="mb-1 block font-medium">Estado</label>
        <input
          className="w-full rounded border p-2"
          value={form.endereco?.estado ?? ""}
          onChange={(e) => set("endereco", { ...(form.endereco || {}), estado: e.target.value })}
        />
      </div>
      <div>
        <label className="mb-1 block font-medium">Bairro</label>
        <input
          className="w-full rounded border p-2"
          value={form.endereco?.bairro ?? ""}
          onChange={(e) => set("endereco", { ...(form.endereco || {}), bairro: e.target.value })}
        />
      </div>
      <div>
        <label className="mb-1 block font-medium">Logradouro</label>
        <input
          className="w-full rounded border p-2"
          value={form.endereco?.logradouro ?? ""}
          onChange={(e) => set("endereco", { ...(form.endereco || {}), logradouro: e.target.value })}
        />
      </div>
      <div>
        <label className="mb-1 block font-medium">Número</label>
        <input
          className="w-full rounded border p-2"
          value={form.endereco?.numero ?? ""}
          onChange={(e) => set("endereco", { ...(form.endereco || {}), numero: e.target.value })}
        />
      </div>
      <div className="col-span-2" />

      {/* Características */}
      <div>
        <label className="mb-1 block font-medium">Quartos</label>
        <input
          className="w-full rounded border p-2"
          inputMode="numeric"
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
        <label className="mb-1 block font-medium">Banheiros</label>
        <input
          className="w-full rounded border p-2"
          inputMode="numeric"
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
        <label className="mb-1 block font-medium">Vagas</label>
        <input
          className="w-full rounded border p-2"
          inputMode="numeric"
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
        <label className="mb-1 block font-medium">Área (m²)</label>
        <input
          className="w-full rounded border p-2"
          inputMode="decimal"
          value={form.caracteristicas?.area_m2 ?? 0}
          onChange={(e) =>
            set("caracteristicas", {
              ...(form.caracteristicas || {}),
              area_m2: toNumber(e.target.value) ?? 0,
            })
          }
        />
      </div>

      {/* ---------------- Imagens (lista com preview/ordenação) ---------------- */}
      <div className="col-span-2 border rounded p-3">
        <div className="mb-2 flex items-center justify-between">
          <label className="font-medium">Imagens</label>
          <button
            type="button"
            className="rounded border px-2 py-1 text-sm"
            onClick={() => set("imagens", [...(form.imagens || []), ""])}
          >
            + Adicionar
          </button>
        </div>

        {(form.imagens || []).length === 0 && (
          <p className="text-sm text-gray-500">Nenhuma imagem. Clique em “Adicionar”.</p>
        )}

        <ul className="space-y-3">
          {(form.imagens || []).map((url, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div className="h-20 w-20 overflow-hidden rounded bg-gray-100">
                {url ? (
                  <img src={normImg(url)} alt={`img-${idx}`} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                    preview
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <input
                  className="w-full rounded border p-2"
                  placeholder="https://..."
                  value={url}
                  onChange={(e) => {
                    const v = e.target.value;
                    set("imagens", (form.imagens || []).map((u, i) => (i === idx ? v : u)));
                  }}
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded border px-2 py-1 text-sm"
                    onClick={() => set("imagens", (form.imagens || []).filter((_, i) => i !== idx))}
                  >
                    Remover
                  </button>
                  <button
                    type="button"
                    className="rounded border px-2 py-1 text-sm"
                    onClick={() => {
                      if (idx === 0) return;
                      const arr = [...(form.imagens || [])];
                      [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
                      set("imagens", arr);
                    }}
                    disabled={idx === 0}
                    title="Mover para cima"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="rounded border px-2 py-1 text-sm"
                    onClick={() => {
                      const arr = [...(form.imagens || [])];
                      if (idx >= arr.length - 1) return;
                      [arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]];
                      set("imagens", arr);
                    }}
                    disabled={idx >= (form.imagens?.length || 0) - 1}
                    title="Mover para baixo"
                  >
                    ↓
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Dica: a primeira imagem será a capa nos cards.
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Ações */}
      <div className="col-span-2 mt-2 flex items-center gap-3">
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-60"
          disabled={!canSubmit || loading}
        >
          {loading ? "Salvando..." : editing ? "Salvar alterações" : "Criar imóvel"}
        </button>

        <button type="button" onClick={() => navigate(-1)} className="rounded border px-4 py-2">
          Cancelar
        </button>

        {success && (
          <span className="text-green-700" role="status" aria-live="polite">
            {success}
          </span>
        )}
      </div>
    </form>
  );
}
