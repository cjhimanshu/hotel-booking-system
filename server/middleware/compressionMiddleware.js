// Compression middleware for reducing response size
const compression = require('compression');

const compressionMiddleware = compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6, // compression level 1-9
});

module.exports = compressionMiddleware;
