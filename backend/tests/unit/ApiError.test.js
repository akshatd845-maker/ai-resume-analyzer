const ApiError = require('../../src/utils/ApiError');
const httpStatus = require('../../src/constants/httpStatus');

describe('ApiError Unit Tests', () => {
  it('should instantiate error constructor with standard properties', () => {
    const error = new ApiError(httpStatus.BAD_REQUEST, 'Syntax error', ['field missing']);
    expect(error.statusCode).toBe(httpStatus.BAD_REQUEST);
    expect(error.message).toBe('Syntax error');
    expect(error.errors).toEqual(['field missing']);
    expect(error.success).toBe(false);
    expect(error.stack).toBeDefined();
  });

  it('should construct with custom stack trace if provided', () => {
    const error = new ApiError(500, 'Panic', [], 'custom-stack-trace');
    expect(error.stack).toBe('custom-stack-trace');
  });

  it('should support static helper constructors', () => {
    const badRequest = ApiError.badRequest('Required parameter key missing');
    expect(badRequest.statusCode).toBe(httpStatus.BAD_REQUEST);
    expect(badRequest.message).toBe('Required parameter key missing');

    const unauthorized = ApiError.unauthorized('Invalid login key');
    expect(unauthorized.statusCode).toBe(httpStatus.UNAUTHORIZED);

    const forbidden = ApiError.forbidden();
    expect(forbidden.statusCode).toBe(httpStatus.FORBIDDEN);

    const notFound = ApiError.notFound();
    expect(notFound.statusCode).toBe(httpStatus.NOT_FOUND);

    const conflict = ApiError.conflict('Already exists');
    expect(conflict.statusCode).toBe(httpStatus.CONFLICT);

    const internal = ApiError.internal();
    expect(internal.statusCode).toBe(httpStatus.INTERNAL_SERVER_ERROR);

    const serviceUnavailable = ApiError.serviceUnavailable();
    expect(serviceUnavailable.statusCode).toBe(httpStatus.SERVICE_UNAVAILABLE);
  });
});
