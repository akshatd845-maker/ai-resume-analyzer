const { calculateATSScore, generateATSAnalysis } = require('../../src/services/ats.service');

describe('ATS Service Unit Tests', () => {
  const mockExtractedData = {
    email: 'john@example.com',
    phone: '1234567890',
    skills: ['react', 'javascript', 'node.js', 'docker', 'mongodb', 'kubernetes', 'git', 'aws', 'python', 'java'],
    experience: [
      { company: 'Google', role: 'Software Engineer', duration: '2 years' },
    ],
    education: [
      { institution: 'MIT', degree: 'BS Computer Science' },
    ],
  };

  const mockRawText = 'John Doe. Summary: Experienced Software Engineer specializing in React and Node.js. Skills: Javascript, Kubernetes, Docker. Increased sales by 20% on projects.';

  it('should calculate category and overall weighted ATS scores', () => {
    const scoreResult = calculateATSScore(mockExtractedData, mockRawText);
    expect(scoreResult.overallScore).toBeGreaterThanOrEqual(0);
    expect(scoreResult.overallScore).toBeLessThanOrEqual(100);
    expect(scoreResult.categoryScores).toBeDefined();
    expect(scoreResult.categoryScores.contact).toBeDefined();
  });

  it('should generate complete ATS analysis containing all metric segments', () => {
    const analysis = generateATSAnalysis(mockExtractedData, mockRawText);
    expect(analysis.overallScore).toBeDefined();
    expect(analysis.categoryScores).toBeDefined();
    expect(Array.isArray(analysis.missingSections)).toBe(true);
    expect(Array.isArray(analysis.missingKeywords)).toBe(true);
    expect(Array.isArray(analysis.recommendations)).toBe(true);
  });

  it('should detect missing sections when resume lacks fields', () => {
    const incompleteData = {
      skills: [],
      experience: [],
      education: [],
    };
    const analysis = generateATSAnalysis(incompleteData, 'lacks sections text');
    expect(analysis.missingSections).toContain('Contact Information');
    expect(analysis.missingSections).toContain('Skills Section');
    expect(analysis.missingSections).toContain('Work Experience');
    expect(analysis.missingSections).toContain('Education');
    expect(analysis.missingSections).toContain('Professional Summary');
  });
});
