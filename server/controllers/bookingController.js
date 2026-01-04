const Booking = require("../models/Booking");
const Room = require("../models/Room");

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

    const conflict = await Booking.findOne({
      room,
      checkIn: { $lt: checkOut },
      checkOut: { $gt: checkIn },
      status: { $ne: "cancelled" },
    });

    if (conflict)
      return res.status(400).json({ message: "Room not available" });

    const roomData = await Room.findById(room);
    const days =
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);

    const booking = await Booking.create({
      user: req.user.id,
      room,
      checkIn,
      checkOut,
      numberOfGuests: numberOfGuests || 1,
      totalPrice: totalPrice || days * roomData.price,
      paymentMethod: paymentMethod || "credit_card",
      paymentStatus: paymentMethod === "cash" ? "pending" : "paid",
      status: "confirmed",
      guestDetails: guestDetails || {},
    });

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate("room");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("room")
      .populate("user", "name email");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
