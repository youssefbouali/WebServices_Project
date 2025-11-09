import { ReactNode, useEffect, useState } from "react";
import {
  AuthContext,
  AuthContextType,
  clearAuth,
  getStoredUser,
  getToken,
  setStoredUser,
  setToken,
} from "@/lib/auth";
import {
  loginProfile,
  registerProfile,
  getCurrentProfile,
  Profile,
} from "@/lib/api/profiles";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<Profile | null>(getStoredUser());
  const [token, setTokenState] = useState<string | null>(getToken());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Try to restore user on mount if token exists
  useEffect(() => {
    if (token && !user) {
      refreshUser();
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await loginProfile({ email, password });
      setToken(response.token);
      setTokenState(response.token);
      setStoredUser(response.profile);
      setUser(response.profile);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    email: string;
    firstName: string;
    lastName: string;
    role: "PATIENT" | "DOCTOR" | "ADMIN";
    phone: string;
    maladieChronique?: string;
    password: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await registerProfile({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        phone: data.phone,
        maladieChronique: data.maladieChronique,
        passwordHash: data.password,
      });
      setToken(response.token);
      setTokenState(response.token);
      setStoredUser(response.profile);
      setUser(response.profile);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Registration failed";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuth();
    setUser(null);
    setTokenState(null);
    setError(null);
  };

  const refreshUser = async () => {
    setIsLoading(true);
    try {
      const profile = await getCurrentProfile();
      setStoredUser(profile);
      setUser(profile);
      setError(null);
    } catch (err) {
      // Token might be invalid, clear auth
      clearAuth();
      setUser(null);
      setTokenState(null);
      const message =
        err instanceof Error ? err.message : "Failed to refresh user";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
