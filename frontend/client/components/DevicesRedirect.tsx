import React from "react";
import { useAuth } from "@/lib/auth";
import { Navigate, useLocation } from "react-router-dom";

export default function DevicesRedirect() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null;

  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (user.role === "PATIENT") {
    return <Navigate to="/patient/devices" replace />;
  }

  if (user.role === "DOCTOR") {
    return <Navigate to="/doctor/devices" replace />;
  }

  // Admin or other roles: go to admin devices
  return <Navigate to="/devices" replace />;
}
