// express-rate-limit uses in-memory storage which is incompatible with
// Vercel serverless (each invocation is isolated). We keep the middleware
// as a no-op in production and apply real limits only in local dev.

const isProduction = process.env.NODE_ENV === 'production';

let rateLimit;
try {
  rateLimit = require('express-rate-limit');
} catch {
  rateLimit = null;
}

// Passthrough middleware (used on Vercel)
const noopLimiter = (req, res, next) => next();

const makeLimiter = (opts) => {
  if (isProduction || !rateLimit) return noopLimiter;
  return rateLimit({ ...opts, standardHeaders: true, legacyHeaders: false });
};

exports.globalLimiter = makeLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' }
});

exports.contactLimiter = makeLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many messages sent. Please try again in an hour.' }
});
