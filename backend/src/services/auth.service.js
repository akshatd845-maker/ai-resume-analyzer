const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const { generateToken } = require('../utils/jwt');
const crypto = require('crypto');

// Password reset token store (in production, use Redis or database)
const passwordResetTokens = new Map();

/**
 * Generate password reset token and store it
 */
const generatePasswordResetToken = (email) => {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour

  passwordResetTokens.set(email, { token, expiresAt });

  // Clean up expired tokens
  for (const [key, value] of passwordResetTokens.entries()) {
    if (Date.now() > value.expiresAt) {
      passwordResetTokens.delete(key);
    }
  }

  return token;
};

/**
 * Validate password reset token
 */
const validatePasswordResetToken = (email, token) => {
  const entry = passwordResetTokens.get(email);

  if (!entry) {
    return false;
  }

  if (entry.token !== token) {
    return false;
  }

  if (Date.now() > entry.expiresAt) {
    passwordResetTokens.delete(email);
    return false;
  }

  return true;
};

/**
 * Clear password reset token
 */
const clearPasswordResetToken = (email) => {
  passwordResetTokens.delete(email);
};

const register = async (userData) => {
  const { email } = userData;

  // Normalize email before duplicate check and creation
  const normalizedEmail = email.trim().toLowerCase();

  // Check if email already exists
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw ApiError.conflict('Email already registered');
  }

  // Create new user with normalized email (provider defaults to 'local')
  const user = await User.create({ ...userData, email: normalizedEmail });
  user.password = undefined;

  return user;
};

const login = async (email, password) => {
  // Normalize email: lowercase only — no Gmail-specific transforms that would
  // break lookups for users whose emails were stored before normalizeEmail() was used.
  const normalizedEmail = email.trim().toLowerCase();

  // Find user with password
  const user = await User.findOne({ email: normalizedEmail }).select('+password');

  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  if (!user.password) {
    throw ApiError.unauthorized(
      'This account uses Google sign-in. Please continue with Google.',
    );
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate JWT token
  const accessToken = generateToken(user._id);

  // Remove password from response
  user.password = undefined;

  return {
    user,
    accessToken,
  };
};

const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  return user;
};

/**
 * Called by Passport's Google strategy after a successful OAuth handshake.
 * Finds an existing user by googleId or email, or creates a new one.
 * Returns the user document (password field never set).
 */
const findOrCreateGoogleUser = async (profile) => {
  const email = profile.emails?.[0]?.value;

  if (!email) {
    throw ApiError.badRequest('No email returned from Google account');
  }

  // 1. Try to find by googleId (fastest path for returning users)
  let user = await User.findOne({ googleId: profile.id });

  if (user) {
    user.lastLogin = new Date();
    await user.save();
    return user;
  }

  // 2. Try to find an existing local account with the same email
  user = await User.findOne({ email: email.toLowerCase() });

  if (user) {
    // Link the Google account to the existing local account
    user.googleId = profile.id;
    user.provider = 'google';
    user.lastLogin = new Date();
    // Use Google avatar only if no custom avatar is already set
    if (!user.avatar?.secure_url && profile.photos?.[0]?.value) {
      user.avatar = { secure_url: profile.photos[0].value, public_id: '' };
    }
    await user.save();
    return user;
  }

  // 3. Create a new user from the Google profile
  const displayName =
    profile.displayName ||
    [profile.name?.givenName, profile.name?.familyName].filter(Boolean).join(' ') ||
    email.split('@')[0];

  user = await User.create({
    name: displayName,
    email: email.toLowerCase(),
    googleId: profile.id,
    provider: 'google',
    isEmailVerified: true, // Google already verified the email
    lastLogin: new Date(),
    avatar: profile.photos?.[0]?.value
      ? { secure_url: profile.photos[0].value, public_id: '' }
      : undefined,
  });

  return user;
};

/**
 * Update user profile (name, email)
 */
const updateProfile = async (userId, updateData) => {
  const user = await User.findById(userId);

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  // Check if email is being changed and if it's already taken
  if (updateData.email && updateData.email.toLowerCase() !== user.email) {
    const existingUser = await User.findOne({ email: updateData.email.toLowerCase() });
    if (existingUser) {
      throw ApiError.conflict('Email already in use');
    }
    user.email = updateData.email.toLowerCase();
    user.isEmailVerified = false;
  }

  // Update name if provided
  if (updateData.name) {
    user.name = updateData.name;
  }

  await user.save();
  user.password = undefined;

  return user;
};

/**
 * Update user avatar
 */
const updateAvatar = async (userId, avatarData) => {
  const user = await User.findById(userId);

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  user.avatar = avatarData;
  await user.save();
  user.password = undefined;

  return user;
};

/**
 * Change user password
 */
const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  // Check if user has a password (Google OAuth users don't have password)
  if (!user.password) {
    throw ApiError.badRequest('Cannot change password for Google OAuth accounts');
  }

  // Verify current password
  const isPasswordValid = await user.comparePassword(currentPassword);
  if (!isPasswordValid) {
    throw ApiError.unauthorized('Current password is incorrect');
  }

  // Update password (pre-save middleware will hash it)
  user.password = newPassword;
  await user.save();
  user.password = undefined;

  return { message: 'Password changed successfully' };
};

/**
 * Request password reset
 */
const forgotPassword = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase() });

  // Don't reveal if user exists or not
  if (!user) {
    return { message: 'If the email exists, a reset link will be sent' };
  }

  // Don't allow password reset for Google OAuth users
  if (user.provider === 'google') {
    return { message: 'If the email exists, a reset link will be sent' };
  }

  const token = generatePasswordResetToken(email.toLowerCase());

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetLink = `${frontendUrl}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

  if (process.env.NODE_ENV === 'development') {
    // Only log/return reset link in development to aid local testing
    console.log(`[DEV] Password reset link: ${resetLink}`);
    return {
      message: 'If the email exists, a reset link will be sent',
      resetLink,
    };
  }

  // TODO: send resetLink via email (e.g. nodemailer / SendGrid) in production

  return {
    message: 'If the email exists, a reset link will be sent',
  };
};

/**
 * Reset password with token
 */
const resetPassword = async (email, token, newPassword) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  // Don't allow password reset for Google OAuth users
  if (user.provider === 'google') {
    throw ApiError.badRequest('Cannot reset password for Google OAuth accounts');
  }

  // Validate token
  if (!validatePasswordResetToken(email.toLowerCase(), token)) {
    throw ApiError.badRequest('Invalid or expired reset token');
  }

  // Update password
  user.password = newPassword;
  await user.save();

  // Clear the token
  clearPasswordResetToken(email.toLowerCase());

  return { message: 'Password reset successfully' };
};

module.exports = {
  register,
  login,
  getCurrentUser,
  findOrCreateGoogleUser,
  updateProfile,
  updateAvatar,
  changePassword,
  forgotPassword,
  resetPassword,
};