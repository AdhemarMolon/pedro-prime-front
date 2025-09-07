// src/lib/api.ts
import axios from "axios";

/**
 * Base API client
 * - Lê a URL do backend de VITE_API_URL (ex.: http://localhost:4000)
 * - Injeta Authorization: Bearer <token> quando existir em localStorage
 */
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

export type Imovel = {
  _id?: string;
  slug?: string;
  titulo: string;
  descricao?: string;
  preco: number;
  endereco?: {
    cidade?: string;
    estado?: string;
    bairro?: string;
    logradouro?: string;
    numero?: string | number;
  };
  caracteristicas?: {
    quartos?: number;
    banheiros?: number;
    garagem?: number;
    area_m2?: number;
  };
  createdAt?: string;
  updatedAt?: string;
};

export type ListaImoveisResponse = {
  data: Imovel[];
  total: number;
  page: number;
  limit: number;
};

export const ImoveisAPI = {
  // Público e Admin (listar com paginação e filtros)
  async list(params?: {
    page?: number;
    limit?: number;
    cidade?: string;
    minPreco?: number;
    maxPreco?: number;
    quartos?: number;
    q?: string;
  }) {
    const { data } = await http.get<ListaImoveisResponse>("/api/imoveis", {
      params,
    });
    return data;
  },

  async getOne(id: string) {
    const { data } = await http.get<Imovel>(`/api/imoveis/${id}`);
    return data;
  },

  async create(payload: Imovel) {
    const { data } = await http.post<Imovel>("/api/imoveis", payload);
    return data;
  },

  async update(id: string, payload: Partial<Imovel>) {
    // Remova _id do body para não tentar atualizar o identificador
    const { _id, ...clean } = (payload || {}) as any;

    const { data } = await http.put<Imovel>(
      `/api/imoveis/${id}`,
      clean,
      { headers: { "Content-Type": "application/json" } }
    );
    return data;
  },


  async remove(id: string) {
    await http.delete(`/api/imoveis/${id}`);
  },

  // Admin Auth
  async adminLogin(email: string, password: string) {
    const { data } = await http.post<{ token: string }>(
      "/api/admin/login",
      { email, password }
    );
    return data;
  },
};
