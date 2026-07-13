const { analyzeResume, buildAnalysisPrompt } = require('../../src/services/ai.service');

describe('AI resume analysis profession detection', () => {
  it('infers a non-software profession and produces domain-specific recommendations', async () => {
    const result = await analyzeResume(
      {
        name: 'Alex Carter',
        email: 'alex@example.com',
        phone: '9876543210',
        skills: ['CATIA', 'ANSYS', 'GD&T', 'SolidWorks'],
        education: ['B.Tech Mechanical Engineering'],
        experience: ['Mechanical Design Engineer at Apex Components'],
        projects: ['Designed a fixture for automated assembly line'],
        certifications: ['Certified SolidWorks Associate'],
      },
      'Mechanical Engineer with expertise in CAD modelling, tolerance analysis, manufacturing support, and production quality improvements.'
    );

    expect(result.detectedProfile).toBeDefined();
    expect(result.detectedProfile.profession).toMatch(/Mechanical/i);
    expect(result.detectedProfile.industry).toMatch(/Manufacturing|Engineering/i);
    expect(result.industryFit.some((item) => /mechanical/i.test(item))).toBe(true);
    expect(result.recommendedJobRoles.some((role) => /mechanical|production|quality/i.test(role))).toBe(true);
    expect(result.missingSkills.some((skill) => /Tolerance|Manufacturing|Process/i.test(skill.name))).toBe(true);
    expect(result.summary).toMatch(/Mechanical/i);
  });

  it('includes the full resume text in the analysis prompt and preserves profession context', () => {
    const extractedData = {
      name: 'Jamie Rivera',
      email: 'jamie@example.com',
      phone: '5551234',
      skills: ['Teaching', 'Curriculum Design', 'Lesson Planning'],
      education: ['M.Ed Education'],
      experience: ['Secondary School Teacher'],
      projects: [],
      certifications: ['TESOL Certificate'],
    };
    const rawText = 'Teacher with 6 years of classroom experience and curriculum design expertise.';

    const prompt = buildAnalysisPrompt(extractedData, rawText);

    expect(prompt).toContain(rawText);
    expect(prompt).toContain('Profession');
    expect(prompt).toContain('Career Level');
    expect(prompt).toContain('FULL RESUME TEXT');
    expect(prompt).toMatch(/Teacher|Teaching/i);
  });
});
