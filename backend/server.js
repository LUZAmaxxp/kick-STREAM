// Import necessary modules
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Fail fast on missing required env vars
const REQUIRED_ENV = ['MONGO_URI', 'JWT_SECRET', 'CLIENT_URL', 'ABLY_API_KEY'];
for (const k of REQUIRED_ENV) {
  if (!process.env[k]) {
    console.error(`FATAL: missing env var ${k}`);
    process.exit(1);
  }
}

const app = express();
const PORT = process.env.PORT || 5000;

// Trust the platform proxy (Railway) so req.ip and secure cookies work
app.set('trust proxy', 1);

// Security headers
app.use(helmet());

// CORS — allow only the configured client origin
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());

// Global rate limit (per IP) — generous; per-route limits are tighter
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 600,
  standardHeaders: true,
  legacyHeaders: false,
}));

// MongoDB connection — exit on initial failure so the orchestrator restarts
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/session', require('./routes/session'));

const Ably = require('ably');
const authMiddleware = require('./middleware/authMiddleware');

const ably = new Ably.Rest({ key: process.env.ABLY_API_KEY.trim() });
const ablyTokenLimiter = rateLimit({ windowMs: 60 * 1000, max: 30 });
app.get('/api/ably-token', ablyTokenLimiter, authMiddleware, async (req, res) => {
  try {
    const tokenRequest = await ably.auth.createTokenRequest({
      clientId: String(req.user.id),
      capability: {
        [`private-chat:${req.user.id}`]: ['publish', 'subscribe', 'presence'],
      },
    });
    res.json(tokenRequest);
  } catch (error) {
    console.error('Ably token error:', error.message);
    res.status(500).json({ msg: 'Error creating Ably token' });
  }
});

app.get('/', (req, res) => {
  res.send('Backend API is running...');
});

// Generic JSON error handler — keep last
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err.message);
  res.status(err.status || 500).json({ msg: 'Server error' });
});

// HTTP + socket.io
const http = require('http');
const setupSocket = require('./socket');
const server = http.createServer(app);
const { notifyAdmin, notifyUser } = setupSocket(server);
app.set('notifyAdmin', notifyAdmin);
app.set('notifyUser', notifyUser);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
function shutdown(signal) {
  console.log(`Received ${signal}, shutting down…`);
  server.close(() => {
    mongoose.disconnect().finally(() => process.exit(0));
  });
  setTimeout(() => process.exit(1), 10000).unref();
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
