// String utility functions
const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const generateSlug = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
};

const truncate = (str, length = 50) => {
  return str.length > length ? str.substring(0, length) + '...' : str;
};

const removeSpecialChars = (str) => {
  return str.replace(/[^a-zA-Z0-9\s]/g, '');
};

const reverseString = (str) => {
  return str.split('').reverse().join('');
};

module.exports = {
  capitalize,
  generateSlug,
  truncate,
  removeSpecialChars,
  reverseString,
};
