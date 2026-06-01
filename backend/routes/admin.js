const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const validator = require('validator');
const xss = require('xss');

const router = express.Router();

const User = require('../models/User');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const UserAnalytics = require('../models/UserAnalytics');
const Conversation = require('../models/Conversation');
const authMiddleware = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminOnly');
const sendEmail = require('../utils/sendEmail');

// ---------------- Helpers ----------------
const MAX_LIMIT = 100;
const ALLOWED_SORT_FIELDS = new Set(['lastVisit', 'firstVisit', 'totalVisits', 'pagesViewed', 'matchesWatched', 'planType']);

function parseLimit(raw, def = 25) {
  const n = parseInt(raw, 10);
  if (!Number.isFinite(n) || n <= 0) return def;
  return Math.min(n, MAX_LIMIT);
}

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(String(id));
}

function sanitizeText(str = '', max = 5000) {
  return xss(String(str)).slice(0, max);
}

const contactLimiter = rateLimit({ windowMs: 60 * 1000, max: 5, standardHeaders: true, legacyHeaders: false });
const analyticsLimiter = rateLimit({ windowMs: 60 * 1000, max: 30, standardHeaders: true, legacyHeaders: false });

// ===========================================================
// USER ANALYTICS TRACKING — now requires auth
// POST /api/admin/analytics/track
// ===========================================================
router.post('/analytics/track', authMiddleware, analyticsLimiter, async (req, res) => {
  try {
    const { event = 'visit', page = '', planType = '' } = req.body || {};
    const userId = req.user.id;
    const email = req.user.email; // may not be on JWT — fetch if needed
    const pageStr = sanitizeText(page, 200);
    const planTypeStr = sanitizeText(planType, 40);
    const country = sanitizeText(req.headers['x-country'] || '', 60);
    const ip = (req.ip || '').slice(0, 60);

    const query = { userId };
    let analytics = await UserAnalytics.findOne(query);

    if (!analytics) {
      let nameOrEmail = email;
      if (!nameOrEmail) {
        const u = await User.findById(userId).select('email username');
        nameOrEmail = u?.email;
      }
      analytics = new UserAnalytics({
        email: nameOrEmail,
        name: nameOrEmail,
        userId,
        firstVisit: new Date(),
        lastVisit: new Date(),
        totalVisits: 1,
        pagesViewed: event === 'visit' || event === 'pageview' ? 1 : 0,
        matchesWatched: 0,
        planType: planTypeStr,
        country,
        ip,
        visitHistory: [{ date: new Date(), pagesViewed: 1, matchesWatched: 0, page: pageStr }],
      });
    } else {
      analytics.lastVisit = new Date();
      analytics.totalVisits = (analytics.totalVisits || 0) + 1;
      if (event === 'visit' || event === 'pageview') {
        analytics.pagesViewed = (analytics.pagesViewed || 0) + 1;
      }
      analytics.visitHistory = analytics.visitHistory || [];
      // Cap visit history
      if (analytics.visitHistory.length >= 500) {
        analytics.visitHistory = analytics.visitHistory.slice(-499);
      }
      analytics.visitHistory.push({
        date: new Date(),
        pagesViewed: event === 'visit' || event === 'pageview' ? 1 : 0,
        matchesWatched: 0,
        page: pageStr,
      });
    }
    await analytics.save();
    res.json({ msg: 'Analytics updated' });
  } catch (err) {
    console.error('analytics/track:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ===========================================================
// ADMIN DASHBOARD STATS
// ===========================================================
router.get('/stats', authMiddleware, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const emailsQueued = await Message.countDocuments({ isRead: false });
    const clickAgg = await UserAnalytics.aggregate([
      { $group: { _id: null, total: { $sum: '$pagesViewed' } } },
    ]);
    const clickEvents = clickAgg[0]?.total || 0;
    res.json({ totalUsers, emailsQueued, clickEvents });
  } catch (err) {
    console.error('stats:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ===========================================================
// USER: send chat message (creates or updates conversation)
// ===========================================================
router.post('/conversation/message', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body || {};
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ msg: 'Missing message text' });
    }
    const cleanText = sanitizeText(text, Conversation.MAX_TEXT_LEN);
    if (!cleanText) return res.status(400).json({ msg: 'Empty message' });

    const userId = req.user.id;
    const user = await User.findById(userId).select('username email');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    let convo = await Conversation.findOne({ participants: userId });
    if (!convo) convo = new Conversation({ participants: [userId], messages: [] });

    const msgObj = {
      senderId: userId,
      senderName: user.username || user.email,
      senderEmail: user.email,
      text: cleanText,
      isAdmin: false,
      timestamp: new Date(),
    };
    convo.messages.push(msgObj);
    convo.lastUpdated = new Date();
    await convo.save();

    const notifyAdmin = req.app.get('notifyAdmin');
    if (notifyAdmin) {
      notifyAdmin({
        type: 'chat',
        from: user.username || user.email,
        userId,
        text: cleanText.slice(0, 200),
        timestamp: msgObj.timestamp,
      });
    }

    res.status(201).json({ msg: 'Message sent', conversation: convo });
  } catch (err) {
    console.error('conversation/message:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ===========================================================
// USER: get own conversation (last N messages only)
// ===========================================================
router.get('/conversation', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseLimit(req.query.limit, 20);

    const convoAgg = await Conversation.aggregate([
      { $match: { participants: new mongoose.Types.ObjectId(userId) } },
      { $project: { participants: 1, messages: { $slice: ['$messages', -limit] } } },
    ]);

    if (!convoAgg || convoAgg.length === 0) return res.json({ conversation: null });

    const convo = convoAgg[0];
    const participants = await User.find({ _id: { $in: convo.participants || [] } }, 'username email');
    convo.participants = participants;

    res.json({ conversation: convo });
  } catch (err) {
    console.error('conversation get:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ===========================================================
// ADMIN: list all conversations
// ===========================================================
router.get('/conversations', authMiddleware, adminOnly, async (req, res) => {
  try {
    const limit = parseLimit(req.query.limit, 20);

    // Use $lookup so we don't make N+1 queries
    const convosAgg = await Conversation.aggregate([
      { $sort: { lastUpdated: -1 } },
      { $limit: 200 }, // hard cap on number of conversations returned
      { $project: {
          participants: 1,
          lastUpdated: 1,
          messages: { $slice: ['$messages', -limit] },
        },
      },
      { $lookup: {
          from: 'users',
          localField: 'participants',
          foreignField: '_id',
          as: 'participantDocs',
          pipeline: [{ $project: { username: 1, email: 1 } }],
        },
      },
      { $addFields: { participants: '$participantDocs' } },
      { $project: { participantDocs: 0 } },
    ]);

    res.json({ conversations: convosAgg });
  } catch (err) {
    console.error('conversations list:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ===========================================================
// ADMIN: reply to a conversation
// ===========================================================
router.post('/conversation/:userId/reply', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { userId } = req.params;
    if (!isValidObjectId(userId)) return res.status(400).json({ msg: 'Invalid userId' });
    const { text } = req.body || {};
    if (!text || typeof text !== 'string') return res.status(400).json({ msg: 'Missing reply text' });
    const cleanText = sanitizeText(text, Conversation.MAX_TEXT_LEN);
    if (!cleanText) return res.status(400).json({ msg: 'Empty reply' });

    const convo = await Conversation.findOne({ participants: userId });
    if (!convo) return res.status(404).json({ msg: 'Conversation not found' });

    const msgObj = {
      senderId: req.user.id,
      senderName: req.user.username || 'Admin',
      senderEmail: req.user.email || '',
      text: cleanText,
      isAdmin: true,
      timestamp: new Date(),
    };
    convo.messages.push(msgObj);
    convo.lastUpdated = new Date();
    await convo.save();

    const notifyUser = req.app.get('notifyUser');
    if (notifyUser) {
      notifyUser(userId, {
        type: 'chat-reply',
        from: req.user.username || 'Admin',
        text: cleanText.slice(0, 200),
        timestamp: msgObj.timestamp,
      });
    }

    res.status(201).json({ msg: 'Reply sent', conversation: convo });
  } catch (err) {
    console.error('conversation reply:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ===========================================================
// POST /chat-message — save user chat message (authenticated)
// ===========================================================
router.post('/chat-message', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body || {};
    if (!text || typeof text !== 'string') return res.status(400).json({ msg: 'Missing message text' });
    const cleanText = sanitizeText(text, 5000);
    if (!cleanText) return res.status(400).json({ msg: 'Empty message' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const message = new Message({
      senderEmail: user.email,
      body: cleanText,
      senderName: user.username || user.email,
      timestamp: new Date(),
      isRead: false,
      userId: user.id,
    });
    await message.save();
    res.status(201).json({ msg: 'Chat message saved', message });
  } catch (err) {
    console.error('chat-message:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ===========================================================
// ADMIN: list all messages (paginated)
// ===========================================================
router.get('/messages', authMiddleware, adminOnly, async (req, res) => {
  try {
    const limit = parseLimit(req.query.limit, 50);
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const skip = (page - 1) * limit;
    const messages = await Message.find({}).sort({ timestamp: -1 }).skip(skip).limit(limit).lean();
    const total = await Message.countDocuments();
    res.json({ messages, page, limit, total });
  } catch (err) {
    console.error('messages list:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ===========================================================
// ADMIN: list all users (paginated)
// ===========================================================
router.get('/users', authMiddleware, adminOnly, async (req, res) => {
  try {
    const limit = parseLimit(req.query.limit, 50);
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const skip = (page - 1) * limit;
    const users = await User.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
    const total = await User.countDocuments();
    res.json({ users, page, limit, total });
  } catch (err) {
    console.error('users list:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ===========================================================
// PUBLIC CONTACT: POST /messages — heavily rate-limited
// (was previously fully open — now bounded)
// ===========================================================
router.post('/messages', contactLimiter, async (req, res) => {
  try {
    const { senderEmail, body } = req.body || {};
    if (!senderEmail || !body) return res.status(400).json({ msg: 'Email and message body required' });
    if (!validator.isEmail(String(senderEmail))) return res.status(400).json({ msg: 'Invalid email' });

    const cleanBody = sanitizeText(body, 5000);
    if (!cleanBody) return res.status(400).json({ msg: 'Empty message' });
    const cleanEmail = String(senderEmail).toLowerCase().trim().slice(0, 200);

    const message = new Message({
      senderEmail: cleanEmail,
      body: cleanBody,
      senderName: cleanEmail,
      timestamp: new Date(),
      isRead: false,
    });
    await message.save();

    // Lightweight analytics upsert (no PII beyond what user supplied)
    try {
      await UserAnalytics.updateOne(
        { email: cleanEmail },
        {
          $setOnInsert: {
            email: cleanEmail,
            name: cleanEmail.split('@')[0],
            firstVisit: new Date(),
            planType: 'free',
          },
          $set: { lastVisit: new Date(), country: sanitizeText(req.headers['x-country'] || '', 60), ip: (req.ip || '').slice(0, 60) },
          $inc: { totalVisits: 1 },
        },
        { upsert: true }
      );
    } catch (e) { /* non-fatal */ }

    const notification = new Notification({
      type: 'message',
      messageId: message._id,
      isRead: false,
      createdAt: new Date(),
      senderName: cleanEmail,
      preview: cleanBody.slice(0, 100),
    });
    await notification.save();

    const notifyAdmin = req.app.get('notifyAdmin');
    if (notifyAdmin) {
      notifyAdmin({
        type: 'message',
        senderName: cleanEmail,
        preview: cleanBody.slice(0, 100),
        timestamp: notification.createdAt,
      });
    }

    if (process.env.ADMIN_EMAIL) {
      try {
        await sendEmail({
          to: process.env.ADMIN_EMAIL,
          subject: 'New message received',
          text: `You have received a new message from ${cleanEmail}:\n${cleanBody}`,
          html: `<p>You have received a new message from <b>${xss(cleanEmail)}</b>:</p><p>${xss(cleanBody)}</p>`,
        });
      } catch (e) { /* email failure shouldn't break submission */ }
    }

    res.status(201).json({ msg: 'Message sent' });
  } catch (err) {
    console.error('public messages:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ===========================================================
// ADMIN: notifications
// ===========================================================
router.get('/notifications', authMiddleware, adminOnly, async (req, res) => {
  try {
    const notifications = await Notification.find({ isRead: false }).sort({ createdAt: -1 }).limit(100).lean();
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.patch('/notifications/:id/read', authMiddleware, adminOnly, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ msg: 'Invalid id' });
    const n = await Notification.findById(req.params.id);
    if (!n) return res.status(404).json({ msg: 'Notification not found' });
    n.isRead = true;
    await n.save();
    res.json({ msg: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.patch('/notifications/read-all', authMiddleware, adminOnly, async (req, res) => {
  try {
    await Notification.updateMany({ isRead: false }, { isRead: true });
    res.json({ msg: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// ===========================================================
// ADMIN: analytics list (paginated, validated)
// ===========================================================
router.get('/analytics/users', authMiddleware, adminOnly, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = parseLimit(req.query.limit, 25);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.planType) filter.planType = String(req.query.planType).slice(0, 40);
    if (req.query.from || req.query.to) {
      filter.lastVisit = {};
      if (req.query.from && !Number.isNaN(Date.parse(req.query.from))) filter.lastVisit.$gte = new Date(req.query.from);
      if (req.query.to && !Number.isNaN(Date.parse(req.query.to))) filter.lastVisit.$lte = new Date(req.query.to);
    }

    let sortField = String(req.query.sortBy || 'lastVisit');
    if (!ALLOWED_SORT_FIELDS.has(sortField)) sortField = 'lastVisit';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const total = await UserAnalytics.countDocuments(filter);
    const analytics = await UserAnalytics.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({ page, limit, total, analytics });
  } catch (err) {
    console.error('analytics/users:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ===========================================================
// ADMIN: export analytics — audit-logged
// ===========================================================
router.get('/analytics/export', authMiddleware, adminOnly, async (req, res) => {
  try {
    const ExcelJS = require('exceljs');
    const analytics = await UserAnalytics.find({}).limit(10000).lean();

    console.log(`[AUDIT] analytics export by adminId=${req.user.id} rows=${analytics.length} at=${new Date().toISOString()}`);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('User Analytics');
    sheet.columns = [
      { header: 'User Name', key: 'name', width: 20 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Plan', key: 'planType', width: 12 },
      { header: 'First Visit', key: 'firstVisit', width: 18 },
      { header: 'Last Visit', key: 'lastVisit', width: 18 },
      { header: 'Total Visits', key: 'totalVisits', width: 14 },
      { header: 'Pages Viewed', key: 'pagesViewed', width: 14 },
      { header: 'Matches Watched', key: 'matchesWatched', width: 16 },
      { header: 'Country', key: 'country', width: 14 },
    ];
    analytics.forEach(row => {
      sheet.addRow({
        ...row,
        firstVisit: row.firstVisit ? new Date(row.firstVisit).toLocaleString() : '',
        lastVisit: row.lastVisit ? new Date(row.lastVisit).toLocaleString() : '',
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="user-analytics.xlsx"');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('analytics/export:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ===========================================================
// ADMIN: reply to a contact message
// ===========================================================
router.post('/messages/:id/reply', authMiddleware, adminOnly, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ msg: 'Invalid id' });
    const { subject, body } = req.body || {};
    if (!body || typeof body !== 'string') return res.status(400).json({ msg: 'Reply body required' });
    const cleanBody = sanitizeText(body, 5000);
    if (!cleanBody) return res.status(400).json({ msg: 'Empty reply' });

    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ msg: 'Message not found' });

    if (message.senderEmail && validator.isEmail(message.senderEmail)) {
      try {
        await sendEmail({
          to: message.senderEmail,
          subject: subject || 'Reply from Admin',
          text: `Admin replied to your message:\n${cleanBody}`,
          html: `<p>Admin replied to your message:</p><p>${xss(cleanBody)}</p>`,
        });
      } catch (e) { /* continue saving even if email fails */ }
    }

    message.repliedAt = new Date();
    message.replies.push({ adminReply: cleanBody, repliedAt: new Date() });
    await message.save();

    res.json({ msg: 'Reply sent and saved', message });
  } catch (err) {
    console.error('message reply:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ===========================================================
// ADMIN: get single message
// ===========================================================
router.get('/messages/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ msg: 'Invalid id' });
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ msg: 'Message not found' });
    if (!message.isRead) {
      message.isRead = true;
      await message.save();
    }
    res.json(message);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
