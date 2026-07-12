const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../middlewares/auth.gamification');
const validate = require('../../middlewares/validate.gamification');
const { createEmissionFactorSchema, updateEmissionFactorSchema } = require('../../utils/schemas/emissionFactor.environmental.schema');
const emissionFactorController = require('../../controllers/environmental/emissionFactor.environmental.controller');

router.post('/', authenticate, authorize('MANAGER', 'ADMIN'), validate(createEmissionFactorSchema), emissionFactorController.createFactor);
router.get('/', authenticate, emissionFactorController.listFactors);
router.get('/:id', authenticate, emissionFactorController.getFactorById);
router.put('/:id', authenticate, authorize('MANAGER', 'ADMIN'), validate(updateEmissionFactorSchema), emissionFactorController.updateFactor);
router.patch('/:id/deactivate', authenticate, authorize('ADMIN'), emissionFactorController.deactivateFactor);

module.exports = router;
