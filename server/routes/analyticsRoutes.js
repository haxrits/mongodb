const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/dashboard', analyticsController.getDashboardStats);
router.get('/conflicts', analyticsController.getConflictAnalytics);
router.get('/rooms', analyticsController.getRoomAnalytics);
router.get('/students', analyticsController.getStudentDemographics);

module.exports = router;
