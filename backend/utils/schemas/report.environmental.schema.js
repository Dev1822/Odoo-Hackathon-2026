const { z } = require('zod');

const environmentalReportQuerySchema = z.object({
  departmentId: z.string().regex(/^\d+$/).optional().transform(val => val ? parseInt(val) : undefined),
  dateFrom: z.string().datetime({ message: 'dateFrom must be a valid ISO date' }),
  dateTo: z.string().datetime({ message: 'dateTo must be a valid ISO date' }),
  format: z.enum(['csv', 'excel', 'pdf'])
}).refine(
  (data) => {
    const from = new Date(data.dateFrom);
    const to = new Date(data.dateTo);
    if (from >= to) return false;
    
    // Check if difference is > 2 years (approx 2 * 365 * 24 * 60 * 60 * 1000 ms)
    const twoYearsMs = 2 * 365.25 * 24 * 60 * 60 * 1000;
    return (to - from) <= twoYearsMs;
  },
  { message: 'dateFrom must be before dateTo, and the maximum allowed date range is 2 years', path: ['dateTo'] }
);

module.exports = { environmentalReportQuerySchema };
