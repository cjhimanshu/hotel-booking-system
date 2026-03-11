const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user", // Allow setting role during registration
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    // Verify the selected role matches the user's actual role
    if (role && user.role !== role) {
      return res.status(403).json({
        message: `This account is registered as ${
          user.role === "admin" ? "Hotel Admin" : "Guest/User"
        }. Please select the correct login type.`,
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Always respond with success to prevent email enumeration
    if (!user) {
      return res.json({
        message: "If that email exists, a reset link has been sent.",
      });
    }

    // Generate a secure random token
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    const resetUrl = `${
      process.env.FRONTEND_URL || "http://localhost:5173"
    }/reset-password/${rawToken}`;

    // Always log to server console for development/debugging
    console.log("\n🔑 Password reset requested for:", user.email);
    console.log("🔗 Reset URL (valid 1 hour):", resetUrl, "\n");

    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request – Luxury Stay",
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
          <p style="color:#6b7280;font-size:14px;">Or copy this link: <a href="${resetUrl}">${resetUrl}</a></p>
          <p style="color:#6b7280;font-size:14px;">This link expires in <strong>1 hour</strong>.</p>
          <p style="color:#6b7280;font-size:14px;">If you didn't request this, you can safely ignore this email.</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;">
          <p style="color:#9ca3af;font-size:12px;">Luxury Stay Hotel Booking System</p>
        </div>
      `,
      });
      return res.json({
        message: "If that email exists, a reset link has been sent.",
      });
    } catch (emailError) {
      if (emailError.message === "EMAIL_NOT_CONFIGURED") {
        // Token is saved — dev can use the console URL to test the flow
        return res.status(503).json({
          message:
            "Email service is not configured. Please set EMAIL_USER and EMAIL_PASS in server/.env (Gmail App Password required). Check the server console for the reset link.",
        });
      }
      // Real SMTP / auth error
      console.error("SMTP send error:", emailError.message);
      return res.status(500).json({
        message:
          "Failed to send reset email. Please verify your EMAIL_USER and EMAIL_PASS (must be a Gmail App Password). Check server logs for details.",
      });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    res
      .status(500)
      .json({ message: "Failed to send reset email. Please try again." });
  }
};

// POST /api/auth/reset-password/:token
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters." });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Reset link is invalid or has expired." });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: "Password reset successful. You can now log in." });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: error.message });
  }
};
