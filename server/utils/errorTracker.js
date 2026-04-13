// Error tracking and monitoring utility
class ErrorTracker {
  static logError(error, context = {}) {
    const errorLog = {
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
      context,
      severity: this.determineSeverity(error),
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ERROR TRACKED:', errorLog);
    }

    // Send to error tracking service (e.g., Sentry)
    // this.sendToErrorService(errorLog);

    return errorLog;
  }

  static determineSeverity(error) {
    if (error.statusCode >= 500) return 'critical';
    if (error.statusCode >= 400) return 'error';
    return 'warning';
  }

  static logWarning(message, context = {}) {
    console.warn(`[WARNING] ${message}`, context);
  }

  static logInfo(message, context = {}) {
    console.log(`[INFO] ${message}`, context);
  }
}

module.exports = ErrorTracker;
