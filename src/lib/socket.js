import { io } from 'socket.io-client';

let socket = null;

export function getSocket() {
  if (socket && socket.connected) return socket;
  if (socket) return socket;
  socket = io(import.meta.env.VITE_API_URL, {
    withCredentials: true,
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
  });
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
