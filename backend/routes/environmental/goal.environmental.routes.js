const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../middlewares/auth.gamification');
const validate = require('../../middlewares/validate.gamification');
const { createGoalSchema, updateGoalSchema } = require('../../utils/schemas/goal.environmental.schema');
const goalController = require('../../controllers/environmental/goal.environmental.controller');

router.post('/', authenticate, authorize('MANAGER', 'ADMIN'), validate(createGoalSchema), goalController.createGoal);
router.get('/', authenticate, goalController.listGoals);
router.put('/:id', authenticate, authorize('MANAGER', 'ADMIN'), validate(updateGoalSchema), goalController.updateGoal);
router.delete('/:id', authenticate, authorize('ADMIN'), goalController.deleteGoal);

module.exports = router;
