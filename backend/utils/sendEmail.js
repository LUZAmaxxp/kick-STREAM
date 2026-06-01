// backend/utils/sendEmail.js
const nodemailer = require('nodemailer');
const validator = require('validator');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT == 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function stripHeaderInjection(str = '') {
  return String(str).replace(/[\r\n]+/g, ' ').slice(0, 200);
}

async function sendEmail({ to, subject, text, html }) {
  if (!to || !validator.isEmail(String(to))) {
    throw new Error('Invalid recipient email');
  }
  try {
    return await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to,
      subject: stripHeaderInjection(subject),
      text,
      html,
    });
  } catch (err) {
    console.error('sendEmail failed:', err.message);
    throw err;
  }
}

module.exports = sendEmail;
