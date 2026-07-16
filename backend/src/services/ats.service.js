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

// Default weights (general/engineering focused)
const DEFAULT_WEIGHTS = {
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

// Legacy export for backward compatibility
const WEIGHTS = DEFAULT_WEIGHTS;

/**
 * Calculate ATS score for a resume with optional field-adaptive weights
 * @param {Object} extractedData - Parsed resume data
 * @param {string} rawText - Raw resume text
 * @param {Object} customWeights - Optional field-specific weights
 */
const calculateATSScore = (extractedData, rawText, customWeights = null) => {
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

  // Use custom weights if provided (field-adaptive), otherwise use defaults
  const weights = customWeights || DEFAULT_WEIGHTS;

  // Calculate weighted overall score
  let overallScore = 0;
  for (const [category, weight] of Object.entries(weights)) {
    overallScore += (categoryScores[category] || 0) * (weight / 100);
  }

  // Round to nearest integer
  overallScore = Math.round(Math.min(Math.max(overallScore, 0), 100));

  return {
    overallScore,
    categoryScores,
    weightsUsed: weights,
  };
};

/**
 * Hard gate check - simulates real ATS auto-filtering based on job requirements
 * Returns pass/fail status and list of missing requirements
 */
const performHardGateCheck = (extractedData, rawText, jobDescription, fieldInfo = null) => {
  if (!jobDescription || !jobDescription.trim()) {
    return { passed: null, missingRequirements: [], reason: 'No job description provided' };
  }

  const jdLower = jobDescription.toLowerCase();
  const resumeLower = (rawText || '').toLowerCase();
  const skillsLower = (extractedData.skills || []).map(s => s.toLowerCase()).join(' ');
  const experienceLower = (extractedData.experience || []).map(e => e.toLowerCase()).join(' ');
  const educationLower = (extractedData.education || []).map(e => e.toLowerCase()).join(' ');
  const certsLower = (extractedData.certifications || []).map(c => c.toLowerCase()).join(' ');

  const missingRequirements = [];
  let hasHardFail = false;

  // Extract requirements from JD - look for "must have", "required", "minimum"
  const requirementPatterns = [
    { pattern: /(\w+)\+?\s+years?\s+(of\s+)?experience/i, label: 'Years of Experience', type: 'experience' },
    { pattern: /(bachelor|master|phd|degree|diploma)/i, label: 'Education Requirement', type: 'education' },
    { pattern: /(certified|certification|certificate)\s+(\w+)/i, label: 'Certification', type: 'certification' },
  ];

  // Check for explicit years of experience requirement
  const yearsMatch = jdLower.match(/(\d+)\+?\s+years?/);
  if (yearsMatch) {
    const requiredYears = parseInt(yearsMatch[1]);
    // Try to estimate years from experience section
    const expEntries = extractedData.experience || [];
    if (expEntries.length === 0) {
      missingRequirements.push({ requirement: `${requiredYears}+ years experience`, severity: 'critical', found: false });
      hasHardFail = true;
    }
  }

  // Check for education requirements
  if (/(bachelor|master|phd|degree)/i.test(jdLower)) {
    const hasDegree = /(bachelor|master|phd|degree)/i.test(educationLower);
    if (!hasDegree) {
      missingRequirements.push({ requirement: 'Required degree', severity: 'critical', found: false });
      hasHardFail = true;
    }
  }

  // Check for specific skills mentioned as "required" or "must have"
  const requiredSkillsPatterns = [
    /must\s+have\s+([^.]+)/i,
    /required\s+([^.]+)/i,
    /minimum\s+([^.]+)/i,
  ];

  for (const pattern of requiredSkillsPatterns) {
    const match = jdLower.match(pattern);
    if (match) {
      const requiredText = match[1];
      // Check if any required skill is missing
      const requiredWords = requiredText.split(/[,;]/).map(w => w.trim()).filter(w => w.length > 2);
      for (const word of requiredWords) {
        const found = skillsLower.includes(word) || resumeLower.includes(word);
        if (!found && word.length > 3) {
          missingRequirements.push({ requirement: `Skill: ${word}`, severity: 'high', found: false });
        }
      }
    }
  }

  // Field-specific critical requirements check
  if (fieldInfo && fieldInfo.criticalCredential) {
    const credentialType = fieldInfo.criticalCredential.toLowerCase();
    const hasCredential = certsLower.includes(credentialType) || educationLower.includes(credentialType);
    if (!hasCredential) {
      missingRequirements.push({
        requirement: `${fieldInfo.criticalCredential} certification/license`,
        severity: 'critical',
        found: false,
      });
      hasHardFail = true;
    }
  }

  // Critical section check (e.g., certifications for nursing)
  if (fieldInfo && fieldInfo.criticalSection) {
    const criticalSection = fieldInfo.criticalSection;
    let hasContent = false;

    switch (criticalSection) {
      case 'certifications':
        hasContent = extractedData.certifications && extractedData.certifications.length > 0;
        break;
      case 'experience':
        hasContent = extractedData.experience && extractedData.experience.length > 0;
        break;
      case 'education':
        hasContent = extractedData.education && extractedData.education.length > 0;
        break;
      case 'projects':
        hasContent = extractedData.projects && extractedData.projects.length > 0;
        break;
      case 'skills':
        hasContent = extractedData.skills && extractedData.skills.length > 0;
        break;
    }

    if (!hasContent) {
      missingRequirements.push({
        requirement: `Required section: ${criticalSection}`,
        severity: 'critical',
        found: false,
      });
      hasHardFail = true;
    }
  }

  // If too many missing requirements, fail the hard gate
  const failed = hasHardFail || missingRequirements.filter(m => m.severity === 'critical').length > 0;

  return {
    passed: !failed,
    missingRequirements,
    totalMissing: missingRequirements.length,
    reason: failed ? 'Failed hard gate - missing critical requirements' : 'Passed hard gate',
  };
};

/**
 * Generate missing items specific to the detected field
 */
const generateMissingForField = (extractedData, rawText, fieldInfo) => {
  const missing = [];
  const textLower = (rawText || '').toLowerCase();

  if (!fieldInfo) return missing;

  const { evaluationCriteria = [], criticalCredential } = fieldInfo;

  // Check for each evaluation criterion
  for (const criterion of evaluationCriteria) {
    const criterionLower = criterion.toLowerCase();

    // Check if criterion is mentioned/skills present
    const hasSkill = (extractedData.skills || []).some(s =>
      s.toLowerCase().includes(criterionLower)
    );

    // Check if criterion appears in experience/achievements
    const hasEvidence = textLower.includes(criterionLower);

    if (!hasSkill && !hasEvidence) {
      missing.push({
        item: criterion,
        type: 'evaluation_criterion',
        whyItMatters: `${criterion} is typically expected in this field for hiring decisions`,
      });
    }
  }

  // Check for critical credential if applicable
  if (criticalCredential) {
    const hasCredential = (extractedData.certifications || []).some(c =>
      c.toLowerCase().includes(criticalCredential.toLowerCase())
    ) || (extractedData.education || []).some(e =>
      e.toLowerCase().includes(criticalCredential.toLowerCase())
    );

    if (!hasCredential) {
      missing.push({
        item: criticalCredential,
        type: 'credential',
        whyItMatters: `${criticalCredential} is often a required credential for this profession`,
      });
    }
  }

  return missing;
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
 * Generate complete ATS analysis result with optional field-adaptive scoring
 * @param {Object} extractedData - Parsed resume data
 * @param {string} rawText - Raw resume text
 * @param {Object} options - Optional parameters: fieldWeights, jobDescription, fieldInfo
 */
const generateATSAnalysis = (extractedData, rawText, options = {}) => {
  const { fieldWeights, jobDescription, fieldInfo } = options;

  const { overallScore, categoryScores, weightsUsed } = calculateATSScore(extractedData, rawText, fieldWeights);
  const missingSections = getMissingSections(extractedData, rawText);
  const missingKeywords = getMissingKeywords(rawText);
  const recommendations = getRecommendations(categoryScores, missingSections, missingKeywords);

  // Perform hard gate check if job description provided
  const hardGateCheck = performHardGateCheck(extractedData, rawText, jobDescription, fieldInfo);

  // Generate missing items specific to the field
  const missingForField = generateMissingForField(extractedData, rawText, fieldInfo);

  return {
    overallScore,
    categoryScores,
    weightsUsed,
    missingSections,
    missingKeywords,
    recommendations,
    hardGateCheck,
    missingForField,
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
  performHardGateCheck,
  generateMissingForField,
  DEFAULT_WEIGHTS,
};