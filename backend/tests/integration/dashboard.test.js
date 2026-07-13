const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/user.model');
const Resume = require('../../src/models/resume.model');
const { generateToken } = require('../../src/utils/jwt');
const httpStatus = require('../../src/constants/httpStatus');

describe('Dashboard Integration Tests', () => {
  let userToken;
  let adminToken;
  let userId;
  let adminId;

  beforeEach(async () => {
    // User
    const user = await User.create({
      name: 'Dashboard Tester',
      email: 'user-dash@example.com',
      password: 'Password123!',
      role: 'user',
    });
    userId = user._id;
    userToken = generateToken(userId);

    // Admin
    const admin = await User.create({
      name: 'Dashboard Admin',
      email: 'admin-dash@example.com',
      password: 'Password123!',
      role: 'admin',
    });
    adminId = admin._id;
    adminToken = generateToken(adminId);
  });

  it('should successfully get user dashboard payload', async () => {
    // Mock user resume
    await Resume.create({
      user: userId,
      originalFileName: 'cv.pdf',
      publicId: 'pid-dash',
      secureUrl: 'http://url',
      fileSize: 100,
      mimeType: 'application/pdf',
      uploadStatus: 'completed',
    });

    const res = await request(app)
      .get('/api/dashboard')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(httpStatus.OK);
    expect(res.body.success).toBe(true);
    expect(res.body.data.profile).toBeDefined();
    expect(res.body.data.resume).toBeDefined();
  });

  it('should allow admin to fetch admin dashboard payload', async () => {
    const res = await request(app)
      .get('/api/dashboard/admin')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(httpStatus.OK);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalUsers).toBeDefined();
    expect(res.body.data.totalResumes).toBeDefined();
  });

  it('should reject admin dashboard fetch attempts by regular users with 403', async () => {
    const res = await request(app)
      .get('/api/dashboard/admin')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(httpStatus.FORBIDDEN);
    expect(res.body.success).toBe(false);
  });
});
