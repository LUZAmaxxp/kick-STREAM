import { io } from 'socket.io-client';
import { getAuthToken } from './auth';

let socket = null;

export function getSocket() {
  if (socket && socket.connected) return socket;
  if (socket) return socket;
  const token = getAuthToken();
  socket = io(import.meta.env.VITE_API_URL, {
    withCredentials: true,
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    transports: ['websocket', 'polling'],
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
