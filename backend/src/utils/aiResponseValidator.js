const ApiError = require('../utils/ApiError');

const VALID_CAREER_LEVELS = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive', 'Student/Intern'];
const VALID_PRIORITIES = ['high', 'medium', 'low'];

const validateAIResponse = (response) => {
  try {
    let parsed;

    if (typeof response === 'string') {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON found in response');
      }
    } else if (typeof response === 'object') {
      parsed = response;
    } else {
      throw new Error('Invalid response type');
    }

    // Validate required fields
    const requiredFields = [
      'atsScore',
      'summary',
      'strengths',
      'weaknesses',
      'missingSkills',
      'improvementSuggestions',
      'recommendedJobRoles',
    ];

    for (const field of requiredFields) {
      if (!(field in parsed)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate atsScore
    if (typeof parsed.atsScore !== 'number' || parsed.atsScore < 0 || parsed.atsScore > 100) {
      throw new Error('atsScore must be a number between 0 and 100');
    }

    // Validate summary
    if (typeof parsed.summary !== 'string') {
      throw new Error('summary must be a string');
    }

    // Validate simple string arrays
    const stringArrayFields = ['strengths', 'weaknesses', 'missingSkills', 'recommendedJobRoles'];
    for (const field of stringArrayFields) {
      if (!Array.isArray(parsed[field])) {
        // Coerce to empty array rather than hard-fail
        parsed[field] = [];
      }
    }

    // Normalise improvementSuggestions — accept both old string[] and new object[] formats
    let improvementSuggestions = [];
    if (Array.isArray(parsed.improvementSuggestions)) {
      improvementSuggestions = parsed.improvementSuggestions.map((item) => {
        if (typeof item === 'string') {
          return { section: 'General', suggestion: item.trim(), priority: 'medium' };
        }
        if (typeof item === 'object' && item !== null) {
          return {
            section: typeof item.section === 'string' ? item.section.trim() : 'General',
            suggestion: typeof item.suggestion === 'string' ? item.suggestion.trim() : '',
            priority: VALID_PRIORITIES.includes(item.priority) ? item.priority : 'medium',
          };
        }
        return null;
      }).filter(Boolean).filter((s) => s.suggestion.length > 0);
    }

    // Career level (optional enhanced field)
    const careerLevel = VALID_CAREER_LEVELS.includes(parsed.careerLevel)
      ? parsed.careerLevel
      : 'Mid Level';

    // Industry fit (optional enhanced field)
    const industryFit = Array.isArray(parsed.industryFit)
      ? parsed.industryFit.filter((s) => typeof s === 'string' && s.trim()).slice(0, 5)
      : [];

    // Keyword optimization (optional enhanced field)
    const keywordOptimization = parsed.keywordOptimization && typeof parsed.keywordOptimization === 'object'
      ? {
          wellUsed: Array.isArray(parsed.keywordOptimization.wellUsed)
            ? parsed.keywordOptimization.wellUsed.filter((s) => typeof s === 'string' && s.trim())
            : [],
          shouldAdd: Array.isArray(parsed.keywordOptimization.shouldAdd)
            ? parsed.keywordOptimization.shouldAdd.filter((s) => typeof s === 'string' && s.trim())
            : [],
        }
      : { wellUsed: [], shouldAdd: [] };

    // Section feedback (optional enhanced field)
    const sectionFeedback = parsed.sectionFeedback && typeof parsed.sectionFeedback === 'object'
      ? {
          contact: typeof parsed.sectionFeedback.contact === 'string' ? parsed.sectionFeedback.contact.trim() : '',
          summary: typeof parsed.sectionFeedback.summary === 'string' ? parsed.sectionFeedback.summary.trim() : '',
          skills: typeof parsed.sectionFeedback.skills === 'string' ? parsed.sectionFeedback.skills.trim() : '',
          experience: typeof parsed.sectionFeedback.experience === 'string' ? parsed.sectionFeedback.experience.trim() : '',
          education: typeof parsed.sectionFeedback.education === 'string' ? parsed.sectionFeedback.education.trim() : '',
          overall: typeof parsed.sectionFeedback.overall === 'string' ? parsed.sectionFeedback.overall.trim() : '',
        }
      : { contact: '', summary: '', skills: '', experience: '', education: '', overall: '' };

    return {
      atsScore: Math.round(parsed.atsScore),
      careerLevel,
      industryFit,
      summary: parsed.summary.trim(),
      strengths: parsed.strengths.filter((s) => typeof s === 'string' && s.trim()),
      weaknesses: parsed.weaknesses.filter((w) => typeof w === 'string' && w.trim()),
      missingSkills: parsed.missingSkills.filter((s) => typeof s === 'string' && s.trim()),
      improvementSuggestions,
      recommendedJobRoles: parsed.recommendedJobRoles.filter((r) => typeof r === 'string' && r.trim()),
      keywordOptimization,
      sectionFeedback,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw ApiError.badRequest(`Invalid AI response: ${error.message}`);
  }
};

module.exports = validateAIResponse;
