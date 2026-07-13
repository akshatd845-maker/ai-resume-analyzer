const httpStatus = require('../constants/httpStatus');

class ApiResponse {
  constructor(statusCode, success, message, data = null, errors = []) {
    this.statusCode = statusCode;
    this.success = success;
    this.message = message;
    this.data = data;
    this.errors = errors;
    this.timestamp = new Date().toISOString();
  }

  static success(message, data = null, statusCode = httpStatus.OK) {
    return new ApiResponse(statusCode, true, message, data);
  }

  static created(message, data = null) {
    return new ApiResponse(httpStatus.CREATED, true, message, data);
  }

  static error(message, errors = [], statusCode = httpStatus.INTERNAL_SERVER_ERROR) {
    return new ApiResponse(statusCode, false, message, null, errors);
  }

  static badRequest(message, errors = []) {
    return ApiResponse.error(message, errors, httpStatus.BAD_REQUEST);
  }

  static unauthorized(message = 'Unauthorized access') {
    return ApiResponse.error(message, [], httpStatus.UNAUTHORIZED);
  }

  static forbidden(message = 'Forbidden') {
    return ApiResponse.error(message, [], httpStatus.FORBIDDEN);
  }

  static notFound(message = 'Resource not found') {
    return ApiResponse.error(message, [], httpStatus.NOT_FOUND);
  }

  send(res) {
    const response = {
      success: this.success,
      message: this.message,
      ...(this.data !== null && { data: this.data }),
      ...(this.errors.length > 0 && { errors: this.errors }),
      ...(process.env.NODE_ENV === 'development' && { timestamp: this.timestamp }),
    };

    return res.status(this.statusCode).json(response);
  }
}

module.exports = ApiResponse;