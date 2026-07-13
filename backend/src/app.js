require('./config/env');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const hpp = require('hpp');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const passport = require('./config/passport');
const corsConfig = require('./config/corsConfig');
const morganMiddleware = require('./config/morganConfig');
const securityConfig = require('./config/security.config');
const healthRouter = require('./routes/health');
const authRouter = require('./routes/auth.routes');
const resumeRouter = require('./routes/resume.routes');
const analysisRouter = require('./routes/analysis.routes');
const jobRouter = require('./routes/job.routes');
const dashboardRouter = require('./routes/dashboard.routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Ensure upload directories exist
const ensureDirectories = () => {
  const dirs = [
    path.join(__dirname, '../uploads'),
    path.join(__dirname, '../uploads/avatars'),
    path.join(__dirname, '../temp'),
  ];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};
ensureDirectories();

// Custom XSS Sanitizer compatible with Express 5
const cleanValue = (val) => {
  if (typeof val === 'string') {
    return val
      .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
      .replace(/<[^>]*>/g, '');
  }
  if (Array.isArray(val)) {
    return val.map(cleanValue);
  }
  if (typeof val === 'object' && val !== null) {
    const cleaned = {};
    for (const key in val) {
      if (Object.prototype.hasOwnProperty.call(val, key)) {
        cleaned[key] = cleanValue(val[key]);
      }
    }
    return cleaned;
  }
  return val;
};

const customXssClean = (req, res, next) => {
  if (req.body) {
    req.body = cleanValue(req.body);
  }
  if (req.query) {
    for (const key in req.query) {
      if (Object.prototype.hasOwnProperty.call(req.query, key)) {
        req.query[key] = cleanValue(req.query[key]);
      }
    }
  }
  if (req.params) {
    for (const key in req.params) {
      if (Object.prototype.hasOwnProperty.call(req.params, key)) {
        req.params[key] = cleanValue(req.params[key]);
      }
    }
  }
  next();
};

const app = express();

// Secure HTTP headers
app.use(helmet());

// Enable gzip compression
app.use(compression());

// Request Size Limits
app.use(express.json({ limit: securityConfig.bodyLimit }));
app.use(express.urlencoded({ extended: true, limit: securityConfig.urlencodedLimit }));

// Sanitize incoming requests (XSS Clean)
app.use(customXssClean);

// Prevent HTTP Parameter Pollution
app.use(hpp());

// CORS configuration
app.use(corsConfig);

// Session — used only for the OAuth round-trip (Passport serializeUser/deserializeUser).
// JWT handles all subsequent auth; sessions are not used for API requests.
app.use(
  session({
    secret: (() => {
      const secret = process.env.SESSION_SECRET || process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('SESSION_SECRET or JWT_SECRET environment variable must be set');
      }
      return secret;
    })(),
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 10 * 60 * 1000, // 10 minutes — only needed for the OAuth round-trip
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    },
  }),
);

// Passport — initialize after session
app.use(passport.initialize());
app.use(passport.session());

// Rate Limiting applied to login & register endpoints (skip in test)
if (process.env.NODE_ENV !== 'test') {
  const authLimiter = rateLimit(securityConfig.rateLimit);
  app.use('/api/auth/login', authLimiter);
  app.use('/api/auth/register', authLimiter);

  const apiLimiter = rateLimit(securityConfig.apiRateLimit);
  app.use('/api/resumes/upload', apiLimiter);
  app.use('/api/analysis', apiLimiter);
  app.use('/api/jobs/match', apiLimiter);
}

app.use(morganMiddleware);

// Static files for uploads
app.use('/api/uploads/avatars', express.static(path.join(__dirname, '../uploads/avatars')));

// Routes
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/resumes', resumeRouter);
app.use('/api/analysis', analysisRouter);
app.use('/api/jobs', jobRouter);
app.use('/api/dashboard', dashboardRouter);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;