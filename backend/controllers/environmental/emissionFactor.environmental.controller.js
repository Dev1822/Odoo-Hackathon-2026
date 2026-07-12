const asyncHandler = require('../../utils/asyncHandler.gamification');
const apiResponse = require('../../utils/apiResponse.gamification');
const emissionFactorService = require('../../services/environmental/emissionFactor.environmental.service');

const createFactor = asyncHandler(async (req, res) => {
  const factor = await emissionFactorService.createFactor(req.body);
  apiResponse(res, 201, true, 'Emission factor created successfully', factor);
});

const listFactors = asyncHandler(async (req, res) => {
  const { categoryId, status, page, limit } = req.query;
  const result = await emissionFactorService.listFactors({
    categoryId: categoryId ? parseInt(categoryId) : undefined,
    status: status || undefined,
    page: page ? parseInt(page) : 1,
    limit: limit ? parseInt(limit) : 10
  });
  apiResponse(res, 200, true, 'Emission factors retrieved successfully', result.data, result.meta);
});

const getFactorById = asyncHandler(async (req, res) => {
  const factor = await emissionFactorService.getFactorById(parseInt(req.params.id));
  apiResponse(res, 200, true, 'Emission factor retrieved successfully', factor);
});

const updateFactor = asyncHandler(async (req, res) => {
  const factor = await emissionFactorService.updateFactor(parseInt(req.params.id), req.body);
  apiResponse(res, 200, true, 'Emission factor updated successfully', factor);
});

const deactivateFactor = asyncHandler(async (req, res) => {
  const factor = await emissionFactorService.deactivateFactor(parseInt(req.params.id));
  apiResponse(res, 200, true, 'Emission factor deactivated successfully', factor);
});

module.exports = {
  createFactor,
  listFactors,
  getFactorById,
  updateFactor,
  deactivateFactor
};
