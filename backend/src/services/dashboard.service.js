const User = require('../models/user.model');
const Resume = require('../models/resume.model');
const ResumeAnalysis = require('../models/analysis.model');
const Job = require('../models/job.model');
const MatchHistory = require('../models/matchHistory.model');
const ApiError = require('../utils/ApiError');

// Get user dashboard data
const getUserDashboard = async (userId) => {
  // Get user profile
  const profile = await User.findById(userId).select('-password');
  if (!profile) {
    throw ApiError.notFound('User not found');
  }

  // Get resumes with analysis
  const resumes = await Resume.find({ user: userId }).sort({ createdAt: -1 });
  const totalResumes = resumes.length;

  // Get latest resume with analysis
  const latestResume = resumes[0] || null;
  let analysis = null;
  let ats = null;

  if (latestResume) {
    const latestAnalysis = await ResumeAnalysis.findOne({ resume: latestResume._id });
    if (latestAnalysis) {
      analysis = {
        parsingStatus: latestAnalysis.parsingStatus,
        analysisStatus: latestAnalysis.analysisStatus,
        extractedData: latestAnalysis.extractedData,
        aiAnalysis: latestAnalysis.aiAnalysis,
        parsedAt: latestAnalysis.parsedAt,
        analyzedAt: latestAnalysis.analyzedAt,
      };
      ats = latestAnalysis.atsResults;
    }
  }

  // Get all analyses for this user
  const analyses = await ResumeAnalysis.find({ user: userId });

  // Calculate analytics
  let latestAtsScore = null;
  let averageAtsScore = null;
  let topSkills = [];
  let missingSkills = [];
  let recommendedJobRoles = [];

  if (analyses.length > 0) {
    // Get ATS scores
    const atsScores = analyses
      .filter(a => a.atsResults && a.atsResults.overallScore)
      .map(a => a.atsResults.overallScore);

    if (atsScores.length > 0) {
      latestAtsScore = atsScores[0];
      averageAtsScore = Math.round(atsScores.reduce((a, b) => a + b, 0) / atsScores.length);
    }

    // Aggregate skills
    const allSkills = analyses
      .flatMap(a => a.extractedData?.skills || []);
    const skillCounts = {};
    allSkills.forEach(skill => {
      const normalized = skill.toLowerCase();
      skillCounts[normalized] = (skillCounts[normalized] || 0) + 1;
    });
    topSkills = Object.entries(skillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([skill]) => skill);

    // Aggregate missing skills from AI analysis
    const allMissingSkills = analyses
      .flatMap(a => a.aiAnalysis?.missingSkills || []);
    const missingSkillCounts = {};
    allMissingSkills.forEach(skill => {
      const normalized = skill.toLowerCase();
      missingSkillCounts[normalized] = (missingSkillCounts[normalized] || 0) + 1;
    });
    missingSkills = Object.entries(missingSkillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([skill]) => skill);

    // Aggregate recommended job roles from AI
    const allJobRoles = analyses
      .flatMap(a => a.aiAnalysis?.recommendedJobRoles || []);
    const roleCounts = {};
    allJobRoles.forEach(role => {
      const normalized = role.toLowerCase();
      roleCounts[normalized] = (roleCounts[normalized] || 0) + 1;
    });
    recommendedJobRoles = Object.entries(roleCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([role]) => role);
  }

  // Get job matching stats
  const matchHistory = await MatchHistory.find({ user: userId }).sort({ matchedAt: -1 });
  const totalMatches = matchHistory.length;
  const bestMatchedJobs = matchHistory
    .filter(m => m.matchPercentage)
    .sort((a, b) => b.matchPercentage - a.matchPercentage)
    .slice(0, 5);

  // Get resume upload history
  const resumeHistory = resumes.map(r => ({
    id: r._id,
    originalFileName: r.originalFileName,
    uploadedAt: r.createdAt,
    status: r.uploadStatus,
  }));

  return {
    profile: {
      name: profile.name,
      email: profile.email,
      role: profile.role,
      avatar: profile.avatar,
      lastLogin: profile.lastLogin,
      createdAt: profile.createdAt,
    },
    resume: {
      total: totalResumes,
      latest: latestResume ? {
        id: latestResume._id,
        fileName: latestResume.originalFileName,
        uploadedAt: latestResume.createdAt,
      } : null,
      history: resumeHistory,
    },
    analysis: {
      total: analyses.length,
      status: analysis?.parsingStatus || 'pending',
      aiStatus: analysis?.analysisStatus || 'pending',
      latest: analysis,
    },
    ats: {
      latestScore: latestAtsScore,
      averageScore: averageAtsScore,
      result: ats,
    },
    jobMatching: {
      totalMatches,
      bestMatches: bestMatchedJobs.map(m => ({
        jobId: m.job,
        matchPercentage: m.matchPercentage,
        matchedAt: m.matchedAt,
      })),
      recommendedRoles: recommendedJobRoles,
    },
    analytics: {
      topSkills,
      missingSkills,
      recommendedJobRoles,
    },
  };
};

// Get admin dashboard data
const getAdminDashboard = async () => {
  // Total counts using aggregation
  const [userStats, resumeStats, analysisStats, jobStats, matchStats] = await Promise.all([
    // User stats
    User.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
        },
      },
    ]),
    // Resume stats
    Resume.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
        },
      },
    ]),
    // Analysis stats
    ResumeAnalysis.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$analysisStatus', 'completed'] }, 1, 0] },
          },
        },
      },
    ]),
    // Job stats
    Job.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] },
          },
        },
      },
    ]),
    // Match stats
    MatchHistory.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
        },
      },
    ]),
  ]);

  const totalUsers = userStats[0]?.total || 0;
  const totalResumes = resumeStats[0]?.total || 0;
  const totalAnalyses = analysisStats[0]?.total || 0;
  const completedAnalyses = analysisStats[0]?.completed || 0;
  const totalJobs = jobStats[0]?.total || 0;
  const activeJobs = jobStats[0]?.active || 0;
  const totalMatches = matchStats[0]?.total || 0;

  // Calculate average ATS score
  const atsStats = await ResumeAnalysis.aggregate([
    {
      $match: {
        'atsResults.overallScore': { $exists: true },
      },
    },
    {
      $group: {
        _id: null,
        averageScore: { $avg: '$atsResults.overallScore' },
      },
    },
  ]);
  const averageAtsScore = atsStats[0]?.averageScore
    ? Math.round(atsStats[0].averageScore)
    : null;

  // Get most common skills
  const skillStats = await ResumeAnalysis.aggregate([
    {
      $match: {
        'extractedData.skills': { $exists: true, $ne: [] },
      },
    },
    {
      $unwind: '$extractedData.skills',
    },
    {
      $group: {
        _id: { $toLower: '$extractedData.skills' },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: 10,
    },
    {
      $project: {
        _id: 0,
        skill: '$_id',
        count: 1,
      },
    },
  ]);

  // Get most missing skills (from job matching)
  const missingSkillsStats = await MatchHistory.aggregate([
    {
      $match: {
        missingSkills: { $exists: true, $ne: [] },
      },
    },
    {
      $unwind: '$missingSkills',
    },
    {
      $group: {
        _id: { $toLower: '$missingSkills' },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: 10,
    },
    {
      $project: {
        _id: 0,
        skill: '$_id',
        count: 1,
      },
    },
  ]);

  // Get new users this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const newUsersThisMonth = await User.countDocuments({
    createdAt: { $gte: startOfMonth },
  });

  // Get resume uploads this month
  const resumeUploadsThisMonth = await Resume.countDocuments({
    createdAt: { $gte: startOfMonth },
  });

  // Get active users (users with logins in last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const activeUsers = await User.countDocuments({
    lastLogin: { $gte: thirtyDaysAgo },
  });

  // Get job category distribution
  const jobCategories = await Job.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $project: {
        _id: 0,
        category: '$_id',
        count: 1,
      },
    },
  ]);

  return {
    totalUsers,
    totalResumes,
    totalAnalyses,
    completedAnalyses,
    totalJobs,
    activeJobs,
    totalMatches,
    averageAtsScore,
    mostCommonSkills: skillStats,
    mostMissingSkills: missingSkillsStats,
    newUsersThisMonth,
    activeUsers,
    resumeUploadsThisMonth,
    jobCategories,
  };
};

module.exports = {
  getUserDashboard,
  getAdminDashboard,
};