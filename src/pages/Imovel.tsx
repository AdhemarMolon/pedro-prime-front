import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Bed, 
  Bath, 
  Car, 
  Square, 
  Building2, 
  MessageCircle,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import FormContato from '@/components/FormContato';
import { DetalheSkeleton } from '@/components/Skeletons';
import { getImovelById, type Imovel } from '@/mocks/imoveis';
import { useToast } from '@/hooks/use-toast';

const ImovelPage = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [imovel, setImovel] = useState<Imovel | null>(null);
  const [loading, setLoading] = useState(true);
  const [imagemAtual, setImagemAtual] = useState(0);
  const [favorito, setFavorito] = useState(false);

  useEffect(() => {
    const carregarImovel = async () => {
      if (!id) return;
      
      setLoading(true);
      
      try {
        // Simular carregamento
        await new Promise(resolve => setTimeout(resolve, 600));
        
        const imovelEncontrado = getImovelById(id);
        setImovel(imovelEncontrado || null);
      } catch (error) {
        console.error('Erro ao carregar imóvel:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarImovel();
  }, [id]);

  const formatarPreco = (preco: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(preco);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'disponivel':
        return 'default';
      case 'vendido':
        return 'destructive';
      case 'alugado':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'disponivel':
        return 'Disponível';
      case 'vendido':
        return 'Vendido';
      case 'alugado':
        return 'Alugado';
      default:
        return status;
    }
  };

  const handleWhatsAppClick = () => {
    if (!imovel) return;
    
    const phoneNumber = '5511999999999';
    const message = encodeURIComponent(
      `Olá! Tenho interesse no imóvel "${imovel.titulo}" (ID: ${imovel._id}). Gostaria de mais informações e agendar uma visita.`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const handleCompartilhar = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: imovel?.titulo,
          text: `Confira este imóvel: ${imovel?.titulo}`,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback para clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copiado!",
          description: "O link do imóvel foi copiado para a área de transferência.",
        });
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copiado!",
        description: "O link do imóvel foi copiado para a área de transferência.",
      });
    }
  };

  const handleFavoritar = () => {
    setFavorito(!favorito);
    toast({
      title: favorito ? "Removido dos favoritos" : "Adicionado aos favoritos",
      description: favorito 
        ? "O imóvel foi removido da sua lista de favoritos." 
        : "O imóvel foi salvo na sua lista de favoritos.",
    });
  };

  const proximaImagem = () => {
    if (!imovel) return;
    setImagemAtual((prev) => (prev + 1) % imovel.imagens.length);
  };

  const imagemAnterior = () => {
    if (!imovel) return;
    setImagemAtual((prev) => (prev - 1 + imovel.imagens.length) % imovel.imagens.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-16">
        <DetalheSkeleton />
      </div>
    );
  }

  if (!imovel) {
    return (
      <div className="min-h-screen bg-background pt-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Imóvel não encontrado</h1>
          <p className="text-muted-foreground mb-6">
            O imóvel que você está procurando não existe ou foi removido.
          </p>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para início
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para resultados
          </Link>
        </Button>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna principal - Galeria e informações */}
          <div className="lg:col-span-2 space-y-8">
            {/* Galeria de Imagens */}
            <div className="space-y-4">
              <div className="relative bg-card rounded-xl overflow-hidden shadow-medium">
                <img
                  src={imovel.imagens[imagemAtual]?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'}
                  alt={imovel.imagens[imagemAtual]?.alt || imovel.titulo}
                  className="w-full h-96 object-cover"
                />
                
                {/* Controles da galeria */}
                {imovel.imagens.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                      onClick={imagemAnterior}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                      onClick={proximaImagem}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}

                {/* Contador de imagens */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {imagemAtual + 1} / {imovel.imagens.length}
                </div>
              </div>

              {/* Thumbnails */}
              {imovel.imagens.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {imovel.imagens.map((imagem, index) => (
                    <button
                      key={index}
                      onClick={() => setImagemAtual(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        index === imagemAtual 
                          ? 'border-primary' 
                          : 'border-transparent hover:border-muted-foreground'
                      }`}
                    >
                      <img
                        src={imagem.url}
                        alt={imagem.alt}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Informações do Imóvel */}
            <div className="bg-card rounded-xl p-6 shadow-medium border border-border">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-card-foreground mb-2">
                    {imovel.titulo}
                  </h1>
                  <div className="flex items-center text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>
                      {imovel.endereco.rua}, {imovel.endereco.bairro}, {imovel.endereco.cidade} - {imovel.endereco.estado}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleFavoritar}
                    className={favorito ? 'text-red-500 border-red-500' : ''}
                  >
                    <Heart className={`h-4 w-4 ${favorito ? 'fill-current' : ''}`} />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleCompartilhar}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <Badge variant={getStatusVariant(imovel.status)} className="font-medium">
                  {getStatusLabel(imovel.status)}
                </Badge>
                <div className="text-2xl font-bold text-brand-blue">
                  {formatarPreco(imovel.preco)}
                </div>
              </div>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                {imovel.descricao}
              </p>

              {/* Características */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {imovel.tipo !== 'terreno' && imovel.caracteristicas.quartos > 0 && (
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <Bed className="h-6 w-6 mx-auto mb-2 text-brand-blue" />
                    <div className="font-semibold">{imovel.caracteristicas.quartos}</div>
                    <div className="text-sm text-muted-foreground">
                      {imovel.caracteristicas.quartos === 1 ? 'Quarto' : 'Quartos'}
                    </div>
                  </div>
                )}
                
                {imovel.tipo !== 'terreno' && imovel.caracteristicas.banheiros > 0 && (
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <Bath className="h-6 w-6 mx-auto mb-2 text-brand-blue" />
                    <div className="font-semibold">{imovel.caracteristicas.banheiros}</div>
                    <div className="text-sm text-muted-foreground">
                      {imovel.caracteristicas.banheiros === 1 ? 'Banheiro' : 'Banheiros'}
                    </div>
                  </div>
                )}
                
                {imovel.caracteristicas.garagem > 0 && (
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <Car className="h-6 w-6 mx-auto mb-2 text-brand-blue" />
                    <div className="font-semibold">{imovel.caracteristicas.garagem}</div>
                    <div className="text-sm text-muted-foreground">
                      {imovel.caracteristicas.garagem === 1 ? 'Vaga' : 'Vagas'}
                    </div>
                  </div>
                )}
                
                <div className="text-center p-3 bg-muted rounded-lg">
                  <Square className="h-6 w-6 mx-auto mb-2 text-brand-blue" />
                  <div className="font-semibold">{imovel.caracteristicas.area_m2}m²</div>
                  <div className="text-sm text-muted-foreground">Área Total</div>
                </div>

                {imovel.caracteristicas.andar && (
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <Building2 className="h-6 w-6 mx-auto mb-2 text-brand-blue" />
                    <div className="font-semibold">{imovel.caracteristicas.andar}º</div>
                    <div className="text-sm text-muted-foreground">Andar</div>
                  </div>
                )}
              </div>

              {/* CTA WhatsApp */}
              <Button
                onClick={handleWhatsAppClick}
                className="w-full bg-brand-amber hover:bg-brand-amber/90 text-white font-semibold py-3 text-lg"
                size="lg"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Falar no WhatsApp
              </Button>
            </div>
          </div>

          {/* Sidebar - Formulário de contato */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <FormContato imovelTitulo={imovel.titulo} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImovelPage;