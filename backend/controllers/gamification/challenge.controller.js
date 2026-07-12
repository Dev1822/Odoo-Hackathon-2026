const asyncHandler = require('../../utils/asyncHandler');
const apiResponse = require('../../utils/apiResponse');
const challengeService = require('../../services/gamification/challenge.service');

const createChallenge = asyncHandler(async (req, res) => {
  const challenge = await challengeService.createChallenge(req.body, req.user.id);
  apiResponse(res, 201, true, 'Challenge created successfully', challenge);
});

const listChallenges = asyncHandler(async (req, res) => {
  const { status, categoryId, page, limit } = req.query;
  const result = await challengeService.listChallenges({
    status: status ? parseInt(status) : undefined,
    categoryId: categoryId ? parseInt(categoryId) : undefined,
    page: page ? parseInt(page) : 1,
    limit: limit ? parseInt(limit) : 10
  });
  apiResponse(res, 200, true, 'Challenges retrieved successfully', result.data, result.meta);
});

const getChallengeById = asyncHandler(async (req, res) => {
  const challenge = await challengeService.getChallengeById(parseInt(req.params.id));
  apiResponse(res, 200, true, 'Challenge retrieved successfully', challenge);
});

const updateChallenge = asyncHandler(async (req, res) => {
  const challenge = await challengeService.updateChallenge(parseInt(req.params.id), req.body);
  apiResponse(res, 200, true, 'Challenge updated successfully', challenge);
});

const updateStatus = asyncHandler(async (req, res) => {
  const challenge = await challengeService.transitionStatus(parseInt(req.params.id), req.body.status);
  apiResponse(res, 200, true, 'Challenge status updated successfully', challenge);
});

const deleteChallenge = asyncHandler(async (req, res) => {
  const result = await challengeService.deleteChallenge(parseInt(req.params.id));
  apiResponse(res, 200, true, result.message);
});

module.exports = {
  createChallenge,
  listChallenges,
  getChallengeById,
  updateChallenge,
  updateStatus,
  deleteChallenge
};
