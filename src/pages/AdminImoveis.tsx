// src/pages/AdminImoveis.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ImoveisAPI, Imovel } from "../lib/api";
import { useAdmin } from "../context/AdminContext";

export default function AdminImoveis() {
  const { logout } = useAdmin();
  const [items, setItems] = useState<Imovel[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 12;

  const [loading, setLoading] = useState(true);
  const [error, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const { data, total } = await ImoveisAPI.list({ page, limit });
      setItems(data);
      setTotal(total);
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Erro ao carregar");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function onDelete(id?: string) {
    if (!id) return;
    if (!confirm("Excluir este imóvel?")) return;
    await ImoveisAPI.remove(id);
    // atualização otimista
    setItems((prev) => prev.filter((i) => i._id !== id));
    setTotal((t) => Math.max(0, t - 1));
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));

  if (loading) return <p className="p-6">Carregando...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl">Imóveis ({total})</h1>
        <div className="flex gap-2">
          <Link to="/admin/imoveis/novo" className="border px-3 py-1">
            Novo
          </Link>
          <button onClick={logout} className="border px-3 py-1">
            Sair
          </button>
        </div>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-2 text-left">Título</th>
            <th className="p-2 text-left">Preço</th>
            <th className="p-2 text-left">Cidade</th>
            <th className="p-2 text-left">Quartos</th>
            <th className="p-2 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i._id} className="border-t">
              <td className="p-2">{i.titulo}</td>
              <td className="p-2">
                R$ {Number(i.preco).toLocaleString("pt-BR")}
              </td>
              <td className="p-2">{i.endereco?.cidade || "-"}</td>
              <td className="p-2">{i.caracteristicas?.quartos ?? "-"}</td>
              <td className="p-2">
                <Link
                  to={`/admin/imoveis/${i._id}`}
                  state={{ imovel: i }} // ✅ prefill instantâneo
                  className="mr-3 underline"
                  onMouseEnter={() => i._id && ImoveisAPI.getOne(i._id)} // ✅ prefetch
                >
                  Editar
                </Link>
                <button
                  onClick={() => onDelete(i._id)}
                  className="underline text-red-600"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td className="p-4 text-center text-gray-500" colSpan={5}>
                Nenhum imóvel cadastrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex items-center gap-2 mt-4">
          <button
            className="border px-2 py-1"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ◀
          </button>
          <span>
            Página {page} de {totalPages}
          </span>
          <button
            className="border px-2 py-1"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
}
