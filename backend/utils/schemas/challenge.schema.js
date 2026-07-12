const { z } = require('zod');

const createChallengeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  categoryId: z.number().int().positive('Category ID must be positive'),
  description: z.string().min(1, 'Description is required'),
  xp: z.number().int().min(0, 'XP must be non-negative'),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  evidenceRequired: z.boolean().optional().default(false),
  deadline: z.string().datetime().nullable().optional(),
  createdById: z.number().int().positive('Creator ID must be positive')
});

const updateChallengeSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  categoryId: z.number().int().positive().optional(),
  description: z.string().min(1).optional(),
  xp: z.number().int().min(0).optional(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
  evidenceRequired: z.boolean().optional(),
  deadline: z.string().datetime().nullable().optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update'
});

const updateStatusSchema = z.object({
  status: z.enum(['DRAFT', 'ACTIVE', 'UNDER_REVIEW', 'COMPLETED', 'ARCHIVED'])
});

module.exports = {
  createChallengeSchema,
  updateChallengeSchema,
  updateStatusSchema
};
