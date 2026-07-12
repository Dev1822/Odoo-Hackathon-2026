const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/auth.gamification');
const dashboardController = require('../../controllers/dashboard/dashboard.controller');

router.get('/overview', authenticate, dashboardController.getExecutiveOverview);

module.exports = router;
