const { generateToken, verifyToken } = require('../../src/utils/jwt');
const jwt = require('jsonwebtoken');

describe('JWT Utility Unit Tests', () => {
  const originalSecret = process.env.JWT_SECRET;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-token-jwt-secret-key-12345';
  });

  afterEach(() => {
    process.env.JWT_SECRET = originalSecret;
  });

  it('should generate a valid JWT token', () => {
    const token = generateToken('user-id-abc');
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.id).toBe('user-id-abc');
  });

  it('should verify a valid token and return payload', () => {
    const payload = { id: 'user-id-xyz' };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    const decoded = verifyToken(token);
    expect(decoded.id).toBe('user-id-xyz');
  });

  it('should throw an error during token generation if JWT_SECRET is missing', () => {
    delete process.env.JWT_SECRET;
    expect(() => generateToken('user-123')).toThrow('JWT_SECRET is not defined');
  });

  it('should throw an error during token verification if JWT_SECRET is missing', () => {
    delete process.env.JWT_SECRET;
    expect(() => verifyToken('mockToken')).toThrow('JWT_SECRET is not defined');
  });
});
