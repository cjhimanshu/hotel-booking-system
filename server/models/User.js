const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
  // Verified contact details (saved after OTP verification)
  verifiedEmail: { type: String, default: null },
  verifiedPhone: { type: String, default: null },
  // Email OTP
  emailOtp: { type: String, default: null },
  emailOtpExpiry: { type: Date, default: null },
  // Phone OTP
  phoneOtp: { type: String, default: null },
  phoneOtpExpiry: { type: Date, default: null },
});

module.exports = mongoose.model("User", userSchema);
