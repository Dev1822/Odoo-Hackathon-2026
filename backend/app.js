require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const compression = require('compression');
const { errorHandler } = require('./middlewares/errorHandler');
const requestId = require('./middlewares/requestId.gamification');

const app = express();

// Request ID middleware (must be first)
app.use(requestId);

// Security middleware with explicit CSP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      fontSrc: ["'self'", "https:", "data:"],
      formAction: ["'self'"],
      frameAncestors: ["'self'"],
      imgSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      scriptSrc: ["'self'"],
      scriptSrcAttr: ["'none'"],
      styleSrc: ["'self'", "https:", "'unsafe-inline'"],
      upgradeInsecureRequests: []
    }
  }
}));

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
  message: 'Too many requests from this IP, please try again later.',
  keyGenerator: (req) => req['ip'] || req.headers['x-forwarded-for'] || '127.0.0.1'
});

app.use('/api', apiLimiter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Dev token generation helper route (for local frontend testbed only)
app.get('/api/dev-token/:userId', async (req, res, next) => {
  try {
    const jwt = require('jsonwebtoken');
    const prisma = require('./config/db');
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(req.params.userId) }
    });
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    const token = jwt.sign(
      { employeeId: employee.id, role: employee.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({
      success: true,
      data: { token, employee }
    });
  } catch (error) {
    next(error);
  }
});

// Gamification routes
app.use('/api/gamification/challenges', require('./routes/gamification/challenge.gamification.routes'));
app.use('/api/gamification', require('./routes/gamification/participation.gamification.routes'));
app.use('/api/gamification', require('./routes/gamification/badge.gamification.routes'));
app.use('/api/gamification', require('./routes/gamification/reward.gamification.routes'));
app.use('/api/gamification', require('./routes/gamification/leaderboard.gamification.routes'));
app.use('/api/gamification', require('./routes/gamification/notification.gamification.routes'));

// Environmental routes
app.use('/api/environmental/emission-factors', require('./routes/environmental/emissionFactor.environmental.routes'));

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
