import { API_BASE_URLS, apiFetch } from "./config";
const BASE = `${API_BASE_URLS.PROFILES}/api/profiles`;

export interface Profile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "PATIENT" | "DOCTOR" | "ADMIN";
  phone: string;
  maladieChronique?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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

export interface RegisterResponse {
  profile: Profile;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  profile: Profile;
  token: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ProfileStatistics {
  totalProfiles: number;
  activeProfiles: number;
  rolesCount: {
    PATIENT: number;
    DOCTOR: number;
    ADMIN: number;
  };
}

/**
 * Register a new profile
 */
export async function registerProfile(
  data: RegisterRequest,
): Promise<RegisterResponse> {
  return apiFetch<RegisterResponse>(`${BASE}/auth/register`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Login with email and password
 */
export async function loginProfile(data: LoginRequest): Promise<LoginResponse> {
  return apiFetch<LoginResponse>(`${BASE}/auth/login`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Get current profile (requires auth token)
 */
export async function getCurrentProfile(): Promise<Profile> {
  return apiFetch<Profile>(`${BASE}/me`, {
    method: "GET",
  });
}

/**
 * Update current profile
 */
export async function updateCurrentProfile(
  data: Partial<Profile>,
): Promise<Profile> {
  return apiFetch<Profile>(`${BASE}/me`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * Change password
 */
export async function changePassword(
  data: ChangePasswordRequest,
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`${BASE}/me/password`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * List all profiles with optional filters
 */
export async function listProfiles(params?: {
  role?: "PATIENT" | "DOCTOR" | "ADMIN";
  isActive?: boolean;
}): Promise<Profile[]> {
  const queryString = new URLSearchParams();
  if (params?.role) queryString.append("role", params.role);
  if (params?.isActive !== undefined)
    queryString.append("isActive", params.isActive.toString());

  const query = queryString.toString();
  const url = query ? `${BASE}?${query}` : `${BASE}`;

  return apiFetch<Profile[]>(url, {
    method: "GET",
  });
}

/**
 * List profiles by role
 */
export async function listProfilesByRole(
  role: "PATIENT" | "DOCTOR" | "ADMIN",
): Promise<Profile[]> {
  return apiFetch<Profile[]>(`${BASE}?role=${encodeURIComponent(role)}`, {
    method: "GET",
  });
}

/**
 * Get profile by ID
 */
export async function getProfileById(id: string): Promise<Profile> {
  return apiFetch<Profile>(`${BASE}/${id}`, {
    method: "GET",
  });
}

/**
 * Update profile by ID
 */
export async function updateProfileById(
  id: string,
  data: Partial<Profile>,
): Promise<Profile> {
  return apiFetch<Profile>(`${BASE}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * Delete profile by ID
 */
export async function deleteProfileById(id: string): Promise<void> {
  return apiFetch<void>(`${BASE}/${id}`, {
    method: "DELETE",
  });
}

/**
 * Get profile statistics
 */
export async function getProfileStatistics(): Promise<ProfileStatistics> {
  return apiFetch<ProfileStatistics>(`${BASE}/statistics`, {
    method: "GET",
  });
}
