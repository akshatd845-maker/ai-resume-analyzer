const { calculateJobMatch } = require('../../src/services/jobMatching.service');

describe('Job Matching Service Unit Tests', () => {
  const mockResumeData = {
    extractedData: {
      skills: ['react', 'javascript', 'node.js', 'docker'],
      experience: [
        { company: 'Acme Corp', role: 'Full Stack Developer', duration: '2 years' },
      ],
      education: [
        { degree: 'Bachelor of Computer Science' },
      ],
    },
    rawText: 'React developer with Javascript, Docker, Node.js and AWS skills.',
  };

  const mockJob = {
    title: 'Frontend Engineer',
    description: 'Looking for a React developer with Javascript and AWS knowledge.',
    requiredSkills: ['react', 'javascript'],
    preferredSkills: ['aws', 'kubernetes'],
    experienceLevel: 'mid',
  };

  it('should compute job match percentage and categorised match details', () => {
    const match = calculateJobMatch(mockResumeData, mockJob);
    
    expect(match.matchPercentage).toBeGreaterThanOrEqual(0);
    expect(match.matchPercentage).toBeLessThanOrEqual(100);
    expect(Array.isArray(match.matchedSkills)).toBe(true);
    expect(Array.isArray(match.missingSkills)).toBe(true);
    expect(Array.isArray(match.recommendations)).toBe(true);
    expect(match.categoryScores).toBeDefined();
  });

  it('should identify missing required and preferred skills', () => {
    const jobWithMissing = {
      ...mockJob,
      requiredSkills: ['react', 'python'], // python is missing in resume
    };
    
    const match = calculateJobMatch(mockResumeData, jobWithMissing);
    expect(match.missingSkills).toContain('python');
    expect(match.matchedSkills).toContain('react');
  });
});
