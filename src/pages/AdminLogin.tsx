import { useState } from "react";
import { useLocation } from "react-router-dom";
import { LogIn, Building2, Lock, Mail, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAdmin } from "@/context/AdminContext";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const location = useLocation() as { state?: { from?: string } };
  const { login } = useAdmin();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
      const to = location?.state?.from || "/admin";
      window.location.href = to;
    } catch (error) {
      setErro((error as Error)?.message ?? "Erro ao fazer login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-2xl mb-4">
            <Building2 className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Pedro de Toledo</h1>
          <p className="text-sm text-muted-foreground mt-1">Área Administrativa</p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-center">Bem-vindo de volta</CardTitle>
            <CardDescription className="text-center">
              Entre com suas credenciais para acessar o painel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />E-mail
                </label>
                <Input
                  type="email"
                  placeholder="seu-email@exemplo.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="username"
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />Senha
                </label>
                <Input
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  disabled={loading}
                />
              </div>

              {erro && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{erro}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Entrando...</>
                ) : (
                  <><LogIn className="mr-2 h-4 w-4" />Entrar</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          &copy; {new Date().getFullYear()} Pedro de Toledo Imóveis
        </p>
      </div>
    </div>
  );
}