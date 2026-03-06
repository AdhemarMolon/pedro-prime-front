import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formata valor numérico para moeda brasileira (R$).
 * Ex: 350000 → "R$ 350.000"
 */
export function formatCurrency(value: number | null | undefined): string {
  if (value == null || isNaN(value)) return "Sob consulta";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Converte string de preço digitada pelo usuário para número.
 * Aceita "350.000", "350000", "350.000,00", "R$ 350.000" etc.
 */
export function parseCurrencyInput(raw: string): number {
  if (!raw) return 0;
  // Remove prefixo R$, espaços
  let cleaned = raw.replace(/R\$\s*/g, "").trim();
  // Se contém vírgula, trata como decimal brasileiro
  if (cleaned.includes(",")) {
    cleaned = cleaned.replace(/\./g, "").replace(",", ".");
  } else {
    // Remove pontos usados como separador de milhar
    cleaned = cleaned.replace(/\./g, "");
  }
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : Math.round(n);
}

/**
 * Formata string de input para display de preço enquanto digita.
 * Ex: "350000" → "350.000"
 */
export function formatPriceInput(value: string): string {
  const nums = value.replace(/\D/g, "");
  if (!nums) return "";
  const n = parseInt(nums, 10);
  if (isNaN(n)) return "";
  return n.toLocaleString("pt-BR");
}
