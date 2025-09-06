import { Link, useLocation } from 'react-router-dom';
import { Building2, Home, Settings, LogIn } from 'lucide-react';

const Nav = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-soft">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-xl font-bold text-primary hover:opacity-80 transition-opacity"
        >
          <Building2 className="h-8 w-8 text-brand-blue" />
          Pedro de Toledo Imóveis
        </Link>

        <div className="flex items-center gap-6">
          {!isAdmin ? (
            // Links públicos
            <>
              <Link 
                to="/" 
                className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium"
              >
                <Home className="h-4 w-4" />
                Início
              </Link>
              <Link 
                to="/admin/login" 
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <LogIn className="h-4 w-4" />
                Admin
              </Link>
            </>
          ) : (
            // Links admin
            <>
              <Link 
                to="/admin/imoveis" 
                className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium"
              >
                <Building2 className="h-4 w-4" />
                Imóveis
              </Link>
              <Link 
                to="/" 
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Ver Site
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;