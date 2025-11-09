import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Allow access to all pages without login for testing
  // Remove this function to re-enable authentication checks
  return <>{children}</>;
}
