const express = require('express');
const passport = require('passport');
const multer = require('multer');
const path = require('path');
const authController = require('../controllers/auth.controller');
const validate = require('../middleware/validation.middleware');
const {
  registerValidator,
  loginValidator,
  updateProfileValidator,
  changePasswordValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require('../validators/auth.validator');
const authenticate = require('../middleware/auth.middleware');
const { generateToken } = require('../utils/jwt');
const { createOAuthCode } = require('../utils/oauthCodeStore');

// Avatar upload storage (local only for avatars)
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/avatars');
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const avatarUpload = multer({
  storage: avatarStorage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed'), false);
    }
  },
});

const router = express.Router();

// ─── Email / Password ────────────────────────────────────────────────────────

// Register route
router.post('/register', registerValidator, validate, authController.register);

// Login route
router.post('/login', loginValidator, validate, authController.login);

// Get current user (protected route)
router.get('/me', authenticate, authController.getCurrentUser);

// Exchange OAuth one-time code for JWT
router.post('/oauth/exchange', authController.exchangeOAuthCode);

// ─── Google OAuth ─────────────────────────────────────────────────────────────

/**
 * GET /api/auth/google
 * Initiates the Google OAuth 2.0 consent screen redirect.
 * The frontend must use window.location.href — not axios.
 */
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: true,
  }),
);

/**
 * GET /api/auth/google/callback
 * Google redirects here after the user approves (or denies) access.
 * On success  → store JWT in session → redirect to frontend /auth/callback
 * On failure  → redirect to /login?error=google_auth_failed
 */
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=google_auth_failed`,
  }),
  (req, res) => {
    try {
      const token = generateToken(req.user._id);
      const frontendBase = process.env.FRONTEND_URL || 'http://localhost:5173';
      const code = createOAuthCode(token);

      return res.redirect(`${frontendBase}/auth/callback?code=${encodeURIComponent(code)}`);
    } catch {
      const frontendBase = process.env.FRONTEND_URL || 'http://localhost:5173';
      return res.redirect(`${frontendBase}/login?error=token_generation_failed`);
    }
  },
);

// ─── Profile Management ────────────────────────────────────────────────────────

// Update profile (name, email) - protected
router.patch('/profile', authenticate, updateProfileValidator, validate, authController.updateProfile);

// Update avatar - protected
router.post('/avatar', authenticate, avatarUpload.single('avatar'), authController.updateAvatar);

// Change password - protected
router.post('/change-password', authenticate, changePasswordValidator, validate, authController.changePassword);

// ─── Password Reset ───────────────────────────────────────────────────────────

// Forgot password - public
router.post('/forgot-password', forgotPasswordValidator, validate, authController.forgotPassword);

// Reset password - public
router.post('/reset-password', resetPasswordValidator, validate, authController.resetPassword);

module.exports = router;
