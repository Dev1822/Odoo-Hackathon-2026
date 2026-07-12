const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/auth.gamification');
const activityLogController = require('../../controllers/shared/activityLog.controller');

router.get('/', authenticate, activityLogController.getRecentActivity);

module.exports = router;
