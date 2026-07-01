// Payment-specific validation helpers
const validatePositiveAmount = (amount) => {
  const normalizedAmount = Number(amount);
  return Number.isFinite(normalizedAmount) && normalizedAmount > 0;
};

const normalizeCurrency = (currency) => {
  return String(currency || 'INR').toUpperCase();
};

module.exports = {
  validatePositiveAmount,
  normalizeCurrency,
};