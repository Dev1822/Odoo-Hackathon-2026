const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../middlewares/auth.gamification');
const validate = require('../../middlewares/validate.gamification');
const upload = require('../../config/multer');
const { updateProgressSchema } = require('../../utils/schemas/participation.gamification.schema');
const participationController = require('../../controllers/gamification/participation.gamification.controller');

router.post('/challenges/:id/join', authenticate, participationController.joinChallenge);
router.patch('/participation/:id/progress', authenticate, validate(updateProgressSchema), participationController.updateProgress);
router.post('/participation/:id/proof', authenticate, upload.single('proof'), participationController.attachProof);
router.patch('/participation/:id/approve', authenticate, authorize('MANAGER', 'ADMIN'), participationController.approveParticipation);
router.patch('/participation/:id/reject', authenticate, authorize('MANAGER', 'ADMIN'), participationController.rejectParticipation);
router.get('/participation', authenticate, authorize('MANAGER', 'ADMIN'), participationController.listParticipations);

module.exports = router;
