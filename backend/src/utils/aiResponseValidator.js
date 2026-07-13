const ApiError = require('../utils/ApiError');

const VALID_CAREER_LEVELS = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive', 'Student/Intern'];
const VALID_PRIORITIES = ['high', 'medium', 'low'];
const VALID_IMPACTS = ['High', 'Medium', 'Low'];
const VALID_DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

/**
 * Normalise a single strength or weakness item.
 * Accepts:
 *   - plain string → { title: "Strength N", description: string }
 *   - { title, description } object → pass through
 *   - { text } fallback → { title: "...", description: text }
 */
const normaliseInsightItem = (item, fallbackLabel) => {
  if (typeof item === 'string' && item.trim()) {
    return { title: fallbackLabel, description: item.trim() };
  }
  if (item && typeof item === 'object') {
    const title = typeof item.title === 'string' && item.title.trim()
      ? item.title.trim()
      : fallbackLabel;
    const description = typeof item.description === 'string' && item.description.trim()
      ? item.description.trim()
      : typeof item.text === 'string' && item.text.trim()
        ? item.text.trim()
        : '';
    if (description) return { title, description };
  }
  return null;
};

/**
 * Normalise a missingSkill item.
 * Accepts:
 *   - plain string → { name: string, reason: "Provided by the backend." }
 *   - { name, reason } object → pass through
 *   - { skill, description } fallback
 */
const normaliseMissingSkill = (item) => {
  if (typeof item === 'string' && item.trim()) {
    return { name: item.trim(), reason: 'Recommended for stronger ATS keyword coverage in this domain.' };
  }
  if (item && typeof item === 'object') {
    const name = typeof item.name === 'string' && item.name.trim()
      ? item.name.trim()
      : typeof item.skill === 'string' && item.skill.trim()
        ? item.skill.trim()
        : null;
    if (!name) return null;
    const reason = typeof item.reason === 'string' && item.reason.trim()
      ? item.reason.trim()
      : typeof item.description === 'string' && item.description.trim()
        ? item.description.trim()
        : 'Recommended for stronger ATS keyword coverage in this domain.';
    return { name, reason };
  }
  return null;
};

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

    // ── Strengths — accept string[] or object[] ──────────────────────────────
    const strengths = Array.isArray(parsed.strengths)
      ? parsed.strengths
          .map((s, i) => normaliseInsightItem(s, `Strength ${i + 1}`))
          .filter(Boolean)
      : [];

    // ── Weaknesses — accept string[] or object[] ─────────────────────────────
    const weaknesses = Array.isArray(parsed.weaknesses)
      ? parsed.weaknesses
          .map((w, i) => normaliseInsightItem(w, `Weakness ${i + 1}`))
          .filter(Boolean)
      : [];

    // ── Missing skills — accept string[] or object[] ─────────────────────────
    const missingSkills = Array.isArray(parsed.missingSkills)
      ? parsed.missingSkills.map(normaliseMissingSkill).filter(Boolean)
      : [];

    // ── Improvement suggestions ───────────────────────────────────────────────
    let improvementSuggestions = [];
    if (Array.isArray(parsed.improvementSuggestions)) {
      improvementSuggestions = parsed.improvementSuggestions.map((item) => {
        if (typeof item === 'string') {
          return { section: 'General', suggestion: item.trim(), priority: 'medium', estimatedImpact: null, difficulty: null };
        }
        if (typeof item === 'object' && item !== null) {
          return {
            section: typeof item.section === 'string' ? item.section.trim() : 'General',
            suggestion: typeof item.suggestion === 'string' ? item.suggestion.trim() : '',
            priority: VALID_PRIORITIES.includes(item.priority) ? item.priority : 'medium',
            estimatedImpact: VALID_IMPACTS.includes(item.estimatedImpact) ? item.estimatedImpact : null,
            difficulty: VALID_DIFFICULTIES.includes(item.difficulty) ? item.difficulty : null,
          };
        }
        return null;
      }).filter(Boolean).filter((s) => s.suggestion.length > 0);
    }

    // ── Career level ──────────────────────────────────────────────────────────
    const careerLevel = VALID_CAREER_LEVELS.includes(parsed.careerLevel)
      ? parsed.careerLevel
      : 'Entry Level';

    // ── Industry fit ──────────────────────────────────────────────────────────
    const industryFit = Array.isArray(parsed.industryFit)
      ? parsed.industryFit.filter((s) => typeof s === 'string' && s.trim()).slice(0, 5)
      : [];

    // ── Recommended job roles ─────────────────────────────────────────────────
    const recommendedJobRoles = Array.isArray(parsed.recommendedJobRoles)
      ? parsed.recommendedJobRoles.filter((r) => typeof r === 'string' && r.trim())
      : [];

    // ── Keyword optimisation ──────────────────────────────────────────────────
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

    // ── Section feedback ──────────────────────────────────────────────────────
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

    // ── Years of experience ───────────────────────────────────────────────────
    const yearsOfExperience = typeof parsed.yearsOfExperience === 'number' && parsed.yearsOfExperience >= 0
      ? Math.round(parsed.yearsOfExperience)
      : null;

    // ── Score breakdown ───────────────────────────────────────────────────────
    const scoreBreakdownFields = ['contactInfo', 'summary', 'workExperience', 'skills', 'education', 'achievements', 'keywords', 'formatting'];
    let scoreBreakdown = null;
    if (parsed.scoreBreakdown && typeof parsed.scoreBreakdown === 'object') {
      scoreBreakdown = {};
      for (const field of scoreBreakdownFields) {
        const val = parsed.scoreBreakdown[field];
        scoreBreakdown[field] = typeof val === 'number' ? Math.round(Math.min(Math.max(val, 0), 100)) : 0;
      }
    }

    return {
      atsScore: Math.round(parsed.atsScore),
      careerLevel,
      yearsOfExperience,
      industryFit,
      summary: parsed.summary.trim(),
      strengths,
      weaknesses,
      missingSkills,
      improvementSuggestions,
      recommendedJobRoles,
      keywordOptimization,
      sectionFeedback,
      ...(scoreBreakdown && { scoreBreakdown }),
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw ApiError.badRequest(`Invalid AI response: ${error.message}`);
  }
};

module.exports = validateAIResponse;
