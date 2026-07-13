const express = require('express');
const analysisController = require('../controllers/analysis.controller');
const authenticate = require('../middleware/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// AI Analysis endpoints
router.post('/:resumeId', analysisController.analyzeResume);
router.get('/:resumeId', analysisController.getAnalysis);

// ATS Scoring endpoints
router.post('/:resumeId/ats', analysisController.analyzeATS);
router.get('/:resumeId/ats', analysisController.getATS);

module.exports = router;