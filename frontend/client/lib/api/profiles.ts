import { API_BASE_URLS, apiFetch } from "./config";

export type ProfileRole = "ADMIN" | "DOCTOR" | "PATIENT";

export interface Profile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: ProfileRole;
  phone?: string;
  maladieChronique?: string;
  isActive?: boolean;
  dateNaissance?: string;
  telephone?: string;
  adresse?: string;
  groupe_sanguin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function listProfiles(filter?: { role?: ProfileRole }): Promise<Profile[]> {
  if (filter?.role === "PATIENT") {
    try {
      return await apiFetch<Profile[]>(
        `${API_BASE_URLS.PROFILES}/profiles/public/patients`,
        { method: "GET" },
      );
    } catch (_) {
      return apiFetch<Profile[]>(
        `${API_BASE_URLS.PROFILES}/profiles/role/patients`,
        { method: "GET" },
      );
    }
  }
  if (filter?.role) {
    return apiFetch<Profile[]>(`${API_BASE_URLS.PROFILES}/profiles/role/${filter.role}`, {
      method: "GET",
    });
  }
  return apiFetch<Profile[]>(`${API_BASE_URLS.PROFILES}/profiles`, {
    method: "GET",
  });
}

export async function getProfileById(id: string): Promise<Profile> {
  return apiFetch<Profile>(`${API_BASE_URLS.PROFILES}/profiles/${id}`, {
    method: "GET",
  });
}

export async function getCurrentProfile(): Promise<Profile> {
  return apiFetch<Profile>(`${API_BASE_URLS.PROFILES}/profiles/me`, {
    method: "GET",
  });
}

export async function registerProfile(data: {
  email: string;
  firstName: string;
  lastName: string;
  role: ProfileRole;
  phone: string;
  maladieChronique?: string;
  password: string;
}): Promise<{ token: string; profile: Profile }> {
  return apiFetch<{ token: string; profile: Profile }>(
    `${API_BASE_URLS.PROFILES}/profiles/auth/register`,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
}

export async function loginProfile(data: {
  email: string;
  password: string;
}): Promise<{ token: string; profile: Profile }> {
  return apiFetch<{ token: string; profile: Profile }>(
    `${API_BASE_URLS.PROFILES}/profiles/auth/login`,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
}

export async function deleteProfileById(id: string): Promise<void> {
  return apiFetch<void>(`${API_BASE_URLS.PROFILES}/profiles/${id}`, {
    method: "DELETE",
  });
}

export async function updateProfileById(
  id: string,
  data: Partial<Pick<Profile, "email" | "firstName" | "lastName" | "role" | "phone" | "maladieChronique" | "isActive">>,
): Promise<Profile> {
  return apiFetch<Profile>(`${API_BASE_URLS.PROFILES}/profiles/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
