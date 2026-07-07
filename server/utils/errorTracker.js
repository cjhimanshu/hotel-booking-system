// Error tracking and monitoring utility
const logger = require('./logger');

class ErrorTracker {
  static logError(error, context = {}) {
    const statusCode = error.statusCode || 500;
    const errorLog = {
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
      context,
      severity: this.determineSeverity(statusCode),
      isOperational: error.isOperational === true,
    };

    // Always log errors with their severity
    const severityPrefix = `[${errorLog.severity.toUpperCase()}]`;
    if (statusCode >= 500) {
      logger.error(`${severityPrefix} ${error.message}`, errorLog);
    } else if (statusCode >= 400) {
      logger.warn(`${severityPrefix} ${error.message}`, errorLog);
    } else {
      logger.info(`${severityPrefix} ${error.message}`, errorLog);
    }

    // Send to error tracking service (e.g., Sentry)
    // this.sendToErrorService(errorLog);

    return errorLog;
  }

  static determineSeverity(statusCode) {
    if (!statusCode || statusCode >= 500) return 'critical';
    if (statusCode >= 400) return 'error';
    return 'warning';
  }

  static logWarning(message, context = {}) {
    logger.warn(`[WARNING] ${message}`, context);
  }

  static logInfo(message, context = {}) {
    logger.info(`[INFO] ${message}`, context);
  }

  static logDebug(message, data = {}) {
    logger.debug(`[DEBUG] ${message}`, data);
  }
}

module.exports = ErrorTracker;
