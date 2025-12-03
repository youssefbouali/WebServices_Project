/**
 * API Configuration for HealthTrack backend services
 */

export const API_BASE_URLS = {
  PROFILES:
    (import.meta.env as any).VITE_PROFILES_API_URL || import.meta.env.VITE_PROFILES ||
    "http://localhost:3000/api/profiles",
  DEVICES: import.meta.env.VITE_DEVICES || "http://localhost:8000",
  APPOINTMENTS: import.meta.env.VITE_APPOINTMENTS || "http://localhost:8082",
  TREATMENTS:
    (import.meta.env as any).VITE_TREATMENTS_API_URL || import.meta.env.VITE_TREATMENTS ||
    "http://localhost:8002",
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
    console.log(`🔄 API Call: ${url}`, options); // LOG pour debug
    
    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log(`📡 API Response: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: `HTTP ${response.status}` };
      }
      
      const error: ApiError = {
        message: errorData.message || `HTTP ${response.status}`,
        status: response.status,
        details: errorData,
      };
      throw error;
    }

    // Contenu vide ou 204 → pas de JSON à parser
    if (response.status === 204) {
      return {} as T;
    }

    const text = await response.text();
    if (!text || text.trim().length === 0) {
      return {} as T;
    }
    try {
      const data = JSON.parse(text) as T;
      console.log(`✅ API Success:`, data);
      return data;
    } catch {
      // Réponses non-JSON (texte) → renvoyer brut
      console.log(`✅ API Success (raw):`, text);
      return text as unknown as T;
    }
    
  } catch (error) {
    console.error(`❌ API Error:`, error); // LOG pour debug
    if (error instanceof Error) {
      throw {
        message: error.message,
        details: error,
      } as ApiError;
    }
    throw error;
  }
}
