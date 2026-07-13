const ApiError = require('../utils/ApiError');
const httpStatus = require('../constants/httpStatus');

const errorHandler = (err, req, res, _next) => {
  let error = err;
  let statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let message = error.message || 'Internal Server Error';
  let errors = error.errors || [];

  // Log error for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error(`[ERROR] ${err.stack || err.message}`);
  } else {
    console.error(`[ERROR] ${err.message}`);
  }

  // If error is not an ApiError, convert it
  if (!(error instanceof ApiError)) {
    if (err.name === 'ValidationError') {
      statusCode = httpStatus.UNPROCESSABLE_ENTITY;
      message = 'Validation Error';
      errors = Object.values(err.errors).map(e => ({ field: e.path, message: e.message }));
    } else if (err.name === 'CastError') {
      statusCode = httpStatus.BAD_REQUEST;
      message = 'Invalid ID format';
    } else if (err.code === 11000) {
      statusCode = httpStatus.CONFLICT;
      message = 'Duplicate field value';
      errors = [{ message: 'A record with this value already exists' }];
    }
  }

  const response = {
    success: false,
    message,
    ...(errors.length > 0 && { errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};

const notFoundHandler = (req, res, next) => {
  const error = new ApiError(
    httpStatus.NOT_FOUND,
    `Route not found - ${req.originalUrl}`
  );
  next(error);
};

module.exports = { errorHandler, notFoundHandler };