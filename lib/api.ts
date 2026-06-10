/**
 * Centralized API client for Bizanolytics → DataBox communication.
 *
 * All fetch calls go through this module. To change the backend URL,
 * update NEXT_PUBLIC_API_URL in .env.local — nothing else needs to change.
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? 'http://localhost:3001';

function getAuthHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('biz_access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  /** Pass `true` to send a FormData body (file uploads) */
  isFormData?: boolean;
};

async function request<T = unknown>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {}, isFormData = false } = opts;

  const contentHeaders: Record<string, string> = isFormData
    ? {} // Let browser set multipart boundary
    : body !== undefined
    ? { 'Content-Type': 'application/json' }
    : {};

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      ...getAuthHeader(),
      ...contentHeaders,
      ...headers,
    },
    cache: 'no-store',
    body: isFormData
      ? (body as FormData)
      : body !== undefined
      ? JSON.stringify(body)
      : undefined,
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText);
    throw new Error(`API error ${res.status}: ${errText}`);
  }

  // Some endpoints (e.g. CSV export) return non-JSON
  const ct = res.headers.get('content-type') ?? '';
  if (!ct.includes('application/json')) {
    return (await res.text()) as unknown as T;
  }
  return res.json() as Promise<T>;
}

export const apiClient = {
  get: <T = unknown>(path: string, headers?: Record<string, string>) =>
    request<T>(path, { method: 'GET', headers }),

  post: <T = unknown>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body }),

  patch: <T = unknown>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body }),

  delete: <T = unknown>(path: string) =>
    request<T>(path, { method: 'DELETE' }),

  upload: <T = unknown>(path: string, formData: FormData) =>
    request<T>(path, { method: 'POST', body: formData, isFormData: true }),

  /** Expose the raw base URL so components can build URLs if needed */
  baseUrl: BASE_URL,
};
