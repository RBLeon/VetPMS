// Base API client for the VetPMS backend
import { useAuth } from "../context/AuthContext";
import { useTenant } from "../context/TenantContext";
import { ApiClientInterface, ApiError } from "./types";

interface ApiOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

class ApiClient implements ApiClientInterface {
  private baseUrl: string;

  constructor(baseUrl: string = "/api") {
    this.baseUrl = baseUrl;
  }

  // Helper method to build headers including auth and tenant context
  async getHeaders(
    additionalHeaders: Record<string, string> = {}
  ): Promise<Record<string, string>> {
    // In a real app, this would get the actual token
    const token = localStorage.getItem("vc_token") || "";

    // Get current tenant from context (this is mock implementation)
    let tenantId = "";
    try {
      const storedTenant = localStorage.getItem("vc_tenant");
      if (storedTenant) {
        tenantId = JSON.parse(storedTenant).id;
      }
    } catch (error) {
      console.error("Failed to parse tenant", error);
    }

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-Tenant-ID": tenantId,
      ...additionalHeaders,
    };
  }

  // Generic request method
  async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { method = "GET", body, headers = {} } = options;

    const allHeaders = await this.getHeaders(headers);

    const config: RequestInit = {
      method,
      headers: allHeaders,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, config);

    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({}))) as ApiError;
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    // Check if the response is empty
    const text = await response.text();
    return text ? JSON.parse(text) : ({} as T);
  }

  // Convenience methods for common HTTP verbs
  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { headers });
  }

  async post<T>(
    endpoint: string,
    body: unknown,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "POST", body, headers });
  }

  async put<T>(
    endpoint: string,
    body: unknown,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "PUT", body, headers });
  }

  async patch<T>(
    endpoint: string,
    body: unknown,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "PATCH", body, headers });
  }

  async delete<T>(
    endpoint: string,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE", headers });
  }
}

// Create and export singleton instance
export const api = new ApiClient();

// Hook for using API with authentication and tenant context
export function useApi() {
  const { isAuthenticated, backendType } = useAuth();
  const { currentTenant } = useTenant();

  return {
    api,
    isAuthenticated,
    backendType,
    currentTenant,
  };
}
