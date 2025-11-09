/**
 * API Configuration for HealthTrack backend services
 */

export const API_BASE_URLS = {
  PROFILES: import.meta.env.VITE_PROFILES ?? "http://localhost:3000",
  DEVICES: import.meta.env.VITE_DEVICES ?? "http://localhost:8000",
  APPOINTMENTS: import.meta.env.VITE_APPOINTMENTS ?? "http://localhost:8082",
  TREATMENTS: import.meta.env.VITE_TREATMENTS ?? "http://localhost:8002",
};

export interface ApiError {
  message: string;
  status?: number;
  details?: unknown;
}

/**
 * Fetch helper with error handling and token management
 */
export async function apiFetch<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem("healthtrack_token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `HTTP ${response.status}`,
      }));
      const error: ApiError = {
        message: errorData.message || `HTTP ${response.status}`,
        status: response.status,
        details: errorData,
      };
      throw error;
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw {
      message: error instanceof Error ? error.message : "Unknown error",
      details: error,
    } as ApiError;
  }
}
