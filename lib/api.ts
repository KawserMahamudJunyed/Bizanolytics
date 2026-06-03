const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export async function getAuthToken(): Promise<string> {
  if (typeof window === 'undefined') return '';
  
  const token = localStorage.getItem('token');
  if (token) return token;

  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'john@databox.io', password: 'demo1234' }),
    });
    if (!res.ok) throw new Error('Auto-login failed');
    const data = await res.json();
    if (data.accessToken) {
      localStorage.setItem('token', data.accessToken);
      return data.accessToken;
    }
  } catch (err) {
    console.error('API Auto-login error:', err);
  }
  return '';
}

export async function apiRequest(path: string, options: RequestInit = {}): Promise<any> {
  const token = await getAuthToken();
  const headers: Record<string, string> = {
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };

  // Merge headers safely
  if (options.headers) {
    Object.entries(options.headers).forEach(([k, v]) => {
      headers[k] = String(v);
    });
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    const newToken = await getAuthToken();
    const retryHeaders: Record<string, string> = {
      ...(newToken ? { 'Authorization': `Bearer ${newToken}` } : {}),
    };
    if (options.headers) {
      Object.entries(options.headers).forEach(([k, v]) => {
        retryHeaders[k] = String(v);
      });
    }

    const retryRes = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: retryHeaders,
    });
    
    if (!retryRes.ok) {
      const errData = await retryRes.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP error ${retryRes.status}`);
    }
    return retryRes.json();
  }

  const contentType = res.headers.get('Content-Type') || '';
  if (contentType.includes('text/csv')) {
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return res.text();
  }

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `HTTP error ${res.status}`);
  }

  return res.json();
}
export { API_BASE_URL };
