/**
 * Custom AppError class for structured error handling
 * Extends Error to provide statusCode and context information
 */
class AppError extends Error {
  constructor(message, statusCode = 500, context = {}) {
    super(message);
    this.statusCode = statusCode;
    this.context = context;
    this.timestamp = new Date().toISOString();
    this.isOperational = true; // Marks error as expected/operational

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
