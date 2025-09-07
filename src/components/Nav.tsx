import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";

export default function Nav() {
  const navigate = useNavigate();
  const { isAdmin, logout } = useAdmin();
  const logoRef = useRef<HTMLAnchorElement | null>(null);

  // Gatilho por teclado: Shift + Alt + A
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.shiftKey && e.altKey && (e.key === "a" || e.key === "A")) {
        navigate("/admin/login");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  // Gatilho por duplo clique no logo
  useEffect(() => {
    const el = logoRef.current;
    if (!el) return;
    const onDbl = (e: MouseEvent) => {
      // impede navegação para home no duplo clique
      e.preventDefault();
      navigate("/admin/login");
    };
    el.addEventListener("dblclick", onDbl);
    return () => el.removeEventListener("dblclick", onDbl);
  }, [navigate]);

  // Pontinho “decorativo” que leva ao login
  const handleSecretClick = () => navigate("/admin/login");

  return (
    <header className="border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Branding + navegação principal */}
        <div className="flex items-center gap-3">
          {/* Pontinho ‘decorativo’ — clique abre /admin/login */}
          <button
            onClick={handleSecretClick}
            aria-hidden="true"
            tabIndex={-1}
            className="w-2 h-2 rounded-full bg-neutral-300 hover:bg-neutral-400 transition-colors"
            title="•"
          />
          <Link
            ref={logoRef}
            to="/"
            className="font-semibold select-none"
            title="FullStack Imóveis"
          >
            FullStack Imóveis
          </Link>

          <nav className="ml-6 hidden sm:flex gap-4 text-sm">
            <Link to="/imoveis">Imóveis</Link>
            <Link to="/sobre">Sobre</Link>
          </nav>
        </div>

        {/* Lado direito (mostra admin somente quando logado) */}
        <div className="flex items-center gap-3">
          {isAdmin ? (
            <>
              <Link
                to="/admin/imoveis"
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                Área Admin
              </Link>
              <button
                onClick={logout}
                className="text-sm underline text-gray-600 hover:text-red-600"
              >
                Sair
              </button>
            </>
          ) : (
            // quando não logado, não exibimos nada chamativo
            <span className="text-xs text-neutral-500 select-none">
              Bem-vindo
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
