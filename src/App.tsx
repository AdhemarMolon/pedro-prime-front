import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Imovel from "./pages/Imovel";
import AdminLogin from "./pages/AdminLogin";
import AdminImoveis from "./pages/AdminImoveis";
import AdminImovelForm from "./pages/AdminImovelForm";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Nav />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/imovel/:id" element={<Imovel />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/imoveis" element={<AdminImoveis />} />
              <Route path="/admin/imoveis/novo" element={<AdminImovelForm />} />
              <Route path="/admin/imoveis/:id/editar" element={<AdminImovelForm />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
