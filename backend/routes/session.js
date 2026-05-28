const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/session - check if user is authenticated (for frontend session check)
const User = require('../models/User');

// GET /api/session - check if user is authenticated (for frontend session check)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ user: null });
    // Ensure user.id is always present for frontend compatibility
    const userObj = user.toObject ? user.toObject() : user;
    userObj.id = userObj._id;
    res.json({ user: userObj });
  } catch (err) {
    res.status(500).json({ user: null });
  }
});

module.exports = router;
