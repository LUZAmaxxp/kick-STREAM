const AUTH_TOKEN_KEY = 'kickstream_auth_token';

export function setAuthToken(token) {
  if (typeof window === 'undefined') return;
  if (!token) return;
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function getAuthToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function clearAuthToken() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function getAuthHeaders(baseHeaders = {}) {
  const token = getAuthToken();
  if (!token) return { ...baseHeaders };
  return {
    ...baseHeaders,
    Authorization: `Bearer ${token}`,
    'x-auth-token': token,
  };
}
