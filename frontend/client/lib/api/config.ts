/**
 * API Configuration for HealthTrack backend services
 */

export const API_BASE_URLS = {
  PROFILES: import.meta.env.VITE_PROFILES || "http://localhost:3000/api",
  DEVICES: import.meta.env.VITE_DEVICES || "http://localhost:8000/api", 
  APPOINTMENTS: import.meta.env.VITE_APPOINTMENTS || "http://localhost:8082/api",
  TREATMENTS: import.meta.env.VITE_TREATMENTS || "http://localhost:8002",
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

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    const contentType = response.headers.get("content-type") || "";
    const contentLength = response.headers.get("content-length");

    if (!contentType.includes("application/json")) {
      const text = await response.text();
      try {
        const parsed = text ? JSON.parse(text) : {};
        console.log(`✅ API Success:`, parsed);
        return parsed as T;
      } catch {
        console.log(`✅ API Success (non-JSON):`, text);
        return {} as T;
      }
    }

    if (contentLength === "0") {
      console.log(`✅ API Success (empty body)`);
      return {} as T;
    }

    try {
      const data = await response.json();
      console.log(`✅ API Success:`, data);
      return data;
    } catch {
      // Gracefully handle empty/invalid JSON
      console.log(`✅ API Success (no parsable JSON)`);
      return {} as T;
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