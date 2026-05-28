const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderName: String,
  senderEmail: String,
  text: String,
  timestamp: { type: Date, default: Date.now },
  isAdmin: { type: Boolean, default: false },
});

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // user and admin
  messages: [messageSchema],
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Conversation', conversationSchema);
