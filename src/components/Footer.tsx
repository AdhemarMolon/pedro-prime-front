import { Building2, Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Empresa */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-brand-amber" />
              <span className="text-xl font-bold">Pedro de Toledo Imóveis</span>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed">
              Há mais de 15 anos realizando sonhos e conectando pessoas aos seus lares ideais. 
              Sua confiança é nossa maior conquista.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-primary-foreground/60 hover:text-brand-amber transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-brand-amber transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-brand-amber transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Contato */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-brand-amber flex-shrink-0" />
                <span className="text-primary-foreground/80">(11) 99999-9999</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-brand-amber flex-shrink-0" />
                <span className="text-primary-foreground/80">contato@pedrodetoledo.com.br</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-brand-amber flex-shrink-0 mt-1" />
                <span className="text-primary-foreground/80">
                  Av. Paulista, 1000 - Sala 1201<br />
                  Bela Vista, São Paulo - SP
                </span>
              </div>
            </div>
          </div>

          {/* Serviços */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Serviços</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-brand-amber transition-colors">
                  Compra de Imóveis
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-brand-amber transition-colors">
                  Venda de Imóveis
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-brand-amber transition-colors">
                  Locação
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-brand-amber transition-colors">
                  Avaliação Gratuita
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-brand-amber transition-colors">
                  Consultoria Imobiliária
                </a>
              </li>
            </ul>
          </div>

          {/* Horário */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Horário de Atendimento</h3>
            <div className="space-y-2 text-primary-foreground/80">
              <div>
                <div className="font-medium">Segunda a Sexta</div>
                <div>08:00 às 18:00</div>
              </div>
              <div>
                <div className="font-medium">Sábado</div>
                <div>09:00 às 14:00</div>
              </div>
              <div>
                <div className="font-medium">Domingo</div>
                <div>Sob agendamento</div>
              </div>
            </div>
          </div>
        </div>

        {/* Linha divisória */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-primary-foreground/60 text-sm">
              © 2024 Pedro de Toledo Imóveis. Todos os direitos reservados.
            </div>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-primary-foreground/60 hover:text-brand-amber transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-brand-amber transition-colors">
                Termos de Uso
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;