import { Code, Database, Palette, Smartphone, Zap, Globe } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';

const Sobre = () => {
  const tecnologias = {
    frontend: [
      'React 18',
      'TypeScript',
      'Vite',
      'Tailwind CSS',
      'React Router',
      'Shadcn/ui',
      'Lucide React'
    ],
    backend: [
      'Neon PostgreSQL',
      'Prisma ORM',
      'Vercel'
    ]
  };

  const funcionalidades = [
    'Hero section com busca',
    'Filtros avançados',
    'Grid de imóveis com paginação',
    'Sistema de 18 tags predefinidas',
    'Galeria de imagens',
    'SEO completo (Open Graph, Twitter Cards)',
    'Login administrativo com JWT',
    'Painel para criar/editar imóveis'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl mb-6">
            <Globe className="h-10 w-10 text-blue-200" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Pedro de Toledo Imóveis
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Site imobiliário moderno e responsivo desenvolvido com React, TypeScript, Tailwind CSS e PostgreSQL (Neon).
          </p>
        </div>
      </section>

      {/* Tecnologias */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tecnologias
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Frontend */}
            <Card className="border-none shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 rounded-lg p-3">
                    <Code className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Frontend</h3>
                </div>
                <ul className="space-y-2">
                  {tecnologias.frontend.map((tech, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-700">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      {tech}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Backend & Database */}
            <Card className="border-none shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-indigo-100 rounded-lg p-3">
                    <Database className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Backend & Database</h3>
                </div>
                <ul className="space-y-2">
                  {tecnologias.backend.map((tech, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-700">
                      <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                      {tech}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-gray-500 mt-4">
                  Região: São Paulo (sa-east-1)
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Design System */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Design System
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="border-none shadow-lg text-center">
              <CardContent className="p-6">
                <Palette className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-2">Fonte</h3>
                <p className="text-gray-600">Inter (Google Fonts)</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg text-center">
              <CardContent className="p-6">
                <div className="flex justify-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-[#1f3fae]" title="Brand Blue"></div>
                  <div className="w-8 h-8 rounded-full bg-[#f59e0b]" title="Brand Amber"></div>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Cores</h3>
                <p className="text-sm text-gray-600">Azul (#1f3fae) + Âmbar (#f59e0b)</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg text-center">
              <CardContent className="p-6">
                <Smartphone className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-2">Estilo</h3>
                <p className="text-gray-600">Clean, profissional, responsivo</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Funcionalidades
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {funcionalidades.map((funcionalidade, index) => (
              <div 
                key={index} 
                className="flex items-start gap-3 bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
              >
                <Zap className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-800">{funcionalidade}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 max-w-3xl mx-auto bg-blue-50 rounded-lg p-6 border border-blue-100">
            <h3 className="font-bold text-gray-900 mb-3 text-center">Áreas do Site</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Área Pública:</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Busca e filtros avançados</li>
                  <li>• Detalhes completos de imóveis</li>
                  <li>• Compartilhamento social</li>
                  <li>• Breadcrumbs e SEO</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Área Administrativa:</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Autenticação com JWT</li>
                  <li>• CRUD completo de imóveis</li>
                  <li>• Seletor visual de tags</li>
                  <li>• Upload de múltiplas imagens</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <section className="py-12 px-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-lg text-blue-100 mb-2">
            Interface completa para busca de imóveis com sistema de tags e painel administrativo
          </p>
          <p className="text-sm text-blue-300">
            Deploy automático via Vercel • Banco de dados serverless no Neon PostgreSQL
          </p>
        </div>
      </section>
    </div>
  );
};

export default Sobre;
