const express = require('express');
const router = express.Router();
const socialController = require('../controllers/social.controller');
const { validateCSRActivity, validateParticipation, validateId } = require('../validators/social.validator');
const validate = require('../middlewares/validation');
const upload = require('../utils/multerConfig');

// CSR Activities
router.post('/csr', validateCSRActivity, validate, socialController.createCSRActivity);
router.get('/csr', socialController.getAllCSRActivities);
router.get('/csr/:id', validateId, validate, socialController.getCSRActivityById);
router.put('/csr/:id', validateId, validateCSRActivity, validate, socialController.updateCSRActivity);
router.delete('/csr/:id', validateId, validate, socialController.deleteCSRActivity);
router.post('/csr/:id/join', validateId, upload.single('proof'), socialController.joinCSRActivity);
router.post('/csr/:id/proof', validateId, validate, upload.single('proof'), socialController.uploadProof);
router.patch('/csr/:id/approve', validateId, validate, socialController.approveCSRActivity);
router.patch('/csr/:id/reject', validateId, validate, socialController.rejectCSRActivity);

// Employee Participation
router.post('/participation', validateParticipation, validate, socialController.createParticipation);
router.get('/participation', socialController.getAllParticipations);
router.get('/participation/:id', validateId, validate, socialController.getParticipationById);
router.put('/participation/:id', validateId, validate, socialController.updateParticipation);
router.delete('/participation/:id', validateId, validate, socialController.deleteParticipation);
router.patch('/participation/:id/approve', validateId, validate, socialController.approveParticipation);
router.patch('/participation/:id/reject', validateId, validate, socialController.rejectParticipation);

// Diversity Dashboard
router.get('/diversity/gender', socialController.getGenderDistribution);
router.get('/diversity/department', socialController.getDepartmentDistribution);
router.get('/diversity/trends', socialController.getParticipationTrends);

module.exports = router;
