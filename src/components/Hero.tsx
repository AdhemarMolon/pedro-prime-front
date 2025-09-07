import { MessageCircle, Search, TrendingUp, Award, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState } from 'react';

const Hero = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleWhatsAppClick = () => {
    const phoneNumber = '5511999999999';
    const message = encodeURIComponent('Olá! Gostaria de solicitar uma avaliação do meu imóvel.');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Implementar busca ou navegar para página de resultados
      console.log('Buscando por:', searchTerm);
    }
  };

  const stats = [
    { 
      icon: TrendingUp, 
      value: '500+', 
      label: 'Imóveis Vendidos',
      description: 'Transações realizadas'
    },
    { 
      icon: Award, 
      value: '15+', 
      label: 'Anos de Experiência',
      description: 'No mercado imobiliário'
    },
    { 
      icon: Users, 
      value: '1000+', 
      label: 'Clientes Satisfeitos',
      description: 'Famílias realizadas'
    },
  ];

  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-amber-900 text-white py-20 lg:py-32 px-4 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-32 right-20 w-24 h-24 bg-amber-400 rounded-full blur-2xl animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-400 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-32 left-20 w-28 h-28 bg-amber-300 rounded-full blur-2xl animate-bounce" style={{animationDelay: '0.5s'}}></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="container mx-auto text-center relative z-10 max-w-6xl">
        {/* Main Headline */}
        <div className="animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Encontre o{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300 animate-pulse">
              Imóvel dos seus Sonhos
            </span>
          </h1>

          <p className="text-xl md:text-2xl lg:text-3xl mb-8 opacity-90 max-w-4xl mx-auto leading-relaxed text-blue-100">
            Com mais de 15 anos de experiência no mercado imobiliário,
            ajudamos você a encontrar o lar perfeito ou realizar o melhor investimento.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 h-5 w-5" />
              <Input
                type="text"
                placeholder="Digite o bairro, cidade ou tipo de imóvel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 bg-transparent border-none text-white placeholder:text-white/70 focus:ring-2 focus:ring-amber-400 h-12"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold px-8 py-3 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 h-12"
            >
              <Search className="mr-2 h-5 w-5" />
              Buscar Imóveis
            </Button>
          </form>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          <Button
            size="lg"
            onClick={handleWhatsAppClick}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-8 py-4 rounded-full text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Avaliação Gratuita pelo WhatsApp
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto animate-fade-in-up" style={{animationDelay: '0.6s'}}>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full p-3 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-8 w-8 text-blue-900" />
                  </div>
                  <div className="text-4xl font-bold text-amber-300 mb-2 group-hover:text-amber-200 transition-colors">
                    {stat.value}
                  </div>
                  <div className="text-lg font-semibold text-white mb-1">
                    {stat.label}
                  </div>
                  <div className="text-sm text-blue-200 opacity-80">
                    {stat.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span>CRECI Licenciado</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
              <span>Atendimento 24/7</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
              <span>Avaliação Gratuita</span>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default Hero;