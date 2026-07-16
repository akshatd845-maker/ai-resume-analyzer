const ResumeAnalysis = require('../models/analysis.model');
const Resume = require('../models/resume.model');
const ApiError = require('../utils/ApiError');
const { analyzeResume, detectField, generateCacheKey } = require('./ai.service');
const atsService = require('./ats.service');

// Simple in-memory cache (in production, use Redis)
// Format: { cacheKey: { data: ..., timestamp: ... } }
const analysisCache = new Map();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Check if cached result exists and is valid
 */
const getCachedResult = (cacheKey) => {
  const cached = analysisCache.get(cacheKey);
  if (!cached) return null;

  const isExpired = Date.now() - cached.timestamp > CACHE_TTL_MS;
  if (isExpired) {
    analysisCache.delete(cacheKey);
    return null;
  }

  return cached.data;
};

/**
 * Store result in cache
 */
const setCachedResult = (cacheKey, data) => {
  // Clean up old entries if cache is too large
  if (analysisCache.size > 100) {
    const oldestKey = analysisCache.keys().next().value;
    analysisCache.delete(oldestKey);
  }

  analysisCache.set(cacheKey, {
    data,
    timestamp: Date.now(),
  });
};

/**
 * Main analysis function with field detection, caching, and orchestration
 */
const analyzeResumeById = async (userId, resumeId, jobDescription = null) => {
  // Check if resume exists and belongs to user
  const resume = await Resume.findOne({ _id: resumeId, user: userId });

  if (!resume) {
    throw ApiError.notFound('Resume not found');
  }

  // Get or create analysis document
  let analysis = await ResumeAnalysis.findOne({ resume: resumeId });

  if (!analysis) {
    throw ApiError.notFound('Resume has not been parsed yet. Please upload and parse the resume first.');
  }

  // Check if parsing is complete
  if (analysis.parsingStatus !== 'completed') {
    throw ApiError.badRequest('Resume parsing is not complete. Please try again later.');
  }

  // Generate cache key
  const cacheKey = generateCacheKey(userId, analysis.rawText, jobDescription);

  // Check cache first
  const cachedResult = getCachedResult(cacheKey);
  if (cachedResult) {
    console.log('Returning cached analysis result');
    return cachedResult;
  }

  // Analyze with AI - with timeout handling
  try {
    // Step 1: Detect field (lightweight OpenAI call)
    // Use a 30-second timeout for field detection
    const fieldDetectionPromise = detectField(analysis.rawText);
    const fieldTimeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Field detection timeout')), 30000);
    });

    const fieldInfo = await Promise.race([fieldDetectionPromise, fieldTimeoutPromise])
      .catch(err => {
        console.error('Field detection failed:', err.message);
        return null; // Fallback to default field
      });

    // Step 2: Run AI analysis with field context
    // Pass field info to AI for grounded, field-specific feedback
    const aiAnalysis = await Promise.race([
      analyzeResume(analysis.extractedData, analysis.rawText, fieldInfo),
      new Promise((_, reject) => setTimeout(() => reject(new Error('AI analysis timeout')), 60000))
    ]);

    // Add field detection results to AI analysis
    if (fieldInfo) {
      aiAnalysis.detectedField = {
        profession: fieldInfo.profession,
        seniority: fieldInfo.seniority,
        fieldCategory: fieldInfo.fieldCategory,
        evaluationCriteria: fieldInfo.evaluationCriteria,
        criticalCredential: fieldInfo.criticalCredential,
      };
    }

    // Step 3: Generate ATS analysis with field-adaptive weights
    const atsOptions = {
      fieldWeights: fieldInfo?.fieldWeights || null,
      jobDescription,
      fieldInfo,
    };
    const atsResults = atsService.generateATSAnalysis(analysis.extractedData, analysis.rawText, atsOptions);

    // Step 4: Generate honest verdict
    const honestVerdict = generateHonestVerdict(aiAnalysis, atsResults, fieldInfo);

    // Combine results
    const fullAnalysis = {
      ...analysis.toObject(),
      aiAnalysis,
      atsResults,
      detectedField: fieldInfo,
      honestVerdict,
      analysisStatus: 'completed',
      analysisError: null,
      analyzedAt: new Date(),
      cachedAt: null, // Will be set when cached
    };

    // Update the analysis document in DB
    analysis = await ResumeAnalysis.findOneAndUpdate(
      { resume: resumeId },
      {
        aiAnalysis,
        atsResults,
        detectedField: fieldInfo,
        honestVerdict,
        analysisStatus: 'completed',
        analysisError: null,
        analyzedAt: new Date(),
      },
      { new: true }
    );

    // Cache the result
    setCachedResult(cacheKey, analysis);

    return analysis;
  } catch (error) {
    const errorMessage = error.message || 'Unknown error';

    // Handle specific error types
    let apiError;
    if (errorMessage.includes('timeout')) {
      apiError = ApiError.serviceUnavailable('Analysis timed out - please try again');
    } else if (error.status === 429 || errorMessage.includes('rate limit')) {
      apiError = ApiError.serviceUnavailable('Rate limit exceeded - please try again later');
    } else if (errorMessage.includes('parse') || errorMessage.includes('JSON')) {
      apiError = ApiError.internal('Failed to parse AI response - please try again');
    } else {
      apiError = ApiError.internal(`Analysis failed: ${errorMessage}`);
    }

    // Save failed analysis status
    await ResumeAnalysis.findOneAndUpdate(
      { resume: resumeId },
      {
        analysisStatus: 'failed',
        analysisError: errorMessage,
      }
    );

    throw apiError;
  }
};

/**
 * Generate an honest, blunt verdict based on analysis results
 */
const generateHonestVerdict = (aiAnalysis, atsResults, fieldInfo) => {
  const atsScore = atsResults?.overallScore || 0;
  const hardGatePassed = atsResults?.hardGateCheck?.passed;

  let verdict = '';
  let isRecommended = true;
  let criticalIssues = [];

  // Check hard gate first (most important)
  if (hardGatePassed === false) {
    isRecommended = false;
    const missing = atsResults.hardGateCheck?.missingRequirements || [];
    criticalIssues = missing.filter(m => m.severity === 'critical').map(m => m.requirement);

    verdict = `This resume likely fails ATS auto-filtering. Missing critical requirements: ${criticalIssues.join(', ')}.`;
  } else if (atsScore < 40) {
    isRecommended = false;
    verdict = 'This resume needs significant improvement. Low ATS score suggests major gaps in content or formatting.';
  } else if (atsScore < 60) {
    isRecommended = true;
    verdict = 'This resume is acceptable but has room for improvement. Consider addressing the identified weaknesses.';
  } else if (atsScore >= 75) {
    isRecommended = true;
    verdict = 'This resume is strong and likely to pass ATS screening. The strengths section highlights your key assets.';
  } else {
    isRecommended = true;
    verdict = 'This resume is competitive. The AI analysis provides specific suggestions for further improvement.';
  }

  // Add field-specific context
  if (fieldInfo && fieldInfo.profession) {
    verdict = `[${fieldInfo.profession}] ${verdict}`;
  }

  return {
    text: verdict,
    isRecommended,
    atsScore,
    criticalIssues,
  };
};

const getAnalysisByResumeId = async (userId, resumeId) => {
  // Check if resume exists and belongs to user
  const resume = await Resume.findOne({ _id: resumeId, user: userId });

  if (!resume) {
    throw ApiError.notFound('Resume not found');
  }

  const analysis = await ResumeAnalysis.findOne({ resume: resumeId });

  if (!analysis) {
    throw ApiError.notFound('Analysis not found for this resume');
  }

  return analysis;
};

module.exports = {
  analyzeResumeById,
  getAnalysisByResumeId,
  getCachedResult,
  setCachedResult,
};