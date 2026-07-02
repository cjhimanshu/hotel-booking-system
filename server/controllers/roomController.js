const Room = require('../models/Room');

const buildPublicUrl = (req, filePath) => {
  const publicBaseUrl = process.env.PUBLIC_BASE_URL;
  const origin = publicBaseUrl || `${req.protocol}://${req.get('host')}`;
  return `${origin}/${filePath.replace(/\\/g, '/')}`;
};

exports.createRoom = async (req, res) => {
  try {
    let images = [];

    // If files are uploaded, use them
    if (req.files && req.files.length > 0) {
      // Convert file paths to full URLs accessible by frontend
      images = req.files.map((file) => buildPublicUrl(req, file.path));
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
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: 'Room deleted' });
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
      images = req.files.map((file) => buildPublicUrl(req, file.path));
    }

    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Add new images to existing ones
    room.images = [...(room.images || []), ...images];
    await room.save();

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
