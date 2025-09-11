// src/pages/Nav.tsx
import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";

export default function Nav() {
  const navigate = useNavigate();
  const { isAdmin, logout } = useAdmin();
  const logoRef = useRef<HTMLAnchorElement | null>(null);

  // Atalho de teclado: Shift + Alt + A
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.shiftKey && e.altKey && (e.key === "a" || e.key === "A")) {
        navigate("/admin/login");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  // Duplo clique no logo → /admin/login
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

  const handleSecretClick = () => navigate("/admin/login");

  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-6xl px-4">
        {/* Grid com 3 colunas para manter o centro perfeito */}
        <div className="grid h-16 grid-cols-3 items-center">
          {/* Coluna esquerda: casinha + pontinho secreto */}
          <div className="flex items-center gap-3 justify-start">
            {/* Ícone de casinha (imobiliária) */}
            <span
              aria-hidden="true"
              className="hidden sm:inline-flex h-8 w-8 items-center justify-center rounded-lg border bg-white shadow-sm"
              title="Imobiliária"
            >
              {/* SVG simples de casa (roofline) */}
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 10.5L12 3l9 7.5" />
                <path d="M5 10v10h14V10" />
                <path d="M9 20v-6h6v6" />
              </svg>
            </span>

            {/* Pontinho “decorativo” (atalho escondido) */}
            <button
              onClick={handleSecretClick}
              aria-hidden="true"
              tabIndex={-1}
              className="h-2 w-2 rounded-full bg-neutral-300 transition-colors hover:bg-neutral-400"
              title="•"
            />
          </div>

          {/* Coluna central (branding + navegação) */}
          <div className="flex items-center justify-center">
            <Link
              ref={logoRef}
              to="/"
              className="group select-none font-semibold tracking-tight text-neutral-800 hover:opacity-90 transition-opacity text-sm sm:text-base flex items-center gap-2"
              title="Pedro de Toledo Corretor"
            >
              {/* Mini telhadinho integrado ao logotipo (reforço visual) */}
              <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-blue-600 transition-transform group-hover:-translate-y-0.5"
              fill="currentColor"
              >
              <path d="M12 3l8 6h-2v9h-4v-6H10v6H6v-9H4l8-6z" />
              </svg>
              <span className="font-bold">Pedro de Toledo Corretor</span>
            </Link>

            <nav className="ml-6 hidden sm:flex gap-6 text-sm text-neutral-600">
              <Link className="hover:text-neutral-900" to="/imoveis">
                Imóveis
              </Link>
              <a
                className="hover:text-neutral-900"
                href="https://pedro-toled0.github.io/imoveis/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Sobre
              </a>
            </nav>
          </div>

          {/* Coluna direita (espaço do corretor + ações/admin) */}
          <div className="flex items-center justify-end gap-3">


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
              // Mantém altura/estrutura sem poluir a UI
              <span className="text-xs text-transparent select-none">.</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
