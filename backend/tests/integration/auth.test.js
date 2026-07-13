const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/user.model');
const httpStatus = require('../../src/constants/httpStatus');

describe('Authentication Integration Tests', () => {
  const testUser = {
    name: 'Test Tester',
    email: 'test@example.com',
    password: 'Password123!',
  };

  it('should successfully register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.statusCode).toBe(httpStatus.CREATED);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testUser.email);
    expect(res.body.data.accessToken).toBeUndefined();

    const userInDb = await User.findOne({ email: testUser.email });
    expect(userInDb).toBeDefined();
    expect(userInDb.name).toBe(testUser.name);
  });

  it('should return error for invalid email structure', async () => {
    const invalidUser = {
      ...testUser,
      email: 'bad-email-format',
    };

    const res = await request(app)
      .post('/api/auth/register')
      .send(invalidUser);

    expect(res.statusCode).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    expect(res.body.success).toBe(false);
  });

  it('should return error for weak password', async () => {
    const weakUser = {
      ...testUser,
      email: 'weak@example.com',
      password: '123',
    };

    const res = await request(app)
      .post('/api/auth/register')
      .send(weakUser);

    expect(res.statusCode).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    expect(res.body.success).toBe(false);
  });

  it('should prevent registration with duplicate email', async () => {
    await User.create(testUser);

    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.statusCode).toBe(httpStatus.CONFLICT);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('already registered');
  });

  it('should login an existing user and return a token', async () => {
    await User.create(testUser);

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(res.statusCode).toBe(httpStatus.OK);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
  });

  it('should reject login for invalid credentials', async () => {
    await User.create(testUser);

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'WrongPassword!',
      });

    expect(res.statusCode).toBe(httpStatus.UNAUTHORIZED);
    expect(res.body.success).toBe(false);
  });

  it('should get current user profile with valid JWT', async () => {
    await User.create(testUser);

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    const token = loginRes.body.data.accessToken;

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(httpStatus.OK);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testUser.email);
  });

  it('should block profile requests with invalid JWT', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid-token-hash-123');

    expect(res.statusCode).toBe(httpStatus.UNAUTHORIZED);
    expect(res.body.success).toBe(false);
  });
});
