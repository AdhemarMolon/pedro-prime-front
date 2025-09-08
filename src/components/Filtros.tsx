import React from "react";

export type SortValue =
  | "preco_asc"   // Mais barato
  | "preco_desc"  // Mais caro
  | "area_desc"   // Maior área
  | "area_asc"    // Menor área
  | "recente";    // Mais recentes

type Props = {
  value: SortValue;
  onChange: (next: SortValue) => void;
  total?: number;        // opcional: mostrar "X imóveis"
  className?: string;    // opcional
};

export default function Ordenacao({ value, onChange, total, className }: Props) {
  return (
    <div
      className={
        "w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 " +
        (className ?? "")
      }
    >
      {typeof total === "number" && (
        <span className="text-sm text-gray-600">{total} imóveis</span>
      )}

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700">Ordenar:</span>
        <select
          className="border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
          value={value}
          onChange={(e) => onChange(e.target.value as SortValue)}
        >
          <option value="preco_asc">Mais barato</option>
          <option value="preco_desc">Mais caro</option>
          <option value="area_desc">Maior área</option>
          <option value="area_asc">Menor área</option>
          <option value="recente">Mais recentes</option>
        </select>
      </div>
    </div>
  );
}

/** Helper para aplicar a ordenação na sua lista */
export function ordenarImoveis<T extends {
  preco?: number;
  area?: number;
  createdAt?: string | number | Date;
}>(lista: T[], criterio: SortValue): T[] {
  const arr = [...lista];
  switch (criterio) {
    case "preco_asc":
      return arr.sort((a, b) => (a.preco ?? 0) - (b.preco ?? 0));
    case "preco_desc":
      return arr.sort((a, b) => (b.preco ?? 0) - (a.preco ?? 0));
    case "area_asc":
      return arr.sort((a, b) => (a.area ?? 0) - (b.area ?? 0));
    case "area_desc":
      return arr.sort((a, b) => (b.area ?? 0) - (a.area ?? 0));
    case "recente":
    default:
      return arr.sort(
        (a, b) =>
          new Date(b.createdAt ?? 0).getTime() -
          new Date(a.createdAt ?? 0).getTime()
      );
  }
}
