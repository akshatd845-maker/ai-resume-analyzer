const dashboardService = require('../services/dashboard.service');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// Get user dashboard
const getUserDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const dashboard = await dashboardService.getUserDashboard(userId);

  const response = ApiResponse.success('Dashboard data fetched successfully', {
    profile: dashboard.profile,
    resume: dashboard.resume,
    analysis: dashboard.analysis,
    ats: dashboard.ats,
    jobMatching: dashboard.jobMatching,
    analytics: dashboard.analytics,
  });

  return response.send(res);
});

// Get admin dashboard
const getAdminDashboard = asyncHandler(async (req, res) => {
  const dashboard = await dashboardService.getAdminDashboard();

  const response = ApiResponse.success('Admin dashboard data fetched successfully', {
    totalUsers: dashboard.totalUsers,
    totalResumes: dashboard.totalResumes,
    totalAnalyses: dashboard.totalAnalyses,
    completedAnalyses: dashboard.completedAnalyses,
    totalJobs: dashboard.totalJobs,
    activeJobs: dashboard.activeJobs,
    totalMatches: dashboard.totalMatches,
    averageAtsScore: dashboard.averageAtsScore,
    mostCommonSkills: dashboard.mostCommonSkills,
    mostMissingSkills: dashboard.mostMissingSkills,
    newUsersThisMonth: dashboard.newUsersThisMonth,
    activeUsers: dashboard.activeUsers,
    resumeUploadsThisMonth: dashboard.resumeUploadsThisMonth,
    jobCategories: dashboard.jobCategories,
  });

  return response.send(res);
});

module.exports = {
  getUserDashboard,
  getAdminDashboard,
};