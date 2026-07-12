const rateLimit = require('express-rate-limit');

const redeemRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  keyGenerator: (req) => String(req.user?.id || req['ip'] || req.headers['x-forwarded-for'] || '127.0.0.1'),
  message: 'Too many redemption attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = redeemRateLimiter;
