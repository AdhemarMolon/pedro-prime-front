// src/context/AdminContext.tsx
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ImoveisAPI } from "../lib/api";

type AdminContextType = {
  isAuth: boolean;
  isAdmin: boolean; // Alias para isAuth
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("admin_token") : null
  );

  const login = useCallback(async (email: string, password: string) => {
    const { token } = await ImoveisAPI.adminLogin(email, password);
    localStorage.setItem("admin_token", token);
    setToken(token);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("admin_token");
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({ isAuth: !!token, isAdmin: !!token, login, logout }),
    [token, login, logout]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin deve estar dentro de <AdminProvider>");
  return ctx;
}

/** Guard para rotas protegidas do /admin */
export function RequireAdmin({ redirectTo = "/admin/login" }: { redirectTo?: string }) {
  const { isAuth } = useAdmin();
  const loc = useLocation();
  if (!isAuth) return <Navigate to={redirectTo} replace state={{ from: loc }} />;
  return <Outlet />;
}
