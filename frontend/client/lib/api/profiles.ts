import { API_BASE_URLS, apiFetch } from "./config";

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
  passwordHash: string;
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
  return apiFetch<RegisterResponse>(
    `${API_BASE_URLS.PROFILES}/profiles/register`,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
}

/**
 * Login with email and password
 */
export async function loginProfile(data: LoginRequest): Promise<LoginResponse> {
  return apiFetch<LoginResponse>(`${API_BASE_URLS.PROFILES}/profiles/login`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Get current profile (requires auth token)
 */
export async function getCurrentProfile(): Promise<Profile> {
  return apiFetch<Profile>(`${API_BASE_URLS.PROFILES}/profiles/me`, {
    method: "GET",
  });
}

/**
 * Update current profile
 */
export async function updateCurrentProfile(
  data: Partial<Profile>,
): Promise<Profile> {
  return apiFetch<Profile>(`${API_BASE_URLS.PROFILES}/profiles/me`, {
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
  return apiFetch<{ message: string }>(
    `${API_BASE_URLS.PROFILES}/profiles/me/password`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
  );
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
  const url = query
    ? `${API_BASE_URLS.PROFILES}/profiles?${query}`
    : `${API_BASE_URLS.PROFILES}/profiles`;

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
  return apiFetch<Profile[]>(
    `${API_BASE_URLS.PROFILES}/profiles/role/${role}`,
    {
      method: "GET",
    },
  );
}

/**
 * Get profile by ID
 */
export async function getProfileById(id: string): Promise<Profile> {
  return apiFetch<Profile>(`${API_BASE_URLS.PROFILES}/profiles/${id}`, {
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
  return apiFetch<Profile>(`${API_BASE_URLS.PROFILES}/profiles/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * Delete profile by ID
 */
export async function deleteProfileById(id: string): Promise<void> {
  return apiFetch<void>(`${API_BASE_URLS.PROFILES}/profiles/${id}`, {
    method: "DELETE",
  });
}

/**
 * Get profile statistics
 */
export async function getProfileStatistics(): Promise<ProfileStatistics> {
  return apiFetch<ProfileStatistics>(
    `${API_BASE_URLS.PROFILES}/profiles/statistics`,
    {
      method: "GET",
    },
  );
}
