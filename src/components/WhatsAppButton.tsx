import { MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

const WhatsAppButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const WHATSAPP_NUMBER = "5516997527532";
  const DEFAULT_MESSAGE = "Olá! Gostaria de mais informações sobre os imóveis disponíveis.";

  const handleClick = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`, "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {showTooltip && (
        <div className="bg-card rounded-xl shadow-xl p-4 max-w-xs border animate-in slide-in-from-right">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-50 rounded-full p-2">
                <MessageCircle className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">Pedro de Toledo</p>
                <p className="text-xs text-muted-foreground">Corretor de Imóveis</p>
              </div>
            </div>
            <button onClick={() => setShowTooltip(false)} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Precisa de ajuda para encontrar o imóvel ideal? Estou online agora!
          </p>
          <Button onClick={handleClick} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" size="sm">
            Iniciar conversa
          </Button>
        </div>
      )}

      <button
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="group relative bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-3.5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-500/30"
        aria-label="Falar no WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute top-0 right-0 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white" />
        </span>
      </button>
    </div>
  );
};

export default WhatsAppButton;