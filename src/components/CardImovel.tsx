import { Link } from "react-router-dom";
import { MapPin, Ruler, Bed, Bath, Car, ImageIcon, Tag } from "lucide-react";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { formatCurrency } from "../lib/utils";
import { getTagConfig } from "../lib/constants";
import type { Imovel } from "../lib/api";

type CardImovelProps = { imovel: Imovel; viewMode?: "grid" | "list" };

function getId(i: Imovel) { return i.id || i._id || ""; }
function getPreco(i: Imovel) { return Number(i.preco ?? 0); }
function getArea(i: Imovel) { return Number(i.area_m2 ?? i.caracteristicas?.area_m2 ?? 0); }
function getQuartos(i: Imovel) { return Number(i.quartos ?? i.caracteristicas?.quartos ?? 0); }
function getBanheiros(i: Imovel) { return Number(i.banheiros ?? i.caracteristicas?.banheiros ?? 0); }
function getGaragem(i: Imovel) { return Number(i.garagem ?? i.caracteristicas?.garagem ?? 0); }
function getCidade(i: Imovel) { return i.cidade || i.endereco?.cidade || ""; }
function getBairro(i: Imovel) { return i.bairro || i.endereco?.bairro || ""; }
function getImagem(i: Imovel): string {
  if (!i.imagens?.length) return "";
  const img = i.imagens[0];
  return typeof img === "string" ? img : img?.url || "";
}

const TIPO_MAP: Record<string, string> = {
  CASA: "Casa", APARTAMENTO: "Apartamento", TERRENO: "Terreno",
  SITIO: "Sítio", COMERCIAL: "Comercial", GALPAO: "Galpão",
  CHACARA: "Chácara", KITNET: "Kitnet",
};
const FINALIDADE_MAP: Record<string, string> = {
  VENDA: "Venda", ALUGUEL: "Aluguel", VENDA_ALUGUEL: "Venda/Aluguel",
};

export default function CardImovel({ imovel, viewMode = "grid" }: CardImovelProps) {
  const id = getId(imovel);
  const titulo = imovel.titulo || "Sem título";
  const preco = getPreco(imovel);
  const area = getArea(imovel);
  const quartos = getQuartos(imovel);
  const banheiros = getBanheiros(imovel);
  const garagem = getGaragem(imovel);
  const cidade = getCidade(imovel);
  const bairro = getBairro(imovel);
  const imgUrl = getImagem(imovel);
  const tipo = TIPO_MAP[(imovel.tipo || "").toUpperCase()] || imovel.tipo || "";
  const finalidade = FINALIDADE_MAP[(imovel.finalidade || "").toUpperCase()] || imovel.finalidade || "";
  const tags = imovel.tags || [];
  const localStr = [bairro, cidade].filter(Boolean).join(", ");
  const isList = viewMode === "list";
  const displayTags = tags.slice(0, 2);

  return (
    <Link to={`/imoveis/${id}`} className="block group">
      <Card className={`overflow-hidden border transition-all duration-300 bg-card hover:shadow-lg hover:-translate-y-0.5 ${isList ? "flex flex-row" : "rounded-xl"}`}>
        {/* Image */}
        <div className={`relative shrink-0 overflow-hidden ${isList ? "w-40 sm:w-48 md:w-56" : "w-full"}`}>
          <div className={`${isList ? "h-full min-h-[180px]" : "aspect-[4/3]"} w-full`}>
            {imgUrl ? (
              <img src={imgUrl} alt={titulo} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-secondary">
                <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
              </div>
            )}
          </div>
          <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5">
            {finalidade && <Badge className="bg-primary text-primary-foreground border-0 text-xs shadow">{finalidade}</Badge>}
            {tipo && <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-foreground shadow text-xs">{tipo}</Badge>}
          </div>
          {displayTags.length > 0 && (
            <div className="absolute right-2.5 top-2.5 flex flex-wrap gap-1 max-w-[50%] justify-end">
              {displayTags.map(tag => {
                const cfg = getTagConfig(tag);
                return (
                  <Badge key={tag} variant="outline" className="bg-secondary/90 backdrop-blur-sm text-secondary-foreground border-0 shadow text-[10px]">
                    {cfg?.icon && <span className="mr-0.5">{cfg.icon}</span>}
                    {cfg?.label || tag}
                  </Badge>
                );
              })}
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className={`${isList ? "flex-1 p-4" : "p-4"}`}>
          <div className="space-y-2.5">
            <h3 className="font-semibold text-base text-foreground line-clamp-2 group-hover:text-primary transition-colors">{titulo}</h3>
            {localStr && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-primary/70" />
                <span className="truncate">{localStr}</span>
              </div>
            )}
            {preco > 0 && (
              <div className="text-xl font-bold text-primary">{formatCurrency(preco)}</div>
            )}

            {/* Features */}
            <div className="flex flex-wrap gap-3 pt-2 border-t">
              {area > 0 && <div className="flex items-center gap-1 text-xs text-muted-foreground"><Ruler className="h-3.5 w-3.5" /><span className="font-medium">{area} m²</span></div>}
              {quartos > 0 && <div className="flex items-center gap-1 text-xs text-muted-foreground"><Bed className="h-3.5 w-3.5" /><span className="font-medium">{quartos}</span></div>}
              {banheiros > 0 && <div className="flex items-center gap-1 text-xs text-muted-foreground"><Bath className="h-3.5 w-3.5" /><span className="font-medium">{banheiros}</span></div>}
              {garagem > 0 && <div className="flex items-center gap-1 text-xs text-muted-foreground"><Car className="h-3.5 w-3.5" /><span className="font-medium">{garagem}</span></div>}
            </div>

            {tags.length > 2 && (
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Tag className="h-3 w-3" />
                <span>+{tags.length - 2} tag{tags.length - 2 > 1 ? "s" : ""}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}