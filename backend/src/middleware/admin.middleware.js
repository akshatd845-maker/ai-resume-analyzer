const ApiError = require('../utils/ApiError');

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return next(ApiError.forbidden('Only admins can perform this action'));
  }
  next();
};

module.exports = requireAdmin;
