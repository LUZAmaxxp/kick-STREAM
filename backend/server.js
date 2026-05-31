// Import necessary modules
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000; // Use port from environment variables or default to 5000

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {

})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Define API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/session', require('./routes/session'));

const Ably = require('ably');
const authMiddleware = require('./middleware/authMiddleware'); // We'll create this middleware shortly

// Ably Token authentication route
const ably = new Ably.Rest({ key: process.env.ABLY_API_KEY.trim() });
app.get('/api/ably-token', authMiddleware, async (req, res) => {
  try {
    console.log('Ably token request headers:', req.headers);
    console.log('Ably token request cookies:', req.headers.cookie);
    console.log('Ably token request user:', req.user);
    const tokenRequest = await ably.auth.createTokenRequest({
      clientId: String(req.user.id),
      capability: {
        'private-chat:*': ['publish', 'subscribe', 'presence'],
      },
    });
    res.json(tokenRequest);
  } catch (error) {
    console.error('Ably token error:', error);
    res.status(500).send('Error creating Ably token');
  }
});
// Basic route for testing
app.get('/', (req, res) => {
  res.send('Backend API is running...');
});

// Start the server with socket.io
const http = require('http');
const setupSocket = require('./socket');
const server = http.createServer(app);
const { notifyAdmin, notifyUser } = setupSocket(server);
app.set('notifyAdmin', notifyAdmin);
app.set('notifyUser', notifyUser);
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
