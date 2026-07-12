const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { createRewardSchema } = require('../../utils/schemas/reward.schema');
const redeemRateLimiter = require('../../middlewares/redeemRateLimiter');
const rewardController = require('../../controllers/gamification/reward.controller');

router.get('/rewards', authenticate, rewardController.listRewards);
router.post('/rewards', authenticate, authorize('ADMIN'), validate(createRewardSchema), rewardController.createReward);
router.post('/rewards/:id/redeem', authenticate, redeemRateLimiter, rewardController.redeemReward);

module.exports = router;
