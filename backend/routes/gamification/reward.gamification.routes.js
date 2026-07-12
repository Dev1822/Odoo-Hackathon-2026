const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../middlewares/auth.gamification');
const validate = require('../../middlewares/validate.gamification');
const { createRewardSchema } = require('../../utils/schemas/reward.gamification.schema');
const redeemRateLimiter = require('../../middlewares/redeemRateLimiter.gamification');
const rewardController = require('../../controllers/gamification/reward.gamification.controller');

router.get('/rewards', authenticate, rewardController.listRewards);
router.post('/rewards', authenticate, authorize('ADMIN'), validate(createRewardSchema), rewardController.createReward);
router.post('/rewards/:id/redeem', authenticate, redeemRateLimiter, rewardController.redeemReward);

module.exports = router;
