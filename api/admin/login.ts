// api/admin/login.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import * as bcrypt from "bcryptjs";
import { prisma } from "../_lib/prisma";
import { signToken } from "../_lib/auth";
import { setCors } from "../_lib/cors";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (setCors(req, res)) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin || !admin.ativo) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const senhaValida = await bcrypt.compare(password, admin.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const token = signToken({ adminId: admin.id, email: admin.email });

    // Log de login
    await prisma.logAcao.create({
      data: {
        adminId: admin.id,
        acao: "LOGIN",
        entidade: "ADMIN",
        detalhes: `Login: ${admin.email}`,
        ip: (req.headers["x-forwarded-for"] as string) || "unknown",
      },
    }).catch(() => {}); // non-blocking

    return res.status(200).json({ token });
  } catch (error: any) {
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
