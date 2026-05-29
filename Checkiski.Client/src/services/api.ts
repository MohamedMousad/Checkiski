export class ApiService {
  static getBaseUrl(): string {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  }

  static getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  }

  private static async fetchWithTimeout(url: string, options: RequestInit, timeoutMs = 10000): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(id);
      return response;
    } catch (error: any) {
      clearTimeout(id);
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. The server took too long to respond.');
      }
      // Catch network-level errors (TypeError: Failed to fetch)
      throw new Error('Unable to connect to the server. Please check your connection or try again later.');
    }
  }

  static async post<T>(endpoint: string, body: any): Promise<T> {
    const res = await this.fetchWithTimeout(`${this.getBaseUrl()}${endpoint}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => '');
      throw new Error(errorText || `API error: ${res.status}`);
    }

    const text = await res.text();
    if (!text) return {} as T;
    return JSON.parse(text) as T;
  }

  static async get<T>(endpoint: string): Promise<T> {
    const res = await this.fetchWithTimeout(`${this.getBaseUrl()}${endpoint}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => '');
      throw new Error(errorText || `API error: ${res.status}`);
    }

    const text = await res.text();
    if (!text) return {} as T;
    return JSON.parse(text) as T;
  }

  static async put<T>(endpoint: string, body: any): Promise<T> {
    const res = await this.fetchWithTimeout(`${this.getBaseUrl()}${endpoint}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => '');
      throw new Error(errorText || `API error: ${res.status}`);
    }

    const text = await res.text();
    if (!text) return {} as T;
    return JSON.parse(text) as T;
  }
}
