const { z } = require('zod');

const createBadgeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().min(1, 'Description is required'),
  icon: z.string().optional(),
  unlockRule: z.object({
    metric: z.enum(['totalXp', 'completedChallenges']),
    operator: z.enum(['>=', '>', '==', '<=', '<']),
    value: z.number().int()
  })
});

module.exports = {
  createBadgeSchema
};
