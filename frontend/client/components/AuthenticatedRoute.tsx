import { ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { Navigate } from "react-router-dom";

interface AuthenticatedRouteProps {
  children: ReactNode;
}

export function AuthenticatedRoute({ children }: AuthenticatedRouteProps) {
  const { user, isLoading } = useAuth();

  // While auth is loading, render nothing (could show spinner)
  if (isLoading) return null;

  // If user is logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // If not logged in, show the public page (login/register)
  return <>{children}</>;
}
