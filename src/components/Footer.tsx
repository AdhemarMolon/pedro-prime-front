import { Mail, Phone, MessageCircle, Lock } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  const YEAR = new Date().getFullYear();
  const WHATS_E164 = "5516997527532";
  const WHATS_MSG = "Ola! Gostaria de solicitar uma avaliacao de imovel.";
  const EMAIL = "pedro.toledo@creci.org.br";
  const CRECI = "CRECI-SP 237958-F";
  const CNAI = "CNAI 39817";

  const openWhats = () =>
    window.open(
      `https://wa.me/${WHATS_E164}?text=${encodeURIComponent(WHATS_MSG)}`,
      "_blank"
    );

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M12 3l8 6h-2v9h-4v-6H10v6H6v-9H4l8-6z" />
                </svg>
              </div>
              <div>
                <span className="text-sm font-bold tracking-tight">Pedro de Toledo</span>
                <span className="block text-[10px] font-medium uppercase tracking-widest text-white/60">
                  Corretor de Imoveis
                </span>
              </div>
            </div>
            <p className="text-sm text-white/70 max-w-xs leading-relaxed">
              Corretor e avaliador de imoveis credenciado. Servicos de avaliacao, consultoria e intermediacao imobiliaria.
            </p>
            <div className="flex items-center gap-3 text-xs text-white/50">
              <span>{CRECI}</span>
              <span className="h-1 w-1 rounded-full bg-white/30" />
              <span>{CNAI}</span>
            </div>
          </div>

          {/* Contato */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80">Contato</h3>
            <div className="space-y-3">
              <a
                href={`tel:+${WHATS_E164}`}
                className="flex items-center gap-3 text-sm text-white/70 hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4 text-white/40" />
                (16) 99752-7532
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="flex items-center gap-3 text-sm text-white/70 hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4 text-white/40" />
                {EMAIL}
              </a>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80">Atendimento</h3>
            <p className="text-sm text-white/60">
              Fale conosco pelo WhatsApp para um atendimento rapido e personalizado.
            </p>
            <button
              onClick={openWhats}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              Falar no WhatsApp
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-xs text-white/50">
            &copy; {YEAR} Pedro de Toledo Corretor. Todos os direitos reservados.
          </span>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/login"
              className="text-white/20 hover:text-white/50 transition-colors"
              title="Área administrativa"
              aria-label="Acesso administrativo"
            >
              <Lock className="h-3 w-3" />
            </Link>
            <a
              href="https://adhemarmolon.github.io/portfolio/"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-white/40 hover:text-white/60 transition-colors"
            >
              Desenvolvido por Adhemar Molon
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}