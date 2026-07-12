const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../middlewares/auth.gamification');
const validate = require('../../middlewares/validate.gamification');
const { environmentalReportQuerySchema } = require('../../utils/schemas/report.environmental.schema');
const reportController = require('../../controllers/reports/report.controller');

router.get('/environmental', authenticate, authorize('MANAGER', 'ADMIN'), validate(environmentalReportQuerySchema, 'query'), reportController.getEnvironmentalReport);

module.exports = router;
