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
  skills: 18,
  education: 12,
  experience: 25,
  projects: 8,
  certifications: 5,
  keywords: 10,
  achievements: 5,
  formatting: 2,
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
    recommendations.push(
      'Critical: Add your email address and phone number. Recruiters cannot contact you without these — ATS will also penalise a missing contact section.'
    );
  } else if (categoryScores.contact < 80) {
    recommendations.push(
      'Add your LinkedIn profile URL and GitHub profile link to the contact section. These are screened by both ATS and human reviewers for software engineering roles.'
    );
  }

  // Summary recommendations
  if (categoryScores.summary < 30) {
    recommendations.push(
      'Add a professional summary (3–5 sentences) directly below your contact info. Lead with your career level, primary tech stack, and one quantified achievement. This section gets the most recruiter attention and is prime real estate for ATS keywords.'
    );
  } else if (categoryScores.summary < 70) {
    recommendations.push(
      'Your summary exists but appears short. Expand it to 80–200 words: include your strongest technologies, years of relevant experience, and a concrete accomplishment (e.g. "Built a REST API serving 10,000 daily requests").'
    );
  }

  // Skills recommendations
  if (categoryScores.skills < 30) {
    recommendations.push(
      'Add a dedicated Skills section with at least 12–15 relevant technologies. Organise them into sub-categories: Languages, Frameworks, Databases, DevOps/Cloud, and Testing. This is the section ATS parsers scan most aggressively.'
    );
  } else if (categoryScores.skills < 60) {
    recommendations.push(
      'Your skills section exists but appears thin. Expand it to cover your full stack — include databases, cloud platforms, and testing frameworks alongside core languages. Each additional relevant keyword increases ATS match rates.'
    );
  } else if (categoryScores.skills < 80) {
    recommendations.push(
      'Consider organising your skills into sub-categories (Languages / Frameworks / Tools / Cloud) rather than a flat list. This helps ATS parse the section correctly and signals technical depth to reviewers.'
    );
  }

  // Experience recommendations
  if (categoryScores.experience < 20) {
    recommendations.push(
      'No work experience is detected. Add any professional experience you have — internships, freelance projects, part-time roles, campus technical clubs, or open-source contributions. If genuinely absent, ensure your Projects section is very strong with clear outcomes.'
    );
  } else if (categoryScores.experience < 50) {
    recommendations.push(
      'Work experience entries are present but sparse. Each role should include: company name, job title, employment dates (Month Year – Month Year format), and 3–5 bullet points. Start each bullet with a strong action verb (Built, Architected, Delivered, Reduced, Increased).'
    );
  } else if (categoryScores.experience < 75) {
    recommendations.push(
      'Add quantified achievements to your experience bullets. Replace vague statements like "worked on features" with specific outcomes: "Reduced API latency by 40% by introducing Redis caching" or "Shipped 3 product features used by 8,000+ active users".'
    );
  }

  // Education recommendations
  if (categoryScores.education < 30) {
    recommendations.push(
      'Add an Education section with your degree name, institution, and expected/actual graduation year. If your GPA is 3.5 or above, include it — it helps for early-career roles.'
    );
  } else if (categoryScores.education < 70) {
    recommendations.push(
      'Ensure your education entry includes the full degree name (e.g. "B.Tech in Computer Science"), institution name, and graduation year. A missing year confuses ATS systems.'
    );
  }

  // Projects recommendations
  if (categoryScores.projects < 30) {
    recommendations.push(
      'Add a Projects section with 2–4 personal or academic projects. For each project include: what problem it solves, the tech stack, a GitHub or live URL, and at least one metric (e.g. "deployed on AWS, handles 500 concurrent users").'
    );
  } else if (categoryScores.projects < 60) {
    recommendations.push(
      'Your projects section exists but descriptions may be thin. Add a GitHub link and one measurable outcome to each project. Deployment details (Heroku, Vercel, AWS) and user metrics significantly increase project credibility.'
    );
  }

  // Keywords recommendations
  if (categoryScores.keywords < 40) {
    recommendations.push(
      'Your resume has low keyword density for ATS systems. Ensure your skills, experience, and project descriptions naturally include industry-standard terms: REST API, CI/CD, Git, Docker, Agile, and the specific frameworks you use.'
    );
  } else if (categoryScores.keywords < 65) {
    recommendations.push(
      'Keyword coverage is moderate. Review the job descriptions you\'re targeting and mirror their exact phrasing where it genuinely applies (e.g. "containerisation" vs "Docker", "version control" vs "Git").'
    );
  }

  // Achievements recommendations
  if (categoryScores.achievements < 30) {
    recommendations.push(
      'No quantified achievements detected. This is the single biggest ATS differentiator. Add at least 3 metrics anywhere in your resume: performance improvements (%), users served, team size, projects delivered, or cost savings ($).'
    );
  }

  // Formatting recommendations
  if (categoryScores.formatting < 50) {
    recommendations.push(
      'Resume word count appears outside the optimal 350–750 word range. Too short signals a sparse resume; too long risks being cut off by ATS. Aim for one full page (400–600 words) for entry/mid-level roles.'
    );
  }

  // Missing sections
  for (const section of missingSections) {
    if (!recommendations.some(r => r.toLowerCase().includes(section.toLowerCase().slice(0, 8)))) {
      recommendations.push(`Missing section detected: "${section}". Add this section — ATS systems score resumes partly based on section completeness.`);
    }
  }

  // Missing keywords suggestions
  if (missingKeywords.length > 0) {
    recommendations.push(
      `High-value ATS keywords not found in your resume: ${missingKeywords.slice(0, 6).join(', ')}. Add these where they genuinely apply — in your Skills section, project descriptions, or experience bullets.`
    );
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