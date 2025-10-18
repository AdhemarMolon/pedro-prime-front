import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

const WhatsAppButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const WHATSAPP_NUMBER = '5516997527532';
  const DEFAULT_MESSAGE = 'Olá! Gostaria de mais informações sobre os imóveis disponíveis.';

  const handleClick = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;
    window.open(url, '_blank');
  };

  return (
    <>
      {/* Botão Flutuante */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Tooltip */}
        {showTooltip && (
          <div className="bg-white rounded-xl shadow-2xl p-4 max-w-xs border border-gray-200 animate-in slide-in-from-right">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="bg-green-100 rounded-full p-2">
                  <MessageCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Pedro de Toledo</p>
                  <p className="text-xs text-gray-500">Corretor de Imóveis</p>
                </div>
              </div>
              <button
                onClick={() => setShowTooltip(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              Olá! 👋 Precisa de ajuda para encontrar o imóvel ideal? Estou online agora!
            </p>
            <Button
              onClick={handleClick}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              size="sm"
            >
              Iniciar conversa
            </Button>
          </div>
        )}

        {/* Botão Principal */}
        <button
          onClick={handleClick}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="group relative bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-2xl hover:shadow-green-500/50 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-500/50"
          aria-label="Falar no WhatsApp"
        >
          <MessageCircle className="h-6 w-6 animate-pulse" />
          
          {/* Indicador de online */}
          <span className="absolute top-0 right-0 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-white"></span>
          </span>

          {/* Efeito de onda */}
          <span className="absolute inset-0 rounded-full bg-green-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
        </button>
      </div>
    </>
  );
};

export default WhatsAppButton;
