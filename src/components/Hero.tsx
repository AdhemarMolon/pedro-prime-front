import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = '5511999999999'; // Número do WhatsApp
    const message = encodeURIComponent('Olá! Gostaria de solicitar uma avaliação do meu imóvel.');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <section className="relative bg-gradient-hero text-white py-24 px-4 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-brand-amber rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Encontre o{' '}
          <span className="text-brand-amber">Imóvel dos seus Sonhos</span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
          Com mais de 15 anos de experiência no mercado imobiliário, 
          ajudamos você a encontrar o lar perfeito ou realizar o melhor investimento.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            onClick={handleWhatsAppClick}
            className="bg-brand-amber hover:bg-brand-amber/90 text-white font-semibold px-8 py-4 rounded-full text-lg shadow-large hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Solicite sua Avaliação pelo WhatsApp
          </Button>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-amber mb-2">500+</div>
            <div className="text-lg opacity-80">Imóveis Vendidos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-amber mb-2">15+</div>
            <div className="text-lg opacity-80">Anos de Experiência</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-amber mb-2">1000+</div>
            <div className="text-lg opacity-80">Clientes Satisfeitos</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;