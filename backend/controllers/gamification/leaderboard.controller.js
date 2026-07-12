const asyncHandler = require('../../utils/asyncHandler');
const apiResponse = require('../../utils/apiResponse');
const leaderboardService = require('../../services/gamification/leaderboard.service');

const getLeaderboard = asyncHandler(async (req, res) => {
  const { scope, departmentId, limit } = req.query;
  
  let result;
  if (scope === 'department') {
    result = await leaderboardService.getDepartmentLeaderboard({
      limit: limit ? parseInt(limit) : 20
    });
  } else {
    result = await leaderboardService.getEmployeeLeaderboard({
      limit: limit ? parseInt(limit) : 20,
      departmentId: departmentId ? parseInt(departmentId) : undefined
    });
  }
  
  apiResponse(res, 200, true, 'Leaderboard retrieved successfully', result);
});

module.exports = {
  getLeaderboard
};
