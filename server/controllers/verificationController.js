const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const {
  validateEmail,
  validatePhoneNumber,
  validateOtp,
} = require('../utils/validator');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

// Helper to wrap async controllers
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Generate 6-digit OTP
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const MAX_OTP_ATTEMPTS = 5;
const OTP_LOCK_DURATION = 15 * 60 * 1000; // 15 minutes

// ─── GET VERIFIED CONTACTS ────────────────────────────────────────────────────
const getVerifiedContacts = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select(
    'email verifiedEmail verifiedPhone'
  );
  res.json({
    success: true,
    verifiedEmail: user.verifiedEmail || null,
    verifiedPhone: user.verifiedPhone || null,
    accountEmail: user.email || null,
  });
});

// ─── SEND EMAIL OTP ────────────────────────────────────────────────────────────
const sendEmailOtp = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const userId = req.user.id;

  // Input validation
  if (!email || !validateEmail(email)) {
    return next(new AppError('Valid email is required', 400));
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Check if temporarily locked due to too many attempts
  if (user.emailOtpLockUntil && new Date() < user.emailOtpLockUntil) {
    const minutesLeft = Math.ceil(
      (user.emailOtpLockUntil - new Date()) / 60000
    );
    return next(
      new AppError(
        `Too many failed attempts. Please try again in ${minutesLeft} minutes.`,
        429
      )
    );
  }

  // Already verified with same email — skip OTP
  if (user.verifiedEmail === email) {
    return res.json({
      success: true,
      alreadyVerified: true,
      message: 'Email already verified',
    });
  }

  // Registered account email — auto-verify without OTP (user proved ownership at login)
  if (user.email === email) {
    await User.findByIdAndUpdate(userId, { verifiedEmail: email });
    return res.json({
      success: true,
      alreadyVerified: true,
      message: 'Account email auto-verified',
    });
  }

  const otp = generateOtp();
  const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  await User.findByIdAndUpdate(userId, {
    emailOtp: otp,
    emailOtpExpiry: expiry,
    emailOtpAttempts: 0, // Reset attempts on new OTP
    emailOtpLockUntil: null,
  });

  await sendEmail({
    to: email,
    subject: 'Your Email Verification OTP',
    html: `
      <div style="font-family:sans-serif;max-width:420px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:16px">
        <h2 style="color:#D97706;margin-bottom:8px">Verify Your Email</h2>
        <p style="color:#374151">Use the OTP below to verify your email for checkout:</p>
        <div style="text-align:center;margin:24px 0;letter-spacing:10px;font-size:42px;font-weight:bold;color:#1f2937;background:#f9fafb;padding:16px;border-radius:8px">
          ${otp}
        </div>
        <p style="color:#6b7280;font-size:13px">Valid for <strong>10 minutes</strong>. Do not share this OTP.</p>
      </div>
    `,
  });

  logger.info('Email OTP sent', { userId, email });
  res.json({ success: true, message: 'OTP sent to your email' });
});

// ─── VERIFY EMAIL OTP ─────────────────────────────────────────────────────────
const verifyEmailOtp = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;
  const userId = req.user.id;

  // Input validation
  if (!email || !validateEmail(email)) {
    return next(new AppError('Valid email is required', 400));
  }

  if (!otp || !validateOtp(otp)) {
    return next(new AppError('OTP must be 6 digits', 400));
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Check if locked
  if (user.emailOtpLockUntil && new Date() < user.emailOtpLockUntil) {
    const minutesLeft = Math.ceil(
      (user.emailOtpLockUntil - new Date()) / 60000
    );
    return next(
      new AppError(
        `Too many failed attempts. Please try again in ${minutesLeft} minutes.`,
        429
      )
    );
  }

  // Validate OTP and expiry
  if (!user.emailOtp || user.emailOtp !== otp) {
    // Increment failed attempts
    user.emailOtpAttempts = (user.emailOtpAttempts || 0) + 1;

    // Lock account after max attempts
    if (user.emailOtpAttempts >= MAX_OTP_ATTEMPTS) {
      user.emailOtpLockUntil = new Date(Date.now() + OTP_LOCK_DURATION);
      await user.save();
      logger.warn('Email OTP verification locked', {
        userId,
        attempts: user.emailOtpAttempts,
      });
      return next(
        new AppError('Too many failed attempts. Please try again later.', 429)
      );
    }

    await user.save();
    return next(new AppError('Invalid OTP', 400));
  }

  if (new Date() > user.emailOtpExpiry) {
    return next(new AppError('OTP expired. Please request a new one.', 400));
  }

  await User.findByIdAndUpdate(userId, {
    verifiedEmail: email,
    emailOtp: null,
    emailOtpExpiry: null,
    emailOtpAttempts: 0,
    emailOtpLockUntil: null,
  });

  logger.info('Email OTP verified successfully', { userId, email });
  res.json({ success: true, message: 'Email verified successfully' });
});

// ─── SEND PHONE OTP (via Fast2SMS) ────────────────────────────────────────────
const sendPhoneOtp = asyncHandler(async (req, res, next) => {
  const { phone } = req.body;
  const userId = req.user.id;

  // Input validation
  if (!phone || !validatePhoneNumber(phone)) {
    return next(
      new AppError('Valid phone number is required (10-15 digits)', 400)
    );
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Check if temporarily locked
  if (user.phoneOtpLockUntil && new Date() < user.phoneOtpLockUntil) {
    const minutesLeft = Math.ceil(
      (user.phoneOtpLockUntil - new Date()) / 60000
    );
    return next(
      new AppError(
        `Too many failed attempts. Please try again in ${minutesLeft} minutes.`,
        429
      )
    );
  }

  // Already verified with same phone — skip OTP
  if (user.verifiedPhone === phone) {
    return res.json({
      success: true,
      alreadyVerified: true,
      message: 'Phone already verified',
    });
  }

  const otp = generateOtp();
  const expiry = new Date(Date.now() + 10 * 60 * 1000);

  await User.findByIdAndUpdate(userId, {
    phoneOtp: otp,
    phoneOtpExpiry: expiry,
    phoneOtpAttempts: 0, // Reset attempts on new OTP
    phoneOtpLockUntil: null,
  });

  // Extract last 10 digits for Fast2SMS
  const digits = phone.replace(/\D/g, '').slice(-10);
  const apiKey = process.env.FAST2SMS_API_KEY;

  if (!apiKey) {
    logger.warn('SMS service not configured');
    return next(new AppError('SMS service not configured', 503));
  }

  try {
    const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${apiKey}&variables_values=${otp}&route=otp&numbers=${digits}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.return) {
      logger.error('SMS send failed', { message: data.message });
      return next(new AppError('Failed to send SMS. Please try again.', 500));
    }

    logger.info('Phone OTP sent', { userId, phone });
    res.json({ success: true, message: 'OTP sent to your phone' });
  } catch (err) {
    logger.error('SMS service error', { error: err.message });
    return next(new AppError('SMS service error. Please try again.', 500));
  }
});

// ─── VERIFY PHONE OTP ─────────────────────────────────────────────────────────
const verifyPhoneOtp = asyncHandler(async (req, res, next) => {
  const { phone, otp } = req.body;
  const userId = req.user.id;

  // Input validation
  if (!phone || !validatePhoneNumber(phone)) {
    return next(
      new AppError('Valid phone number is required (10-15 digits)', 400)
    );
  }

  if (!otp || !validateOtp(otp)) {
    return next(new AppError('OTP must be 6 digits', 400));
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Check if locked
  if (user.phoneOtpLockUntil && new Date() < user.phoneOtpLockUntil) {
    const minutesLeft = Math.ceil(
      (user.phoneOtpLockUntil - new Date()) / 60000
    );
    return next(
      new AppError(
        `Too many failed attempts. Please try again in ${minutesLeft} minutes.`,
        429
      )
    );
  }

  // Validate OTP and expiry
  if (!user.phoneOtp || user.phoneOtp !== otp) {
    // Increment failed attempts
    user.phoneOtpAttempts = (user.phoneOtpAttempts || 0) + 1;

    // Lock account after max attempts
    if (user.phoneOtpAttempts >= MAX_OTP_ATTEMPTS) {
      user.phoneOtpLockUntil = new Date(Date.now() + OTP_LOCK_DURATION);
      await user.save();
      logger.warn('Phone OTP verification locked', {
        userId,
        attempts: user.phoneOtpAttempts,
      });
      return next(
        new AppError('Too many failed attempts. Please try again later.', 429)
      );
    }

    await user.save();
    return next(new AppError('Invalid OTP', 400));
  }

  if (new Date() > user.phoneOtpExpiry) {
    return next(new AppError('OTP expired. Please request a new one.', 400));
  }

  await User.findByIdAndUpdate(userId, {
    verifiedPhone: phone,
    phoneOtp: null,
    phoneOtpExpiry: null,
    phoneOtpAttempts: 0,
    phoneOtpLockUntil: null,
  });

  logger.info('Phone OTP verified successfully', { userId, phone });
  res.json({ success: true, message: 'Phone verified successfully' });
});

module.exports = {
  getVerifiedContacts,
  sendEmailOtp,
  verifyEmailOtp,
  sendPhoneOtp,
  verifyPhoneOtp,
};
