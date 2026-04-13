// Response status constants
const RESPONSE_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  PENDING: 'pending',
  FAILED: 'failed',
};

// Booking status enum
const BOOKING_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  PENDING: 'pending',
};

// Payment status enum
const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

// Payment method enum
const PAYMENT_METHOD = {
  RAZORPAY: 'razorpay',
  CASH: 'cash',
  BANK_TRANSFER: 'bank_transfer',
};

// Room category enum
const ROOM_CATEGORY = {
  STANDARD: 'standard',
  DELUXE: 'deluxe',
  LUXURY: 'luxury',
  SUITE: 'suite',
};

module.exports = {
  RESPONSE_STATUS,
  BOOKING_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHOD,
  ROOM_CATEGORY,
};
