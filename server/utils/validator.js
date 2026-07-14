// Input validation utility functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validatePhoneNumber = (phone) => {
  // Accept various formats: +91 9876543210, 9876543210, +919876543210, etc.
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 15;
};

const validateOtp = (otp) => {
  // OTP should be exactly 6 digits
  return /^\d{6}$/.test(otp.toString());
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

const validateDateRange = (checkIn, checkOut) => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  return checkOutDate > checkInDate;
};

module.exports = {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validateOtp,
  sanitizeInput,
  validateDateRange,
};
