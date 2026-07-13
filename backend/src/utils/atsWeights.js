// ATS Scoring Weights Configuration
// Total must equal 100

module.exports = {
  // Category weights (must sum to 100)
  weights: {
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
  },

  // Scoring thresholds for contact info
  contact: {
    hasEmail: 50,
    hasPhone: 50,
  },

  // Scoring thresholds for summary
  summary: {
    minLength: 50,
    maxLength: 500,
    bonusForLength: 20,
  },

  // Scoring thresholds for skills
  skills: {
    minCount: 3,
    maxCount: 30,
    perSkill: 3,
    bonusThreshold: 10,
  },

  // Scoring thresholds for education
  education: {
    hasDegree: 60,
    hasInstitution: 20,
    hasGPA: 10,
    hasYear: 10,
  },

  // Scoring thresholds for experience
  experience: {
    minEntries: 1,
    perEntry: 15,
    hasCompany: 10,
    hasDuration: 10,
    maxEntries: 5,
  },

  // Scoring thresholds for projects
  projects: {
    minEntries: 1,
    perProject: 25,
    maxProjects: 5,
  },

  // Scoring thresholds for certifications
  certifications: {
    perCert: 25,
    maxCerts: 4,
  },

  // Scoring thresholds for keywords
  keywords: {
    minMatches: 5,
    maxMatches: 30,
    perKeyword: 3,
  },

  // Scoring thresholds for achievements
  achievements: {
    perAchievement: 20,
    maxAchievements: 5,
  },

  // Scoring thresholds for formatting
  formatting: {
    idealLength: {
      min: 400,
      max: 800,
    },
    warningLength: {
      min: 200,
      max: 1500,
    },
  },

  // Important keywords to look for
  importantKeywords: [
    // Programming Languages
    'javascript', 'python', 'java', 'typescript', 'c++', 'c#', 'ruby', 'go', 'rust', 'php', 'swift', 'kotlin', 'scala',
    // Frontend
    'react', 'angular', 'vue', 'next.js', 'svelte', 'html', 'css', 'tailwind', 'bootstrap', 'redux',
    // Backend
    'node', 'express', 'django', 'flask', 'fastapi', 'spring', 'nestjs', 'rest api', 'graphql', 'microservices',
    // Databases
    'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'firebase', 'dynamodb', 'elasticsearch',
    // Cloud & DevOps
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'ci/cd', 'jenkins', 'github actions', 'linux',
    // Data Science / ML
    'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'pandas', 'numpy', 'scikit-learn', 'data science',
    'artificial intelligence', 'nlp', 'llm',
    // Tools
    'git', 'agile', 'scrum', 'jira', 'figma', 'kafka',
    // Soft Skills / Action verbs
    'leadership', 'communication', 'teamwork', 'problem solving', 'analytical',
    'developed', 'implemented', 'designed', 'created', 'managed', 'led', 'optimized',
    'analyzed', 'improved', 'built', 'delivered', 'reduced', 'increased', 'achieved',
  ],

  // Required sections
  requiredSections: ['contact', 'skills', 'experience'],
};