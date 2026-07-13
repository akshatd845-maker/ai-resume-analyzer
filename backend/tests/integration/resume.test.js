process.env.MAX_UPLOAD_SIZE = '1024';
const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/user.model');
const Resume = require('../../src/models/resume.model');
const { generateToken } = require('../../src/utils/jwt');
const httpStatus = require('../../src/constants/httpStatus');

// Mock parser service to avoid real PDF parsing and OpenAI calls
jest.mock('../../src/services/parser.service', () => ({
  parseResumeFromUrl: jest.fn().mockResolvedValue({
    name: 'Test Candidate',
    email: 'candidate@example.com',
    phone: '123-456-7890',
    skills: ['react', 'javascript', 'node.js'],
    experience: [],
    education: [],
    rawText: 'Candidate summary with react developer skills.',
  }),
  saveAnalysis: jest.fn().mockResolvedValue({}),
}));

// Mock Cloudinary config & storage engine
jest.mock('../../src/config/cloudinary', () => {
  const multer = require('multer');
  const makeSecureStorage = require('../../src/utils/pdfValidator');
  const securityConfig = require('../../src/config/security.config');
  return {
    cloudinary: {
      uploader: {
        destroy: jest.fn().mockResolvedValue({ result: 'ok' }),
      },
    },
    upload: multer({
      storage: makeSecureStorage(multer.memoryStorage()),
      limits: {
        fileSize: securityConfig.uploads.maxSize,
      },
      fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
          cb(new Error('Only PDF files are allowed'), false);
        } else {
          cb(null, true);
        }
      },
    }),
  };
});

describe('Resume Integration Tests', () => {
  let token;
  let userId;

  beforeEach(async () => {
    const user = await User.create({
      name: 'Tester Resume',
      email: 'resume@example.com',
      password: 'Password123!',
    });
    userId = user._id;
    token = generateToken(userId);
  });

  it('should successfully upload a PDF resume', async () => {
    const res = await request(app)
      .post('/api/resumes/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('resume', Buffer.from('%PDF-1.4 ... dummy pdf content'), 'test_cv.pdf');

    expect(res.statusCode).toBe(httpStatus.CREATED);
    expect(res.body.success).toBe(true);
    expect(res.body.data.resume.originalFileName).toBe('test_cv.pdf');
  });

  it('should return 400 bad request if no resume file is attached', async () => {
    const res = await request(app)
      .post('/api/resumes/upload')
      .set('Authorization', `Bearer ${token}`)
      .send({}); // no attachment

    expect(res.statusCode).toBe(httpStatus.BAD_REQUEST);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 bad request if resume file has a .pdf extension but invalid magic bytes', async () => {
    const res = await request(app)
      .post('/api/resumes/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('resume', Buffer.from('NOT-A-PDF-header ... some content'), 'fake_cv.pdf');

    expect(res.statusCode).toBe(httpStatus.BAD_REQUEST);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Only PDF files are allowed');
  });

  it('should return 400 bad request if resume file has an invalid extension', async () => {
    const res = await request(app)
      .post('/api/resumes/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('resume', Buffer.from('%PDF-1.4 ... dummy pdf content'), 'malicious.exe');

    expect(res.statusCode).toBe(httpStatus.BAD_REQUEST);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Only PDF files are allowed');
  });

  it('should return 400 bad request if resume file has an invalid MIME type', async () => {
    const res = await request(app)
      .post('/api/resumes/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('resume', Buffer.from('%PDF-1.4 ... dummy pdf content'), { filename: 'test.png', contentType: 'image/png' });

    expect(res.statusCode).toBe(httpStatus.BAD_REQUEST);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Only PDF files are allowed');
  });

  it('should return 400 bad request if resume file is oversized', async () => {
    // Generate buffer larger than 1024 bytes (max size is set to 1024)
    const largeBuffer = Buffer.concat([Buffer.from('%PDF-'), Buffer.alloc(2000)]);
    const res = await request(app)
      .post('/api/resumes/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('resume', largeBuffer, 'large_cv.pdf');

    expect(res.statusCode).toBe(httpStatus.BAD_REQUEST);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('File size must be less than');
  });

  it('should fetch list of resumes for authenticated user', async () => {
    await Resume.create({
      user: userId,
      originalFileName: 'cv1.pdf',
      publicId: 'id1',
      secureUrl: 'http://url1',
      fileSize: 1024,
      mimeType: 'application/pdf',
      uploadStatus: 'completed',
    });

    const res = await request(app)
      .get('/api/resumes')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(httpStatus.OK);
    expect(res.body.success).toBe(true);
    expect(res.body.data.resumes.length).toBe(1);
    expect(res.body.data.resumes[0].originalFileName).toBe('cv1.pdf');
  });

  it('should fetch a single resume by ID', async () => {
    const resume = await Resume.create({
      user: userId,
      originalFileName: 'cv_target.pdf',
      publicId: 'id2',
      secureUrl: 'http://url2',
      fileSize: 2048,
      mimeType: 'application/pdf',
      uploadStatus: 'completed',
    });

    const res = await request(app)
      .get(`/api/resumes/${resume._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(httpStatus.OK);
    expect(res.body.success).toBe(true);
    expect(res.body.data.resume.originalFileName).toBe('cv_target.pdf');
  });

  it('should delete a resume by ID', async () => {
    const resume = await Resume.create({
      user: userId,
      originalFileName: 'cv_deleted.pdf',
      publicId: 'id3',
      secureUrl: 'http://url3',
      fileSize: 3000,
      mimeType: 'application/pdf',
      uploadStatus: 'completed',
    });

    const res = await request(app)
      .delete(`/api/resumes/${resume._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(httpStatus.OK);
    expect(res.body.success).toBe(true);

    const deleted = await Resume.findById(resume._id);
    expect(deleted).toBeNull();
  });
});
