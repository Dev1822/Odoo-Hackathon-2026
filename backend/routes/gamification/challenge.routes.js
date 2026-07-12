const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { createChallengeSchema, updateChallengeSchema, updateStatusSchema } = require('../../utils/schemas/challenge.schema');
const challengeController = require('../../controllers/gamification/challenge.controller');

router.post('/', authenticate, authorize('MANAGER', 'ADMIN'), validate(createChallengeSchema), challengeController.createChallenge);
router.get('/', authenticate, challengeController.listChallenges);
router.get('/:id', authenticate, challengeController.getChallengeById);
router.put('/:id', authenticate, authorize('MANAGER', 'ADMIN'), validate(updateChallengeSchema), challengeController.updateChallenge);
router.patch('/:id/status', authenticate, authorize('MANAGER', 'ADMIN'), validate(updateStatusSchema), challengeController.updateStatus);
router.delete('/:id', authenticate, authorize('ADMIN'), challengeController.deleteChallenge);

module.exports = router;
