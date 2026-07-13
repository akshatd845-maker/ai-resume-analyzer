const mongoose = require('mongoose');

const extractedDataSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    skills: [{ type: String }],
    education: [{ type: String }],
    experience: [{ type: String }],
    projects: [{ type: String }],
    certifications: [{ type: String }],
  },
  { _id: false }
);

const improvementSuggestionSchema = new mongoose.Schema(
  {
    section: { type: String, default: 'General' },
    suggestion: { type: String, default: '' },
    priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  },
  { _id: false }
);

const keywordOptimizationSchema = new mongoose.Schema(
  {
    wellUsed: [{ type: String }],
    shouldAdd: [{ type: String }],
  },
  { _id: false }
);

const sectionFeedbackSchema = new mongoose.Schema(
  {
    contact: { type: String, default: '' },
    summary: { type: String, default: '' },
    skills: { type: String, default: '' },
    experience: { type: String, default: '' },
    education: { type: String, default: '' },
    overall: { type: String, default: '' },
  },
  { _id: false }
);

const scoreBreakdownSchema = new mongoose.Schema(
  {
    contactInfo: { type: Number, default: 0 },
    summary: { type: Number, default: 0 },
    workExperience: { type: Number, default: 0 },
    skills: { type: Number, default: 0 },
    education: { type: Number, default: 0 },
    achievements: { type: Number, default: 0 },
    keywords: { type: Number, default: 0 },
    formatting: { type: Number, default: 0 },
  },
  { _id: false }
);

const aiAnalysisSchema = new mongoose.Schema(
  {
    atsScore: { type: Number, default: 0 },
    careerLevel: { type: String, default: '' },
    yearsOfExperience: { type: Number, default: null },
    industryFit: [{ type: String }],
    summary: { type: String, default: '' },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    missingSkills: [{ type: String }],
    improvementSuggestions: [improvementSuggestionSchema],
    recommendedJobRoles: [{ type: String }],
    keywordOptimization: { type: keywordOptimizationSchema, default: {} },
    sectionFeedback: { type: sectionFeedbackSchema, default: {} },
    scoreBreakdown: { type: scoreBreakdownSchema, default: null },
  },
  { _id: false }
);

const atsCategoryScoresSchema = new mongoose.Schema(
  {
    contact: { type: Number, default: 0 },
    summary: { type: Number, default: 0 },
    skills: { type: Number, default: 0 },
    education: { type: Number, default: 0 },
    experience: { type: Number, default: 0 },
    projects: { type: Number, default: 0 },
    certifications: { type: Number, default: 0 },
    keywords: { type: Number, default: 0 },
    achievements: { type: Number, default: 0 },
    formatting: { type: Number, default: 0 },
  },
  { _id: false }
);

const atsResultsSchema = new mongoose.Schema(
  {
    overallScore: { type: Number, default: 0 },
    categoryScores: { type: atsCategoryScoresSchema, default: {} },
    missingSections: [{ type: String }],
    missingKeywords: [{ type: String }],
    recommendations: [{ type: String }],
  },
  { _id: false }
);

const resumeAnalysisSchema = new mongoose.Schema(
  {
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: [true, 'Resume reference is required'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    rawText: { type: String, default: '' },
    extractedData: { type: extractedDataSchema, default: {} },
    parsingStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    parsingError: { type: String, default: null },
    parsedAt: { type: Date, default: null },
    aiAnalysis: { type: aiAnalysisSchema, default: null },
    analysisStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    analysisError: { type: String, default: null },
    analyzedAt: { type: Date, default: null },
    atsResults: { type: atsResultsSchema, default: null },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

resumeAnalysisSchema.index({ resume: 1 });
resumeAnalysisSchema.index({ user: 1, parsingStatus: 1 });

const ResumeAnalysis = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);

module.exports = ResumeAnalysis;