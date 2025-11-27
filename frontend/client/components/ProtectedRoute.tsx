import React, { ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // While auth is loading, render nothing (could show spinner)
  if (isLoading) return null;

  if (!user) {
    // Redirect unauthenticated users to login page
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
