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

  static async post<T>(endpoint: string, body: any): Promise<T> {
    const res = await fetch(`${this.getBaseUrl()}${endpoint}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `API error: ${res.status}`);
    }

    return res.json() as Promise<T>;
  }

  static async get<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${this.getBaseUrl()}${endpoint}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `API error: ${res.status}`);
    }

    return res.json() as Promise<T>;
  }
}
