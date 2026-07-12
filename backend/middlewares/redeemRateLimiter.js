const rateLimit = require('express-rate-limit');

const redeemRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  keyGenerator: (req) => req.user?.id || req.ip,
  message: 'Too many redemption attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = redeemRateLimiter;
