const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type: { type: String, enum: ['message', 'email'], required: true },
  messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  senderName: { type: String, required: true },
  preview: { type: String, required: true },
});

module.exports = mongoose.model('Notification', notificationSchema);
