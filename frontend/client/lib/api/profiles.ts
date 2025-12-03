import { API_BASE_URLS, apiFetch } from "./config";

export interface Profile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "PATIENT" | "DOCTOR" | "ADMIN";
  phone?: string;
  maladieChronique?: string;
  isActive?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  role: "PATIENT" | "DOCTOR" | "ADMIN";
  phone: string;
  maladieChronique?: string;
  password: string;
}

export async function loginProfile(
  data: LoginRequest,
): Promise<{ token: string; profile: Profile }> {
  return apiFetch<{ token: string; profile: Profile }>(
    `${API_BASE_URLS.PROFILES}/auth/login`,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
}

export async function registerProfile(
  data: RegisterRequest,
): Promise<{ token?: string; profile: Profile }> {
  return apiFetch<{ token?: string; profile: Profile }>(
    `${API_BASE_URLS.PROFILES}/auth/register`,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
}

export async function getCurrentProfile(): Promise<Profile> {
  return apiFetch<Profile>(`${API_BASE_URLS.PROFILES}/me`, {
    method: "GET",
  });
}

export async function listProfiles(
  params?: { role?: Profile["role"] },
): Promise<Profile[]> {
  const query = new URLSearchParams();
  if (params?.role) query.append("role", params.role);
  const url = query.toString()
    ? `${API_BASE_URLS.PROFILES}?${query}`
    : `${API_BASE_URLS.PROFILES}`;
  return apiFetch<Profile[]>(url, { method: "GET" });
}

export async function listProfilesByRole(role: Profile["role"]): Promise<Profile[]> {
  return apiFetch<Profile[]>(`${API_BASE_URLS.PROFILES}/role/${role}`, {
    method: "GET",
  });
}

export async function getProfileById(id: string): Promise<Profile> {
  return apiFetch<Profile>(`${API_BASE_URLS.PROFILES}/${id}`, {
    method: "GET",
  });
}

export async function updateProfileById(
  id: string,
  data: Partial<Profile> & { password?: string; isActive?: boolean },
): Promise<Profile> {
  return apiFetch<Profile>(`${API_BASE_URLS.PROFILES}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteProfileById(id: string): Promise<void> {
  return apiFetch<void>(`${API_BASE_URLS.PROFILES}/${id}`, {
    method: "DELETE",
  });
}
