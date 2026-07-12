const prisma = require('../../config/db');
const { ApiError } = require('../../middlewares/errorHandler');

/**
 * Emission Factor Service — Environmental Module
 *
 * Manages emission factors (conversion rates for CO2e calculations).
 * Each factor belongs to a Category of type EMISSION_FACTOR and has a
 * validity date range. Factors are soft-deactivated rather than deleted
 * because historical CarbonTransactions reference them.
 */

const createFactor = async (data) => {
  // Verify category exists and is of type EMISSION_FACTOR
  const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
  if (!category) throw new ApiError(404, 'Category not found');
  if (category.type !== 'EMISSION_FACTOR') {
    throw new ApiError(400, 'Category must be of type EMISSION_FACTOR');
  }

  return prisma.emissionFactor.create({
    data: {
      categoryId: data.categoryId,
      name: data.name,
      unit: data.unit,
      factorValue: data.factorValue,
      source: data.source || null,
      validFrom: new Date(data.validFrom),
      validTo: data.validTo ? new Date(data.validTo) : null
    },
    include: { category: true }
  });
};

const listFactors = async ({ categoryId, status, page = 1, limit = 10 }) => {
  const where = {};
  if (categoryId) where.categoryId = categoryId;
  if (status) where.status = status;

  const [data, total] = await Promise.all([
    prisma.emissionFactor.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.emissionFactor.count({ where })
  ]);

  return {
    data,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
  };
};

const getFactorById = async (id) => {
  const factor = await prisma.emissionFactor.findUnique({
    where: { id },
    include: { category: true }
  });
  if (!factor) throw new ApiError(404, 'Emission factor not found');
  return factor;
};

/**
 * Update an emission factor.
 *
 * IMPORTANT: If factorValue changes, we do NOT retroactively recalculate
 * past CarbonTransactions. This preserves audit integrity — historical
 * transactions retain the CO2e value computed at the time of logging.
 * Only future auto-calculations will use the new factorValue.
 */
const updateFactor = async (id, data) => {
  const existing = await prisma.emissionFactor.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, 'Emission factor not found');

  const updateData = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.unit !== undefined) updateData.unit = data.unit;
  if (data.factorValue !== undefined) updateData.factorValue = data.factorValue;
  if (data.source !== undefined) updateData.source = data.source;
  if (data.validFrom !== undefined) updateData.validFrom = new Date(data.validFrom);
  if (data.validTo !== undefined) updateData.validTo = data.validTo ? new Date(data.validTo) : null;

  return prisma.emissionFactor.update({
    where: { id },
    data: updateData,
    include: { category: true }
  });
};

/**
 * Soft-deactivate an emission factor.
 * Never hard-delete because historical CarbonTransactions reference it.
 */
const deactivateFactor = async (id) => {
  const existing = await prisma.emissionFactor.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, 'Emission factor not found');
  if (existing.status === 'INACTIVE') throw new ApiError(400, 'Factor is already inactive');

  return prisma.emissionFactor.update({
    where: { id },
    data: { status: 'INACTIVE' },
    include: { category: true }
  });
};

module.exports = {
  createFactor,
  listFactors,
  getFactorById,
  updateFactor,
  deactivateFactor
};
