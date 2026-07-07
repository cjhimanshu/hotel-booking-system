const logger = require('../utils/logger');
const ErrorTracker = require('../utils/errorTracker');

/**
 * Central error handling middleware
 * IMPORTANT: Must have 4 parameters (err, req, res, next) to be recognized as Express error middleware
 */
exports.errorHandler = (err, req, res, next) => {
  // Determine status code
  const statusCode = err.statusCode || 500;
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Track and log error
  const errorContext = {
    method: req.method,
    url: req.originalUrl,
    statusCode,
    userId: req.user?.id,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  };

  ErrorTracker.logError(err, errorContext);

  // Prepare error response
  const errorResponse = {
    success: false,
    statusCode,
    message: err.message || 'Internal Server Error',
    ...(isDevelopment && { stack: err.stack, context: err.context || {} }),
  };

  // Send response
  res.status(statusCode).json(errorResponse);
};

/**
 * 404 Not Found middleware
 * Should be placed after all routes
 */
exports.notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

/**
 * Wrapper for async route handlers to catch errors
 * Usage: router.get('/path', asyncHandler(controller.method))
 */
exports.asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
