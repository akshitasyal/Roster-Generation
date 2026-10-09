export const API_BASE_URL = 'http://localhost:8080/api';

export class ApiError extends Error {
  status: number;
  data: any;
  constructor(status: number, data: any) {
    super(data.message || 'API Error');
    this.status = status;
    this.data = data;
  }
}

async function request(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    let errorData = {};
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { message: response.statusText };
    }
    throw new ApiError(response.status, errorData);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
}

export const api = {
  get: (endpoint: string, options?: RequestInit) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint: string, data: any, options?: RequestInit) => request(endpoint, { ...options, method: 'POST', body: data instanceof FormData ? data : JSON.stringify(data) }),
  put: (endpoint: string, data: any, options?: RequestInit) => request(endpoint, { ...options, method: 'PUT', body: data instanceof FormData ? data : JSON.stringify(data) }),
  delete: (endpoint: string, options?: RequestInit) => request(endpoint, { ...options, method: 'DELETE' })
};
