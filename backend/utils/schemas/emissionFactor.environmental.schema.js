const { z } = require('zod');

const createEmissionFactorSchema = z.object({
  categoryId: z.number().int().positive('Category ID must be a positive integer'),
  name: z.string().min(1, 'Name is required').max(200),
  unit: z.string().min(1, 'Unit is required').max(50),
  factorValue: z.number().positive('Factor value must be positive'),
  source: z.string().max(200).optional(),
  validFrom: z.string().datetime({ message: 'validFrom must be a valid ISO date' }),
  validTo: z.string().datetime({ message: 'validTo must be a valid ISO date' }).optional().nullable()
}).refine(
  (data) => {
    if (data.validTo) {
      return new Date(data.validFrom) < new Date(data.validTo);
    }
    return true;
  },
  { message: 'validFrom must be before validTo', path: ['validTo'] }
);

const updateEmissionFactorSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  unit: z.string().min(1).max(50).optional(),
  factorValue: z.number().positive('Factor value must be positive').optional(),
  source: z.string().max(200).optional().nullable(),
  validFrom: z.string().datetime().optional(),
  validTo: z.string().datetime().optional().nullable()
}).refine(
  (data) => {
    if (data.validFrom && data.validTo) {
      return new Date(data.validFrom) < new Date(data.validTo);
    }
    return true;
  },
  { message: 'validFrom must be before validTo', path: ['validTo'] }
);

module.exports = { createEmissionFactorSchema, updateEmissionFactorSchema };
