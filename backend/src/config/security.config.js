
// Extract and parse environment variables
const rateLimitWindowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000; // 15 mins
const rateLimitMax = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 5; // 5 requests
const maxUploadSize = parseInt(process.env.MAX_UPLOAD_SIZE) || 5 * 1024 * 1024; // 5 MB

module.exports = {
  // CORS configuration
  cors: {
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }
      
      const isLocalhost = origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:');
      if (isLocalhost && process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }

      const allowed = [];
      if (process.env.FRONTEND_URL) {
        allowed.push(...process.env.FRONTEND_URL.split(',').map(url => url.trim()));
      }
      if (process.env.CORS_ORIGIN) {
        allowed.push(...process.env.CORS_ORIGIN.split(',').map(url => url.trim()));
      }

      if (allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },

  // Rate Limiting options (auth endpoints — strict)
  rateLimit: {
    windowMs: rateLimitWindowMs,
    max: rateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message: 'Too many requests from this IP, please try again later.',
      });
    },
  },

  // Rate limiting for expensive endpoints (upload, AI, matching)
  apiRateLimit: {
    windowMs: rateLimitWindowMs,
    max: parseInt(process.env.API_RATE_LIMIT_MAX) || 30,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
      });
    },
  },

  // Payload limits
  bodyLimit: '2mb',
  urlencodedLimit: '2mb',

  // Upload validation limits
  uploads: {
    maxSize: maxUploadSize,
    allowedMimeTypes: ['application/pdf'],
    blockedExtensions: ['.exe', '.bat', '.sh', '.cmd', '.com', '.vbs', '.js', '.bin', '.msi', '.jar'],
  },
};
