import { createContext, useContext } from "react";
import {
  Profile,
  loginProfile,
  registerProfile,
  getCurrentProfile,
} from "./api/profiles";

export interface AuthContextType {
  user: Profile | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    firstName: string;
    lastName: string;
    role: "PATIENT" | "DOCTOR" | "ADMIN";
    phone: string;
    maladieChronique?: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!localStorage.getItem("healthtrack_token");
}

/**
 * Get stored token
 */
export function getToken(): string | null {
  return localStorage.getItem("healthtrack_token");
}

/**
 * Store token
 */
export function setToken(token: string): void {
  localStorage.setItem("healthtrack_token", token);
}

/**
 * Clear token and user
 */
export function clearAuth(): void {
  localStorage.removeItem("healthtrack_token");
  localStorage.removeItem("healthtrack_user");
}

/**
 * Get stored user
 */
export function getStoredUser(): Profile | null {
  const user = localStorage.getItem("healthtrack_user");
  return user ? JSON.parse(user) : null;
}

/**
 * Store user
 */
export function setStoredUser(user: Profile): void {
  localStorage.setItem("healthtrack_user", JSON.stringify(user));
}
