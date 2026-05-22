import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("balinook_auth") === "verified";

    if (!isAuthenticated && location.pathname !== "/login") {
      navigate("/login", { replace: true });
    }
  }, [navigate, location]);

  const isAuthenticated = sessionStorage.getItem("balinook_auth") === "verified";

  if (!isAuthenticated && location.pathname !== "/login") {
    return null;
  }

  return <>{children}</>;
}
