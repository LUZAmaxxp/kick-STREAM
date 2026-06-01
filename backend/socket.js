const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

function parseCookieHeader(header) {
  const out = {};
  if (!header) return out;
  header.split(';').forEach(pair => {
    const idx = pair.indexOf('=');
    if (idx === -1) return;
    const k = pair.slice(0, idx).trim();
    const v = decodeURIComponent(pair.slice(idx + 1).trim());
    out[k] = v;
  });
  return out;
}

function setupSocket(server) {
  if (!process.env.CLIENT_URL) {
    throw new Error('CLIENT_URL env var is required for Socket.IO CORS.');
  }

  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
      methods: ['GET', 'POST'],
    },
    pingTimeout: 20000,
    pingInterval: 25000,
    maxHttpBufferSize: 1e6,
  });

  // Auth handshake: verify JWT from cookie or auth payload
  io.use((socket, next) => {
    try {
      const cookies = parseCookieHeader(socket.handshake.headers.cookie);
      const authHeader = socket.handshake.headers?.authorization;
      const bearer = authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.slice(7).trim()
        : null;
      const token = cookies.token || socket.handshake.auth?.token || bearer || socket.handshake.headers?.['x-auth-token'];
      if (!token) return next(new Error('unauthorized'));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.data.userId = String(decoded.user.id);
      socket.data.isAdmin = !!decoded.user.isAdmin;
      next();
    } catch (err) {
      next(new Error('unauthorized'));
    }
  });

  // userId -> Set of socket.ids
  const userSockets = new Map();

  io.on('connection', (socket) => {
    const uid = socket.data.userId;
    if (uid) {
      if (!userSockets.has(uid)) userSockets.set(uid, new Set());
      userSockets.get(uid).add(socket.id);
    }

    socket.on('disconnect', () => {
      if (uid && userSockets.has(uid)) {
        const set = userSockets.get(uid);
        set.delete(socket.id);
        if (set.size === 0) userSockets.delete(uid);
      }
    });
  });

  return {
    notifyAdmin: (notification) => {
      io.sockets.sockets.forEach((s) => {
        if (s.data.isAdmin) s.emit('admin-notification', notification);
      });
    },
    notifyUser: (userId, notification) => {
      const set = userSockets.get(String(userId));
      if (!set) return;
      for (const sid of set) {
        io.to(sid).emit('user-notification', notification);
      }
    },
    io,
  };
}

module.exports = setupSocket;
