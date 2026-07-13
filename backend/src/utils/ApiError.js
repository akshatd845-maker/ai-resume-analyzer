const httpStatus = require('../constants/httpStatus');

class ApiError extends Error {
  constructor(statusCode, message, errors = [], stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;
    this.data = null;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static badRequest(message, errors = []) {
    return new ApiError(httpStatus.BAD_REQUEST, message, errors);
  }

  static unauthorized(message = 'Unauthorized', errors = []) {
    return new ApiError(httpStatus.UNAUTHORIZED, message, errors);
  }

  static forbidden(message = 'Forbidden', errors = []) {
    return new ApiError(httpStatus.FORBIDDEN, message, errors);
  }

  static notFound(message = 'Not found', errors = []) {
    return new ApiError(httpStatus.NOT_FOUND, message, errors);
  }

  static conflict(message = 'Conflict', errors = []) {
    return new ApiError(httpStatus.CONFLICT, message, errors);
  }

  static internal(message = 'Internal server error', errors = []) {
    return new ApiError(httpStatus.INTERNAL_SERVER_ERROR, message, errors);
  }

  static serviceUnavailable(message = 'Service unavailable', errors = []) {
    return new ApiError(httpStatus.SERVICE_UNAVAILABLE, message, errors);
  }
}

module.exports = ApiError;