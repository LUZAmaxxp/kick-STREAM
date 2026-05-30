

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Message = require('../models/Message');
const UserAnalytics = require('../models/UserAnalytics');
const authMiddleware = require('../middleware/authMiddleware');
const Conversation = require('../models/Conversation');

// --- USER ANALYTICS TRACKING ENDPOINT ---
// POST /api/analytics/track
router.post('/analytics/track', async (req, res) => {
  try {
    const { email, name, userId, event = 'visit', page = '', planType = '', country = '', ip = '' } = req.body;
    if (!email && !userId) return res.status(400).json({ msg: 'Missing email or userId' });
    const query = email ? { email } : { userId };
    let analytics = await UserAnalytics.findOne(query);
    if (!analytics) {
      analytics = new UserAnalytics({
        email,
        name,
        userId,
        firstVisit: new Date(),
        lastVisit: new Date(),
        totalVisits: 1,
        pagesViewed: event === 'visit' || event === 'pageview' ? 1 : 0,
        matchesWatched: 0,
        planType,
        country,
        ip,
        visitHistory: [{ date: new Date(), pagesViewed: 1, matchesWatched: 0, page }]
      });
    } else {
      analytics.lastVisit = new Date();
      analytics.totalVisits = (analytics.totalVisits || 0) + 1;
      if (event === 'visit' || event === 'pageview') {
        analytics.pagesViewed = (analytics.pagesViewed || 0) + 1;
      }
      analytics.visitHistory = analytics.visitHistory || [];
      analytics.visitHistory.push({ date: new Date(), pagesViewed: event === 'visit' || event === 'pageview' ? 1 : 0, matchesWatched: 0, page });
    }
    await analytics.save();
    res.json({ msg: 'Analytics updated' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});


// GET /api/admin/stats - dashboard stats: total users, emails queued, click events
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ msg: 'Forbidden' });
    // Total users
    const totalUsers = await User.countDocuments();
    // Emails queued: count of messages not replied
    const emailsQueued = await Message.countDocuments({ isRead: false });
    // Click events: sum of all UserAnalytics.pagesViewed
    const clickAgg = await UserAnalytics.aggregate([
      { $group: { _id: null, total: { $sum: "$pagesViewed" } } }
    ]);
    const clickEvents = clickAgg[0]?.total || 0;
    res.json({ totalUsers, emailsQueued, clickEvents });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});




// USER: Send message (creates or updates conversation)
router.post('/conversation/message', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !req.user) return res.status(400).json({ msg: 'Missing message text or user' });
    const userId = req.user.id;
    let convo = await Conversation.findOne({ participants: userId });
    if (!convo) {
      convo = new Conversation({ participants: [userId], messages: [] });
    }
    const msgObj = {
      senderId: userId,
      senderName: req.user.username || req.user.email,
      senderEmail: req.user.email,
      text,
      isAdmin: false,
      timestamp: new Date(),
    };
    convo.messages.push(msgObj);
    convo.lastUpdated = new Date();
    await convo.save();

    // Emit real-time notification to admin
    if (req.app.get('notifyAdmin')) {
      req.app.get('notifyAdmin')({
        type: 'chat',
        from: req.user.username || req.user.email,
        userId,
        text,
        timestamp: msgObj.timestamp
      });
    }

    res.status(201).json({ msg: 'Message sent', conversation: convo });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// USER: Get their conversation (for chat widget history)
router.get('/conversation', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit, 10) || 20;

    // Use aggregation to only fetch the last N messages
    const convoAgg = await Conversation.aggregate([
      { $match: { participants: userId } },
      { $project: {
          participants: 1,
          messages: { $slice: ['$messages', -limit] }
        }
      }
    ]);

    if (!convoAgg || convoAgg.length === 0) return res.json({ conversation: null });

    // Optionally, populate participants (if needed)
    // We'll fetch participant details for the frontend
    const convo = convoAgg[0];
    const participantIds = convo.participants || [];
    const participants = await User.find({ _id: { $in: participantIds } }, 'username email');
    convo.participants = participants;

    res.json({ conversation: convo });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// ADMIN: List all conversations (for admin dashboard)
router.get('/conversations', authMiddleware, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ msg: 'Forbidden' });
    const limit = parseInt(req.query.limit, 10) || 20; // messages per conversation
    // Aggregate to limit messages per conversation
    const convosAgg = await Conversation.aggregate([
      { $sort: { lastUpdated: -1 } },
      { $project: {
          participants: 1,
          lastUpdated: 1,
          messages: { $slice: ['$messages', -limit] }
        }
      }
    ]);

    // Populate participants for all conversations
    const allParticipantIds = Array.from(new Set(convosAgg.flatMap(c => c.participants.map(id => id.toString()))));
    const participants = await User.find({ _id: { $in: allParticipantIds } }, 'username email');
    const participantsMap = Object.fromEntries(participants.map(p => [p._id.toString(), p]));

    // Attach participant details to each conversation
    const convos = convosAgg.map(convo => ({
      ...convo,
      participants: convo.participants.map(id => participantsMap[id.toString()] || { _id: id, username: 'Unknown', email: '' })
    }));

    res.json({ conversations: convos });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// ADMIN: Reply to a conversation (by userId)
router.post('/conversation/:userId/reply', authMiddleware, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ msg: 'Forbidden' });
    const { text } = req.body;
    if (!text) return res.status(400).json({ msg: 'Missing reply text' });
    const userId = req.params.userId;
    let convo = await Conversation.findOne({ participants: userId });
    if (!convo) return res.status(404).json({ msg: 'Conversation not found' });
    const msgObj = {
      senderId: req.user.id,
      senderName: req.user.username || 'Admin',
      senderEmail: req.user.email || '',
      text,
      isAdmin: true,
      timestamp: new Date(),
    };
    convo.messages.push(msgObj);
    convo.lastUpdated = new Date();
    await convo.save();

    // Emit real-time notification to user
    if (req.app.get('notifyUser')) {
      req.app.get('notifyUser')(userId, {
        type: 'chat-reply',
        from: req.user.username || 'Admin',
        text,
        timestamp: msgObj.timestamp
      });
    }

    res.status(201).json({ msg: 'Reply sent', conversation: convo });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});


const Notification = require('../models/Notification');

// POST /api/admin/chat-message - save chat message to DB (for chat feature)
router.post('/chat-message', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !req.user) return res.status(400).json({ msg: 'Missing message text or user' });
    // Fetch full user info
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    const message = new Message({
      senderEmail: user.email,
      body: text,
      senderName: user.username || user.email,
      timestamp: new Date(),
      isRead: false,
      isChat: true,
      userId: user.id
    });
    await message.save();
    // Optionally: emit notification, update analytics, etc.
    res.status(201).json({ msg: 'Chat message saved', message });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// GET /api/admin/messages - fetch all messages for admin
router.get('/messages', authMiddleware, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ msg: 'Forbidden' });
    const messages = await Message.find({}).sort({ timestamp: -1 }).lean();
    res.json({ messages });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// GET /api/admin/users - fetch all users for admin
router.get('/users', authMiddleware, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ msg: 'Forbidden' });
    const users = await User.find({}).select('-password').sort({ createdAt: -1 }).lean();
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// POST /api/admin/messages - save user message to DB and notify admin
const sendEmail = require('../utils/sendEmail');
router.post('/messages', async (req, res) => {
  try {
    const { senderEmail, body } = req.body;
    if (!senderEmail || !body) return res.status(400).json({ msg: 'Email and message body required' });
    const message = new Message({
      senderEmail,
      body,
      senderName: senderEmail,
      timestamp: new Date(),
      isRead: false
    });
    await message.save();

    // --- User Analytics Tracking ---
    let analytics = await UserAnalytics.findOne({ email: senderEmail });
    if (!analytics) {
      analytics = new UserAnalytics({
        email: senderEmail,
        name: senderEmail.split('@')[0],
        firstVisit: new Date(),
        lastVisit: new Date(),
        totalVisits: 1,
        pagesViewed: 0,
        matchesWatched: 0,
        planType: 'free',
        country: req.headers['x-country'] || '',
        ip: req.ip || req.connection?.remoteAddress || '',
        visitHistory: [{ date: new Date(), pagesViewed: 0, matchesWatched: 0 }]
      });
    } else {
      analytics.lastVisit = new Date();
      analytics.totalVisits = (analytics.totalVisits || 0) + 1;
      analytics.visitHistory = analytics.visitHistory || [];
      analytics.visitHistory.push({ date: new Date(), pagesViewed: 0, matchesWatched: 0 });
    }
    await analytics.save();
    // --- End User Analytics Tracking ---

    // Create notification in DB
    const notification = new Notification({
      type: 'message',
      messageId: message._id,
      isRead: false,
      createdAt: new Date(),
      senderName: senderEmail,
      preview: body.slice(0, 100)
    });
    await notification.save();

    // Emit notification via socket if available
    if (req.app.get('notifyAdmin')) {
      req.app.get('notifyAdmin')({
        type: 'message',
        senderName: senderEmail,
        preview: body.slice(0, 100),
        timestamp: notification.createdAt
      });
    }

    // Send email to admin
    if (process.env.ADMIN_EMAIL) {
      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: 'New message received',
        text: `You have received a new message from ${senderEmail}:\n${body}`,
        html: `<p>You have received a new message from <b>${senderEmail}</b>:</p><p>${body}</p>`
      });
    }

    res.status(201).json({ msg: 'Message sent', message });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// GET /api/admin/notifications - fetch unread notifications for admin
router.get('/notifications', authMiddleware, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ msg: 'Forbidden' });
    const notifications = await Notification.find({ isRead: false }).sort({ createdAt: -1 }).lean();
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// PATCH /api/admin/notifications/:id/read - mark a notification as read
router.patch('/notifications/:id/read', authMiddleware, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ msg: 'Forbidden' });
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ msg: 'Notification not found' });
    notification.isRead = true;
    await notification.save();
    res.json({ msg: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// PATCH /api/admin/notifications/read-all - mark all notifications as read
router.patch('/notifications/read-all', authMiddleware, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ msg: 'Forbidden' });
    await Notification.updateMany({ isRead: false }, { isRead: true });
    res.json({ msg: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});
// GET /api/admin/analytics/export - export analytics data as .xlsx file
router.get('/analytics/export', authMiddleware, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ msg: 'Forbidden' });
    const UserAnalytics = require('../models/UserAnalytics');
    const ExcelJS = require('exceljs');
    const analytics = await UserAnalytics.find({}).lean();

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
      { header: 'IP', key: 'ip', width: 18 },
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
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// GET /api/admin/analytics/users - fetch per-user analytics data
router.get('/analytics/users', authMiddleware, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ msg: 'Forbidden' });

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const skip = (page - 1) * limit;

    // Filters
    const filter = {};
    if (req.query.planType) filter.planType = req.query.planType;
    if (req.query.from || req.query.to) {
      filter.lastVisit = {};
      if (req.query.from) filter.lastVisit.$gte = new Date(req.query.from);
      if (req.query.to) filter.lastVisit.$lte = new Date(req.query.to);
    }

    // Sorting
    const sortField = req.query.sortBy || 'lastVisit';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const sort = {};
    sort[sortField] = sortOrder;

    const total = await UserAnalytics.countDocuments(filter);
    const analytics = await UserAnalytics.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      page,
      limit,
      total,
      analytics
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});
// POST /api/admin/messages/:id/reply - send reply email and store in DB
router.post('/messages/:id/reply', authMiddleware, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ msg: 'Forbidden' });
    const { subject, body } = req.body;
    if (!body) return res.status(400).json({ msg: 'Reply body required' });
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ msg: 'Message not found' });

    // Send email to user
    if (message.senderEmail) {
      await sendEmail({
        to: message.senderEmail,
        subject: subject || 'Reply from Admin',
        text: `Admin replied to your message:\n${body}`,
        html: `<p>Admin replied to your message:</p><p>${body}</p>`
      });
    }

    // Store reply in DB
    message.repliedAt = new Date();
    message.replies.push({ adminReply: body, repliedAt: new Date() });
    await message.save();

    res.json({ msg: 'Reply sent and saved', message });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});
// GET /api/admin/messages/:id - fetch a single message and mark as read
router.get('/messages/:id', authMiddleware, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ msg: 'Forbidden' });
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ msg: 'Message not found' });
    if (!message.isRead) {
      message.isRead = true;
      await message.save();
    }
    res.json(message);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;
