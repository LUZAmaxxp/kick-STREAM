require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  const username = 'admin';
  const email = 'admin@kickstream.com';
  const password = 'admin123';
  const isAdmin = true;

  let user = await User.findOne({ email });
  if (user) {
    console.log('Admin user already exists:', email);
    process.exit(0);
  }

  user = new User({ username, email, password, isAdmin });
  await user.save();
  console.log('Admin user created:', email, 'password:', password);
  process.exit(0);
}

createAdmin().catch(e => { console.error(e); process.exit(1); });
