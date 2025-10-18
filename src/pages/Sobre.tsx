import { Award, CheckCircle, Heart, Home, MapPin, Phone, Mail, MessageCircle, Star, TrendingUp, Users, Building2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const Sobre = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = '5516997527532';
    const message = encodeURIComponent('Olá Pedro! Gostaria de conversar sobre serviços imobiliários.');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const diferenciais = [
    {
      icon: Award,
      title: 'Experiência Comprovada',
      description: 'Mais de 15 anos atuando no mercado imobiliário com centenas de transações bem-sucedidas.'
    },
    {
      icon: Heart,
      title: 'Atendimento Personalizado',
      description: 'Cada cliente é único. Dedico tempo para entender suas necessidades e encontrar a solução ideal.'
    },
    {
      icon: TrendingUp,
      title: 'Conhecimento de Mercado',
      description: 'Análise profunda do mercado local para garantir as melhores oportunidades e preços justos.'
    },
    {
      icon: Users,
      title: 'Rede de Contatos',
      description: 'Acesso a uma ampla rede de compradores, vendedores e parceiros do setor.'
    },
    {
      icon: CheckCircle,
      title: 'Processo Transparente',
      description: 'Comunicação clara em todas as etapas, sem surpresas ou taxas ocultas.'
    },
    {
      icon: Home,
      title: 'Suporte Completo',
      description: 'Acompanhamento em todo o processo: documentação, financiamento e entrega das chaves.'
    }
  ];

  const servicos = [
    'Compra e Venda de Imóveis',
    'Locação Residencial e Comercial',
    'Avaliação de Imóveis',
    'Consultoria Imobiliária',
    'Análise de Investimentos',
    'Assessoria em Financiamento',
    'Regularização Documental',
    'Vistorias Técnicas'
  ];

  const numeros = [
    { value: '500+', label: 'Imóveis Vendidos', icon: Home },
    { value: '15+', label: 'Anos de Experiência', icon: Award },
    { value: '1000+', label: 'Clientes Satisfeitos', icon: Users },
    { value: '98%', label: 'Taxa de Satisfação', icon: Star }
  ];

  const certificacoes = [
    { title: 'CRECI-SP', code: '237958-F', description: 'Conselho Regional de Corretores de Imóveis' },
    { title: 'CNAI', code: '39817', description: 'Cadastro Nacional de Avaliadores Imobiliários' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-amber-900 text-white py-20 lg:py-32 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-400 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Texto */}
            <div className="space-y-6">
              <Badge className="bg-amber-500 text-white border-none">CRECI-SP 237958-F</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Pedro de Toledo
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
                Corretor de Imóveis e Avaliador Credenciado
              </p>
              <p className="text-lg text-blue-200">
                Transformando sonhos em endereços há mais de 15 anos. 
                Especialista em encontrar o lar perfeito para cada família.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <Button
                  onClick={handleWhatsAppClick}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white px-8"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Fale Comigo
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                  onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Ver Contatos
                </Button>
              </div>
            </div>

            {/* Imagem/Card com números */}
            <div className="grid grid-cols-2 gap-4">
              {numeros.map((numero, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all">
                  <CardContent className="p-6 text-center">
                    <numero.icon className="h-8 w-8 text-amber-400 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-white mb-1">{numero.value}</div>
                    <div className="text-sm text-blue-100">{numero.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sobre Mim */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Minha História
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-amber-500 mx-auto mb-6"></div>
          </div>

          <div className="max-w-4xl mx-auto space-y-6 text-lg text-gray-700 leading-relaxed">
            <p>
              Iniciei minha carreira no mercado imobiliário há mais de 15 anos, motivado pela paixão em ajudar 
              pessoas a realizarem o sonho da casa própria. Desde então, já assessorei centenas de famílias em 
              uma das decisões mais importantes de suas vidas.
            </p>
            <p>
              Com credenciamento <strong>CRECI-SP 237958-F</strong> e <strong>CNAI 39817</strong>, atuo com total 
              transparência e profissionalismo. Meu compromisso vai além da simples transação: busco entender 
              profundamente as necessidades de cada cliente para oferecer soluções personalizadas.
            </p>
            <p>
              Minha experiência abrange todas as etapas do processo imobiliário: desde a avaliação precisa do 
              imóvel, passando pela negociação estratégica, até o suporte completo com documentação e 
              financiamento. Acredito que conhecimento técnico aliado ao atendimento humanizado faz toda a diferença.
            </p>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Por Que Me Escolher?
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-amber-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Diferenciais que fazem a diferença na sua jornada imobiliária
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {diferenciais.map((item, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-gradient-to-br from-blue-100 to-amber-50 rounded-lg p-4 w-fit mb-4">
                    <item.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Serviços Oferecidos
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-amber-500 mx-auto mb-6"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {servicos.map((servico, index) => (
              <div key={index} className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-800 font-medium">{servico}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificações */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Certificações e Credenciais
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-amber-500 mx-auto mb-6"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {certificacoes.map((cert, index) => (
              <Card key={index} className="border-2 border-blue-200 shadow-lg">
                <CardContent className="p-8 text-center">
                  <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{cert.title}</h3>
                  <Badge className="bg-blue-100 text-blue-800 text-lg px-4 py-1 mb-3">{cert.code}</Badge>
                  <p className="text-gray-600">{cert.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="py-16 px-4 bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Vamos Conversar?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Entre em contato e descubra como posso ajudá-lo a encontrar o imóvel perfeito
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6 text-center">
                <Phone className="h-8 w-8 text-amber-400 mx-auto mb-3" />
                <div className="text-sm text-blue-200 mb-1">Telefone</div>
                <a href="tel:+5516997527532" className="text-white hover:text-amber-400 transition-colors font-semibold">
                  (16) 99752-7532
                </a>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6 text-center">
                <Mail className="h-8 w-8 text-amber-400 mx-auto mb-3" />
                <div className="text-sm text-blue-200 mb-1">E-mail</div>
                <a href="mailto:pedro.toledo@creci.org.br" className="text-white hover:text-amber-400 transition-colors font-semibold break-all">
                  pedro.toledo@creci.org.br
                </a>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6 text-center">
                <MapPin className="h-8 w-8 text-amber-400 mx-auto mb-3" />
                <div className="text-sm text-blue-200 mb-1">Localização</div>
                <div className="text-white font-semibold">
                  São Paulo, SP
                </div>
              </CardContent>
            </Card>
          </div>

          <Button
            onClick={handleWhatsAppClick}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white px-12 py-6 text-lg"
          >
            <MessageCircle className="mr-2 h-6 w-6" />
            Falar no WhatsApp
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Sobre;
