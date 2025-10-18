import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path: string;
}

const Breadcrumbs = () => {
  const location = useLocation();
  
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Sempre adiciona Home
    breadcrumbs.push({ label: 'Início', path: '/' });

    // Mapeia os paths
    const pathMap: Record<string, string> = {
      'imoveis': 'Imóveis',
      'sobre': 'Sobre Mim',
      'admin': 'Administração',
      'login': 'Login',
      'novo': 'Novo Imóvel'
    };

    let currentPath = '';
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      
      // Ignora IDs numéricos/ObjectIds na breadcrumb
      if (/^[0-9a-f]{24}$/i.test(path) || /^\d+$/.test(path)) {
        breadcrumbs.push({ label: 'Detalhes', path: currentPath });
      } else {
        breadcrumbs.push({ 
          label: pathMap[path] || path.charAt(0).toUpperCase() + path.slice(1), 
          path: currentPath 
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  // Não mostra breadcrumb na home
  if (location.pathname === '/') {
    return null;
  }

  return (
    <nav className="bg-white border-b border-gray-200 py-3 px-4">
      <div className="max-w-7xl mx-auto">
        <ol className="flex items-center gap-2 text-sm">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            
            return (
              <li key={crumb.path} className="flex items-center gap-2">
                {index === 0 ? (
                  <Link 
                    to={crumb.path} 
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Home className="h-4 w-4" />
                    <span>{crumb.label}</span>
                  </Link>
                ) : isLast ? (
                  <span className="text-gray-600 font-medium">
                    {crumb.label}
                  </span>
                ) : (
                  <Link 
                    to={crumb.path} 
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
                
                {!isLast && (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;
