const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });
const logger = require('./utils/logger');
const securityHeaders = require('./middleware/securityMiddleware');
const compressionMiddleware = require('./middleware/compressionMiddleware');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const sanitizeInputs = require('./middleware/sanitizationMiddleware');
const {
  authLimiter,
  paymentLimiter,
  generalLimiter,
} = require('./middleware/rateLimitMiddleware');

// Ensure uploads directory exists (important for Render deployments)
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();

// CORS Configuration: Allows specific frontend domains (Vercel, localhost)
// to make requests to this backend API, and allows all methods.
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:5173',
      'http://localhost:3000',
    ].filter(Boolean);

    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    // Allow any Vercel preview/production deployment
    if (/https:\/\/[a-z0-9-]+-[a-z0-9]+-[a-z0-9]+\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }
    // Allow the main vercel.app domain for the project
    if (/https:\/\/hotel-booking-system[a-z0-9-]*\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.use(securityHeaders);
app.use(compressionMiddleware);
app.use(express.json());
app.use(sanitizeInputs); // Sanitize all inputs globally
app.use(generalLimiter); // Apply general rate limit globally
app.use('/uploads', express.static('uploads'));
app.use('/', require('./routes/healthRoutes'));
app.use('/api', require('./routes/healthRoutes'));

app.get('/', (req, res) => {
  res.json({ message: 'Hotel Booking API is running' });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => logger.info('✅ MongoDB Connected'))
  .catch((err) => {
    logger.error('❌ MongoDB Error:', err.message);
    process.exit(1);
  });

// Apply auth-specific rate limiting to auth routes
const authRoutes = require('./routes/authRoutes');
app.post('/api/auth/login', authLimiter, authRoutes);
app.post('/api/auth/register', authLimiter, authRoutes);
app.use('/api/auth', authRoutes);

app.use('/api/rooms', require('./routes/roomRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));

// Apply OTP rate limiting to verification routes
const verificationRoutes = require('./routes/verificationRoutes');
app.post('/api/verify/send-email-otp', authLimiter, verificationRoutes);
app.post('/api/verify/send-phone-otp', authLimiter, verificationRoutes);
app.use('/api/verify', verificationRoutes);
try {
  app.use('/api/payment', paymentLimiter, require('./routes/paymentRoutes'));
} catch (error) {
  logger.error('Error loading payment routes:', error.message);
}

// Error handling middleware
// Must be after all route definitions
app.use(notFound);
app.use(errorHandler);

// For Vercel serverless
if (process.env.VERCEL) {
  module.exports = app;
} else {
  // For local development and Render
  const server = app.listen(process.env.PORT || 5000, () =>
    logger.info(`Server running on port ${process.env.PORT || 5000}`)
  );
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
  });
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });
}
