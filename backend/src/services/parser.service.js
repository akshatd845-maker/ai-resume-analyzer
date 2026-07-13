const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');
const ResumeAnalysis = require('../models/analysis.model');

/**
 * Download file from URL to temp location
 */
const downloadFile = (url, redirectCount = 0) => {
  return new Promise((resolve, reject) => {
    if (redirectCount > 5) {
      return reject(new Error('Too many redirects (infinite redirect loop prevented)'));
    }

    const protocol = url.startsWith('https') ? https : http;
    const tempPath = path.join(
      __dirname,
      '../../temp',
      `resume_${Date.now()}_${Math.round(Math.random() * 1e6)}.pdf`
    );

    // Ensure temp directory exists
    const tempDir = path.dirname(tempPath);
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const file = fs.createWriteStream(tempPath);

    const request = protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlink(tempPath, () => {});
        const redirectUrl = response.headers.location;
        if (!redirectUrl) {
          return reject(new Error('Redirect location header missing'));
        }
        return downloadFile(redirectUrl, redirectCount + 1).then(resolve).catch(reject);
      }

      if (response.statusCode !== 200) {
        file.close();
        fs.unlink(tempPath, () => {});
        return reject(new Error(`Failed to download: ${response.statusCode}`));
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(tempPath);
      });
    });

    request.on('error', (err) => {
      file.close();
      fs.unlink(tempPath, () => {});
      reject(err);
    });

    request.setTimeout(10000, () => {
      request.destroy();
      file.close();
      fs.unlink(tempPath, () => {});
      reject(new Error('File download request timed out'));
    });
  });
};

/**
 * Extract text from PDF file
 */
const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const parser = new PDFParse({ data: dataBuffer });
    const pdfData = await parser.getText();
    const text = pdfData.text || '';
    console.info('[PDF_PARSER]', JSON.stringify({
      filePath,
      extractedTextLength: text.length,
      extractedTextPreview: text.slice(0, 4000),
    }));
    return text;
  } finally {
    // Clean up temp file
    try {
      fs.unlinkSync(filePath);
    } catch {
      // Ignore cleanup errors
    }
  }
};

/**
 * Extract name from text
 */
const extractName = (text) => {
  const lines = text.split('\n').filter(line => line.trim());

  // First non-empty line is often the name
  for (const line of lines.slice(0, 5)) {
    const cleaned = line.trim();
    // Check if it looks like a name (no numbers, no email-like patterns)
    if (cleaned.length > 2 &&
        cleaned.length < 50 &&
        !cleaned.includes('@') &&
        !/\d{3}/.test(cleaned) &&
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(cleaned)) {
      return cleaned;
    }
  }
  return '';
};

/**
 * Extract email from text
 */
const extractEmail = (text) => {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;
  const matches = text.match(emailRegex);
  return matches ? matches[0].toLowerCase() : '';
};

/**
 * Extract phone from text
 */
const extractPhone = (text) => {
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  const matches = text.match(phoneRegex);
  return matches ? matches[0] : '';
};

/**
 * Helper to compile a skill keyword into a regex with word boundaries.
 */
const makeSkillRegex = (skill) => {
  const escaped = skill.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  const leadingBoundary = /^\w/.test(skill) ? '\\b' : '';
  const trailingBoundary = /\w$/.test(skill) ? '\\b' : '(?!\\w)';
  return new RegExp(leadingBoundary + escaped + trailingBoundary, 'i');
};

/**
 * Extract skills from text
 */
const extractSkills = (text) => {
  const skillKeywords = [
    // Programming Languages
    'javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'golang', 'rust', 'php',
    'swift', 'kotlin', 'typescript', 'scala', 'r', 'matlab', 'perl', 'dart', 'elixir', 'haskell',
    // Web Frontend
    'html', 'css', 'react', 'angular', 'vue', 'next.js', 'nuxt', 'svelte', 'redux',
    'webpack', 'vite', 'tailwind', 'bootstrap', 'sass', 'less', 'jquery', 'graphql',
    // Web Backend
    'node', 'express', 'django', 'flask', 'fastapi', 'spring', 'asp.net', 'laravel',
    'rails', 'nestjs', 'hapi', 'koa', 'fiber',
    // Databases
    'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'oracle', 'firebase', 'dynamodb',
    'cassandra', 'elasticsearch', 'sqlite', 'mariadb', 'supabase', 'prisma', 'sequelize',
    // Cloud & DevOps
    'git', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'jenkins', 'ci/cd',
    'linux', 'unix', 'terraform', 'ansible', 'nginx', 'apache', 'github actions',
    'gitlab ci', 'circleci', 'vercel', 'netlify', 'heroku', 'cloudflare',
    // Data Science & ML
    'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'keras',
    'pandas', 'numpy', 'scikit-learn', 'data analysis', 'data science',
    'artificial intelligence', 'nlp', 'computer vision', 'llm', 'openai',
    'langchain', 'hugging face', 'spark', 'hadoop', 'airflow', 'dbt', 'tableau', 'power bi',
    // Mobile
    'react native', 'flutter', 'android', 'ios', 'xcode',
    // Testing
    'jest', 'mocha', 'cypress', 'selenium', 'pytest', 'junit', 'testing',
    // Other Tools
    'rest api', 'restful', 'websocket', 'grpc', 'microservices', 'kafka', 'rabbitmq',
    'agile', 'scrum', 'jira', 'confluence', 'figma', 'photoshop', 'excel', 'powerpoint',
    // Soft Skills
    'leadership', 'communication', 'teamwork', 'problem-solving', 'analytical', 'project management',
  ];

  const foundSkills = [];

  for (const skill of skillKeywords) {
    const regex = makeSkillRegex(skill);
    if (regex.test(text)) {
      // Capitalize first letter
      const formattedSkill = skill.split(' ').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      if (!foundSkills.includes(formattedSkill)) {
        foundSkills.push(formattedSkill);
      }
    }
  }

  return foundSkills;
};

/**
 * Extract education from text — returns full education section blocks
 */
const extractEducation = (text) => {
  const lines = text.split('\n');
  const educationKeywords = [
    'education', 'academic background', 'academic qualifications', 'qualifications',
    'degree', 'university', 'college', 'bachelor', 'master', 'phd', 'doctorate',
    'b.tech', 'b.e', 'm.tech', 'm.e', 'b.sc', 'm.sc', 'bsc', 'msc', 'b.com', 'm.com',
    'high school', 'secondary school', 'diploma', 'associate'
  ];

  // Try to find the Education section block first
  let sectionStart = -1;
  const sectionEndKeywords = [
    'experience', 'employment', 'work history', 'skills', 'projects',
    'certifications', 'achievements', 'awards', 'publications', 'interests', 'references'
  ];

  for (let i = 0; i < lines.length; i++) {
    const lineLower = lines[i].toLowerCase().trim();
    if (/^education/i.test(lineLower) || lineLower === 'education') {
      sectionStart = i + 1;
      break;
    }
  }

  if (sectionStart !== -1) {
    // Collect up to 10 lines of the education section
    const sectionLines = [];
    for (let i = sectionStart; i < Math.min(sectionStart + 15, lines.length); i++) {
      const lineLower = lines[i].toLowerCase().trim();
      if (sectionEndKeywords.some(k => lineLower.startsWith(k)) && lines[i].trim().length < 30) break;
      if (lines[i].trim()) sectionLines.push(lines[i].trim());
    }
    if (sectionLines.length > 0) {
      // Group non-empty lines into logical entries (max 3 lines each)
      const entries = [];
      let current = [];
      for (const line of sectionLines) {
        if (current.length >= 3) {
          entries.push(current.join(' '));
          current = [];
        }
        current.push(line);
      }
      if (current.length) entries.push(current.join(' '));
      return entries.slice(0, 5);
    }
  }

  // Fallback: scan all lines for education-related content
  const educationEntries = [];
  for (let i = 0; i < lines.length; i++) {
    const lineLower = lines[i].toLowerCase();
    if (educationKeywords.some(keyword => lineLower.includes(keyword))) {
      const context = lines.slice(i, Math.min(i + 3, lines.length))
        .map(l => l.trim()).filter(Boolean).join(' ');
      if (context.length > 10 && !educationEntries.includes(context)) {
        educationEntries.push(context);
      }
    }
  }

  return educationEntries.slice(0, 5);
};

/**
 * Extract experience from text — captures job title, company, dates, and bullet points
 */
const extractExperience = (text) => {
  const lines = text.split('\n');
  const sectionEndKeywords = [
    'education', 'skills', 'projects', 'certifications', 'achievements',
    'awards', 'publications', 'interests', 'references', 'volunteer'
  ];

  // Try to find the Experience/Employment section
  let sectionStart = -1;
  const expSectionKeywords = [
    'experience', 'employment history', 'work experience', 'work history',
    'professional experience', 'career history'
  ];

  for (let i = 0; i < lines.length; i++) {
    const lineLower = lines[i].toLowerCase().trim();
    if (expSectionKeywords.some(k => lineLower === k || lineLower.startsWith(k + ' '))) {
      sectionStart = i + 1;
      break;
    }
  }

  if (sectionStart !== -1) {
    const sectionLines = [];
    for (let i = sectionStart; i < Math.min(sectionStart + 40, lines.length); i++) {
      const lineLower = lines[i].toLowerCase().trim();
      if (sectionEndKeywords.some(k => lineLower === k || (lineLower.startsWith(k) && lines[i].trim().length < 30))) break;
      sectionLines.push(lines[i].trim());
    }

    // Group lines into job entries. A new entry typically starts with a date pattern or a line
    // that looks like a job title (non-empty, no leading bullet, not too long).
    const entries = [];
    let current = [];
    const datePattern = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)\b.*\d{4}|\d{4}\s*[-–—]\s*(\d{4}|present|current)/i;

    for (const line of sectionLines) {
      if (!line) continue;
      // New job entry likely starts when we hit a date line or after a blank
      if (datePattern.test(line) && current.length > 0) {
        entries.push(current.join(' '));
        current = [line];
      } else {
        current.push(line);
        // Cap each entry at 5 lines of context
        if (current.length >= 5) {
          entries.push(current.join(' '));
          current = [];
        }
      }
    }
    if (current.length) entries.push(current.join(' '));

    const filtered = entries.map(e => e.trim()).filter(e => e.length > 15);
    if (filtered.length > 0) return filtered.slice(0, 6);
  }

  // Fallback: scan for company/role indicators
  const experienceKeywords = [
    'experience', 'employment', 'engineer', 'developer', 'analyst', 'manager',
    'intern', 'associate', 'consultant', 'designer', 'architect',
    'inc', 'llc', 'ltd', 'corp', 'technologies', 'solutions', 'services', 'pvt'
  ];

  const experienceEntries = [];
  for (let i = 0; i < lines.length; i++) {
    const lineLower = lines[i].toLowerCase();
    if (experienceKeywords.some(keyword => lineLower.includes(keyword))) {
      const context = lines.slice(i, Math.min(i + 4, lines.length))
        .map(l => l.trim()).filter(Boolean).join(' ');
      if (context.length > 15 && !experienceEntries.includes(context)) {
        experienceEntries.push(context);
      }
    }
  }

  return experienceEntries.slice(0, 6);
};

/**
 * Extract projects from text
 */
const extractProjects = (text) => {
  const projectKeywords = ['project', 'developed', 'built', 'created', 'designed', 'implemented'];

  const lines = text.split('\n');
  const projectEntries = [];

  for (let i = 0; i < lines.length; i++) {
    const lineLower = lines[i].toLowerCase();
    if (projectKeywords.some(keyword => lineLower.includes(keyword))) {
      const context = lines.slice(i, Math.min(i + 3, lines.length)).join(' ');
      if (context.trim() && context.length > 20) {
        projectEntries.push(context.trim());
      }
    }
  }

  return projectEntries.slice(0, 5);
};

/**
 * Extract certifications from text
 */
const extractCertifications = (text) => {
  const certKeywords = ['certification', 'certified', 'certificate', 'license', 'diploma'];

  const lines = text.split('\n');
  const certEntries = [];

  for (let i = 0; i < lines.length; i++) {
    const lineLower = lines[i].toLowerCase();
    if (certKeywords.some(keyword => lineLower.includes(keyword))) {
      const context = lines.slice(i, Math.min(i + 2, lines.length)).join(' ');
      if (context.trim() && context.length > 10) {
        certEntries.push(context.trim());
      }
    }
  }

  return certEntries.slice(0, 5);
};

/**
 * Parse resume from URL
 */
const parseResumeFromUrl = async (url) => {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    // Read local file directly without downloading and without deleting it
    const dataBuffer = fs.readFileSync(url);
    const parser = new PDFParse({ data: dataBuffer });
    const pdfData = await parser.getText();
    return parseRawText(pdfData.text);
  }
  const tempPath = await downloadFile(url);
  const rawText = await extractTextFromPDF(tempPath);
  return parseRawText(rawText);
};

/**
 * Parse resume from file path
 */
const parseResumeFromPath = async (filePath) => {
  const rawText = await extractTextFromPDF(filePath);
  return parseRawText(rawText);
};

/**
 * Parse raw text into structured data
 */
const parseRawText = (rawText) => {
  return {
    rawText,
    name: extractName(rawText),
    email: extractEmail(rawText),
    phone: extractPhone(rawText),
    skills: extractSkills(rawText),
    education: extractEducation(rawText),
    experience: extractExperience(rawText),
    projects: extractProjects(rawText),
    certifications: extractCertifications(rawText),
  };
};

/**
 * Save analysis to database
 */
const saveAnalysis = async (resumeId, userId, extractedData, status = 'completed', error = null) => {
  const analysis = await ResumeAnalysis.findOneAndUpdate(
    { resume: resumeId },
    {
      resume: resumeId,
      user: userId,
      rawText: extractedData.rawText,
      extractedData: {
        name: extractedData.name,
        email: extractedData.email,
        phone: extractedData.phone,
        skills: extractedData.skills,
        education: extractedData.education,
        experience: extractedData.experience,
        projects: extractedData.projects,
        certifications: extractedData.certifications,
      },
      parsingStatus: status,
      parsingError: error,
      parsedAt: status === 'completed' ? new Date() : null,
    },
    { upsert: true, new: true }
  );

  return analysis;
};

module.exports = {
  parseResumeFromUrl,
  parseResumeFromPath,
  parseRawText,
  saveAnalysis,
  downloadFile,
};