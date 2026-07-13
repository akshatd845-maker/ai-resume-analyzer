const mongoose = require('mongoose');

const matchHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: [true, 'Resume reference is required'],
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job reference is required'],
    },
    matchPercentage: {
      type: Number,
      required: [true, 'Match percentage is required'],
      min: [0, 'Match percentage cannot be less than 0'],
      max: [100, 'Match percentage cannot be more than 100'],
    },
    matchedSkills: [
      {
        type: String,
      },
    ],
    missingSkills: [
      {
        type: String,
      },
    ],
    recommendations: [
      {
        type: String,
      },
    ],
    matchedAt: {
      type: Date,
      default: Date.now,
    },
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

// Indexes
matchHistorySchema.index({ user: 1, resume: 1 });
matchHistorySchema.index({ job: 1 });
matchHistorySchema.index({ matchPercentage: -1 });
matchHistorySchema.index({ matchedAt: -1 });

const MatchHistory = mongoose.model('MatchHistory', matchHistorySchema);

module.exports = MatchHistory;