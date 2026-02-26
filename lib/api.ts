const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Basic fetch wrapper that adds JSON headers and throws on non-OK responses.
 * Automatically attaches stored bearer token if available.
 */
export async function fetcher(endpoint: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // include auth token if present
  try {
    const stored = localStorage.getItem('user');
    if (stored) {
      const user = JSON.parse(stored);
      if (user && user.token) {
        headers['Authorization'] = `Bearer ${user.token}`;
      }
    }
  } catch (err) {
    console.warn('could not parse user from localStorage', err);
  }

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  if (!res.ok) {
    const err = new Error('An error occurred while fetching the data.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (err as any).info = await res.json().catch(() => ({}));
    (err as any).status = res.status;
    throw err;
  }
  return res.json();
}
