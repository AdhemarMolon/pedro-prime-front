import { Link } from "react-router-dom";
import { MapPin, DollarSign, Ruler, Bed, Bath, Car, ImageIcon } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { ImovelType } from "../lib/api";

type ViewMode = "grid" | "list";

type CardImovelProps = {
  i: ImovelType & { _id?: string; id?: string } & Record<string, any>;
  viewMode: ViewMode;
};

export default function CardImovel({ i, viewMode }: CardImovelProps) {
  // IDs aceitos
  const id = i._id ?? i.id;

  // Imagem (string direta, array de objetos {url}, etc.)
  const imgUrl =
    (Array.isArray(i.imagens) && i.imagens[0]?.url) ||
    (typeof i.imagem === "string" && i.imagem) ||
    (Array.isArray(i.fotos) && (i.fotos[0]?.url || i.fotos[0])) ||
    "";

  // -------- Normalização de shape (flat vs nested) --------
  const precoRaw = i.preco ?? i.valor;
  const preco = typeof precoRaw === "number" ? precoRaw : Number(precoRaw ?? 0);

  const cidade = i.cidade ?? i?.endereco?.cidade ?? i?.localidade ?? "";

  const area =
    i.area ??
    i?.caracteristicas?.area_m2 ??
    i?.caracteristicas?.area ??
    undefined;

  const quartos =
    i.quartos ??
    i?.caracteristicas?.quartos ??
    undefined;

  const banheiros =
    i.banheiros ??
    i?.caracteristicas?.banheiros ??
    undefined;

  const vagas =
    i.vagas ??
    i?.caracteristicas?.garagem ??
    i?.garagem ??
    undefined;

  const tipo = i.tipo ?? i?.categoria ?? i?.finalidade;

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) =>
    id ? (
      <Link to={`/imoveis/${id}`} className="block group">
        {children}
      </Link>
    ) : (
      <div className="block">{children}</div>
    );

  return (
    <Card
      className={[
        "overflow-hidden border-0 shadow-md transition-all duration-200",
        "bg-white hover:shadow-lg hover:-translate-y-0.5",
        viewMode === "list" ? "flex" : "",
      ].join(" ")}
    >
      <Wrapper>
        <div className={viewMode === "list" ? "flex" : ""}>
          {/* Imagem */}
          <div
            className={[
              "relative bg-gray-100",
              viewMode === "grid" ? "h-48 w-full" : "h-40 w-48 flex-shrink-0",
            ].join(" ")}
          >
            {imgUrl ? (
              <img
                src={imgUrl}
                alt={i.titulo}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-400">
                <ImageIcon className="h-8 w-8" />
              </div>
            )}

            {tipo && (
              <Badge className="absolute top-3 left-3 bg-white/90 text-gray-800">
                {tipo}
              </Badge>
            )}
          </div>

          {/* Conteúdo */}
          <CardContent className={["p-4", viewMode === "list" ? "flex-1" : ""].join(" ")}>
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-700 transition-colors">
                {i.titulo}
              </h3>
              {Number.isFinite(preco) && preco > 0 && (
                <div className="text-blue-700 font-bold whitespace-nowrap">
                  R$ {preco.toLocaleString("pt-BR")}
                </div>
              )}
            </div>

            {(cidade && cidade.trim().length > 0) && (
              <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span className="line-clamp-1">{cidade}</span>
              </div>
            )}

            <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-gray-600">
              {area ? (
                <div className="flex items-center gap-1">
                  <Ruler className="h-4 w-4" />
                  {area} m²
                </div>
              ) : null}
              {quartos ? (
                <div className="flex items-center gap-1">
                  <Bed className="h-4 w-4" />
                  {quartos}
                </div>
              ) : null}
              {banheiros ? (
                <div className="flex items-center gap-1">
                  <Bath className="h-4 w-4" />
                  {banheiros}
                </div>
              ) : null}
              {vagas ? (
                <div className="flex items-center gap-1">
                  <Car className="h-4 w-4" />
                  {vagas}
                </div>
              ) : null}
            </div>

            {Number.isFinite(preco) && area ? (
              <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-700">
                <DollarSign className="h-3 w-3" />
                R$ {((preco || 0) / (area || 1)).toFixed(0)}/m²
              </div>
            ) : null}
          </CardContent>
        </div>
      </Wrapper>
    </Card>
  );
}
