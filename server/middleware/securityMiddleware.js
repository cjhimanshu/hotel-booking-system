// Security middleware - Helmet configuration
const helmet = require('helmet');

const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://checkout.razorpay.com'],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https://checkout.razorpay.com'],
      frameSrc: ['https://checkout.razorpay.com'],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
    },
  },
  frameguard: {
    action: 'deny',
  },
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin',
  },
});

module.exports = securityHeaders;
