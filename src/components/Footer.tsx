// src/pages/Footer.tsx
import { Mail, Phone, Facebook, MessageCircle } from "lucide-react";

export default function Footer() {
  const YEAR = new Date().getFullYear();

  // Dados
  const WHATS_E164 = "5516997527532"; // +55 16 99752-7532
  const WHATS_MSG = "Olá! Gostaria de solicitar uma avaliação de imóvel.";
  const EMAIL = "pedro.toledo@creci.org.br";
  const FACEBOOK_URL =
    "https://www.facebook.com/people/Pedro-de-Toledo/100071185627021/";
  const CRECI = "CRECI-SP 237958-F";
  const CNAI = "CNAI 39817";

  const openWhats = () =>
    window.open(
      `https://wa.me/${WHATS_E164}?text=${encodeURIComponent(WHATS_MSG)}`,
      "_blank"
    );

  return (
    <footer className="bg-[#1d39b4] text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Cabeçalho do footer */}
        <div className="flex flex-col gap-2 mb-8">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <h3 className="text-xl font-bold tracking-tight"> Pedro de Toledo Corretor </h3>
          </div>
          <p className="text-sm text-white/90">
            Por <span className="font-semibold">Pedro de Toledo</span>, corretor
            e avaliador credenciado.
          </p>
        </div>

        {/* Grid de contato */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Coluna principal (WhatsApp + telefone + e-mail) */}
          <div className="md:col-span-2 space-y-4">
            <button
              onClick={openWhats}
              className="w-full md:w-[480px] inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 bg-green-600 hover:bg-green-700 transition-colors text-sm font-medium shadow"
              aria-label="Abrir WhatsApp"
              title="Solicitar avaliação pelo WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp: (16) 99752-7532
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="inline-flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-amber-300" />
                <span>(16) 99752-7532</span>
              </div>

              <div className="inline-flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-blue-200" />
                <a
                  href={`mailto:${EMAIL}`}
                  className="hover:underline break-all"
                >
                  {EMAIL}
                </a>
              </div>
            </div>
          </div>

          {/* Coluna lateral (Facebook) */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3 text-sm">
              <Facebook className="h-5 w-5 text-blue-300" />
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>

        {/* Credenciais */}
        <div className="mt-8 text-xs text-white/85 flex flex-wrap items-center gap-3">
          <span>• {CRECI}</span>
          <span>• {CNAI}</span>
        </div>
      </div>

      {/* Barra inferior + crédito pequeno */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-xs text-white/70">© {YEAR}  Pedro de Toledo Corretor </span>

          <a
            href="https://adhemarmolon.github.io/portfolio/"
            target="_blank"
            rel="noreferrer"
            className="text-[10px] px-2 py-1 rounded border border-white/20 hover:border-white/40 hover:bg-white/10 transition"
            title="Ver portfólio de Adhemar Molon"
          >
            Desenvolvido por Adhemar Molon
          </a>
        </div>
      </div>
    </footer>
  );
}
