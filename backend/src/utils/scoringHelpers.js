/**
 * Calculate score based on presence of contact info
 */
const calculateContactScore = (extractedData) => {
  const { contact } = require('./atsWeights');
  let score = 0;

  if (extractedData.email && extractedData.email.includes('@')) {
    score += contact.hasEmail;
  }

  if (extractedData.phone) {
    score += contact.hasPhone;
  }

  return Math.min(score, 100);
};

/**
 * Calculate score based on resume summary
 */
const calculateSummaryScore = (rawText) => {
  const { summary } = require('./atsWeights');

  if (!rawText) return 0;

  const summaryKeywords = ['summary', 'objective', 'profile', 'about'];
  const lines = rawText.split('\n');

  let summaryText = '';
  let foundSummarySection = false;

  for (let i = 0; i < lines.length; i++) {
    const lineLower = lines[i].toLowerCase();
    if (summaryKeywords.some(k => lineLower.includes(k))) {
      foundSummarySection = true;
      summaryText = lines.slice(i + 1, i + 4).join(' ');
      break;
    }
  }

  if (!foundSummarySection) {
    // Check if there's any substantial paragraph at the top
    const firstParagraph = lines.slice(0, 5).join(' ');
    if (firstParagraph.length >= 50) {
      summaryText = firstParagraph;
    }
  }

  if (!summaryText) return 0;

  const length = summaryText.length;

  if (length < summary.minLength) return 20;
  if (length > summary.maxLength) return 60;

  // Calculate score based on length
  const lengthScore = Math.min(
    ((length - summary.minLength) / (summary.maxLength - summary.minLength)) * 100 + summary.bonusForLength,
    100
  );

  return Math.round(lengthScore);
};

/**
 * Calculate score based on skills
 */
const calculateSkillsScore = (extractedData) => {
  const { skills } = require('./atsWeights');

  const skillCount = extractedData.skills ? extractedData.skills.length : 0;

  if (skillCount === 0) return 0;
  if (skillCount < skills.minCount) return 30;

  let score = 50; // Base score

  // Add points for each skill
  const additionalSkills = Math.min(skillCount - skills.minCount, skills.maxCount - skills.minCount);
  score += additionalSkills * skills.perSkill;

  // Bonus for having many skills
  if (skillCount >= skills.bonusThreshold) {
    score += 20;
  }

  return Math.min(score, 100);
};

/**
 * Calculate score based on education
 */
const calculateEducationScore = (extractedData) => {
  const { education } = require('./atsWeights');

  const educationList = extractedData.education || [];

  if (educationList.length === 0) return 0;

  let score = 0;

  for (const edu of educationList) {
    if (edu) {
      const eduText =
        typeof edu === 'string'
          ? edu
          : [edu.institution, edu.degree, edu.school, edu.field]
              .filter(Boolean)
              .join(' ');

      score += education.hasDegree;

      if (eduText.toLowerCase().includes('university') || eduText.toLowerCase().includes('college')) {
        score += education.hasInstitution;
      }

      if (/\d{4}/.test(eduText)) {
        score += education.hasYear;
      }

      if (/gpa|cgpa/i.test(eduText) || /\d\.\d{2}/.test(eduText)) {
        score += education.hasGPA;
      }

      break;
    }
  }

  return Math.min(score, 100);
};

/**
 * Calculate score based on experience
 */
const calculateExperienceScore = (extractedData) => {
  const { experience } = require('./atsWeights');

  const experienceList = extractedData.experience || [];

  if (experienceList.length === 0) return 0;

  let score = 0;
  const entriesToScore = Math.min(experienceList.length, experience.maxEntries);

  score += entriesToScore * experience.perEntry;

  for (const exp of experienceList.slice(0, entriesToScore)) {
    if (exp) {
      if (/inc|llc|ltd|corp|technologies|solutions/i.test(exp)) {
        score += experience.hasCompany / entriesToScore;
      }
      if (/\d{4}|present/i.test(exp)) {
        score += experience.hasDuration / entriesToScore;
      }
    }
  }

  return Math.min(score, 100);
};

/**
 * Calculate score based on projects
 */
const calculateProjectsScore = (extractedData) => {
  const { projects } = require('./atsWeights');

  const projectList = extractedData.projects || [];

  if (projectList.length === 0) return 0; // No projects, no credit

  const entriesToScore = Math.min(projectList.length, projects.maxProjects);
  const score = entriesToScore * projects.perProject;

  return Math.min(score, 100);
};

/**
 * Calculate score based on certifications
 */
const calculateCertificationsScore = (extractedData) => {
  const { certifications } = require('./atsWeights');

  const certList = extractedData.certifications || [];

  if (certList.length === 0) return 0; // No certifications, no credit

  const entriesToScore = Math.min(certList.length, certifications.maxCerts);
  const score = entriesToScore * certifications.perCert;

  return Math.min(score, 100);
};

/**
 * Calculate keyword score
 */
const calculateKeywordScore = (extractedData, rawText) => {
  const { keywords } = require('./atsWeights');
  const { matchKeywords } = require('./keywordMatcher');

  const text = rawText || '';
  const result = matchKeywords(text);

  if (result.totalFound === 0) return 0;

  let score = 30; // Base score

  const matchedCount = Math.min(result.totalFound, keywords.maxMatches);
  const additionalPoints = (matchedCount - keywords.minMatches) * keywords.perKeyword;
  score += Math.max(additionalPoints, matchedCount * keywords.perKeyword / 2);

  return Math.min(score, 100);
};

/**
 * Calculate achievements score
 */
const calculateAchievementsScore = (rawText) => {
  const { achievements } = require('./atsWeights');
  const { findQuantifiableAchievements, findActionVerbs } = require('./keywordMatcher');

  if (!rawText) return 0;

  const quantifiableCount = findQuantifiableAchievements(rawText).length;
  const actionVerbCount = findActionVerbs(rawText).length;

  let score = 0;

  // Score for quantifiable achievements
  score += Math.min(quantifiableCount * achievements.perAchievement, achievements.maxAchievements * achievements.perAchievement);

  // Bonus for action verbs
  score += Math.min(actionVerbCount * 5, 30);

  return Math.min(score, 100);
};

/**
 * Calculate formatting score
 */
const calculateFormattingScore = (rawText) => {
  const { formatting } = require('./atsWeights');

  if (!rawText) return 0;

  // Count words
  const wordCount = (rawText.match(/\b[a-z]+\b/gi) || []).length;

  const ideal = formatting.idealLength;
  const warning = formatting.warningLength;

  // Check ideal length
  if (wordCount >= ideal.min && wordCount <= ideal.max) {
    return 100;
  }

  // Check warning length
  if (wordCount >= warning.min && wordCount <= warning.max) {
    return 70;
  }

  // Too short or too long
  return 40;
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