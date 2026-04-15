const Booking = require('../models/Booking');
const Room = require('../models/Room');

const hasDateOverlap = (
  existingCheckIn,
  existingCheckOut,
  newCheckIn,
  newCheckOut
) => {
  return existingCheckIn < newCheckOut && existingCheckOut > newCheckIn;
};

exports.createBooking = async (req, res) => {
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
      return res
        .status(400)
        .json({ message: 'Room, check-in, and check-out are required' });
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

    if (!roomData.isAvailable) {
      return res.status(409).json({ message: 'Room is not available' });
    }

    if (
      numberOfGuests &&
      Number.isFinite(Number(numberOfGuests)) &&
      Number(numberOfGuests) > roomData.maxGuests
    ) {
      return res
        .status(400)
        .json({
          message: `Maximum ${roomData.maxGuests} guests allowed for this room`,
        });
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
      return res.status(409).json({ message: 'Room not available' });
    }

    const days = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);

    const booking = await Booking.create({
      user: req.user.id,
      room,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      numberOfGuests: numberOfGuests || 1,
      totalPrice:
        Number.isFinite(Number(totalPrice)) && Number(totalPrice) > 0
          ? Number(totalPrice)
          : days * roomData.price,
      paymentMethod: paymentMethod || 'credit_card',
      paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid',
      status: 'confirmed',
      guestDetails: guestDetails || {},
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('room');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const isAdmin = req.user.role === 'admin';
    const isOwner = booking.user.toString() === req.user.id;

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ message: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'cancelled') {
      return res.status(200).json(booking);
    }

    booking.status = 'cancelled';
    if (booking.paymentStatus === 'paid') {
      booking.paymentStatus = 'refunded';
    }

    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
