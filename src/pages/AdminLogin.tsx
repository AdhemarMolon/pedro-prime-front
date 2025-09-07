// src/pages/AdminLogin.tsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";

export default function AdminLogin() {
  const { login } = useAdmin();
  const nav = useNavigate();
  const loc = useLocation() as any;

  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await login(email, password);
      const to = loc.state?.from?.pathname || "/admin/imoveis";
      nav(to, { replace: true });
    } catch (err: any) {
      setErr(err?.response?.data?.message || "Falha no login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto p-6">
      <h1 className="text-xl mb-4">Login do Admin</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="border w-full p-2"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
        />
        <input
          className="border w-full p-2"
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPass(e.target.value)}
          autoComplete="current-password"
        />
        {error && <p className="text-red-600">{error}</p>}
        <button className="border px-4 py-2" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
