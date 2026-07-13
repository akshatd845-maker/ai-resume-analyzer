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
    return pdfData.text;
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
    'javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'rust', 'php', 'swift', 'kotlin', 'typescript',
    // Web Technologies
    'html', 'css', 'react', 'angular', 'vue', 'node', 'express', 'django', 'flask', 'spring', 'asp.net',
    // Databases
    'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'oracle', 'firebase', 'dynamodb',
    // Tools & Platforms
    'git', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'jenkins', 'ci/cd', 'linux', 'unix',
    // Data Science & ML
    'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'pandas', 'numpy', 'scikit-learn',
    'data analysis', 'data science', 'artificial intelligence', 'ai',
    // Soft Skills
    'leadership', 'communication', 'teamwork', 'problem-solving', 'analytical', 'project management',
    // Frameworks
    'bootstrap', 'tailwind', 'sass', 'less', 'graphql', 'rest api', 'restful',
    // Others
    'agile', 'scrum', 'jira', 'confluence', 'figma', 'photoshop', 'excel', 'powerpoint'
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
 * Extract education from text
 */
const extractEducation = (text) => {
  const educationKeywords = [
    'education', 'academic', 'degree', 'university', 'college', 'bachelor', 'master', 'phd',
    'b.tech', 'b.e', 'm.tech', 'm.e', 'b.sc', 'm.sc', 'bsc', 'msc'
  ];

  const lines = text.split('\n');
  const educationEntries = [];

  for (let i = 0; i < lines.length; i++) {
    const lineLower = lines[i].toLowerCase();
    if (educationKeywords.some(keyword => lineLower.includes(keyword))) {
      // Get surrounding context (current line + next 2 lines)
      const context = lines.slice(i, Math.min(i + 3, lines.length)).join(' ');
      if (context.trim() && context.length > 10) {
        educationEntries.push(context.trim());
      }
    }
  }

  // If no education found, try to find degree patterns
  if (educationEntries.length === 0) {
    const degreePattern = /(bachelor|master|phd|b\.tech|m\.tech|b\.e|m\.e|b\.sc|m\.sc|bsc|msc)/gi;
    for (const line of lines) {
      if (degreePattern.test(line)) {
        educationEntries.push(line.trim());
      }
    }
  }

  return educationEntries.slice(0, 5);
};

/**
 * Extract experience from text
 */
const extractExperience = (text) => {
  const experienceKeywords = [
    'experience', 'employment', 'work history', 'professional', 'career', 'job',
    'company', 'inc', 'llc', 'ltd', 'corp', 'technologies', 'solutions', 'services'
  ];

  const lines = text.split('\n');
  const experienceEntries = [];

  for (let i = 0; i < lines.length; i++) {
    const lineLower = lines[i].toLowerCase();
    if (experienceKeywords.some(keyword => lineLower.includes(keyword))) {
      const context = lines.slice(i, Math.min(i + 3, lines.length)).join(' ');
      if (context.trim() && context.length > 15) {
        experienceEntries.push(context.trim());
      }
    }
  }

  return experienceEntries.slice(0, 5);
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