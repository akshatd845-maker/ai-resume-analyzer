const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');
const httpStatus = require('../constants/httpStatus');

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = errors.array().map(err => ({
    field: err.path,
    message: err.msg,
  }));

  const validationError = new ApiError(
    httpStatus.UNPROCESSABLE_ENTITY,
    'Validation failed',
    extractedErrors,
  );

  next(validationError);
};

module.exports = validate;