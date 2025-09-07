import { Link } from "react-router-dom";
import { Home, Search, ArrowLeft, RefreshCw, HelpCircle } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

/**
 * Página 404 - Não encontrado.
 * Versão completamente refatorada com design elegante e interativo.
 */
export default function NotFound() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-amber-400/10 to-orange-400/10 rounded-full blur-2xl animate-bounce" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236B7280' fill-opacity='0.4'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="max-w-lg w-full text-center space-y-8 relative z-10">
        {/* Animated 404 */}
        <div className="space-y-6 animate-fade-in-up">
          <div className="relative">
            {/* Large 404 Text */}
            <div className="text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 select-none animate-pulse">
              404
            </div>
            
            {/* Centered Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-6 shadow-2xl animate-bounce" style={{animationDelay: '0.5s'}}>
                <Search className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>

          {/* Title and Description */}
          <div className="space-y-4 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">
              Ops! Página não encontrada
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-md mx-auto">
              A página que você está procurando não existe, foi movida ou está temporariamente indisponível.
            </p>
          </div>
        </div>

        {/* Enhanced Action Card */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm animate-fade-in-up" style={{animationDelay: '0.6s'}}>
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">
                O que você gostaria de fazer?
              </span>
            </div>
            
            <div className="grid gap-3">
              <Button 
                asChild 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]" 
                size="lg"
              >
                <Link to="/">
                  <Home className="h-5 w-5 mr-2" />
                  Ir para a página inicial
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 hover:scale-[1.02]" 
                onClick={() => window.history.back()}
                size="lg"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Voltar à página anterior
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300 transition-all duration-300 hover:scale-[1.02]" 
                onClick={handleRefresh}
                size="lg"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Recarregar página
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Suggestions */}
        <div className="space-y-4 animate-fade-in-up" style={{animationDelay: '0.9s'}}>
          <h3 className="text-lg font-semibold text-gray-700">
            Sugestões para você:
          </h3>
          
          <div className="grid gap-3">
            <Link 
              to="/imoveis" 
              className="group bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-2 group-hover:scale-110 transition-transform duration-300">
                  <Search className="h-4 w-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-800">Buscar Imóveis</div>
                  <div className="text-sm text-gray-600">Explore nossa seleção completa</div>
                </div>
              </div>
            </Link>
            
            <Link 
              to="/contato" 
              className="group bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-2 group-hover:scale-110 transition-transform duration-300">
                  <HelpCircle className="h-4 w-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-800">Fale Conosco</div>
                  <div className="text-sm text-gray-600">Precisa de ajuda? Entre em contato</div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <div className="text-xs text-gray-500 animate-fade-in-up bg-white/30 backdrop-blur-sm rounded-lg p-4" style={{animationDelay: '1.2s'}}>
          <p className="flex items-center justify-center gap-2">
            <span>Se o problema persistir, entre em contato conosco:</span>
            <a href="tel:+5511999999999" className="text-blue-600 hover:text-blue-800 font-medium underline">
              (11) 99999-9999
            </a>
          </p>
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
    </div>
  );
}