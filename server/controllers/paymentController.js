const Razorpay = require('razorpay');
const crypto = require('crypto');
const Room = require('../models/Room');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const logger = require('../utils/logger');
const {
  validatePositiveAmount,
  normalizeCurrency,
} = require('../utils/paymentValidation');

const SUPPORTED_CURRENCIES = ['INR'];

exports.createOrder = async (req, res) => {
  try {
    const { room, checkIn, checkOut, currency = 'INR' } = req.body;

    if (!room || !checkIn || !checkOut) {
      return res.status(400).json({
        message:
          'Room, check-in, and check-out are required to create a payment order',
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (
      Number.isNaN(checkInDate.getTime()) ||
      Number.isNaN(checkOutDate.getTime())
    ) {
      return res
        .status(400)
        .json({ message: 'Invalid check-in or check-out date' });
    }

    if (checkOutDate <= checkInDate) {
      return res
        .status(400)
        .json({ message: 'Check-out date must be after check-in date' });
    }

    const roomData = await Room.findById(room);
    if (!roomData) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const nights = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);
    const amount = nights * roomData.price;

    if (!validatePositiveAmount(amount)) {
      return res
        .status(400)
        .json({ message: 'Calculated amount must be a positive number' });
    }

    const normalizedCurrency = normalizeCurrency(currency);
    if (!SUPPORTED_CURRENCIES.includes(normalizedCurrency)) {
      return res.status(400).json({
        message: `Unsupported currency. Allowed: ${SUPPORTED_CURRENCIES.join(', ')}`,
      });
    }

    const options = {
      amount: Math.round(Number(amount) * 100), // amount in smallest currency unit (paise)
      currency: normalizedCurrency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    logger.error('Error creating Razorpay order:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      res.json({
        success: true,
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id,
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid signature',
      });
    }
  } catch (error) {
    logger.error('Error verifying payment:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getRazorpayKey = async (req, res) => {
  if (!process.env.RAZORPAY_KEY_ID) {
    return res.status(500).json({ message: 'Razorpay key is not configured' });
  }

  res.json({ key: process.env.RAZORPAY_KEY_ID });
};
