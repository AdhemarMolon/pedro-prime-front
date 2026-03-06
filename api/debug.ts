// api/debug.ts
// Temporary debug endpoint — remove after fixing
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const results: Record<string, any> = {};

  // Step 1: Can we import PrismaClient?
  try {
    const { PrismaClient } = await import("@prisma/client");
    results.prismaImport = "ok";

    // Step 2: Can we instantiate?
    try {
      const prisma = new PrismaClient({
        datasources: { db: { url: process.env.DATABASE_URL } },
      });
      results.prismaInstance = "ok";

      // Step 3: Can we query?
      try {
        const count = await prisma.imovel.count();
        results.query = { ok: true, count };
        await prisma.$disconnect();
      } catch (e: any) {
        results.query = { error: e.message, name: e.name };
      }
    } catch (e: any) {
      results.prismaInstance = { error: e.message, name: e.name };
    }
  } catch (e: any) {
    results.prismaImport = { error: e.message, name: e.name, stack: e.stack?.slice(0, 500) };
  }

  return res.status(200).json(results);
}
