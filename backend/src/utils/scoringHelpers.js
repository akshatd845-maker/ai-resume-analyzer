/**
 * Calculate score based on presence of contact info
 * Full marks require both email AND phone. Bonus for LinkedIn/GitHub URL.
 */
const calculateContactScore = (extractedData) => {
  let score = 0;

  if (extractedData.email && extractedData.email.includes('@')) {
    score += 40;
  }

  if (extractedData.phone) {
    score += 40;
  }

  // Check for LinkedIn or GitHub in raw fields (passed through extractedData if parser captured URLs)
  const rawSnapshot = [
    extractedData.name || '',
    extractedData.email || '',
  ].join(' ').toLowerCase();

  if (/linkedin\.com/.test(rawSnapshot) || /github\.com/.test(rawSnapshot)) {
    score += 20;
  }

  return Math.min(score, 100);
};

/**
 * Calculate score based on resume summary.
 * Rewards the presence, length, and quality signals of a professional summary.
 */
const calculateSummaryScore = (rawText) => {
  if (!rawText) return 0;

  const summaryKeywords = ['summary', 'objective', 'profile', 'about me', 'professional profile'];
  const lines = rawText.split('\n');

  let summaryText = '';
  let foundSummarySection = false;

  for (let i = 0; i < lines.length; i++) {
    const lineLower = lines[i].toLowerCase().trim();
    if (summaryKeywords.some(k => lineLower.includes(k))) {
      foundSummarySection = true;
      // Grab up to 6 lines of the summary body
      summaryText = lines.slice(i + 1, i + 7).join(' ').trim();
      break;
    }
  }

  if (!foundSummarySection) {
    // Fallback: check if the top of the resume has a substantial paragraph (not a header/name)
    const firstMeaningfulLines = lines
      .slice(0, 10)
      .filter(l => l.trim().length > 40 && !l.includes('@') && !/^\+?\d/.test(l.trim()));
    if (firstMeaningfulLines.length > 0) {
      summaryText = firstMeaningfulLines.slice(0, 3).join(' ').trim();
    }
  }

  if (!summaryText || summaryText.length < 30) return 0;

  const length = summaryText.length;

  // Too short — exists but barely useful
  if (length < 60) return 20;

  // Ideal range: 80–400 chars
  if (length >= 80 && length <= 400) return 100;

  // Slightly too long — still good
  if (length > 400 && length <= 600) return 80;

  // Very long — risk of ATS truncation
  if (length > 600) return 60;

  // Short but present
  return 40;
};

/**
 * Calculate score based on skills.
 * Rewards quantity, breadth (multiple categories), and ATS keyword coverage.
 */
const calculateSkillsScore = (extractedData) => {
  const skillCount = extractedData.skills ? extractedData.skills.length : 0;

  if (skillCount === 0) return 0;
  if (skillCount === 1) return 15;
  if (skillCount === 2) return 25;

  // Base score scales with count up to 15 skills
  const countScore = Math.min(skillCount * 5, 75);

  // Check for breadth across categories
  const skillsLower = (extractedData.skills || []).map(s => s.toLowerCase());
  const hasLanguage = skillsLower.some(s => /javascript|python|java|typescript|c\+\+|go|rust|php|swift|kotlin/.test(s));
  const hasFramework = skillsLower.some(s => /react|angular|vue|express|django|flask|spring|next|node/.test(s));
  const hasDatabase = skillsLower.some(s => /sql|mongo|postgres|mysql|redis|firebase|dynamo|sqlite/.test(s));
  const hasDevOps = skillsLower.some(s => /docker|git|kubernetes|aws|azure|gcp|ci\/cd|jenkins|linux/.test(s));

  const breadthBonus =
    (hasLanguage ? 5 : 0) +
    (hasFramework ? 8 : 0) +
    (hasDatabase ? 7 : 0) +
    (hasDevOps ? 5 : 0);

  return Math.min(countScore + breadthBonus, 100);
};

/**
 * Calculate score based on education.
 * Full score requires degree type, institution, and graduation year.
 */
const calculateEducationScore = (extractedData) => {
  const educationList = extractedData.education || [];

  if (educationList.length === 0) return 0;

  let score = 0;

  for (const edu of educationList) {
    if (!edu) continue;

    const eduText = typeof edu === 'string'
      ? edu
      : [edu.institution, edu.degree, edu.school, edu.field].filter(Boolean).join(' ');

    const eduLower = eduText.toLowerCase();

    // Degree type
    if (/bachelor|master|phd|doctorate|b\.tech|b\.e|m\.tech|m\.e|bsc|msc|b\.sc|m\.sc|b\.com|associate/i.test(eduLower)) {
      score += 45;
    } else {
      score += 20; // some education present
    }

    // Institution name
    if (/university|college|institute|school|iit|nit|bits|mit|stanford|berkeley/i.test(eduLower)) {
      score += 25;
    }

    // Graduation year
    if (/20\d{2}|19\d{2}/.test(eduText)) {
      score += 20;
    }

    // GPA (optional bonus)
    if (/gpa|cgpa|\d\.\d{1,2}\/\d/.test(eduLower)) {
      score += 10;
    }

    break; // Score primary entry only
  }

  return Math.min(score, 100);
};

/**
 * Calculate score based on experience.
 * Rewards number of entries, action verbs, date ranges, and company names.
 */
const calculateExperienceScore = (extractedData) => {
  const experienceList = extractedData.experience || [];

  if (experienceList.length === 0) return 0;

  const entryCount = Math.min(experienceList.length, 5);
  // Base: 15 points per entry, up to 5 entries = 75
  let score = entryCount * 15;

  const actionVerbs = ['developed', 'implemented', 'built', 'designed', 'led', 'managed', 'created',
    'optimized', 'delivered', 'reduced', 'increased', 'architected', 'launched', 'improved',
    'deployed', 'spearheaded', 'mentored', 'collaborated', 'streamlined', 'engineered'];

  let hasDateRange = false;
  let hasCompanySignal = false;
  let hasActionVerb = false;
  let hasMetric = false;

  for (const exp of experienceList.slice(0, 5)) {
    if (!exp) continue;
    const expLower = exp.toLowerCase();

    if (/\d{4}\s*[-–—]\s*(\d{4}|present|current)/i.test(exp) ||
        /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+\d{4}/i.test(exp)) {
      hasDateRange = true;
    }

    if (/inc\b|llc\b|ltd\b|corp\b|technologies|solutions|systems|software|consulting|pvt\.?\s*ltd/i.test(expLower)) {
      hasCompanySignal = true;
    }

    if (actionVerbs.some(v => expLower.includes(v))) {
      hasActionVerb = true;
    }

    if (/\d+\s*%|\$\s*\d+|\d+\s*users?|\d+\s*ms\b|\d+x\b/.test(exp)) {
      hasMetric = true;
    }
  }

  if (hasDateRange) score += 8;
  if (hasCompanySignal) score += 7;
  if (hasActionVerb) score += 5;
  if (hasMetric) score += 5;

  return Math.min(score, 100);
};

/**
 * Calculate score based on projects.
 * Rewards count, GitHub/deployment links, and technical depth signals.
 */
const calculateProjectsScore = (extractedData) => {
  const projectList = extractedData.projects || [];

  if (projectList.length === 0) return 0;

  const entryCount = Math.min(projectList.length, 5);
  // Base: 20 points per project, up to 5
  let score = entryCount * 20;

  let hasLink = false;
  let hasTechStack = false;
  let hasOutcome = false;

  const techSignals = ['react', 'node', 'python', 'mongodb', 'api', 'database', 'backend', 'frontend',
    'deployed', 'aws', 'docker', 'firebase', 'express', 'django', 'flask', 'next'];

  for (const proj of projectList.slice(0, 5)) {
    if (!proj) continue;
    const projLower = proj.toLowerCase();

    if (/github\.com|vercel\.app|netlify\.app|heroku|live|demo|deployed/.test(projLower)) {
      hasLink = true;
    }

    if (techSignals.some(t => projLower.includes(t))) {
      hasTechStack = true;
    }

    if (/\d+\s*users?|\d+\s*%|\d+\s*ms\b|scalab|performance|real.?time/.test(projLower)) {
      hasOutcome = true;
    }
  }

  if (hasLink) score += 10;
  if (hasTechStack) score += 5;
  if (hasOutcome) score += 5;

  return Math.min(score, 100);
};

/**
 * Calculate score based on certifications.
 * Rewards presence and relevance signals.
 */
const calculateCertificationsScore = (extractedData) => {
  const certList = extractedData.certifications || [];

  if (certList.length === 0) return 0;

  const certCount = Math.min(certList.length, 4);
  let score = certCount * 22;

  // Bonus for well-known/relevant certifications
  const premiumCerts = ['aws', 'azure', 'gcp', 'google', 'cisco', 'comptia', 'pmp', 'scrum',
    'certified', 'professional', 'associate', 'oracle', 'microsoft'];

  const certsText = certList.join(' ').toLowerCase();
  if (premiumCerts.some(c => certsText.includes(c))) {
    score += 12;
  }

  return Math.min(score, 100);
};

/**
 * Calculate keyword score.
 * Uses the full keyword list from atsWeights and rewards both density and coverage.
 */
const calculateKeywordScore = (extractedData, rawText) => {
  const { matchKeywords } = require('./keywordMatcher');

  const text = rawText || '';
  if (!text.trim()) return 0;

  const result = matchKeywords(text);
  const matchedCount = result.totalFound;

  if (matchedCount === 0) return 0;

  // Tiered scoring
  if (matchedCount >= 25) return 100;
  if (matchedCount >= 18) return 85;
  if (matchedCount >= 12) return 70;
  if (matchedCount >= 8)  return 55;
  if (matchedCount >= 5)  return 40;
  if (matchedCount >= 3)  return 25;
  return 15;
};

/**
 * Calculate achievements score.
 * Rewards quantified metrics and strong action verbs.
 */
const calculateAchievementsScore = (rawText) => {
  const { findQuantifiableAchievements, findActionVerbs } = require('./keywordMatcher');

  if (!rawText) return 0;

  const quantifiable = findQuantifiableAchievements(rawText);
  const actionVerbs = findActionVerbs(rawText);

  // Also check for common metric patterns not covered by findQuantifiableAchievements
  const extraMetrics = (rawText.match(/\d+\s*%|\$\s*\d+[\d,]*|\d+\s*users?|\d+\s*ms\b|\d+x\b|\d+\s*req/gi) || []);

  const totalMetrics = Math.min(quantifiable.length + extraMetrics.length, 8);
  const totalVerbs = Math.min(actionVerbs.length, 10);

  // Score: up to 70 from metrics, up to 30 from action verbs
  const metricScore = totalMetrics * 8.75; // 8 metrics = 70 points
  const verbScore = totalVerbs * 3;        // 10 verbs = 30 points

  return Math.min(Math.round(metricScore + verbScore), 100);
};

/**
 * Calculate formatting score.
 * Rewards the optimal word count range and penalises extremes.
 */
const calculateFormattingScore = (rawText) => {
  if (!rawText) return 0;

  const wordCount = (rawText.match(/\b\w+\b/g) || []).length;

  // Ideal range for one-page engineering resume: 350–750 words
  if (wordCount >= 350 && wordCount <= 750) return 100;

  // Acceptable range
  if (wordCount >= 250 && wordCount < 350) return 75;
  if (wordCount > 750 && wordCount <= 1000) return 75;

  // Warning range
  if (wordCount >= 150 && wordCount < 250) return 50;
  if (wordCount > 1000 && wordCount <= 1400) return 55;

  // Too sparse or too long
  if (wordCount < 150) return 20;
  return 35; // > 1400 words
};

module.exports = {
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
};