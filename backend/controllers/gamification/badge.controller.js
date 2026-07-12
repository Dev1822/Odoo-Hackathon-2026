const asyncHandler = require('../../utils/asyncHandler');
const apiResponse = require('../../utils/apiResponse');
const badgeService = require('../../services/gamification/badge.service');

const createBadge = asyncHandler(async (req, res) => {
  const badge = await badgeService.createBadge(req.body);
  apiResponse(res, 201, true, 'Badge created successfully', badge);
});

const listBadges = asyncHandler(async (req, res) => {
  const badges = await badgeService.listBadges();
  apiResponse(res, 200, true, 'Badges retrieved successfully', badges);
});

const getEmployeeBadges = asyncHandler(async (req, res) => {
  const badges = await badgeService.getEmployeeBadges(parseInt(req.params.id));
  apiResponse(res, 200, true, 'Employee badges retrieved successfully', badges);
});

module.exports = {
  createBadge,
  listBadges,
  getEmployeeBadges
};
