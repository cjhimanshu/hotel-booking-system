const Booking = require('../models/Booking');
const Room = require('../models/Room');
const AppError = require('../utils/AppError');

const hasDateOverlap = (
  existingCheckIn,
  existingCheckOut,
  newCheckIn,
  newCheckOut
) => {
  return existingCheckIn < newCheckOut && existingCheckOut > newCheckIn;
};

/**
 * Validates that check-in/check-out dates are reasonable
 * @throws {AppError} if dates are invalid
 */
const validateBookingDates = (checkInDate, checkOutDate) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  // Check-in cannot be in the past
  if (checkInDate < now) {
    throw new AppError('Check-in date cannot be in the past', 400, {
      checkInDate,
      now,
    });
  }

  // Check-out must be after check-in
  if (checkOutDate <= checkInDate) {
    throw new AppError('Check-out date must be after check-in date', 400, {
      checkInDate,
      checkOutDate,
    });
  }

  // Limit booking to 90 days max
  const maxBookingDays = 90;
  const bookingDays = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);
  if (bookingDays > maxBookingDays) {
    throw new AppError(`Booking cannot exceed ${maxBookingDays} days`, 400, {
      bookingDays,
      maxBookingDays,
    });
  }
};

exports.createBooking = async (req, res, next) => {
  try {
    const {
      room,
      checkIn,
      checkOut,
      numberOfGuests,
      paymentMethod,
      guestDetails,
      totalPrice,
    } = req.body;

    if (!room || !checkIn || !checkOut) {
      throw new AppError('Room, check-in, and check-out are required', 400);
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (
      Number.isNaN(checkInDate.getTime()) ||
      Number.isNaN(checkOutDate.getTime())
    ) {
      throw new AppError('Invalid check-in or check-out date', 400);
    }

    // Validate date ranges
    validateBookingDates(checkInDate, checkOutDate);

    const roomData = await Room.findById(room);
    if (!roomData) {
      throw new AppError('Room not found', 404);
    }

    if (!roomData.isAvailable) {
      throw new AppError('Room is not available', 409);
    }

    if (
      numberOfGuests &&
      Number.isFinite(Number(numberOfGuests)) &&
      Number(numberOfGuests) > roomData.maxGuests
    ) {
      throw new AppError(
        `Maximum ${roomData.maxGuests} guests allowed for this room`,
        400
      );
    }

    const existingBookings = await Booking.find({
      room,
      status: { $in: ['pending', 'confirmed'] },
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate },
    }).select('checkIn checkOut');

    const hasConflict = existingBookings.some((booking) =>
      hasDateOverlap(
        booking.checkIn,
        booking.checkOut,
        checkInDate,
        checkOutDate
      )
    );

    if (hasConflict) {
      throw new AppError('Room not available for selected dates', 409);
    }

    const days = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);
    const authoritativeTotalPrice = days * roomData.price;

    const booking = await Booking.create({
      user: req.user.id,
      room,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      numberOfGuests: numberOfGuests || 1,
      totalPrice: authoritativeTotalPrice,
      paymentMethod: paymentMethod || 'credit_card',
      paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid',
      status: 'confirmed',
      guestDetails: guestDetails || {},
    });

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

exports.getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('room');
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    const isAdmin = req.user.role === 'admin';
    const isOwner = booking.user.toString() === req.user.id;

    if (!isOwner && !isAdmin) {
      throw new AppError('Not authorized to cancel this booking', 403, {
        bookingId: req.params.id,
        userId: req.user.id,
      });
    }

    if (booking.status === 'cancelled') {
      return res.json(booking);
    }

    booking.status = 'cancelled';
    if (booking.paymentStatus === 'paid') {
      booking.paymentStatus = 'refunded';
    }

    await booking.save();
    res.json(booking);
  } catch (error) {
    next(error);
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('room')
      .populate('user', 'name email');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
