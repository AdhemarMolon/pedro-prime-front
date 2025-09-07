import { Link } from "react-router-dom";
import { Building2, Phone, Mail, MapPin, Facebook, Instagram, Linkedin, MessageCircle } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleWhatsAppClick = () => {
    const phoneNumber = '5511999999999';
    const message = encodeURIComponent('Olá! Gostaria de mais informações sobre os imóveis.');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const navigation = {
    main: [
      { name: 'Início', href: '/' },
      { name: 'Imóveis', href: '/imoveis' },
      { name: 'Sobre Nós', href: '/sobre' },
      { name: 'Contato', href: '/contato' },
    ],
    services: [
      { name: 'Venda de Imóveis', href: '/servicos/venda' },
      { name: 'Locação', href: '/servicos/locacao' },
      { name: 'Avaliação', href: '/servicos/avaliacao' },
      { name: 'Consultoria', href: '/servicos/consultoria' },
    ],
    legal: [
      { name: 'Política de Privacidade', href: '/privacidade' },
      { name: 'Termos de Uso', href: '/termos' },
      { name: 'LGPD', href: '/lgpd' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#', color: 'hover:text-blue-600' },
    { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:text-pink-600' },
    { name: 'LinkedIn', icon: Linkedin, href: '#', color: 'hover:text-blue-700' },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-amber-400" />
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-amber-400 bg-clip-text text-transparent">
                FullStack Imóveis
              </h3>
            </div>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Há mais de 15 anos realizando sonhos e conectando pessoas aos seus lares ideais. 
              Sua confiança é nosso maior patrimônio.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Phone className="h-4 w-4 text-amber-400" />
                <span>(11) 99999-9999</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Mail className="h-4 w-4 text-blue-400" />
                <span>contato@fullstackimoveis.com.br</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-gray-300">
                <MapPin className="h-4 w-4 text-red-400 mt-0.5" />
                <span>Rua dos Sonhos, 123<br />Centro - São Paulo/SP</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-400" />
              Navegação
            </h4>
            <ul className="space-y-2">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-gray-300 hover:text-amber-400 text-sm transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-4">Nossos Serviços</h4>
            <ul className="space-y-2">
              {navigation.services.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-gray-300 hover:text-blue-400 text-sm transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA & Social */}
          <div>
            <h4 className="font-semibold text-white mb-4">Fale Conosco</h4>
            <button
              onClick={handleWhatsAppClick}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 shadow-lg flex items-center gap-2 mb-6"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </button>

            <div>
              <h5 className="font-medium text-white mb-3">Siga-nos</h5>
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className={`text-gray-400 ${social.color} transition-colors duration-200 hover:scale-110`}
                      aria-label={social.name}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-sm text-gray-400">
              © {currentYear} FullStack Imóveis. Todos os direitos reservados.
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap gap-4">
              {navigation.legal.map((item, index) => (
                <span key={item.name} className="flex items-center gap-4">
                  <Link
                    to={item.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                  {index < navigation.legal.length - 1 && (
                    <span className="text-gray-600">•</span>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Badge */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-amber-500/10 border border-blue-500/20 rounded-full px-4 py-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-xs text-gray-300">
                CRECI-SP 12345 • Licenciado pelo CRECI
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}