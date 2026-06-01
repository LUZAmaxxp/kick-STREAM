const mongoose = require('mongoose');

const MAX_TEXT_LEN = 5000;
const MAX_MESSAGES_PER_CONVO = 200;

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderName: { type: String, maxlength: 100 },
  senderEmail: { type: String, maxlength: 200 },
  text: { type: String, maxlength: MAX_TEXT_LEN },
  timestamp: { type: Date, default: Date.now },
  isAdmin: { type: Boolean, default: false },
});

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [messageSchema],
  lastUpdated: { type: Date, default: Date.now },
});

conversationSchema.index({ participants: 1, lastUpdated: -1 });

conversationSchema.pre('save', function (next) {
  if (this.messages && this.messages.length > MAX_MESSAGES_PER_CONVO) {
    this.messages = this.messages.slice(-MAX_MESSAGES_PER_CONVO);
  }
  next();
});

conversationSchema.statics.MAX_TEXT_LEN = MAX_TEXT_LEN;
conversationSchema.statics.MAX_MESSAGES_PER_CONVO = MAX_MESSAGES_PER_CONVO;

module.exports = mongoose.model('Conversation', conversationSchema);
