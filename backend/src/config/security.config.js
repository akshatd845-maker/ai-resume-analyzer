
// Extract and parse environment variables
const rateLimitWindowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000; // 15 mins
const rateLimitMax = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 5; // 5 requests
const maxUploadSize = parseInt(process.env.MAX_UPLOAD_SIZE) || 5 * 1024 * 1024; // 5 MB

module.exports = {
  // CORS configuration
  cors: {
    origin: (origin, callback) => {
      // Allow server-to-server / curl (no origin header)
      if (!origin) {
        return callback(null, true);
      }

      // Allow any localhost in development
      const isLocalhost =
        origin.startsWith('http://localhost:') ||
        origin.startsWith('http://127.0.0.1:');
      if (isLocalhost && process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }

      // Build explicit allow-list from env vars (comma-separated)
      const allowed = [];
      if (process.env.FRONTEND_URL) {
        allowed.push(...process.env.FRONTEND_URL.split(',').map((u) => u.trim()));
      }
      if (process.env.CORS_ORIGIN) {
        allowed.push(...process.env.CORS_ORIGIN.split(',').map((u) => u.trim()));
      }

      // Exact match first
      if (allowed.includes(origin)) {
        return callback(null, true);
      }

      // Allow ALL Vercel preview deployments for this project
      // Pattern: https://<project>-<hash>-<scope>.vercel.app
      const isVercelPreview =
        /^https:\/\/ai-resume-analyzer[a-z0-9-]*\.vercel\.app$/.test(origin);
      if (isVercelPreview) {
        return callback(null, true);
      }

      callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
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
