import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Imovel from "./pages/Imovel";
import Sobre from "./pages/Sobre";
import AdminLogin from "./pages/AdminLogin";
import AdminImoveis from "./pages/AdminImoveis";
import AdminImovelForm from "./pages/AdminImovelForm";
import NotFound from "./pages/NotFound";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import Breadcrumbs from "./components/Breadcrumbs";
import { RequireAdmin } from "./context/AdminContext";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <Breadcrumbs />
      <div className="flex-1">
        <Routes>
          {/* Público */}
          <Route path="/" element={<Home />} />
          <Route path="/imoveis" element={<Home />} />
          <Route path="/imoveis/:id" element={<Imovel />} />
          <Route path="/sobre" element={<Sobre />} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<RequireAdmin redirectTo="/admin/login" />}>
            <Route index element={<Navigate to="imoveis" replace />} />
            <Route path="imoveis" element={<AdminImoveis />} />
            <Route path="imoveis/novo" element={<AdminImovelForm />} />
            <Route path="imoveis/:id" element={<AdminImovelForm />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
