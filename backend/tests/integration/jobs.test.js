const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/user.model');
const Job = require('../../src/models/job.model');
const Resume = require('../../src/models/resume.model');
const ResumeAnalysis = require('../../src/models/analysis.model');
const { generateToken } = require('../../src/utils/jwt');
const httpStatus = require('../../src/constants/httpStatus');

describe('Jobs and Matching Integration Tests', () => {
  let userToken;
  let adminToken;
  let userId;
  let adminId;
  let testJob;

  beforeEach(async () => {
    // Regular User
    const user = await User.create({
      name: 'Regular Candidate',
      email: 'candidate@example.com',
      password: 'Password123!',
      role: 'user',
    });
    userId = user._id;
    userToken = generateToken(userId);

    // Admin User
    const admin = await User.create({
      name: 'Admin Manager',
      email: 'admin@example.com',
      password: 'Password123!',
      role: 'admin',
    });
    adminId = admin._id;
    adminToken = generateToken(adminId);

    // Create a default job
    testJob = await Job.create({
      title: 'Full Stack Engineer',
      description: 'Looking for a developer skilled in React, Node, and Python.',
      category: 'engineering',
      requiredSkills: ['react', 'node'],
      preferredSkills: ['python'],
      experienceLevel: 'mid',
      location: 'Remote',
      employmentType: 'full-time',
      isActive: true,
    });
  });

  it('should get all active jobs list', async () => {
    const res = await request(app)
      .get('/api/jobs')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(httpStatus.OK);
    expect(res.body.success).toBe(true);
    expect(res.body.data.jobs.length).toBeGreaterThan(0);
  });

  it('should fetch a single job by ID', async () => {
    const res = await request(app)
      .get(`/api/jobs/${testJob._id}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(httpStatus.OK);
    expect(res.body.success).toBe(true);
    expect(res.body.data.job.title).toBe('Full Stack Engineer');
  });

  it('should allow admin to create a new job', async () => {
    const newJobPayload = {
      title: 'Cloud Architect',
      description: 'Design robust cloud architectures with AWS and Kubernetes.',
      category: 'engineering',
      requiredSkills: ['aws', 'kubernetes'],
      preferredSkills: ['docker'],
      experienceLevel: 'senior',
      location: 'New York',
      employmentType: 'full-time',
      isActive: true,
    };

    const res = await request(app)
      .post('/api/jobs')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newJobPayload);

    expect(res.statusCode).toBe(httpStatus.CREATED);
    expect(res.body.success).toBe(true);
    expect(res.body.data.job.title).toBe('Cloud Architect');
  });

  it('should return 403 forbidden if regular user tries to create a job', async () => {
    const res = await request(app)
      .post('/api/jobs')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ title: 'Hacker' });

    expect(res.statusCode).toBe(httpStatus.FORBIDDEN);
    expect(res.body.success).toBe(false);
  });

  it('should successfully match a resume to active jobs', async () => {
    // Setup resume and parsing records for matching
    const resume = await Resume.create({
      user: userId,
      originalFileName: 'cv.pdf',
      publicId: 'pid-match',
      secureUrl: 'http://url',
      fileSize: 1024,
      mimeType: 'application/pdf',
      uploadStatus: 'completed',
    });

    await ResumeAnalysis.create({
      resume: resume._id,
      user: userId,
      rawText: 'Experienced developer skilled in React, Node, and Python.',
      parsingStatus: 'completed',
      extractedData: {
        skills: ['react', 'node', 'python'],
        experience: ['Test Corp — 2 years'],
        education: ['BS Computer Science'],
      },
    });

    const res = await request(app)
      .post(`/api/jobs/match/${resume._id}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(httpStatus.OK);
    expect(res.body.success).toBe(true);
    expect(res.body.data.bestMatches).toBeDefined();
    expect(res.body.data.totalJobs).toBeGreaterThan(0);
  });
});
