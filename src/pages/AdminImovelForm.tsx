// src/pages/AdminImovelForm.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ImoveisAPI, Imovel } from "../lib/api";

const empty: Imovel = {
  titulo: "",
  preco: 0,
  descricao: "",
  endereco: {
    cidade: "",
    estado: "",
    bairro: "",
    logradouro: "",
    numero: "",
  },
  caracteristicas: {
    quartos: undefined,
    banheiros: undefined,
    garagem: undefined,
    area_m2: undefined,
  },
};

export default function AdminImovelForm() {
  const { id } = useParams();
  const editing = useMemo(() => Boolean(id), [id]);
  const nav = useNavigate();

  const [form, setForm] = useState<Imovel>(empty);
  const [loading, setLoading] = useState(!!editing);
  const [saving, setSaving] = useState(false);
  const [error, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!editing || !id) return;
    (async () => {
      try {
        const data = await ImoveisAPI.getOne(id);
        setForm({
          ...empty,
          ...data,
        });
      } catch (e: any) {
        setErr(e?.response?.data?.message || "Erro ao carregar");
      } finally {
        setLoading(false);
      }
    })();
  }, [editing, id]);

  function set<K extends keyof Imovel>(key: K, val: Imovel[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function setEndereco<K extends keyof NonNullable<Imovel["endereco"]>>(
    key: K,
    val: NonNullable<Imovel["endereco"]>[K]
  ) {
    setForm((f) => ({ ...f, endereco: { ...(f.endereco || {}), [key]: val } }));
  }

  function setCar<K extends keyof NonNullable<Imovel["caracteristicas"]>>(
    key: K,
    val: NonNullable<Imovel["caracteristicas"]>[K]
  ) {
    setForm((f) => ({
      ...f,
      caracteristicas: { ...(f.caracteristicas || {}), [key]: val },
    }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    try {
      const payload: Imovel = {
        ...form,
        preco: Number(form.preco || 0),
        caracteristicas: {
          ...form.caracteristicas,
          quartos: form.caracteristicas?.quartos
            ? Number(form.caracteristicas.quartos)
            : undefined,
          banheiros: form.caracteristicas?.banheiros
            ? Number(form.caracteristicas.banheiros)
            : undefined,
          garagem: form.caracteristicas?.garagem
            ? Number(form.caracteristicas.garagem)
            : undefined,
          area_m2: form.caracteristicas?.area_m2
            ? Number(form.caracteristicas.area_m2)
            : undefined,
        },
      };

      if (editing && id) await ImoveisAPI.update(id, payload);
      else await ImoveisAPI.create(payload);

      nav("/admin/imoveis");
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Falha ao salvar");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="p-6">Carregando...</p>;

  return (
    <form onSubmit={onSubmit} className="max-w-3xl p-6 mx-auto space-y-4">
      <h1 className="text-xl">
        {editing ? "Editar Imóvel" : "Novo Imóvel"}
      </h1>
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-2 gap-4">
        <input
          className="border p-2 col-span-2"
          placeholder="Título"
          value={form.titulo}
          onChange={(e) => set("titulo", e.target.value)}
          required
        />
        <input
          className="border p-2"
          placeholder="Preço"
          value={form.preco}
          onChange={(e) => set("preco", Number(e.target.value || 0))}
          inputMode="numeric"
          required
        />
        <input
          className="border p-2"
          placeholder="Cidade"
          value={form.endereco?.cidade || ""}
          onChange={(e) => setEndereco("cidade", e.target.value)}
        />
        <input
          className="border p-2"
          placeholder="Estado"
          value={form.endereco?.estado || ""}
          onChange={(e) => setEndereco("estado", e.target.value)}
        />
        <input
          className="border p-2"
          placeholder="Bairro"
          value={form.endereco?.bairro || ""}
          onChange={(e) => setEndereco("bairro", e.target.value)}
        />
        <input
          className="border p-2"
          placeholder="Logradouro"
          value={form.endereco?.logradouro || ""}
          onChange={(e) => setEndereco("logradouro", e.target.value)}
        />
        <input
          className="border p-2"
          placeholder="Número"
          value={form.endereco?.numero || ""}
          onChange={(e) => setEndereco("numero", e.target.value)}
        />

        <input
          className="border p-2"
          placeholder="Quartos"
          value={form.caracteristicas?.quartos ?? ""}
          onChange={(e) => setCar("quartos", Number(e.target.value || 0))}
          inputMode="numeric"
        />
        <input
          className="border p-2"
          placeholder="Banheiros"
          value={form.caracteristicas?.banheiros ?? ""}
          onChange={(e) => setCar("banheiros", Number(e.target.value || 0))}
          inputMode="numeric"
        />
        <input
          className="border p-2"
          placeholder="Vagas de garagem"
          value={form.caracteristicas?.garagem ?? ""}
          onChange={(e) => setCar("garagem", Number(e.target.value || 0))}
          inputMode="numeric"
        />
        <input
          className="border p-2"
          placeholder="Área (m²)"
          value={form.caracteristicas?.area_m2 ?? ""}
          onChange={(e) => setCar("area_m2", Number(e.target.value || 0))}
          inputMode="numeric"
        />

        <textarea
          className="border p-2 col-span-2"
          rows={6}
          placeholder="Descrição"
          value={form.descricao || ""}
          onChange={(e) => set("descricao", e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <button className="border px-4 py-2" disabled={saving}>
          {saving ? "Salvando..." : "Salvar"}
        </button>
        <button
          type="button"
          className="border px-4 py-2"
          onClick={() => history.back()}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
