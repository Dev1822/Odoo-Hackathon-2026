const { z } = require('zod');

const createGoalSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  departmentId: z.number().int().positive('Department ID must be a positive integer'),
  targetCo2e: z.number().positive('Target CO2e must be positive'),
  deadline: z.string().datetime({ message: 'Deadline must be a valid ISO date' })
});

const updateGoalSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  targetCo2e: z.number().positive().optional(),
  deadline: z.string().datetime().optional(),
  status: z.enum(['ACTIVE', 'ON_TRACK', 'AT_RISK', 'COMPLETED', 'ARCHIVED']).optional()
});

module.exports = { createGoalSchema, updateGoalSchema };
