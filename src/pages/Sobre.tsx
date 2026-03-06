import { Award, CheckCircle, MessageCircle, Phone, Mail, MapPin, Building2 } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

const Sobre = () => {
  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/5516997527532?text=${encodeURIComponent("Olá Pedro! Gostaria de uma avaliação de imóvel.")}`, "_blank");
  };

  const credenciais = [
    { orgao: "CRECI-SP", numero: "237958-F" },
    { orgao: "CNAI", numero: "39817" },
  ];

  const servicos = [
    "Avaliação para venda de imóveis",
    "Vistorias imobiliárias",
    "Due diligence Imobiliária",
    "Consultoria Imobiliária",
    "Contratos Imobiliários",
    "Corretagem e Intermediações de Imóveis",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-foreground text-primary-foreground py-20 lg:py-28 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,160,80,0.08),transparent_70%)]" />
        <div className="container mx-auto max-w-4xl text-center relative">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-5">
            <Building2 className="h-8 w-8 text-secondary" />
          </div>
          <Badge className="bg-secondary text-secondary-foreground border-0 mb-4">
            CRECI-SP 237958-F &bull; CNAI 39817
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mt-3 mb-4">Pedro de Toledo</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-2">
            Corretor e Avaliador de Imóveis Credenciado
          </p>
          <p className="text-primary-foreground/60 max-w-xl mx-auto mb-8">
            Avaliação de Imóveis Precisa e Confiável
          </p>
          <Button onClick={handleWhatsAppClick} size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg">
            <MessageCircle className="mr-2 h-5 w-5" />
            Solicite sua Avaliação
          </Button>
        </div>
      </section>

      {/* Sobre */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Um Especialista ao seu Dispor</h2>
          <div className="w-16 h-0.5 bg-primary mx-auto mb-6" />
          <p className="text-muted-foreground leading-relaxed">
            Com anos de experiência no mercado imobiliário de <strong className="text-foreground">São Carlos</strong>,
            ofereço um serviço de avaliação de imóveis pautado pela ética, precisão técnica
            e conhecimento de mercado. Garanta a segurança e o valor justo para o seu patrimônio.
          </p>
        </div>
      </section>

      {/* Credenciais */}
      <section className="py-16 px-4 bg-card">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-3">Credenciais Profissionais</h2>
            <div className="w-16 h-0.5 bg-primary mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {credenciais.map((cred, i) => (
              <Card key={i} className="border-2 border-primary/20">
                <CardContent className="p-6 text-center">
                  <Award className="h-12 w-12 text-primary mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-foreground mb-2">{cred.orgao}</h3>
                  <Badge variant="secondary" className="text-lg px-4 py-1">{cred.numero}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-3">Serviços Especializados</h2>
            <div className="w-16 h-0.5 bg-primary mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {servicos.map((s, i) => (
              <div key={i} className="flex items-start gap-3 bg-card rounded-lg p-4 border">
                <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="text-foreground text-sm font-medium">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contato */}
      <section className="py-16 px-4 bg-foreground text-primary-foreground">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Entre em Contato</h2>
            <p className="text-primary-foreground/70">Solicite sua avaliação ou tire suas dúvidas</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-white/10 border-white/10 backdrop-blur-sm">
              <CardContent className="p-5 text-center">
                <Phone className="h-7 w-7 text-secondary mx-auto mb-2" />
                <div className="text-xs text-primary-foreground/60 mb-1">Telefone</div>
                <a href="tel:+5516997527532" className="text-primary-foreground hover:text-secondary transition-colors font-medium text-sm">(16) 99752-7532</a>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/10 backdrop-blur-sm">
              <CardContent className="p-5 text-center">
                <Mail className="h-7 w-7 text-secondary mx-auto mb-2" />
                <div className="text-xs text-primary-foreground/60 mb-1">E-mail</div>
                <a href="mailto:contato@pedrodetoledo.com.br" className="text-primary-foreground hover:text-secondary transition-colors font-medium text-sm break-all">contato@pedrodetoledo.com.br</a>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/10 backdrop-blur-sm">
              <CardContent className="p-5 text-center">
                <MapPin className="h-7 w-7 text-secondary mx-auto mb-2" />
                <div className="text-xs text-primary-foreground/60 mb-1">Localização</div>
                <div className="text-primary-foreground font-medium text-sm">São Carlos, SP</div>
              </CardContent>
            </Card>
          </div>
          <div className="text-center">
            <Button onClick={handleWhatsAppClick} size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg">
              <MessageCircle className="mr-2 h-5 w-5" />Falar no WhatsApp
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sobre;