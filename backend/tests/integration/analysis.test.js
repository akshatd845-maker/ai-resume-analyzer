const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/user.model');
const Resume = require('../../src/models/resume.model');
const ResumeAnalysis = require('../../src/models/analysis.model');
const { generateToken } = require('../../src/utils/jwt');
const httpStatus = require('../../src/constants/httpStatus');

// Mock ai.service to skip live OpenAI completions
jest.mock('../../src/services/ai.service', () => ({
  analyzeResume: jest.fn().mockResolvedValue({
    atsScore: 82,
    summary: 'AI analyzed candidate details.',
    strengths: ['React programming', 'Database design'],
    weaknesses: ['Missing Kubernetes experience'],
    missingSkills: ['kubernetes'],
    improvementSuggestions: [
      {
        section: 'General',
        suggestion: 'Add certified cloud practitioner credential',
        priority: 'medium',
      },
    ],
    recommendedJobRoles: ['Full Stack Developer'],
  }),
}));

describe('Analysis and ATS Integration Tests', () => {
  let token;
  let userId;
  let resumeId;

  beforeEach(async () => {
    const user = await User.create({
      name: 'Tester Analysis',
      email: 'analysis@example.com',
      password: 'Password123!',
    });
    userId = user._id;
    token = generateToken(userId);

    const resume = await Resume.create({
      user: userId,
      originalFileName: 'cv.pdf',
      publicId: 'pid1',
      secureUrl: 'http://secure',
      fileSize: 1024,
      mimeType: 'application/pdf',
      uploadStatus: 'completed',
    });
    resumeId = resume._id;

    await ResumeAnalysis.create({
      resume: resumeId,
      user: userId,
      rawText: 'Mock raw resume text showing React, Node.js, and MongoDB.',
      parsingStatus: 'completed',
      extractedData: {
        skills: ['react', 'node.js', 'mongodb'],
        experience: ['Test Corp — Dev'],
        education: ['BSCS — State University'],
      },
    });
  });

  it('should successfully run AI analysis on a parsed resume', async () => {
    const res = await request(app)
      .post(`/api/analysis/${resumeId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(httpStatus.OK);
    expect(res.body.success).toBe(true);
    expect(res.body.data.analysis.aiAnalysis).toBeDefined();
    expect(res.body.data.analysis.aiAnalysis.summary).toBe('AI analyzed candidate details.');
  });

  it('should get analysis details of a resume', async () => {
    const res = await request(app)
      .get(`/api/analysis/${resumeId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(httpStatus.OK);
    expect(res.body.success).toBe(true);
    expect(res.body.data.analysis.parsingStatus).toBe('completed');
  });

  it('should trigger and return ATS scoring for a resume', async () => {
    const res = await request(app)
      .post(`/api/analysis/${resumeId}/ats`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(httpStatus.OK);
    expect(res.body.success).toBe(true);
    expect(res.body.data.atsResults.overallScore).toBeDefined();
    expect(res.body.data.atsResults.recommendations.length).toBeGreaterThan(0);
  });

  it('should retrieve parsed ATS results', async () => {
    // Populate some atsResults in the db first
    await ResumeAnalysis.findOneAndUpdate(
      { resume: resumeId },
      {
        atsResults: {
          overallScore: 78,
          categoryScores: { skills: 80 },
          missingSections: [],
          missingKeywords: [],
          recommendations: ['Improve details'],
        },
      }
    );

    const res = await request(app)
      .get(`/api/analysis/${resumeId}/ats`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(httpStatus.OK);
    expect(res.body.success).toBe(true);
    expect(res.body.data.atsResults.overallScore).toBe(78);
  });
});
