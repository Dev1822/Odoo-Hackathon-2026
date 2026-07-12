const asyncHandler = require('../../utils/asyncHandler.gamification');
const apiResponse = require('../../utils/apiResponse.gamification');
const dashboardService = require('../../services/dashboard.service');
const cache = require('../../utils/cache');

const getExecutiveOverview = asyncHandler(async (req, res) => {
  const cacheKey = 'dashboard_executive_overview';
  
  // Try retrieving from cache first
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return apiResponse(res, 200, true, 'Executive overview retrieved from cache', cachedData);
  }

  const overview = await dashboardService.getExecutiveOverview();
  
  // Cache the overview payload for 30 seconds
  cache.set(cacheKey, overview, 30);

  apiResponse(res, 200, true, 'Executive overview retrieved successfully', overview);
});

module.exports = {
  getExecutiveOverview
};
