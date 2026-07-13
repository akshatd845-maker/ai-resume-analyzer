const authService = require('../services/auth.service');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { exchangeOAuthCode } = require('../utils/oauthCodeStore');

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const user = await authService.register({ name, email, password });

  const response = ApiResponse.created('Registration successful', {
    user,
  });

  return response.send(res);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await authService.login(email, password);

  const response = ApiResponse.success('Login successful', {
    user: result.user,
    accessToken: result.accessToken,
  });

  return response.send(res);
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user._id);

  const response = ApiResponse.success('User fetched successfully', {
    user,
  });

  return response.send(res);
});

/**
 * Exchange a one-time OAuth code for a JWT.
 * The code is single-use and expires after 5 minutes.
 */
const exchangeOAuthCodeHandler = asyncHandler(async (req, res) => {
  const { code } = req.body;

  if (!code || typeof code !== 'string') {
    throw ApiError.badRequest('OAuth code is required');
  }

  const accessToken = exchangeOAuthCode(code);

  if (!accessToken) {
    throw ApiError.unauthorized('OAuth code expired or invalid. Please sign in again.');
  }

  const response = ApiResponse.success('OAuth token exchanged successfully', {
    accessToken,
  });

  return response.send(res);
});

/**
 * Update user profile (name, email)
 */
const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { name, email } = req.body;

  const user = await authService.updateProfile(userId, { name, email });

  const response = ApiResponse.success('Profile updated successfully', {
    user,
  });

  return response.send(res);
});

/**
 * Update user avatar
 */
const updateAvatar = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Check if file was uploaded
    if (!req.file) {
      throw ApiError.badRequest('Please upload an image file');
    }

    // Avatar data comes from upload middleware
    const baseUrl = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 5000}/api`;
    const avatarData = {
      public_id: req.file.filename,
      secure_url: `${baseUrl}/uploads/avatars/${req.file.filename}`,
    };

    const user = await authService.updateAvatar(userId, avatarData);

    const response = ApiResponse.success('Avatar updated successfully', {
      user,
    });

    return response.send(res);
  } catch (error) {
    next(error);
  }
});

/**
 * Change user password
 */
const changePassword = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { currentPassword, newPassword } = req.body;

  const result = await authService.changePassword(userId, currentPassword, newPassword);

  const response = ApiResponse.success(result.message);

  return response.send(res);
});

/**
 * Request password reset
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const result = await authService.forgotPassword(email);

  const response = ApiResponse.success(result.message);

  // In production, don't include resetLink in response
  if (result.resetLink) {
    response.data = { resetLink: result.resetLink };
  }

  return response.send(res);
});

/**
 * Reset password with token
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { email, token, newPassword } = req.body;

  const result = await authService.resetPassword(email, token, newPassword);

  const response = ApiResponse.success(result.message);

  return response.send(res);
});

module.exports = {
  register,
  login,
  getCurrentUser,
  exchangeOAuthCode: exchangeOAuthCodeHandler,
  updateProfile,
  updateAvatar,
  changePassword,
  forgotPassword,
  resetPassword,
};