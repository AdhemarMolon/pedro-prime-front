// src/pages/AdminLogin.tsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginAdmin } from "@/lib/api";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const navigate = useNavigate();
  const loc = useLocation() as any;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setLoading(true);
    try {
      const { token } = await loginAdmin(email.trim(), password);
      localStorage.setItem("admin_token", token);
      const to = loc?.state?.from || "/admin";
      navigate(to, { replace: true });
    } catch (e: any) {
      setErro(e?.message ?? "Falha no login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Login do Admin</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <input
          className="border px-3 py-2"
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
        />
        <input
          className="border px-3 py-2"
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPass(e.target.value)}
          autoComplete="current-password"
        />
        {erro && <p className="text-red-600">{erro}</p>}
        <button className="border px-4 py-2" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
