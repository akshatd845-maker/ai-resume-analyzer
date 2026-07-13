const asyncHandler = require('../../src/utils/asyncHandler');

describe('asyncHandler Unit Tests', () => {
  it('should call the wrapped function and pass next parameter', async () => {
    const mockFn = jest.fn().mockResolvedValue('value');
    const req = {};
    const res = {};
    const next = jest.fn();

    const handler = asyncHandler(mockFn);
    handler(req, res, next);

    expect(mockFn).toHaveBeenCalledWith(req, res, next);
  });

  it('should catch errors thrown by async function and forward to next()', async () => {
    const error = new Error('Async execution crash');
    const mockFn = jest.fn().mockRejectedValue(error);
    const req = {};
    const res = {};
    const next = jest.fn();

    const handler = asyncHandler(mockFn);
    handler(req, res, next);

    // Wait for the promise resolution chain
    await new Promise(resolve => setTimeout(resolve, 10));

    expect(next).toHaveBeenCalledWith(error);
  });
});
