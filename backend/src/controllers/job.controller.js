const jobService = require('../services/jobMatching.service');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// Get all jobs
const getJobs = asyncHandler(async (req, res) => {
  const { category, experienceLevel } = req.query;
  const filters = {};

  if (category) filters.category = category;
  if (experienceLevel) filters.experienceLevel = experienceLevel;

  const jobs = await jobService.getJobs(filters);

  const response = ApiResponse.success('Jobs fetched successfully', {
    jobs,
    total: jobs.length,
  });

  return response.send(res);
});

// Get job by ID
const getJobById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const job = await jobService.getJobById(id);

  const response = ApiResponse.success('Job fetched successfully', {
    job,
  });

  return response.send(res);
});

// Create job (admin only)
const createJob = asyncHandler(async (req, res) => {
  const job = await jobService.createJob(req.body);

  const response = ApiResponse.created('Job created successfully', {
    job,
  });

  return response.send(res);
});

// Update job (admin only)
const updateJob = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const job = await jobService.updateJob(id, req.body);

  const response = ApiResponse.success('Job updated successfully', {
    job,
  });

  return response.send(res);
});

// Delete job (admin only)
const deleteJob = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await jobService.deleteJob(id);

  const response = ApiResponse.success('Job deleted successfully');

  return response.send(res);
});

// Match resume to jobs
const matchResume = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { resumeId } = req.params;

  const result = await jobService.matchResumeToJobs(userId, resumeId);

  const response = ApiResponse.success('Job matching completed successfully', result);

  return response.send(res);
});

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  matchResume,
};