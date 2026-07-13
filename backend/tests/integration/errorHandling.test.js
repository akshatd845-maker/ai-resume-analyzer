const request = require('supertest');
const app = require('../../src/app');
const { generateToken } = require('../../src/utils/jwt');
const User = require('../../src/models/user.model');
const httpStatus = require('../../src/constants/httpStatus');

describe('Error Handling Integration Tests', () => {
  let token;

  beforeEach(async () => {
    const user = await User.create({
      name: 'Error Tester',
      email: 'error@example.com',
      password: 'Password123!',
    });
    token = generateToken(user._id);
  });

  it('should return 404 for non-existent route paths', async () => {
    const res = await request(app)
      .get('/api/auth/non-existent-subpath-abc')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(httpStatus.NOT_FOUND);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Route not found');
  });

  it('should return 400 Bad Request for invalid mongo ObjectId cast format', async () => {
    const res = await request(app)
      .get('/api/resumes/invalid-mongodb-id-format')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(httpStatus.BAD_REQUEST);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Invalid ID format');
  });
});
