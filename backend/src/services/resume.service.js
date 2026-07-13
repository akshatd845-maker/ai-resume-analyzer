const Resume = require('../models/resume.model');
const ApiError = require('../utils/ApiError');
const path = require('path');
const { cloudinary } = require('../config/cloudinary');
const { parseResumeFromUrl, saveAnalysis } = require('./parser.service');

const uploadResume = async (userId, file) => {
  const isLocal = !process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === 'your-cloud-name';
  const publicId =
    file.filename ||
    `${file.fieldname}-${Date.now()}${path.extname(file.originalname || '.pdf')}`;

  let resume;
  try {
    resume = await Resume.create({
      user: userId,
      originalFileName: file.originalname,
      publicId,
      secureUrl: isLocal ? 'pending' : file.path,
      fileSize: file.size,
      mimeType: file.mimetype,
      uploadStatus: 'completed',
    });

    // For local storage, point secureUrl at the authenticated file endpoint
    if (isLocal) {
      const baseUrl = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 5000}/api`;
      resume.secureUrl = `${baseUrl}/resumes/${resume._id}/file`;
      await resume.save();
    }
  } catch (dbError) {
    // Database save failed, clean up uploaded file
    if (isLocal && file.path) {
      const fs = require('fs');
      try {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      } catch (err) {
        console.error('Error deleting local file on database error:', err.message);
      }
    } else if (!isLocal && publicId) {
      try {
        await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
      } catch (err) {
        console.error('Error deleting Cloudinary file on database error:', err.message);
      }
    }
    throw dbError;
  }

  // Parse the uploaded resume
  try {
    const extractedData = await parseResumeFromUrl(file.path);
    await saveAnalysis(resume._id, userId, extractedData);
  } catch (error) {
    console.error('Error parsing resume:', error.message);
    // Save analysis with failed status
    await saveAnalysis(resume._id, userId, { rawText: '' }, 'failed', error.message);
  }

  return resume;
};

const getResumes = async (userId) => {
  const resumes = await Resume.find({ user: userId }).sort({ createdAt: -1 });
  return resumes;
};

const getResumeById = async (userId, resumeId) => {
  const resume = await Resume.findOne({ _id: resumeId, user: userId });

  if (!resume) {
    throw ApiError.notFound('Resume not found');
  }

  return resume;
};

const deleteResume = async (userId, resumeId) => {
  const resume = await Resume.findOne({ _id: resumeId, user: userId });

  if (!resume) {
    throw ApiError.notFound('Resume not found');
  }

  const isLocal = !process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === 'your-cloud-name';
  if (isLocal) {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, '../../uploads', resume.publicId);
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted local file: ${filePath}`);
      }
    } catch (error) {
      console.error('Error deleting local file:', error.message);
    }
  } else {
    // Delete from Cloudinary
    try {
      await cloudinary.uploader.destroy(resume.publicId, {
        resource_type: 'raw',
      });
    } catch (error) {
      console.error('Error deleting file from Cloudinary:', error.message);
    }
  }

  // Delete analysis if exists
  const ResumeAnalysis = require('../models/analysis.model');
  await ResumeAnalysis.findOneAndDelete({ resume: resumeId });

  // Delete from database
  await Resume.findByIdAndDelete(resumeId);

  return true;
};

const streamResumeFile = async (userId, resumeId, res) => {
  const resume = await Resume.findOne({ _id: resumeId, user: userId });

  if (!resume) {
    throw ApiError.notFound('Resume not found');
  }

  const isLocal = !process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === 'your-cloud-name';

  if (!isLocal) {
    return res.redirect(resume.secureUrl);
  }

  const fs = require('fs');
  const path = require('path');
  const filePath = path.join(__dirname, '../../uploads', resume.publicId);

  if (!fs.existsSync(filePath)) {
    throw ApiError.notFound('Resume file not found on server');
  }

  res.setHeader('Content-Type', resume.mimeType || 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `inline; filename="${encodeURIComponent(resume.originalFileName)}"`,
  );

  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
};

module.exports = {
  uploadResume,
  getResumes,
  getResumeById,
  deleteResume,
  streamResumeFile,
};