const nodemailer = require('nodemailer');
const logger = require('./logger');

const sendEmail = async ({ to, subject, html }) => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    // Extract reset URL from html so dev can still test
    const urlMatch = html.match(/href="([^"]*reset-password[^"]*)"/);
    logger.error(
      'EMAIL NOT CONFIGURED — set EMAIL_USER and EMAIL_PASS in server/.env'
    );
    logger.error(
      'Gmail requires a 16-character App Password (not your account password).'
    );
    logger.error(
      'Go to: https://myaccount.google.com/apppasswords to generate one.'
    );
    if (urlMatch) {
      logger.info('[DEV FALLBACK] Email would have been sent to:', { to });
      logger.debug('DEV reset URL:', { url: urlMatch[1] });
    }
    throw new Error('EMAIL_NOT_CONFIGURED');
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // STARTTLS
    auth: {
      user: emailUser,
      pass: emailPass, // Must be a Gmail App Password, NOT your login password
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // Verify connection before sending
  await transporter.verify();

  await transporter.sendMail({
    from: `"Luxury Stay" <${emailUser}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
