const analysisService = require('../services/analysis.service');
const atsService = require('../services/ats.service');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const analyzeResume = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { resumeId } = req.params;

  const analysis = await analysisService.analyzeResumeById(userId, resumeId);

  const response = ApiResponse.success('Resume analyzed successfully', {
    analysis,
  });

  return response.send(res);
});

const getAnalysis = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { resumeId } = req.params;

  const analysis = await analysisService.getAnalysisByResumeId(userId, resumeId);

  const response = ApiResponse.success('Analysis fetched successfully', {
    analysis,
  });

  return response.send(res);
});

const analyzeATS = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { resumeId } = req.params;

  const atsResults = await atsService.analyzeATSById(userId, resumeId);

  const response = ApiResponse.success('ATS analysis completed successfully', {
    atsResults,
  });

  return response.send(res);
});

const getATS = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { resumeId } = req.params;

  const atsResults = await atsService.getATSScoreById(userId, resumeId);

  const response = ApiResponse.success('ATS results fetched successfully', {
    atsResults,
  });

  return response.send(res);
});

module.exports = {
  analyzeResume,
  getAnalysis,
  analyzeATS,
  getATS,
};