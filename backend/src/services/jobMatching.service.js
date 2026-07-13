const Job = require('../models/job.model');
const Resume = require('../models/resume.model');
const ResumeAnalysis = require('../models/analysis.model');
const MatchHistory = require('../models/matchHistory.model');
const ApiError = require('../utils/ApiError');

// Helper: Normalize skill text for matching
const normalizeSkill = (skill) => {
  return skill.toLowerCase().trim();
};

// Helper: Compile a skill keyword into a regex with word boundaries
const makeSkillRegex = (skill) => {
  const escaped = skill.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  const leadingBoundary = /^\w/.test(skill) ? '\\b' : '';
  const trailingBoundary = /\w$/.test(skill) ? '\\b' : '(?!\\w)';
  return new RegExp(leadingBoundary + escaped + trailingBoundary, 'i');
};

// Helper: Extract words from text
const extractWords = (text) => {
  if (!text) return [];
  return text.toLowerCase().match(/\b[a-z]+\b/g) || [];
};

// Calculate skills match
const calculateSkillsMatch = (resumeSkills, jobRequiredSkills, jobPreferredSkills) => {
  const resumeSkillSet = new Set((resumeSkills || []).map(normalizeSkill));
  const allJobSkills = [
    ...(jobRequiredSkills || []),
    ...(jobPreferredSkills || []),
  ].map(normalizeSkill);

  const matchedSkills = [];
  const missingSkills = [];

  for (const jobSkill of allJobSkills) {
    let isMatched = false;
    const jobSkillRegex = makeSkillRegex(jobSkill);
    for (const resumeSkill of resumeSkillSet) {
      const resumeSkillRegex = makeSkillRegex(resumeSkill);
      if (jobSkillRegex.test(resumeSkill) || resumeSkillRegex.test(jobSkill)) {
        matchedSkills.push(jobSkill);
        isMatched = true;
        break;
      }
    }
    if (!isMatched && jobRequiredSkills.map(normalizeSkill).includes(jobSkill)) {
      missingSkills.push(jobSkill);
    }
  }

  const totalRequired = jobRequiredSkills.length;
  const matchedRequired = matchedSkills.filter(s =>
    jobRequiredSkills.map(normalizeSkill).includes(s)
  ).length;

  let score = 0;
  if (totalRequired > 0) {
    score = (matchedRequired / totalRequired) * 70; // 70% weight for required skills
    // Add bonus for preferred skills
    const matchedPreferred = matchedSkills.length - matchedRequired;
    const totalPreferred = jobPreferredSkills.length;
    if (totalPreferred > 0) {
      score += (matchedPreferred / totalPreferred) * 30; // 30% weight for preferred skills
    }
  } else {
    // No required skills, base score on any matches
    score = Math.min(matchedSkills.length * 20, 50);
  }

  return {
    score: Math.round(Math.min(score, 100)),
    matchedSkills,
    missingSkills,
  };
};

// Calculate keywords match
const calculateKeywordsMatch = (rawText, jobDescription) => {
  if (!rawText || !jobDescription) {
    return { score: 0, matchedKeywords: [], missingKeywords: [] };
  }

  const resumeWordsArray = extractWords(rawText);
  const jobWords = extractWords(jobDescription);

  // Create a Set for fast lookup
  const resumeWordsSet = new Set(resumeWordsArray);

  // Important keywords to look for
  const importantKeywords = [
    'javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'rust', 'php',
    'react', 'angular', 'vue', 'node', 'express', 'django', 'flask', 'spring',
    'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'firebase', 'aws', 'azure',
    'gcp', 'docker', 'kubernetes', 'jenkins', 'git', 'linux', 'agile', 'scrum',
    'leadership', 'management', 'communication', 'teamwork', 'analytical',
    'problem', 'solving', 'design', 'development', 'testing', 'deployment',
  ];

  const jobKeywords = jobWords.filter(w => importantKeywords.includes(w));

  const matchedKeywords = jobKeywords.filter(k => resumeWordsSet.has(k));
  const missingKeywords = jobKeywords.filter(k => !resumeWordsSet.has(k));

  const score = jobKeywords.length > 0
    ? Math.round((matchedKeywords.length / jobKeywords.length) * 100)
    : 50;

  return { score, matchedKeywords, missingKeywords };
};

// Calculate experience match
const calculateExperienceMatch = (extractedData, jobExperienceLevel) => {
  const experience = extractedData.experience || [];
  const hasExperience = experience.length > 0;

  const levelScores = {
    entry: { hasExp: 30, noExp: 0 },
    mid: { hasExp: 60, noExp: 20 },
    senior: { hasExp: 80, noExp: 30 },
    lead: { hasExp: 90, noExp: 40 },
    executive: { hasExp: 100, noExp: 50 },
  };

  return hasExperience
    ? levelScores[jobExperienceLevel]?.hasExp || 50
    : levelScores[jobExperienceLevel]?.noExp || 0;
};

// Calculate education match
const calculateEducationMatch = (extractedData) => {
  const education = extractedData.education || [];

  if (education.length === 0) return 30;

  const hasDegree = education.some(e =>
    /bachelor|master|phd|b\.tech|m\.tech|b\.e|m\.e|bsc|msc/i.test(e)
  );

  return hasDegree ? 100 : 50;
};

// Main matching function
const calculateJobMatch = (resumeData, job) => {
  const { extractedData, rawText } = resumeData;
  const skills = extractedData?.skills || [];

  // Calculate individual scores
  const skillsResult = calculateSkillsMatch(
    skills,
    job.requiredSkills,
    job.preferredSkills
  );

  const keywordsResult = calculateKeywordsMatch(rawText, job.description);

  const experienceScore = calculateExperienceMatch(
    extractedData,
    job.experienceLevel
  );

  const educationScore = calculateEducationMatch(extractedData);

  // Weighted overall match percentage
  const weights = {
    skills: 0.45,
    keywords: 0.25,
    experience: 0.20,
    education: 0.10,
  };

  const matchPercentage = Math.round(
    (skillsResult.score * weights.skills) +
    (keywordsResult.score * weights.keywords) +
    (experienceScore * weights.experience) +
    (educationScore * weights.education)
  );

  // Generate recommendations
  const recommendations = [];

  if (skillsResult.missingSkills.length > 0) {
    recommendations.push(
      `Add these required skills: ${skillsResult.missingSkills.slice(0, 5).join(', ')}`
    );
  }

  if (keywordsResult.missingKeywords.length > 0) {
    recommendations.push(
      `Include more keywords like: ${keywordsResult.missingKeywords.slice(0, 5).join(', ')}`
    );
  }

  if (experienceScore < 50) {
    recommendations.push('Add more work experience to improve your chances');
  }

  return {
    matchPercentage,
    matchedSkills: skillsResult.matchedSkills,
    missingSkills: skillsResult.missingSkills,
    recommendations,
    categoryScores: {
      skills: skillsResult.score,
      keywords: keywordsResult.score,
      experience: experienceScore,
      education: educationScore,
    },
  };
};

// Get all jobs (with optional filters)
const getJobs = async (filters = {}) => {
  const query = { isActive: true, ...filters };
  return await Job.find(query).sort({ createdAt: -1 });
};

// Get job by ID
const getJobById = async (jobId) => {
  const job = await Job.findById(jobId);
  if (!job) {
    throw ApiError.notFound('Job not found');
  }
  return job;
};

// Create job (admin only)
const createJob = async (jobData) => {
  const job = await Job.create(jobData);
  return job;
};

// Update job (admin only)
const updateJob = async (jobId, jobData) => {
  const job = await Job.findByIdAndUpdate(jobId, jobData, { new: true });
  if (!job) {
    throw ApiError.notFound('Job not found');
  }
  return job;
};

// Delete job (admin only)
const deleteJob = async (jobId) => {
  const job = await Job.findByIdAndDelete(jobId);
  if (!job) {
    throw ApiError.notFound('Job not found');
  }
  return true;
};

// Match resume to all jobs
const matchResumeToJobs = async (userId, resumeId) => {
  // Get resume and its analysis
  const resume = await Resume.findOne({ _id: resumeId, user: userId });
  if (!resume) {
    throw ApiError.notFound('Resume not found');
  }

  const analysis = await ResumeAnalysis.findOne({ resume: resumeId });
  if (!analysis || !analysis.extractedData) {
    throw ApiError.notFound('Resume has not been parsed yet');
  }

  // Get all active jobs
  const jobs = await Job.find({ isActive: true });

  if (jobs.length === 0) {
    return { totalJobs: 0, bestMatches: [] };
  }

  // Replace previous match history for this user+resume (avoid unbounded growth)
  await MatchHistory.deleteMany({ user: userId, resume: resumeId });

  // Calculate match for each job
  const matches = [];
  const historyDocs = [];

  for (const job of jobs) {
    const matchResult = calculateJobMatch(analysis, job);

    historyDocs.push({
      user: userId,
      resume: resumeId,
      job: job._id,
      matchPercentage: matchResult.matchPercentage,
      matchedSkills: matchResult.matchedSkills,
      missingSkills: matchResult.missingSkills,
      recommendations: matchResult.recommendations,
      matchedAt: new Date(),
    });

    matches.push({
      job: {
        id: job._id,
        title: job.title,
        category: job.category,
        location: job.location,
        employmentType: job.employmentType,
        experienceLevel: job.experienceLevel,
      },
      matchPercentage: matchResult.matchPercentage,
      matchedSkills: matchResult.matchedSkills,
      missingSkills: matchResult.missingSkills,
      recommendations: matchResult.recommendations,
      categoryScores: matchResult.categoryScores,
    });
  }

  if (historyDocs.length > 0) {
    await MatchHistory.insertMany(historyDocs);
  }

  // Sort by match percentage (highest first)
  matches.sort((a, b) => b.matchPercentage - a.matchPercentage);

  // Return top 10 matches
  const bestMatches = matches.slice(0, 10);

  return {
    totalJobs: jobs.length,
    bestMatches,
  };
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  matchResumeToJobs,
  calculateJobMatch,
};