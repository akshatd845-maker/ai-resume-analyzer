const resumeService = require('../services/resume.service');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const uploadResume = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const file = req.file;

  const resume = await resumeService.uploadResume(userId, file);

  const response = ApiResponse.created('Resume uploaded successfully', {
    resume,
  });

  return response.send(res);
});

const getResumes = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const resumes = await resumeService.getResumes(userId);

  const response = ApiResponse.success('Resumes fetched successfully', {
    resumes,
  });

  return response.send(res);
});

const getResumeById = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  const resume = await resumeService.getResumeById(userId, id);

  const response = ApiResponse.success('Resume fetched successfully', {
    resume,
  });

  return response.send(res);
});

const deleteResume = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  await resumeService.deleteResume(userId, id);

  const response = ApiResponse.success('Resume deleted successfully');

  return response.send(res);
});

const downloadResumeFile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  await resumeService.streamResumeFile(userId, id, res);
});

module.exports = {
  uploadResume,
  getResumes,
  getResumeById,
  deleteResume,
  downloadResumeFile,
};