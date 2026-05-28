const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  senderName: { type: String, required: true },
  senderEmail: { type: String, required: true },
  subject: { type: String },
  body: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
  repliedAt: { type: Date },
  replies: [
    {
      adminReply: { type: String, required: true },
      repliedAt: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('Message', messageSchema);
