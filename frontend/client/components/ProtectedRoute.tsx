import { ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ("PATIENT" | "DOCTOR" | "ADMIN")[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // While auth is loading, render nothing (could show spinner)
  if (isLoading) return null;

  if (!user) {
    // Redirect unauthenticated users to login page
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Check role-based access
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to dashboard if user doesn't have required role
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
