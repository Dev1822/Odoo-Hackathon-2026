const { z } = require('zod');

const updateProgressSchema = z.object({
  progress: z.number().int().min(0).max(100, 'Progress must be between 0 and 100')
});

const approvalDecisionSchema = z.object({
  decision: z.enum(['APPROVED', 'REJECTED'])
});

module.exports = {
  updateProgressSchema,
  approvalDecisionSchema
};
