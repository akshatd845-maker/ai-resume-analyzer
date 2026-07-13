const ApiResponse = require('../../src/utils/ApiResponse');
const httpStatus = require('../../src/constants/httpStatus');

describe('ApiResponse Unit Tests', () => {
  it('should instantiate constructor with proper fields', () => {
    const resObj = new ApiResponse(200, true, 'Test Success', { userId: 1 }, ['some error']);
    expect(resObj.statusCode).toBe(200);
    expect(resObj.success).toBe(true);
    expect(resObj.message).toBe('Test Success');
    expect(resObj.data).toEqual({ userId: 1 });
    expect(resObj.errors).toEqual(['some error']);
    expect(resObj.timestamp).toBeDefined();
  });

  it('should create success responses', () => {
    const successRes = ApiResponse.success('Perfect match', { id: 45 });
    expect(successRes.statusCode).toBe(httpStatus.OK);
    expect(successRes.success).toBe(true);
    expect(successRes.message).toBe('Perfect match');
    expect(successRes.data).toEqual({ id: 45 });
  });

  it('should create created responses', () => {
    const createdRes = ApiResponse.created('User added', { id: 99 });
    expect(createdRes.statusCode).toBe(httpStatus.CREATED);
    expect(createdRes.success).toBe(true);
    expect(createdRes.message).toBe('User added');
  });

  it('should create error responses', () => {
    const errRes = ApiResponse.error('Server crash', ['DB error'], httpStatus.INTERNAL_SERVER_ERROR);
    expect(errRes.statusCode).toBe(httpStatus.INTERNAL_SERVER_ERROR);
    expect(errRes.success).toBe(false);
    expect(errRes.errors).toEqual(['DB error']);
  });

  it('should support static helper factories', () => {
    expect(ApiResponse.badRequest('Wrong params').statusCode).toBe(httpStatus.BAD_REQUEST);
    expect(ApiResponse.unauthorized('No key').statusCode).toBe(httpStatus.UNAUTHORIZED);
    expect(ApiResponse.forbidden().statusCode).toBe(httpStatus.FORBIDDEN);
    expect(ApiResponse.notFound().statusCode).toBe(httpStatus.NOT_FOUND);
  });

  it('should send response through express response mock object', () => {
    const jsonMock = jest.fn();
    const statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    const resMock = { status: statusMock };

    const apiRes = ApiResponse.success('OK', { done: true });
    apiRes.send(resMock);

    expect(statusMock).toHaveBeenCalledWith(httpStatus.OK);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: 'OK',
        data: { done: true },
      })
    );
  });
});
