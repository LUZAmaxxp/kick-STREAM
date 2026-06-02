import { io } from 'socket.io-client';
import { getAuthToken } from './auth';

let socket = null;
const FALLBACK_SOCKET_URL = 'https://kick-stream-production.up.railway.app';

function resolveSocketUrl() {
  const raw = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || FALLBACK_SOCKET_URL;

  try {
    const url = new URL(raw);
    // Prevent accidental frontend-origin socket target in production deploys.
    if (url.hostname.endsWith('vercel.app')) return FALLBACK_SOCKET_URL;
    return url.origin;
  } catch {
    return FALLBACK_SOCKET_URL;
  }
}

export function getSocket() {
  if (socket && socket.connected) return socket;
  if (socket) return socket;
  const token = getAuthToken();
  socket = io(resolveSocketUrl(), {
    withCredentials: true,
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    transports: ['polling', 'websocket'],
    path: '/socket.io',
    auth: token ? { token } : undefined,
  });
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
