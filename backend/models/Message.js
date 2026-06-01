const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  senderName: { type: String, required: true, maxlength: 100 },
  senderEmail: { type: String, required: true, maxlength: 200 },
  subject: { type: String, maxlength: 200 },
  body: { type: String, required: true, maxlength: 5000 },
  timestamp: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
  repliedAt: { type: Date },
  replies: [
    {
      adminReply: { type: String, required: true, maxlength: 5000 },
      repliedAt: { type: Date, default: Date.now }
    }
  ]
});

messageSchema.index({ timestamp: -1 });
messageSchema.index({ senderEmail: 1 });
messageSchema.index({ isRead: 1, timestamp: -1 });

module.exports = mongoose.model('Message', messageSchema);
