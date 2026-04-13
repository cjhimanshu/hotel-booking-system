// File upload errors handler and utilities
const handleUploadErrors = (err, res) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File size too large. Maximum size is 5MB',
    });
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      success: false,
      message: 'Too many files',
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message: 'Unexpected file field',
    });
  }

  res.status(500).json({
    success: false,
    message: 'Upload failed',
  });
};

const validateFileType = (file, allowedTypes) => {
  return allowedTypes.includes(file.mimetype);
};

module.exports = {
  handleUploadErrors,
  validateFileType,
};
