const Room = require('../models/Room');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

const buildPublicUrl = (req, filePath) => {
  const publicBaseUrl = process.env.PUBLIC_BASE_URL;
  const origin = publicBaseUrl || `${req.protocol}://${req.get('host')}`;
  return `${origin}/${filePath.replace(/\\/g, '/')}`;
};

// Helper to wrap async controllers
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Valid room categories
const VALID_CATEGORIES = ['deluxe', 'standard', 'suite', 'premium', 'basic'];

exports.createRoom = asyncHandler(async (req, res, next) => {
  const { name, category, price, maxGuests, description, amenities } = req.body;

  // Input validation
  if (!name || !category || price === undefined || maxGuests === undefined) {
    return next(
      new AppError('Name, category, price, and maxGuests are required', 400)
    );
  }

  if (!VALID_CATEGORIES.includes(category.toLowerCase())) {
    return next(
      new AppError(
        `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`,
        400
      )
    );
  }

  // Validate price
  const priceNum = parseFloat(price);
  if (isNaN(priceNum) || priceNum <= 0) {
    return next(new AppError('Price must be a positive number', 400));
  }

  // Validate maxGuests
  const guestsNum = parseInt(maxGuests, 10);
  if (isNaN(guestsNum) || guestsNum <= 0 || guestsNum > 20) {
    return next(new AppError('Max guests must be between 1 and 20', 400));
  }

  // Validate file sizes (5MB per file)
  if (req.files && req.files.length > 0) {
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const oversized = req.files.filter((f) => f.size > MAX_FILE_SIZE);
    if (oversized.length > 0) {
      return next(new AppError('Image files must not exceed 5MB each', 400));
    }
  }

  let images = [];

  // If files are uploaded, use them
  if (req.files && req.files.length > 0) {
    images = req.files.map((file) => buildPublicUrl(req, file.path));
  }
  // Otherwise, if a preset image URL is provided, use it
  else if (req.body.imageUrl) {
    images = [req.body.imageUrl];
  }

  const room = await Room.create({
    name: name.trim(),
    category: category.toLowerCase(),
    price: priceNum,
    maxGuests: guestsNum,
    description: description ? description.trim() : '',
    amenities: amenities || [],
    images,
  });

  logger.info('Room created:', { roomId: room._id, name, price: priceNum });
  res.status(201).json({
    success: true,
    message: 'Room created successfully',
    room,
  });
});

exports.getRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find();
  res.json({
    success: true,
    count: rooms.length,
    rooms,
  });
});

exports.getRoomById = asyncHandler(async (req, res, next) => {
  const room = await Room.findById(req.params.id);
  if (!room) {
    return next(new AppError('Room not found', 404));
  }
  res.json({ success: true, room });
});

exports.deleteRoom = asyncHandler(async (req, res, next) => {
  const room = await Room.findByIdAndDelete(req.params.id);
  if (!room) {
    return next(new AppError('Room not found', 404));
  }
  logger.info('Room deleted:', { roomId: req.params.id });
  res.json({
    success: true,
    message: 'Room deleted successfully',
  });
});

exports.updateRoomImages = asyncHandler(async (req, res, next) => {
  const room = await Room.findById(req.params.id);
  if (!room) {
    return next(new AppError('Room not found', 404));
  }

  // Validate file sizes (5MB per file)
  if (req.files && req.files.length > 0) {
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const oversized = req.files.filter((f) => f.size > MAX_FILE_SIZE);
    if (oversized.length > 0) {
      return next(new AppError('Image files must not exceed 5MB each', 400));
    }
  }

  let images = [];

  // If files are uploaded, use them
  if (req.files && req.files.length > 0) {
    images = req.files.map((file) => buildPublicUrl(req, file.path));
  }

  // Add new images to existing ones
  room.images = [...(room.images || []), ...images];
  await room.save();

  logger.info('Room images updated:', {
    roomId: room._id,
    imageCount: room.images.length,
  });
  res.json({
    success: true,
    message: 'Images updated successfully',
    room,
  });
});
