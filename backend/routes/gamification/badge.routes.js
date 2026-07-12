const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { createBadgeSchema } = require('../../utils/schemas/badge.schema');
const badgeController = require('../../controllers/gamification/badge.controller');

router.post('/badges', authenticate, authorize('ADMIN'), validate(createBadgeSchema), badgeController.createBadge);
router.get('/badges', authenticate, badgeController.listBadges);
router.get('/employees/:id/badges', authenticate, badgeController.getEmployeeBadges);

module.exports = router;
