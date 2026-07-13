const ResumeAnalysis = require('../models/analysis.model');
const Resume = require('../models/resume.model');
const ApiError = require('../utils/ApiError');
const { analyzeResume } = require('./ai.service');
const atsService = require('./ats.service');

const analyzeResumeById = async (userId, resumeId) => {
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

  // Analyze with AI
  try {
    const aiAnalysis = await analyzeResume(analysis.extractedData);
    const atsResults = atsService.generateATSAnalysis(analysis.extractedData, analysis.rawText);

    // Update the analysis document
    analysis = await ResumeAnalysis.findOneAndUpdate(
      { resume: resumeId },
      {
        aiAnalysis,
        atsResults,
        analysisStatus: 'completed',
        analysisError: null,
        analyzedAt: new Date(),
      },
      { new: true }
    );
  } catch (error) {
    // Save failed analysis
    analysis = await ResumeAnalysis.findOneAndUpdate(
      { resume: resumeId },
      {
        analysisStatus: 'failed',
        analysisError: error.message,
      },
      { new: true }
    );

    throw ApiError.internal(`AI analysis failed: ${error.message}`);
  }

  return analysis;
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
};