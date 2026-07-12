require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const compression = require('compression');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Compression
app.use(compression());

// Rate limiter for all /api routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX || 100,
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api', apiLimiter);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Gamification routes
app.use('/api/gamification/challenges', require('./routes/gamification/challenge.routes'));
app.use('/api/gamification', require('./routes/gamification/participation.routes'));
app.use('/api/gamification', require('./routes/gamification/badge.routes'));
app.use('/api/gamification', require('./routes/gamification/reward.routes'));
app.use('/api/gamification', require('./routes/gamification/leaderboard.routes'));

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
