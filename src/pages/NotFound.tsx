import { Link } from "react-router-dom";
import { Home, Search, ArrowLeft, RefreshCw } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="relative inline-block">
            <span className="text-8xl font-black text-primary/10 select-none">404</span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-primary rounded-full p-4 shadow-lg">
                <Search className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Página não encontrada</h1>
          <p className="text-muted-foreground max-w-sm mx-auto">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>

        <Card>
          <CardContent className="p-6 space-y-3">
            <Button asChild className="w-full" size="lg">
              <Link to="/"><Home className="h-4 w-4 mr-2" />Página inicial</Link>
            </Button>
            <Button variant="outline" className="w-full" onClick={() => window.history.back()} size="lg">
              <ArrowLeft className="h-4 w-4 mr-2" />Voltar
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => window.location.reload()} size="lg">
              <RefreshCw className="h-4 w-4 mr-2" />Recarregar
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}