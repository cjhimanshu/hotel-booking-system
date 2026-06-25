// Input validation utility functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validatePhoneNumber = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
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

const validatePositiveAmount = (amount) => {
  const normalizedAmount = Number(amount);
  return Number.isFinite(normalizedAmount) && normalizedAmount > 0;
};

const normalizeCurrency = (currency) => {
  return String(currency || 'INR').toUpperCase();
};

module.exports = {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  sanitizeInput,
  validateDateRange,
  validatePositiveAmount,
  normalizeCurrency,
};
