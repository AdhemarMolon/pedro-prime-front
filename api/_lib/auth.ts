// api/_lib/auth.ts
// JWT helpers for admin authentication

import * as jwt from "jsonwebtoken";
import type { VercelRequest } from "@vercel/node";

const SECRET = process.env.JWT_SECRET || "fallback-dev-secret";

export interface JwtPayload {
  adminId: string;
  email: string;
}

/** Sign a JWT token (24h expiry) */
export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: "24h" });
}

/** Verify and decode a JWT token */
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, SECRET) as JwtPayload;
}

/** Extract token from Authorization header */
export function extractToken(req: VercelRequest): string | null {
  const auth = req.headers.authorization;
  if (!auth) return null;
  const [scheme, token] = auth.split(" ");
  if (scheme !== "Bearer" || !token) return null;
  return token;
}

/** Verify request is authenticated, returns payload or null */
export function authenticateRequest(req: VercelRequest): JwtPayload | null {
  const token = extractToken(req);
  if (!token) return null;
  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}
