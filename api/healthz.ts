// api/healthz.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { setCors } from "./_lib/cors";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (setCors(req, res)) return;
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
}
