const asyncHandler = require('../../utils/asyncHandler.gamification');
const apiResponse = require('../../utils/apiResponse.gamification');
const goalService = require('../../services/environmental/environmentalGoal.environmental.service');

const createGoal = asyncHandler(async (req, res) => {
  const goal = await goalService.createGoal(req.body);
  apiResponse(res, 201, true, 'Environmental goal created successfully', goal);
});

const listGoals = asyncHandler(async (req, res) => {
  const { departmentId, status, search, page, limit } = req.query;
  const result = await goalService.listGoals({
    departmentId: departmentId ? parseInt(departmentId) : undefined,
    status: status || undefined,
    search: search || undefined,
    page: page ? parseInt(page) : 1,
    limit: limit ? parseInt(limit) : 10
  });
  apiResponse(res, 200, true, 'Environmental goals retrieved successfully', result.data, result.meta);
});

const updateGoal = asyncHandler(async (req, res) => {
  const goal = await goalService.updateGoal(parseInt(req.params.id), req.body);
  apiResponse(res, 200, true, 'Environmental goal updated successfully', goal);
});

const deleteGoal = asyncHandler(async (req, res) => {
  const result = await goalService.deleteGoal(parseInt(req.params.id));
  apiResponse(res, 200, true, result.message);
});

module.exports = {
  createGoal,
  listGoals,
  updateGoal,
  deleteGoal
};
