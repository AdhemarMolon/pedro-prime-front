import { Link } from "react-router-dom";
import { MapPin, DollarSign, Ruler, Bed, Bath, Car, ImageIcon } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { ImovelType } from "../lib/api";

type ViewMode = "grid" | "list";

type CardImovelProps = {
  i: ImovelType & { _id?: any; id?: any } & Record<string, any>;
  viewMode: ViewMode;
};

/* ----------------- ID helpers ----------------- */
function normalizeIdVal(val: any): string | undefined {
  if (!val) return undefined;
  if (typeof val === "string" && val.trim()) return val.trim();
  if (typeof val === "number") return String(val);
  if (typeof val === "object") {
    if (typeof val.$oid === "string") return val.$oid;
    if (typeof val.oid === "string") return val.oid;
    if (typeof val._id === "string") return val._id;
    if (typeof val.id === "string") return val.id;
    if (typeof (val as any).toHexString === "function") {
      try {
        const hex = (val as any).toHexString();
        if (typeof hex === "string" && hex) return hex;
      } catch {}
    }
    const s = String(val);
    const m = s.match(/ObjectId\('([0-9a-fA-F]{24})'\)/);
    if (m) return m[1];
  }
  return undefined;
}
function getId(x: any) {
  return normalizeIdVal(x?._id) ?? normalizeIdVal(x?.id);
}

/* ----------------- Number helpers ----------------- */
function num(n: any) {
  const v = Number(n);
  return Number.isFinite(v) ? v : undefined;
}

/* ----------------- Field helpers ----------------- */
function getPreco(i: any) {
  return num(i?.preco ?? i?.valor ?? i?.price);
}
function getArea(i: any) {
  return num(
    i?.area ??
      i?.areaUtil ??
      i?.m2 ??
      i?.area_m2 ??
      i?.caracteristicas?.area_m2 ??
      i?.caracteristicas?.area
  );
}
function getQuartos(i: any) {
  return num(i?.quartos ?? i?.dorms ?? i?.bedrooms ?? i?.caracteristicas?.quartos);
}
function getBanheiros(i: any) {
  return num(i?.banheiros ?? i?.baths ?? i?.banho ?? i?.caracteristicas?.banheiros);
}
function getVagas(i: any) {
  return num(i?.vagas ?? i?.garagem ?? i?.garages ?? i?.caracteristicas?.garagem);
}
function getTitulo(i: any) {
  const base =
    i?.titulo ??
    i?.nome ??
    i?.title ??
    i?.headline ??
    `${i?.tipo || ""} ${i?.bairro || ""}`.trim();
  return String(base || "Imóvel").trim();
}
function getLocalStr(i: any) {
  const bairro = i?.bairro ?? i?.endereco?.bairro ?? i?.district ?? "";
  const cidade = i?.cidade ?? i?.endereco?.cidade ?? i?.localidade ?? i?.city ?? "";
  const estado = i?.estado ?? i?.endereco?.estado ?? i?.state ?? i?.uf ?? "";
  return [bairro, cidade, estado].filter(Boolean).join(" • ");
}

/* ----------------- Imagem helpers ----------------- */
function fromGoogleImgRes(u: string): string {
  try {
    const url = new URL(u);
    if (url.hostname.includes("google.") && url.pathname.includes("/imgres")) {
      const raw = url.searchParams.get("imgurl");
      if (raw) return decodeURIComponent(raw);
    }
  } catch {}
  return u;
}
function firstNonEmpty(arr: (string | undefined)[]): string {
  for (const s of arr) if (s && s.trim()) return s.trim();
  return "";
}
function resolveImageUrl(i: any): string {
  if (typeof i?.imagens === "string") {
    const first = i.imagens.split(",")[0]?.trim();
    if (first) return fromGoogleImgRes(first);
  }
  const arraysPossiveis = [i?.imagens, i?.images, i?.fotos, i?.photos].filter(Array.isArray);
  for (const arr of arraysPossiveis as any[]) {
    if (arr.length > 0) {
      const a0 = arr[0];
      if (typeof a0 === "string" && a0) return fromGoogleImgRes(a0);
      if (typeof a0 === "object" && (a0?.url || a0?.src)) {
        return fromGoogleImgRes(a0.url || a0.src);
      }
    }
  }
  const single = firstNonEmpty([i?.imagem, i?.image, i?.capa, i?.cover, i?.caracteristicas?.capa]);
  if (single) return fromGoogleImgRes(single);
  return "";
}

/* ----------------- Componente ----------------- */
export default function CardImovel({ i, viewMode }: CardImovelProps) {
  const rawId = getId(i);
  const id = rawId ? encodeURIComponent(rawId) : undefined;
  const preco = getPreco(i);
  const area = getArea(i);
  const quartos = getQuartos(i);
  const banheiros = getBanheiros(i);
  const vagas = getVagas(i);
  const titulo = getTitulo(i);
  const localStr = getLocalStr(i);
  const imgUrl = resolveImageUrl(i);
  const isList = viewMode === "list";

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) =>
    id ? (
      <Link
        to={`/imoveis/${id}`} // <<<<<< CORRIGIDO: rota plural
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-2xl"
      >
        {children}
      </Link>
    ) : (
      <div className="block">{children}</div>
    );

  return (
    <Wrapper>
      <Card
        className={[
          "overflow-hidden border-0 shadow-md transition-all duration-200 bg-white",
          "hover:shadow-lg hover:-translate-y-0.5 rounded-2xl",
          isList ? "flex" : "",
        ].join(" ")}
      >
        <div className={isList ? "flex w-full" : ""}>
          {/* IMAGEM */}
          <div className={["relative shrink-0", isList ? "w-48 h-36 md:w-56 md:h-40" : "w-full"].join(" ")}>
            <div className={isList ? "h-full" : "aspect-[16/10] w-full"}>
              {imgUrl ? (
                <img
                  src={imgUrl}
                  alt={titulo}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-100">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>

            <div className="pointer-events-none absolute left-2 top-2 flex flex-wrap gap-1">
              {i?.finalidade ? (
                <Badge variant="secondary" className="bg-white/90 text-gray-700">
                  {String(i.finalidade)}
                </Badge>
              ) : null}
              {i?.tipo ? (
                <Badge variant="secondary" className="bg-white/90 text-gray-700">
                  {String(i.tipo)}
                </Badge>
              ) : null}
            </div>
          </div>

          {/* CONTEÚDO */}
          <CardContent className={isList ? "flex min-w-0 flex-1 p-4" : "p-4"}>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-lg font-semibold text-gray-900">{titulo}</h3>

              {localStr && (
                <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{localStr}</span>
                </div>
              )}

              {typeof preco === "number" && !Number.isNaN(preco) ? (
                <div className="mt-3 text-xl font-bold text-gray-900">
                  R$ {preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
              ) : null}

              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-700">
                {area ? (
                  <span className="inline-flex items-center gap-1">
                    <Ruler className="h-4 w-4" />
                    {area} m²
                  </span>
                ) : null}
                {quartos ? (
                  <span className="inline-flex items-center gap-1">
                    <Bed className="h-4 w-4" />
                    {quartos} {quartos === 1 ? "quarto" : "quartos"}
                  </span>
                ) : null}
                {banheiros ? (
                  <span className="inline-flex items-center gap-1">
                    <Bath className="h-4 w-4" />
                    {banheiros} {banheiros === 1 ? "banheiro" : "banheiros"}
                  </span>
                ) : null}
                {vagas ? (
                  <span className="inline-flex items-center gap-1">
                    <Car className="h-4 w-4" />
                    {vagas} {vagas === 1 ? "vaga" : "vagas"}
                  </span>
                ) : null}
              </div>

              {preco && area ? (
                <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-700">
                  <DollarSign className="h-3 w-3" />
                  R$ {(preco / area).toFixed(0)}/m²
                </div>
              ) : null}
            </div>
          </CardContent>
        </div>
      </Card>
    </Wrapper>
  );
}
