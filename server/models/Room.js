const mongoose = require("mongoose");

const roomSchema = mongoose.Schema({
  roomNumber: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  maxGuests: {
    type: Number,
    required: true
  },
  images: [String],
  isAvailable: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("Room", roomSchema);
