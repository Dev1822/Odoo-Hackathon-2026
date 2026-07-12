const asyncHandler = require('../../utils/asyncHandler.gamification');
const apiResponse = require('../../utils/apiResponse.gamification');
const rewardService = require('../../services/gamification/reward.gamification.service');

const listRewards = asyncHandler(async (req, res) => {
  const rewards = await rewardService.listRewards();
  apiResponse(res, 200, true, 'Rewards retrieved successfully', rewards);
});

const createReward = asyncHandler(async (req, res) => {
  const reward = await rewardService.createReward(req.body);
  apiResponse(res, 201, true, 'Reward created successfully', reward);
});

const redeemReward = asyncHandler(async (req, res) => {
  const redemption = await rewardService.redeem(req.user.id, parseInt(req.params.id));
  apiResponse(res, 201, true, 'Reward redeemed successfully', redemption);
});

module.exports = {
  listRewards,
  createReward,
  redeemReward
};
