require('dotenv').config();
const mongoose = require('mongoose');
const validator = require('validator');
const User = require('../models/User');

async function createAdmin() {
  const username = process.env.ADMIN_USERNAME;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !email || !password) {
    console.error('Missing ADMIN_USERNAME, ADMIN_EMAIL or ADMIN_PASSWORD env vars.');
    process.exit(1);
  }
  if (!validator.isEmail(email)) {
    console.error('ADMIN_EMAIL is not a valid email address.');
    process.exit(1);
  }
  if (password.length < 12) {
    console.error('ADMIN_PASSWORD must be at least 12 characters.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);

  const force = process.argv.includes('--force');
  let user = await User.findOne({ email });
  if (user && !force) {
    console.log('Admin user already exists:', email);
    process.exit(0);
  }

  if (user && force) {
    user.username = username;
    user.password = password;
    user.isAdmin = true;
    await user.save();
    console.log('Admin user updated:', email);
  } else {
    user = new User({ username, email, password, isAdmin: true });
    await user.save();
    console.log('Admin user created:', email);
  }
  process.exit(0);
}

createAdmin().catch(e => { console.error(e); process.exit(1); });
