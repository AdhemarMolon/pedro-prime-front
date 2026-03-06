// api/_lib/prisma.ts
// Singleton Prisma client for Vercel serverless functions

import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

// Reuse connection across hot reloads in dev
export const prisma: PrismaClient =
  globalThis.__prisma ??
  new PrismaClient({
    datasources: {
      db: { url: process.env.DATABASE_URL },
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}
