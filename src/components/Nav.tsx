import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import { Menu, X, LogOut } from "lucide-react";

export default function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, logout } = useAdmin();
  const logoRef = useRef<HTMLAnchorElement | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.shiftKey && e.altKey && (e.key === "a" || e.key === "A")) {
        navigate("/admin/login");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  useEffect(() => {
    const el = logoRef.current;
    if (!el) return;
    const onDbl = (e: MouseEvent) => {
      e.preventDefault();
      navigate("/admin/login");
    };
    el.addEventListener("dblclick", onDbl);
    return () => el.removeEventListener("dblclick", onDbl);
  }, [navigate]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: "Imoveis", href: "/imoveis" },
    { label: "Sobre", href: "/sobre" },
  ];

  const isActive = (href: string) =>
    location.pathname === href || location.pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-card/90 backdrop-blur-md supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          <Link
            ref={logoRef}
            to="/"
            className="group flex items-center gap-2.5 select-none"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:scale-105">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M12 3l8 6h-2v9h-4v-6H10v6H6v-9H4l8-6z" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-bold tracking-tight text-foreground">
                Pedro de Toledo
              </span>
              <span className="block text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                Corretor de Imoveis
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <>
                <Link
                  to="/admin/imoveis"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive("/admin")
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  }`}
                >
                  Painel
                </Link>
                <button
                  onClick={logout}
                  className="ml-2 flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-red-50 transition-colors"
                  title="Sair"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sair
                </button>
              </>
            )}
          </nav>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex items-center justify-center h-10 w-10 rounded-lg text-muted-foreground hover:bg-secondary transition-colors"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border/60 bg-card animate-slide-down">
          <nav className="mx-auto max-w-6xl px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <>
                <Link
                  to="/admin/imoveis"
                  className="block px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                >
                  Painel Admin
                </Link>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                >
                  Sair
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}