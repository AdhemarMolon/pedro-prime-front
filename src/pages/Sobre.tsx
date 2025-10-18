import { Award, CheckCircle, MessageCircle, Phone, Mail, MapPin, Building2 } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

const Sobre = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = '5516997527532';
    const message = encodeURIComponent('Olá Pedro! Gostaria de uma avaliação de imóvel.');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const credenciais = [
    { orgao: 'CRECI-SP', numero: '237958-F' },
    { orgao: 'CNAI', numero: '39817' }
  ];

  const servicos = [
    'Avaliação para venda de imóveis',
    'Vistorias imobiliárias',
    'Due diligence Imobiliária',
    'Consultoria Imobiliária',
    'Contratos Imobiliários',
    'Corretagem e Intermediações de Imóveis'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white py-20 lg:py-32 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl mb-4">
              <Building2 className="h-10 w-10 text-blue-200" />
            </div>
            
            <Badge className="bg-amber-500 text-white border-none text-base px-4 py-1">
              CRECI-SP 237958-F • CNAI 39817
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Pedro de Toledo
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Corretor e Avaliador de Imóveis Credenciado
            </p>
            
            <p className="text-lg text-blue-200 max-w-2xl mx-auto">
              Avaliação de Imóveis Precisa e Confiável
            </p>

            <div className="pt-6">
              <Button
                onClick={handleWhatsAppClick}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg shadow-xl"
              >
                <MessageCircle className="mr-2 h-6 w-6" />
                Solicite sua Avaliação pelo WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Um Especialista ao seu Dispor
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto"></div>
          </div>

          <div className="text-center max-w-3xl mx-auto">
            <p className="text-lg text-gray-700 leading-relaxed">
              Com anos de experiência no mercado imobiliário de <strong>São Carlos</strong>, 
              ofereço um serviço de avaliação de imóveis pautado pela ética, precisão técnica 
              e conhecimento de mercado. Garanta a segurança e o valor justo para o seu patrimônio.
            </p>
          </div>
        </div>
      </section>

      {/* Credenciais */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Credenciais Profissionais
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {credenciais.map((cred, index) => (
              <Card key={index} className="border-2 border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center">
                  <Award className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{cred.orgao}</h3>
                  <Badge className="bg-blue-100 text-blue-800 text-xl px-6 py-2">
                    {cred.numero}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Serviços Especializados
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {servicos.map((servico, index) => (
              <div 
                key={index} 
                className="flex items-start gap-3 bg-white rounded-lg p-5 shadow-md hover:shadow-lg transition-shadow"
              >
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-800 font-medium">{servico}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="py-16 px-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Entre em Contato
            </h2>
            <p className="text-xl text-blue-100">
              Solicite sua avaliação ou tire suas dúvidas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6 text-center">
                <Phone className="h-8 w-8 text-amber-400 mx-auto mb-3" />
                <div className="text-sm text-blue-200 mb-1">Telefone</div>
                <a 
                  href="tel:+5516997527532" 
                  className="text-white hover:text-amber-400 transition-colors font-semibold"
                >
                  (16) 99752-7532
                </a>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6 text-center">
                <Mail className="h-8 w-8 text-amber-400 mx-auto mb-3" />
                <div className="text-sm text-blue-200 mb-1">E-mail</div>
                <a 
                  href="mailto:contato@pedrodetoledo.com.br" 
                  className="text-white hover:text-amber-400 transition-colors font-semibold text-sm break-all"
                >
                  contato@pedrodetoledo.com.br
                </a>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6 text-center">
                <MapPin className="h-8 w-8 text-amber-400 mx-auto mb-3" />
                <div className="text-sm text-blue-200 mb-1">Localização</div>
                <div className="text-white font-semibold">
                  São Carlos, SP
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button
              onClick={handleWhatsAppClick}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-12 py-6 text-lg shadow-xl"
            >
              <MessageCircle className="mr-2 h-6 w-6" />
              Falar no WhatsApp
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sobre;
