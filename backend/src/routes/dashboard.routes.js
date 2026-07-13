const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const authenticate = require('../middleware/auth.middleware');
const requireAdmin = require('../middleware/admin.middleware');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// User dashboard
router.get('/', dashboardController.getUserDashboard);

// Admin dashboard
router.get('/admin', requireAdmin, dashboardController.getAdminDashboard);

module.exports = router;