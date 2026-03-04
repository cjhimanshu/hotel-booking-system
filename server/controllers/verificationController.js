const User = require("../models/User");
const { Resend } = require("resend");

const getResend = () => new Resend(process.env.RESEND_API_KEY);

// Generate 6-digit OTP
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// ─── GET VERIFIED CONTACTS ────────────────────────────────────────────────────
const getVerifiedContacts = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "email verifiedEmail verifiedPhone",
    );
    res.json({
      verifiedEmail: user.verifiedEmail || null,
      verifiedPhone: user.verifiedPhone || null,
      accountEmail: user.email || null,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── SEND EMAIL OTP ────────────────────────────────────────────────────────────
const sendEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    // Already verified with same email — skip OTP
    if (user.verifiedEmail === email) {
      return res.json({
        alreadyVerified: true,
        message: "Email already verified",
      });
    }
    // Registered account email — auto-verify without OTP (user proved ownership at login)
    if (user.email === email) {
      await User.findByIdAndUpdate(userId, { verifiedEmail: email });
      return res.json({
        alreadyVerified: true,
        message: "Account email auto-verified",
      });
    }

    const otp = generateOtp();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    await User.findByIdAndUpdate(userId, {
      emailOtp: otp,
      emailOtpExpiry: expiry,
    });

    const resend = getResend();
    await resend.emails.send({
      from: "Luxury Stay <onboarding@resend.dev>",
      to: email,
      subject: "Your Email Verification OTP",
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

    res.json({ success: true, message: "OTP sent to your email" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── VERIFY EMAIL OTP ─────────────────────────────────────────────────────────
const verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user.emailOtp || user.emailOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (new Date() > user.emailOtpExpiry) {
      return res
        .status(400)
        .json({ message: "OTP expired. Please request a new one." });
    }

    await User.findByIdAndUpdate(userId, {
      verifiedEmail: email,
      emailOtp: null,
      emailOtpExpiry: null,
    });

    res.json({ success: true, message: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── SEND PHONE OTP (via Fast2SMS) ────────────────────────────────────────────
const sendPhoneOtp = async (req, res) => {
  try {
    const { phone } = req.body; // e.g. "+91 9876543210"
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (user.verifiedPhone === phone) {
      return res.json({
        alreadyVerified: true,
        message: "Phone already verified",
      });
    }

    const otp = generateOtp();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);
    await User.findByIdAndUpdate(userId, {
      phoneOtp: otp,
      phoneOtpExpiry: expiry,
    });

    // Extract last 10 digits for Fast2SMS
    const digits = phone.replace(/\D/g, "").slice(-10);
    const apiKey = process.env.FAST2SMS_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ message: "SMS service not configured" });
    }

    const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${apiKey}&variables_values=${otp}&route=otp&numbers=${digits}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.return) {
      return res.status(500).json({
        message: "Failed to send SMS: " + (data.message || "Unknown error"),
      });
    }

    res.json({ success: true, message: "OTP sent to your phone" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── VERIFY PHONE OTP ─────────────────────────────────────────────────────────
const verifyPhoneOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user.phoneOtp || user.phoneOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (new Date() > user.phoneOtpExpiry) {
      return res
        .status(400)
        .json({ message: "OTP expired. Please request a new one." });
    }

    await User.findByIdAndUpdate(userId, {
      verifiedPhone: phone,
      phoneOtp: null,
      phoneOtpExpiry: null,
    });

    res.json({ success: true, message: "Phone verified successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getVerifiedContacts,
  sendEmailOtp,
  verifyEmailOtp,
  sendPhoneOtp,
  verifyPhoneOtp,
};
