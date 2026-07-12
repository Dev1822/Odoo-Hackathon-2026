const asyncHandler = require('../../utils/asyncHandler.gamification');
const apiResponse = require('../../utils/apiResponse.gamification');
const carbonTransactionService = require('../../services/environmental/carbonTransaction.environmental.service');

const createTransaction = asyncHandler(async (req, res) => {
  const transaction = await carbonTransactionService.createManualTransaction(req.body, req.user.id);
  apiResponse(res, 201, true, 'Carbon transaction created successfully', transaction);
});

const listTransactions = asyncHandler(async (req, res) => {
  const { departmentId, dateFrom, dateTo, sourceModule, page, limit } = req.query;
  const result = await carbonTransactionService.listTransactions({
    departmentId: departmentId ? parseInt(departmentId) : undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    sourceModule: sourceModule || undefined,
    page: page ? parseInt(page) : 1,
    limit: limit ? parseInt(limit) : 10
  });
  apiResponse(res, 200, true, 'Carbon transactions retrieved successfully', result.data, result.meta);
});

const getEmissionsTrend = asyncHandler(async (req, res) => {
  const { departmentId, months } = req.query;
  const trend = await carbonTransactionService.getEmissionsTrend({
    departmentId: departmentId ? parseInt(departmentId) : undefined,
    months: months ? parseInt(months) : 12
  });
  apiResponse(res, 200, true, 'Emissions trend retrieved successfully', trend);
});

module.exports = {
  createTransaction,
  listTransactions,
  getEmissionsTrend
};
