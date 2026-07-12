const asyncHandler = require('../../utils/asyncHandler.gamification');
const apiResponse = require('../../utils/apiResponse.gamification');
const departmentScoreService = require('../../services/departmentScore.service');

const getAllDepartmentScores = asyncHandler(async (req, res) => {
  const scores = await departmentScoreService.getAllDepartmentScores();
  apiResponse(res, 200, true, 'Department scores retrieved successfully', scores);
});

const getDepartmentScore = asyncHandler(async (req, res) => {
  const score = await departmentScoreService.getDepartmentScore(parseInt(req.params.departmentId));
  if (!score) {
    return apiResponse(res, 404, false, 'Score record not found');
  }
  apiResponse(res, 200, true, 'Department score retrieved successfully', score);
});

const getOverallEsgScore = asyncHandler(async (req, res) => {
  const overall = await departmentScoreService.getOverallEsgScore();
  apiResponse(res, 200, true, 'Overall ESG Score retrieved successfully', overall);
});

module.exports = {
  getAllDepartmentScores,
  getDepartmentScore,
  getOverallEsgScore
};
