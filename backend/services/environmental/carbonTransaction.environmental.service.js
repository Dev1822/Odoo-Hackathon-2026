const prisma = require('../../config/db');
const { ApiError } = require('../../middlewares/errorHandler');
const { Prisma } = require('@prisma/client');

/**
 * Carbon Transaction Service — Environmental Module
 *
 * Handles manual and automated carbon emission transaction logging.
 * calculatedCo2e is ALWAYS computed server-side (quantity × factorValue).
 * Never trust a client-sent CO2e value.
 */

/**
 * Create a manual carbon transaction (sourceModule = MANUAL).
 * CO2e is computed server-side: quantity × emissionFactor.factorValue
 */
const createManualTransaction = async (data, creatorId) => {
  const emissionFactor = await prisma.emissionFactor.findUnique({
    where: { id: data.emissionFactorId }
  });
  if (!emissionFactor) throw new ApiError(404, 'Emission factor not found');
  if (emissionFactor.status !== 'ACTIVE') throw new ApiError(400, 'Emission factor is inactive');

  const department = await prisma.department.findUnique({ where: { id: data.departmentId } });
  if (!department) throw new ApiError(404, 'Department not found');

  // Server-side CO2e calculation — never trust client-sent values
  const quantity = new Prisma.Decimal(data.quantity);
  const calculatedCo2e = quantity.mul(emissionFactor.factorValue);

  const transaction = await prisma.carbonTransaction.create({
    data: {
      departmentId: data.departmentId,
      emissionFactorId: data.emissionFactorId,
      productId: data.productId || null,
      sourceModule: 'MANUAL',
      quantity: data.quantity,
      calculatedCo2e: calculatedCo2e,
      autoCalculated: false,
      transactionDate: new Date(data.transactionDate)
    },
    include: {
      department: true,
      emissionFactor: true,
      product: true
    }
  });

  // Trigger goal recalculation and activity logging asynchronously
  // (these are wired in commits 4 & 5 — calling them here once they exist)
  try {
    const goalService = require('./environmentalGoal.environmental.service');
    await goalService.recalculateProgress(data.departmentId);
  } catch (e) {
    // Goal service may not be available yet — silently skip
  }

  try {
    const activityLogService = require('../activityLog.service');
    await activityLogService.log({
      module: 'ENVIRONMENTAL',
      eventType: 'CARBON_TRANSACTION_LOGGED',
      departmentId: data.departmentId,
      employeeId: creatorId,
      description: `Manual carbon transaction logged: ${parseFloat(calculatedCo2e).toFixed(2)} kgCO2e for ${department.name}`
    });
  } catch (e) {
    // Activity log service may not be available yet — silently skip
  }

  return transaction;
};

/**
 * Create a carbon transaction from a source record (Purchase/Manufacturing/Expense/Fleet).
 *
 * This is the function other modules (Purchase, Manufacturing, Expense, Fleet)
 * will call when the "Auto Emission Calculation" toggle is enabled.
 * Export it cleanly from this service so it's reusable across modules.
 *
 * Usage by other modules:
 *   const carbonTransactionService = require('../services/environmental/carbonTransaction.environmental.service');
 *   await carbonTransactionService.createFromSourceRecord({ ... });
 *
 * @param {Object} params
 * @param {number} params.departmentId
 * @param {number} params.emissionFactorId
 * @param {number} [params.productId]
 * @param {string} params.sourceModule - PURCHASE | MANUFACTURING | EXPENSE | FLEET
 * @param {number} [params.sourceRecordId] - ID from the originating module's record
 * @param {number} params.quantity
 * @param {Date|string} params.transactionDate
 */
const createFromSourceRecord = async ({ departmentId, emissionFactorId, productId, sourceModule, sourceRecordId, quantity, transactionDate }) => {
  const emissionFactor = await prisma.emissionFactor.findUnique({
    where: { id: emissionFactorId }
  });
  if (!emissionFactor) throw new ApiError(404, 'Emission factor not found');
  if (emissionFactor.status !== 'ACTIVE') throw new ApiError(400, 'Emission factor is inactive');

  // Validate transactionDate falls within [validFrom, validTo ?? infinity]
  const txDate = new Date(transactionDate);
  if (txDate < emissionFactor.validFrom) {
    throw new ApiError(400, 'No active emission factor for this date — transactionDate is before factor validFrom');
  }
  if (emissionFactor.validTo && txDate > emissionFactor.validTo) {
    throw new ApiError(400, 'No active emission factor for this date — transactionDate is after factor validTo');
  }

  const department = await prisma.department.findUnique({ where: { id: departmentId } });
  if (!department) throw new ApiError(404, 'Department not found');

  // Server-side CO2e calculation
  const qty = new Prisma.Decimal(quantity);
  const calculatedCo2e = qty.mul(emissionFactor.factorValue);

  const transaction = await prisma.carbonTransaction.create({
    data: {
      departmentId,
      emissionFactorId,
      productId: productId || null,
      sourceModule,
      sourceRecordId: sourceRecordId || null,
      quantity,
      calculatedCo2e,
      autoCalculated: true,
      transactionDate: txDate
    },
    include: {
      department: true,
      emissionFactor: true,
      product: true
    }
  });

  // Trigger goal recalculation
  try {
    const goalService = require('./environmentalGoal.environmental.service');
    await goalService.recalculateProgress(departmentId);
  } catch (e) { /* Goal service wired in commit 4 */ }

  // Log activity
  try {
    const activityLogService = require('../activityLog.service');
    await activityLogService.log({
      module: 'ENVIRONMENTAL',
      eventType: 'CARBON_TRANSACTION_LOGGED',
      departmentId,
      description: `Auto carbon transaction from ${sourceModule}: ${parseFloat(calculatedCo2e).toFixed(2)} kgCO2e for ${department.name}`
    });
  } catch (e) { /* Activity log service wired in commit 5 */ }

  return transaction;
};

/**
 * List carbon transactions with pagination and filters.
 * Powers the "Emissions Trend (12 mo)" chart and Custom Report Builder filters.
 */
const listTransactions = async ({ departmentId, dateFrom, dateTo, sourceModule, page = 1, limit = 10 }) => {
  const where = {};
  if (departmentId) where.departmentId = departmentId;
  if (sourceModule) where.sourceModule = sourceModule;
  if (dateFrom || dateTo) {
    where.transactionDate = {};
    if (dateFrom) where.transactionDate.gte = new Date(dateFrom);
    if (dateTo) where.transactionDate.lte = new Date(dateTo);
  }

  const [data, total] = await Promise.all([
    prisma.carbonTransaction.findMany({
      where,
      include: {
        department: true,
        emissionFactor: true,
        product: true
      },
      orderBy: { transactionDate: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.carbonTransaction.count({ where })
  ]);

  return {
    data,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
  };
};

/**
 * Get emissions trend grouped by month.
 * Uses Prisma $queryRaw with tagged templates (never string concatenation)
 * for safe parameterized SQL.
 *
 * Returns array of { month: 'YYYY-MM', totalCo2e: number }
 */
const getEmissionsTrend = async ({ departmentId, months = 12 }) => {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  let results;
  if (departmentId) {
    results = await prisma.$queryRaw`
      SELECT
        DATE_FORMAT(transactionDate, '%Y-%m') AS month,
        CAST(SUM(calculatedCo2e) AS DECIMAL(12,4)) AS totalCo2e
      FROM CarbonTransaction
      WHERE transactionDate >= ${startDate}
        AND departmentId = ${departmentId}
      GROUP BY DATE_FORMAT(transactionDate, '%Y-%m')
      ORDER BY month ASC
    `;
  } else {
    results = await prisma.$queryRaw`
      SELECT
        DATE_FORMAT(transactionDate, '%Y-%m') AS month,
        CAST(SUM(calculatedCo2e) AS DECIMAL(12,4)) AS totalCo2e
      FROM CarbonTransaction
      WHERE transactionDate >= ${startDate}
      GROUP BY DATE_FORMAT(transactionDate, '%Y-%m')
      ORDER BY month ASC
    `;
  }

  return results.map(r => ({
    month: r.month,
    totalCo2e: parseFloat(r.totalCo2e)
  }));
};

module.exports = {
  createManualTransaction,
  createFromSourceRecord,
  listTransactions,
  getEmissionsTrend
};
