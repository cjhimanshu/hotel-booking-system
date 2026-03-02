const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getVerifiedContacts,
  sendEmailOtp,
  verifyEmailOtp,
  sendPhoneOtp,
  verifyPhoneOtp,
} = require("../controllers/verificationController");

router.get("/verified-contacts", protect, getVerifiedContacts);
router.post("/send-email-otp", protect, sendEmailOtp);
router.post("/verify-email-otp", protect, verifyEmailOtp);
router.post("/send-phone-otp", protect, sendPhoneOtp);
router.post("/verify-phone-otp", protect, verifyPhoneOtp);

module.exports = router;
