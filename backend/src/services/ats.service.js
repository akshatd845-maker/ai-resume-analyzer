const ResumeAnalysis = require('../models/analysis.model');
const Resume = require('../models/resume.model');
const ApiError = require('../utils/ApiError');
const { matchKeywords } = require('../utils/keywordMatcher');
const {
  calculateContactScore,
  calculateSummaryScore,
  calculateSkillsScore,
  calculateEducationScore,
  calculateExperienceScore,
  calculateProjectsScore,
  calculateCertificationsScore,
  calculateKeywordScore,
  calculateAchievementsScore,
  calculateFormattingScore,
} = require('../utils/scoringHelpers');

// Weights defined locally to avoid circular dependency
const WEIGHTS = {
  contact: 5,
  summary: 10,
  skills: 20,
  education: 15,
  experience: 20,
  projects: 10,
  certifications: 5,
  keywords: 8,
  achievements: 4,
  formatting: 3,
};

/**
 * Calculate ATS score for a resume
 */
const calculateATSScore = (extractedData, rawText) => {
  // Calculate individual category scores
  const categoryScores = {
    contact: calculateContactScore(extractedData),
    summary: calculateSummaryScore(rawText),
    skills: calculateSkillsScore(extractedData),
    education: calculateEducationScore(extractedData),
    experience: calculateExperienceScore(extractedData),
    projects: calculateProjectsScore(extractedData),
    certifications: calculateCertificationsScore(extractedData),
    keywords: calculateKeywordScore(extractedData, rawText),
    achievements: calculateAchievementsScore(rawText),
    formatting: calculateFormattingScore(rawText),
  };

  // Calculate weighted overall score
  let overallScore = 0;
  for (const [category, weight] of Object.entries(WEIGHTS)) {
    overallScore += (categoryScores[category] || 0) * (weight / 100);
  }

  // Round to nearest integer
  overallScore = Math.round(Math.min(Math.max(overallScore, 0), 100));

  return {
    overallScore,
    categoryScores,
  };
};

/**
 * Generate missing sections list
 */
const getMissingSections = (extractedData, rawText) => {
  const missing = [];

  // Check required sections
  if (!extractedData.email && !extractedData.phone) {
    missing.push('Contact Information');
  }

  if (!extractedData.skills || extractedData.skills.length === 0) {
    missing.push('Skills Section');
  }

  if (!extractedData.experience || extractedData.experience.length === 0) {
    missing.push('Work Experience');
  }

  if (!extractedData.education || extractedData.education.length === 0) {
    missing.push('Education');
  }

  // Check for summary
  const hasSummary = rawText && /summary|objective|profile/i.test(rawText);
  if (!hasSummary) {
    missing.push('Professional Summary');
  }

  return missing;
};

/**
 * Generate missing keywords list
 */
const getMissingKeywords = (rawText) => {
  const result = matchKeywords(rawText || '');
  return result.missing.slice(0, 15); // Return top 15 missing keywords
};

/**
 * Generate recommendations based on scores
 */
const getRecommendations = (categoryScores, missingSections, missingKeywords) => {
  const recommendations = [];

  // Contact recommendations
  if (categoryScores.contact < 50) {
    recommendations.push('Add your email and phone number to improve contactability');
  }

  // Summary recommendations
  if (categoryScores.summary < 50) {
    recommendations.push('Add a professional summary (50-500 characters)');
  }

  // Skills recommendations
  if (categoryScores.skills < 50) {
    recommendations.push('Add more technical skills (aim for at least 10)');
  } else if (categoryScores.skills < 80) {
    recommendations.push('Consider adding more relevant skills');
  }

  // Experience recommendations
  if (categoryScores.experience < 50) {
    recommendations.push('Add work experience with company names and dates');
  }

  // Education recommendations
  if (categoryScores.education < 50) {
    recommendations.push('Add education details including institution and graduation year');
  }

  // Keywords recommendations
  if (categoryScores.keywords < 50) {
    recommendations.push('Include more industry-relevant keywords');
  }

  // Achievements recommendations
  if (categoryScores.achievements < 50) {
    recommendations.push('Add quantifiable achievements (e.g., "increased sales by 20%")');
  }

  // Formatting recommendations
  if (categoryScores.formatting < 70) {
    recommendations.push('Aim for 400-800 words for optimal resume length');
  }

  // Missing sections
  for (const section of missingSections) {
    recommendations.push(`Add ${section.toLowerCase()}`);
  }

  // Missing keywords suggestions
  if (missingKeywords.length > 0) {
    recommendations.push(`Consider adding skills like: ${missingKeywords.slice(0, 5).join(', ')}`);
  }

  return recommendations;
};

/**
 * Generate complete ATS analysis result
 */
const generateATSAnalysis = (extractedData, rawText) => {
  const { overallScore, categoryScores } = calculateATSScore(extractedData, rawText);
  const missingSections = getMissingSections(extractedData, rawText);
  const missingKeywords = getMissingKeywords(rawText);
  const recommendations = getRecommendations(categoryScores, missingSections, missingKeywords);

  return {
    overallScore,
    categoryScores,
    missingSections,
    missingKeywords,
    recommendations,
  };
};

/**
 * Save ATS results to database
 */
const saveATSResults = async (resumeId, atsResults) => {
  const analysis = await ResumeAnalysis.findOneAndUpdate(
    { resume: resumeId },
    {
      atsResults,
    },
    { new: true }
  );

  return analysis;
};

/**
 * Get ATS score for a resume by ID
 */
const getATSScoreById = async (userId, resumeId) => {
  // Check if resume exists and belongs to user
  const resume = await Resume.findOne({ _id: resumeId, user: userId });

  if (!resume) {
    throw ApiError.notFound('Resume not found');
  }

  const analysis = await ResumeAnalysis.findOne({ resume: resumeId });

  if (!analysis || !analysis.extractedData) {
    throw ApiError.notFound('Resume has not been parsed yet');
  }

  if (analysis.atsResults?.overallScore != null) {
    return analysis.atsResults;
  }

  const atsResults = generateATSAnalysis(analysis.extractedData, analysis.rawText);

  return atsResults;
};

/**
 * Analyze ATS for a resume by ID
 */
const analyzeATSById = async (userId, resumeId) => {
  // Check if resume exists and belongs to user
  const resume = await Resume.findOne({ _id: resumeId, user: userId });

  if (!resume) {
    throw ApiError.notFound('Resume not found');
  }

  const analysis = await ResumeAnalysis.findOne({ resume: resumeId });

  if (!analysis || !analysis.extractedData) {
    throw ApiError.notFound('Resume has not been parsed yet');
  }

  // Generate ATS analysis
  const atsResults = generateATSAnalysis(analysis.extractedData, analysis.rawText);

  // Save results to database
  await saveATSResults(resumeId, atsResults);

  return atsResults;
};

module.exports = {
  calculateATSScore,
  generateATSAnalysis,
  getATSScoreById,
  analyzeATSById,
  saveATSResults,
};