// src/lib/api.ts
// Base da API a partir das ENVs públicas
const RAW_BASE =
  // Vite
  (import.meta as any)?.env?.VITE_API_BASE ??
  (import.meta as any)?.env?.VITE_API_URL ??
  // Next.js
  process?.env?.NEXT_PUBLIC_API_BASE ??
  "";

export const API_BASE: string = String(RAW_BASE || "").replace(/\/+$/, ""); // remove barra final

type Json = Record<string, unknown>;
type Query = Record<string, string | number | boolean | null | undefined>;

function toQuery(q?: Query) {
  if (!q) return "";
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(q)) {
    if (v === undefined || v === null) continue;
    p.append(k, String(v));
  }
  const s = p.toString();
  return s ? `?${s}` : "";
}

async function http<T>(
  path: string,
  init: RequestInit & { authToken?: string; query?: Query } = {}
): Promise<T> {
  const { authToken, query, headers, ...opts } = init;
  if (!API_BASE) {
    console.warn(
      "[api] API_BASE não definida. Configure VITE_API_BASE (Vite) ou NEXT_PUBLIC_API_BASE (Next.js)."
    );
  }
  // path sempre absoluto e sob /api (exceto healthz)
  const p = path.startsWith("/") ? path : `/${path}`;
  const url = `${API_BASE}${p}${toQuery(query)}`;

  const res = await fetch(url, {
    cache: (opts.cache as RequestCache) ?? "no-store",
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...(headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`${res.status} ${res.statusText}${text ? ` – ${text}` : ""}`);
  }

  // tenta JSON, senão devolve texto
  const txt = await res.text();
  try {
    return JSON.parse(txt) as T;
  } catch {
    return txt as T;
  }
}

/* ---------------------------
 * Endpoints utilitários
 * ------------------------- */
export const ping = () => http<string>("/healthz");

/* ---------------------------
 * Tipos
 * ------------------------- */
export type Imovel = {
  _id?: string;
  id?: string;
  titulo: string;
  preco?: number;
  descricao?: string;
  endereco?: {
    cidade?: string;
    estado?: string;
    bairro?: string;
    logradouro?: string;
    numero?: string | number;
  };
  caracteristicas?: { quartos?: number; banheiros?: number; garagem?: number; area_m2?: number };
  imagens?: string[] | Array<{ url: string; legenda?: string }>;
  tipo?: string;
  finalidade?: string;
};

export type ImovelType = Imovel;

/* ---------------------------
 * ImoveisAPI (usado nas páginas)
 * ------------------------- */
export const ImoveisAPI = {
  // GET /api/imoveis?page&limit
  async list(params?: { page?: number; limit?: number }) {
    return http<{ data: Imovel[]; total: number; page: number; limit: number }>(
      "/api/imoveis",
      { method: "GET", query: params }
    );
  },

  // GET /api/imoveis/:id
  async getOne(id: string) {
    return http<Imovel>(`/api/imoveis/${encodeURIComponent(id)}`, { method: "GET" });
  },

  // Alias (algumas telas tentam get por slug/id)
  async get(idOrSlug: string) {
    return this.getOne(idOrSlug);
  },

  // POST /api/imoveis (requer token Bearer)
  async create(payload: Partial<Imovel>) {
    const token = localStorage.getItem("admin_token") || localStorage.getItem("token") || "";
    return http<Imovel>("/api/imoveis", {
      method: "POST",
      body: JSON.stringify(payload),
      authToken: token || undefined,
    });
  },

  // PUT /api/imoveis/:id (requer token Bearer)
  async update(id: string, payload: Partial<Imovel>) {
    const token = localStorage.getItem("admin_token") || localStorage.getItem("token") || "";
    return http<Imovel>(`/api/imoveis/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(payload),
      authToken: token || undefined,
    });
  },

  // DELETE /api/imoveis/:id (requer token Bearer)
  async remove(id: string) {
    const token = localStorage.getItem("admin_token") || localStorage.getItem("token") || "";
    return http<{ ok: true }>(`/api/imoveis/${encodeURIComponent(id)}`, {
      method: "DELETE",
      authToken: token || undefined,
    });
  },
};
