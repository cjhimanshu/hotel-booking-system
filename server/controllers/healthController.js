// Health check endpoint for monitoring
const healthCheck = (req, res) => {
  const healthStatus = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  };
  res.status(200).json(healthStatus);
};

module.exports = healthCheck;
