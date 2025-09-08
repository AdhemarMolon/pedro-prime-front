// src/lib/api.ts

// =========================
// Base da API
// =========================

// Lê da ENV (Vite). Só variáveis que começam com VITE_ são expostas no browser.
// Se não existir, usa fallback público (Render).
const RAW_BASE =
  (import.meta as any)?.env?.VITE_API_BASE ??
  (import.meta as any)?.env?.VITE_API_URL ??
  "";

const DEFAULT_BASE = "https://fullstack-imoveis-api.onrender.com";

// normaliza removendo barra final
export const API_BASE: string = String(RAW_BASE || DEFAULT_BASE).replace(/\/+$/, "");

// =========================
// Utils internos
// =========================
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
  const p = path.startsWith("/") ? path : `/${path}`;
  const url = `${API_BASE}${p}${toQuery(query)}`;

  if (typeof window !== "undefined") {
    console.log("[api] URL =>", url);
  }

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

  const txt = await res.text();
  try {
    return JSON.parse(txt) as T;
  } catch {
    // quando não for JSON, devolve texto
    // @ts-expect-error
    return txt as T;
  }
}

// =========================
// Tipos
// =========================
export type Imovel = {
  _id?: string;
  id?: string;
  titulo: string;
  preco?: number;
  descricao?: string;
  endereco?: { cidade?: string; estado?: string; bairro?: string; logradouro?: string; numero?: string | number };
  caracteristicas?: { quartos?: number; banheiros?: number; garagem?: number; area_m2?: number };
  imagens?: string[] | Array<{ url: string; legenda?: string }>;
  tipo?: string;
  finalidade?: string;
};

// =========================
// Endpoints utilitários
// =========================
export const ping = () => http<string>("/healthz");

// =========================
// API usada nas telas
// =========================
export const ImoveisAPI = {
  list(params?: { page?: number; limit?: number }) {
    return http<{ data: Imovel[]; total: number; page: number; limit: number }>(
      "/api/imoveis",
      { method: "GET", query: params }
    );
  },
  getOne(id: string) {
    return http<Imovel>(`/api/imoveis/${encodeURIComponent(id)}`, { method: "GET" });
  },
  get(idOrSlug: string) {
    return this.getOne(idOrSlug);
  },
  create(payload: Partial<Imovel>) {
    const token = localStorage.getItem("admin_token") || localStorage.getItem("token") || "";
    return http<Imovel>("/api/imoveis", {
      method: "POST",
      body: JSON.stringify(payload),
      authToken: token || undefined,
    });
  },
  update(id: string, payload: Partial<Imovel>) {
    const token = localStorage.getItem("admin_token") || localStorage.getItem("token") || "";
    return http<Imovel>(`/api/imoveis/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(payload),
      authToken: token || undefined,
    });
  },
  remove(id: string) {
    const token = localStorage.getItem("admin_token") || localStorage.getItem("token") || "";
    return http<{ ok: true }>(`/api/imoveis/${encodeURIComponent(id)}`, {
      method: "DELETE",
      authToken: token || undefined,
    });
  },
};
