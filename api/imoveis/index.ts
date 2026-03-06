// api/imoveis/index.ts
// GET /api/imoveis  — list (public)
// POST /api/imoveis — create (admin)

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../_lib/prisma.js";
import { authenticateRequest } from "../_lib/auth.js";
import { setCors } from "../_lib/cors.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (setCors(req, res)) return;

  if (req.method === "GET") return handleList(req, res);
  if (req.method === "POST") return handleCreate(req, res);
  return res.status(405).json({ error: "Method not allowed" });
}

/* ── GET /api/imoveis ── */
async function handleList(req: VercelRequest, res: VercelResponse) {
  try {
    const page = Math.max(1, parseInt(String(req.query.page || "1")) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit || "50")) || 50));
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.imovel.findMany({
        where: { ativo: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.imovel.count({ where: { ativo: true } }),
    ]);

    // Serialize Decimal fields to number for JSON compatibility
    const serialized = data.map(serializeImovel);

    return res.status(200).json({ data: serialized, total, page, limit });
  } catch (error: any) {
    return res.status(500).json({ error: "Erro ao listar imóveis" });
  }
}

/* ── POST /api/imoveis ── */
async function handleCreate(req: VercelRequest, res: VercelResponse) {
  const auth = authenticateRequest(req);
  if (!auth) {
    return res.status(401).json({ error: "Não autorizado" });
  }

  try {
    const body = req.body || {};

    if (!body.titulo || body.preco === undefined) {
      return res.status(400).json({ error: "Título e preço são obrigatórios" });
    }

    const imovel = await prisma.imovel.create({
      data: {
        titulo: body.titulo,
        descricao: body.descricao || null,
        preco: parseFloat(body.preco) || 0,
        tipo: body.tipo || "CASA",
        finalidade: body.finalidade || "VENDA",
        status: body.status || "DISPONIVEL",
        tags: body.tags || [],
        cidade: body.cidade || "",
        estado: body.estado || "SP",
        bairro: body.bairro || "",
        logradouro: body.logradouro || null,
        numero: body.numero || null,
        complemento: body.complemento || null,
        cep: body.cep || null,
        quartos: body.quartos != null ? parseInt(body.quartos) : null,
        banheiros: body.banheiros != null ? parseInt(body.banheiros) : null,
        suites: body.suites != null ? parseInt(body.suites) : null,
        garagem: body.garagem != null ? parseInt(body.garagem) : null,
        area_m2: body.area_m2 != null ? parseFloat(body.area_m2) : null,
        area_total: body.area_total != null ? parseFloat(body.area_total) : null,
        imagens: body.imagens || [],
        createdBy: auth.adminId,
      },
    });

    // Log
    await prisma.logAcao.create({
      data: {
        adminId: auth.adminId,
        acao: "CRIAR",
        entidade: "IMOVEL",
        detalhes: `Criado: ${imovel.titulo} (${imovel.id})`,
      },
    }).catch(() => {});

    return res.status(201).json(serializeImovel(imovel));
  } catch (error: any) {
    return res.status(500).json({ error: "Erro ao criar imóvel" });
  }
}

/* ── Helpers ── */
function serializeImovel(imovel: any) {
  return {
    ...imovel,
    id: imovel.id,
    preco: imovel.preco ? Number(imovel.preco) : 0,
    area_m2: imovel.area_m2 ? Number(imovel.area_m2) : null,
    area_total: imovel.area_total ? Number(imovel.area_total) : null,
  };
}
