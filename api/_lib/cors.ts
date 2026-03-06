// api/_lib/cors.ts
// CORS helper for Vercel serverless functions

import type { VercelRequest, VercelResponse } from "@vercel/node";

const ALLOWED_ORIGINS = [
  "http://localhost:8080",
  "http://localhost:5173",
  "http://localhost:3000",
];

export function setCors(req: VercelRequest, res: VercelResponse): boolean {
  const origin = req.headers.origin || "";

  // Allow same-origin (no origin header) and localhost in dev
  // In production, Vercel serves from same domain so origin matches
  if (
    !origin ||
    ALLOWED_ORIGINS.includes(origin) ||
    origin.endsWith(".vercel.app")
  ) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  } else {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Max-Age", "86400");

  // Handle preflight
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return true; // signal: already handled
  }

  return false;
}
