const express = require('express');
const jobController = require('../controllers/job.controller');
const authenticate = require('../middleware/auth.middleware');
const requireAdmin = require('../middleware/admin.middleware');
const validate = require('../middleware/validation.middleware');
const { createJobValidator, updateJobValidator } = require('../validators/job.validator');

const router = express.Router();

// Public routes (require authentication but not admin)
router.use(authenticate);

// Get all jobs (public)
router.get('/', jobController.getJobs);

// Get job by ID (public)
router.get('/:id', jobController.getJobById);

// Match resume to jobs (authenticated users)
router.post('/match/:resumeId', jobController.matchResume);

// Admin only routes — check role before body validation
router.post('/', requireAdmin, createJobValidator, validate, jobController.createJob);
router.put('/:id', requireAdmin, updateJobValidator, validate, jobController.updateJob);
router.delete('/:id', requireAdmin, jobController.deleteJob);

module.exports = router;