import React from "react";

export type FiltrosState = {
  busca: string;
  precoMin: string | number;
  precoMax: string | number;
  areaMin: string | number;
  areaMax: string | number;
};

type Props = {
  value: FiltrosState;
  onChange: (next: FiltrosState) => void;
  onClear?: () => void;
};

export default function Filtros({ value, onChange, onClear }: Props) {
  const set = (patch: Partial<FiltrosState>) => onChange({ ...value, ...patch });

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-6 gap-3">
      {/* Busca por nome (mantém o que você já usa) */}
      <input
        className="col-span-2 border rounded-lg px-3 py-2"
        placeholder="Buscar por nome do imóvel…"
        value={value.busca}
        onChange={(e) => set({ busca: e.target.value })}
      />

      {/* Preço */}
      <input
        className="border rounded-lg px-3 py-2"
        type="number"
        min={0}
        placeholder="Preço mín."
        value={value.precoMin}
        onChange={(e) => set({ precoMin: e.target.value })}
      />
      <input
        className="border rounded-lg px-3 py-2"
        type="number"
        min={0}
        placeholder="Preço máx."
        value={value.precoMax}
        onChange={(e) => set({ precoMax: e.target.value })}
      />

      {/* Limpar */}
      <button
        type="button"
        className="border rounded-lg px-3 py-2"
        onClick={() =>
          onClear
            ? onClear()
            : onChange({
                busca: "",
                precoMin: "",
                precoMax: "",
                areaMin: "",
                areaMax: "",
              })
        }
      >
        Limpar filtros
      </button>
    </div>
  );
}
