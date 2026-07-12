const { z } = require('zod');

const createRewardSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().min(1, 'Description is required'),
  pointsRequired: z.number().int().min(0, 'Points must be non-negative'),
  stock: z.number().int().min(0, 'Stock must be non-negative').default(0),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE')
});

const redeemRewardSchema = z.object({
  rewardId: z.number().int().positive('Reward ID must be positive')
});

module.exports = {
  createRewardSchema,
  redeemRewardSchema
};
