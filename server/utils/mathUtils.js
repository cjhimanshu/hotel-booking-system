// Math utility functions for calculations
const calculateDiscount = (price, discountPercent) => {
  return (price * discountPercent) / 100;
};

const calculateTotalWithTax = (subtotal, taxPercent) => {
  return subtotal + (subtotal * taxPercent) / 100;
};

const roundToTwoDecimals = (num) => {
  return Math.round(num * 100) / 100;
};

const calculatePercentage = (value, total) => {
  return (value / total) * 100;
};

const clamp = (num, min, max) => {
  return Math.max(min, Math.min(max, num));
};

module.exports = {
  calculateDiscount,
  calculateTotalWithTax,
  roundToTwoDecimals,
  calculatePercentage,
  clamp,
};
