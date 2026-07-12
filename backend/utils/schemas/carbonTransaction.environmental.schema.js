const { z } = require('zod');

const createManualTransactionSchema = z.object({
  departmentId: z.number().int().positive('Department ID must be a positive integer'),
  emissionFactorId: z.number().int().positive('Emission factor ID must be a positive integer'),
  productId: z.number().int().positive().optional().nullable(),
  quantity: z.number().positive('Quantity must be positive'),
  transactionDate: z.string().datetime({ message: 'transactionDate must be a valid ISO date' })
});

const listTransactionsSchema = z.object({
  departmentId: z.string().regex(/^\d+$/).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  sourceModule: z.enum(['PURCHASE', 'MANUFACTURING', 'EXPENSE', 'FLEET', 'MANUAL']).optional(),
  page: z.string().regex(/^\d+$/).optional(),
  limit: z.string().regex(/^\d+$/).optional()
});

const trendSchema = z.object({
  departmentId: z.string().regex(/^\d+$/).optional(),
  months: z.string().regex(/^\d+$/).optional()
});

module.exports = { createManualTransactionSchema, listTransactionsSchema, trendSchema };
