const asyncHandler = require('../../utils/asyncHandler.gamification');
const apiResponse = require('../../utils/apiResponse.gamification');
const activityLogService = require('../../services/activityLog.service');

const getRecentActivity = asyncHandler(async (req, res) => {
  const { limit, departmentId, module } = req.query;
  const logs = await activityLogService.getRecentActivity({
    limit: limit ? parseInt(limit) : 10,
    departmentId: departmentId ? parseInt(departmentId) : undefined,
    module: module || undefined
  });
  apiResponse(res, 200, true, 'Recent activity retrieved successfully', logs);
});

module.exports = {
  getRecentActivity
};
