const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/auth.gamification');
const departmentScoreController = require('../../controllers/shared/departmentScore.controller');

router.get('/', authenticate, departmentScoreController.getAllDepartmentScores);
router.get('/overall', authenticate, departmentScoreController.getOverallEsgScore);
router.get('/:departmentId', authenticate, departmentScoreController.getDepartmentScore);

module.exports = router;
