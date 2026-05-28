const { Server } = require('socket.io');

function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  // Map userId to socket.id
  const userSockets = new Map();

  io.on('connection', (socket) => {
    // Listen for user identification
    socket.on('identify', (userId) => {
      if (userId) {
        userSockets.set(userId, socket.id);
        socket.userId = userId;
      }
    });

    socket.on('disconnect', () => {
      if (socket.userId) {
        userSockets.delete(socket.userId);
      }
    });
  });

  // Expose functions to emit notifications
  return {
    notifyAdmin: (notification) => {
      io.emit('admin-notification', notification);
    },
    notifyUser: (userId, notification) => {
      const socketId = userSockets.get(userId);
      if (socketId) {
        io.to(socketId).emit('user-notification', notification);
      }
    }
  };
}

module.exports = setupSocket;
