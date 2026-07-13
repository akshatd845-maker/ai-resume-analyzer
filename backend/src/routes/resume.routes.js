const express = require('express');
const resumeController = require('../controllers/resume.controller');
const authenticate = require('../middleware/auth.middleware');
const handleUpload = require('../middleware/upload.middleware');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Upload a new resume
router.post('/upload', handleUpload, resumeController.uploadResume);

// Get all resumes for the authenticated user
router.get('/', resumeController.getResumes);

// Stream resume PDF (authenticated — replaces public /uploads)
router.get('/:id/file', resumeController.downloadResumeFile);

// Get a specific resume by ID
router.get('/:id', resumeController.getResumeById);

// Delete a resume by ID
router.delete('/:id', resumeController.deleteResume);

module.exports = router;