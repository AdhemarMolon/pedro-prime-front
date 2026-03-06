// api/imoveis/[id].ts
// GET    /api/imoveis/:id — get single (public)
// PUT    /api/imoveis/:id — update (admin)
// DELETE /api/imoveis/:id — soft delete (admin)

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../_lib/prisma.js";
import { authenticateRequest } from "../_lib/auth.js";
import { setCors } from "../_lib/cors.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (setCors(req, res)) return;

  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "ID inválido" });
  }

  if (req.method === "GET") return handleGet(id, req, res);
  if (req.method === "PUT") return handleUpdate(id, req, res);
  if (req.method === "DELETE") return handleDelete(id, req, res);
  return res.status(405).json({ error: "Method not allowed" });
}

/* ── GET /api/imoveis/:id ── */
async function handleGet(id: string, _req: VercelRequest, res: VercelResponse) {
  try {
    const imovel = await prisma.imovel.findUnique({ where: { id } });

    if (!imovel || !imovel.ativo) {
      return res.status(404).json({ error: "Imóvel não encontrado" });
    }

    return res.status(200).json(serializeImovel(imovel));
  } catch (error: any) {
    return res.status(500).json({ error: "Erro ao buscar imóvel" });
  }
}

/* ── PUT /api/imoveis/:id ── */
async function handleUpdate(id: string, req: VercelRequest, res: VercelResponse) {
  const auth = authenticateRequest(req);
  if (!auth) {
    return res.status(401).json({ error: "Não autorizado" });
  }

  try {
    const existing = await prisma.imovel.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Imóvel não encontrado" });
    }

    const body = req.body || {};

    const imovel = await prisma.imovel.update({
      where: { id },
      data: {
        ...(body.titulo !== undefined && { titulo: body.titulo }),
        ...(body.descricao !== undefined && { descricao: body.descricao }),
        ...(body.preco !== undefined && { preco: parseFloat(body.preco) || 0 }),
        ...(body.tipo !== undefined && { tipo: body.tipo }),
        ...(body.finalidade !== undefined && { finalidade: body.finalidade }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.tags !== undefined && { tags: body.tags }),
        ...(body.cidade !== undefined && { cidade: body.cidade }),
        ...(body.estado !== undefined && { estado: body.estado }),
        ...(body.bairro !== undefined && { bairro: body.bairro }),
        ...(body.logradouro !== undefined && { logradouro: body.logradouro }),
        ...(body.numero !== undefined && { numero: body.numero }),
        ...(body.complemento !== undefined && { complemento: body.complemento }),
        ...(body.cep !== undefined && { cep: body.cep }),
        ...(body.quartos !== undefined && { quartos: body.quartos != null ? parseInt(body.quartos) : null }),
        ...(body.banheiros !== undefined && { banheiros: body.banheiros != null ? parseInt(body.banheiros) : null }),
        ...(body.suites !== undefined && { suites: body.suites != null ? parseInt(body.suites) : null }),
        ...(body.garagem !== undefined && { garagem: body.garagem != null ? parseInt(body.garagem) : null }),
        ...(body.area_m2 !== undefined && { area_m2: body.area_m2 != null ? parseFloat(body.area_m2) : null }),
        ...(body.area_total !== undefined && { area_total: body.area_total != null ? parseFloat(body.area_total) : null }),
        ...(body.imagens !== undefined && { imagens: body.imagens }),
        ...(body.ativo !== undefined && { ativo: body.ativo }),
      },
    });

    // Log
    await prisma.logAcao.create({
      data: {
        adminId: auth.adminId,
        acao: "EDITAR",
        entidade: "IMOVEL",
        detalhes: `Editado: ${imovel.titulo} (${imovel.id})`,
      },
    }).catch(() => {});

    return res.status(200).json(serializeImovel(imovel));
  } catch (error: any) {
    return res.status(500).json({ error: "Erro ao atualizar imóvel" });
  }
}

/* ── DELETE /api/imoveis/:id ── */
async function handleDelete(id: string, req: VercelRequest, res: VercelResponse) {
  const auth = authenticateRequest(req);
  if (!auth) {
    return res.status(401).json({ error: "Não autorizado" });
  }

  try {
    const existing = await prisma.imovel.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Imóvel não encontrado" });
    }

    // Soft delete
    await prisma.imovel.update({
      where: { id },
      data: { ativo: false },
    });

    // Log
    await prisma.logAcao.create({
      data: {
        adminId: auth.adminId,
        acao: "EXCLUIR",
        entidade: "IMOVEL",
        detalhes: `Excluído: ${existing.titulo} (${id})`,
      },
    }).catch(() => {});

    return res.status(200).json({ ok: true });
  } catch (error: any) {
    return res.status(500).json({ error: "Erro ao excluir imóvel" });
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
