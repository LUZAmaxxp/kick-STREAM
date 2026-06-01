const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const validator = require('validator');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// ---------------- Helpers ----------------
function setTokenCookie(res, token) {
  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 60 * 60 * 1000, // 1 hour
  });
}

function clearTokenCookie(res) {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });
}

function signToken(user) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { user: { id: user.id, isAdmin: user.isAdmin } },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => (err ? reject(err) : resolve(token))
    );
  });
}

// Tight rate limits on credential endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { msg: 'Too many attempts, please try again later.' },
});

// ---------------- Register ----------------
router.post('/register', authLimiter, async (req, res) => {
  try {
    const { username, email, password } = req.body || {};

    if (!username || !email || !password) {
      return res.status(400).json({ msg: 'username, email and password are required' });
    }
    if (!validator.isEmail(String(email))) {
      return res.status(400).json({ msg: 'Invalid email' });
    }
    if (typeof password !== 'string' || password.length < 8 || password.length > 200) {
      return res.status(400).json({ msg: 'Password must be 8-200 characters' });
    }
    if (typeof username !== 'string' || username.length < 2 || username.length > 40) {
      return res.status(400).json({ msg: 'Username must be 2-40 characters' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      // Generic message to avoid user enumeration
      return res.status(400).json({ msg: 'Unable to register with the supplied credentials' });
    }

    const user = new User({
      username: String(username).trim(),
      email: normalizedEmail,
      password,
    });
    await user.save();

    const token = await signToken(user);
    setTokenCookie(res, token);
    res.json({ user: { id: user.id, username: user.username, email: user.email, isAdmin: user.isAdmin } });
  } catch (err) {
    console.error('register error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ---------------- Login ----------------
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }
    if (!validator.isEmail(String(email))) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // password has select:false in schema; include it explicitly here
    const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select('+password');
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const token = await signToken(user);
    setTokenCookie(res, token);
    res.json({ user: { id: user.id, username: user.username, email: user.email, isAdmin: user.isAdmin } });
  } catch (err) {
    console.error('login error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ---------------- Logout ----------------
router.post('/logout', (req, res) => {
  clearTokenCookie(res);
  res.json({ msg: 'Logged out' });
});

module.exports = router;
