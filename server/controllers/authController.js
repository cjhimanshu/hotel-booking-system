const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const logger = require('../utils/logger');
const { validateEmail, validatePassword } = require('../utils/validator');
const AppError = require('../utils/AppError');

// Helper to wrap async controllers
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Input validation
  if (!name || !email || !password) {
    return next(new AppError('Name, email, and password are required', 400));
  }

  if (!validateEmail(email)) {
    return next(new AppError('Invalid email format', 400));
  }

  if (!validatePassword(password)) {
    return next(
      new AppError('Password must be at least 6 characters long', 400)
    );
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('Email already registered', 409));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Always register as 'user' - admin role can only be set by existing admins
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    role: 'user', // Force user role, never allow role override in registration
  });

  res.status(201).json({
    success: true,
    message: 'Registration successful. Please verify your email.',
    user: { id: user._id, email: user.email, name: user.name },
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password, role } = req.body;

  // Input validation
  if (!email || !password) {
    return next(new AppError('Email and password are required', 400));
  }

  if (!validateEmail(email)) {
    return next(new AppError('Invalid email format', 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError('Invalid email or password', 401));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new AppError('Invalid email or password', 401));
  }

  // Verify the selected role matches the user's actual role
  if (role && user.role !== role) {
    return next(
      new AppError(
        `This account is registered as ${
          user.role === 'admin' ? 'Hotel Admin' : 'Guest/User'
        }. Please select the correct login type.`,
        403
      )
    );
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET
  );

  res.json({
    success: true,
    message: 'Login successful',
    token,
    user: { id: user._id, email: user.email, name: user.name, role: user.role },
  });
});

exports.getProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  res.json({ success: true, user });
});

// POST /api/auth/forgot-password
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email || !validateEmail(email)) {
    return next(new AppError('Valid email is required', 400));
  }

  const user = await User.findOne({ email });

  // Always respond with success to prevent email enumeration
  if (!user) {
    return res.json({
      success: true,
      message: 'If that email exists, a reset link has been sent.',
    });
  }

  // Generate a secure random token
  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto
    .createHash('sha256')
    .update(rawToken)
    .digest('hex');

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${rawToken}`;

  logger.debug('Password reset requested for:', { email: user.email });

  try {
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request – Luxury Stay',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
          <h2 style="color:#1d4ed8;">🏨 Luxury Stay – Password Reset</h2>
          <p>Hi <strong>${user.name}</strong>,</p>
          <p>We received a request to reset your password. Click the button below to set a new one:</p>
          <div style="text-align:center;margin:30px 0;">
            <a href="${resetUrl}"
              style="background:#1d4ed8;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-size:16px;font-weight:bold;">
              Reset Password
            </a>
          </div>
          <p style="color:#6b7280;font-size:14px;">This link expires in <strong>1 hour</strong>.</p>
          <p style="color:#6b7280;font-size:14px;">If you didn't request this, you can safely ignore this email.</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;">
          <p style="color:#9ca3af;font-size:12px;">Luxury Stay Hotel Booking System</p>
        </div>
      `,
    });
    res.json({
      success: true,
      message: 'If that email exists, a reset link has been sent.',
    });
  } catch (emailError) {
    if (emailError.message === 'EMAIL_NOT_CONFIGURED') {
      return next(
        new AppError('Email service not configured. Check server logs.', 503)
      );
    }
    logger.error('SMTP send error:', { message: emailError.message });
    return next(
      new AppError('Failed to send reset email. Please try again.', 500)
    );
  }
});

// POST /api/auth/reset-password/:token
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || !validatePassword(password)) {
    return next(
      new AppError('Password must be at least 6 characters long', 400)
    );
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Reset link is invalid or has expired', 400));
  }

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();

  res.json({
    success: true,
    message: 'Password reset successful. You can now log in.',
  });
});
