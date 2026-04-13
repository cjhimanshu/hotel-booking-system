// Request logging middleware
const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info(
      `${req.method} ${req.path}`,
      `Status: ${res.statusCode} | Duration: ${duration}ms`
    );
  });

  next();
};

module.exports = requestLogger;
