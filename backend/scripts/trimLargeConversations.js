require('dotenv').config();
const mongoose = require('mongoose');
const Conversation = require('../models/Conversation');

async function trimLargeConversations(maxMessages = 100) {
  await mongoose.connect(process.env.MONGO_URI);
  const allConvos = await Conversation.find({}, { messages: 1 });
  const largeConvos = allConvos.filter(convo => convo.messages.length > maxMessages);
  console.log(`Found ${largeConvos.length} conversations with more than ${maxMessages} messages.`);

  for (const convo of largeConvos) {
    const originalLength = convo.messages.length;
    convo.messages = convo.messages.slice(-maxMessages);
    await convo.save();
    console.log(`Trimmed conversation ${convo._id}: ${originalLength} -> ${convo.messages.length} messages.`);
  }
  mongoose.disconnect();
  console.log('Done.');
}

trimLargeConversations(100).catch(e => { console.error(e); process.exit(1); });
