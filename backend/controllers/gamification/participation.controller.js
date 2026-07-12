const asyncHandler = require('../../utils/asyncHandler');
const apiResponse = require('../../utils/apiResponse');
const participationService = require('../../services/gamification/participation.service');

const joinChallenge = asyncHandler(async (req, res) => {
  const participation = await participationService.joinChallenge(parseInt(req.params.id), req.user.id);
  apiResponse(res, 201, true, 'Successfully joined challenge', participation);
});

const updateProgress = asyncHandler(async (req, res) => {
  const participation = await participationService.updateProgress(
    parseInt(req.params.id),
    req.user.id,
    req.body.progress
  );
  apiResponse(res, 200, true, 'Progress updated successfully', participation);
});

const attachProof = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new Error('No file uploaded');
  }
  const participation = await participationService.attachProof(
    parseInt(req.params.id),
    req.user.id,
    req.file.buffer
  );
  apiResponse(res, 200, true, 'Proof uploaded successfully', participation);
});

const approveParticipation = asyncHandler(async (req, res) => {
  const participation = await participationService.decideApproval(
    parseInt(req.params.id),
    'APPROVED',
    req.user.id
  );
  apiResponse(res, 200, true, 'Participation approved successfully', participation);
});

const rejectParticipation = asyncHandler(async (req, res) => {
  const participation = await participationService.decideApproval(
    parseInt(req.params.id),
    'REJECTED',
    req.user.id
  );
  apiResponse(res, 200, true, 'Participation rejected successfully', participation);
});

const listParticipations = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await participationService.listParticipations({
    page: page ? parseInt(page) : 1,
    limit: limit ? parseInt(limit) : 10
  });
  apiResponse(res, 200, true, 'Participations retrieved successfully', result.data, result.meta);
});

module.exports = {
  joinChallenge,
  updateProgress,
  attachProof,
  approveParticipation,
  rejectParticipation,
  listParticipations
};
