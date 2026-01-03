const Room = require("../models/Room");

exports.createRoom = async (req, res) => {
  try {
    let images = [];

    // If files are uploaded, use them
    if (req.files && req.files.length > 0) {
      // Convert file paths to full URLs accessible by frontend
      images = req.files.map(
        (file) => `http://localhost:5000/${file.path.replace(/\\/g, "/")}`
      );
    }
    // Otherwise, if a preset image URL is provided, use it
    else if (req.body.imageUrl) {
      images = [req.body.imageUrl];
    }

    const room = await Room.create({
      ...req.body,
      images,
    });

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRooms = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 6;

    const rooms = await Room.find()
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: "Room deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateRoomImages = async (req, res) => {
  try {
    let images = [];

    // If files are uploaded, use them
    if (req.files && req.files.length > 0) {
      // Convert file paths to full URLs accessible by frontend
      images = req.files.map(
        (file) => `http://localhost:5000/${file.path.replace(/\\/g, "/")}`
      );
    }

    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Add new images to existing ones
    room.images = [...(room.images || []), ...images];
    await room.save();

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
