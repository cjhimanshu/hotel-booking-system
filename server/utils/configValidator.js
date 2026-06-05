// Configuration validator to ensure app starts correctly
const logger = require('./logger');

const validateConfig = () => {
  const requiredEnvVars = [
    'PORT',
    'MONGO_URI',
    'JWT_SECRET',
    'RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET',
    'FRONTEND_URL',
  ];

  const errors = [];

  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      errors.push(`Missing required environment variable: ${varName}`);
    }
  });

  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    errors.push('JWT_SECRET should be at least 32 characters long');
  }

  if (errors.length > 0) {
    logger.error('Configuration Validation Errors:');
    errors.forEach((error) => logger.error(`  - ${error}`));
    process.exit(1);
  }

  logger.info('✓ Configuration validation passed');
  return true;
};

module.exports = validateConfig;
