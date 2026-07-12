const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../middlewares/auth.gamification');
const validate = require('../../middlewares/validate.gamification');
const { createManualTransactionSchema } = require('../../utils/schemas/carbonTransaction.environmental.schema');
const carbonTransactionController = require('../../controllers/environmental/carbonTransaction.environmental.controller');

router.post('/', authenticate, authorize('MANAGER', 'ADMIN'), validate(createManualTransactionSchema), carbonTransactionController.createTransaction);
router.get('/', authenticate, carbonTransactionController.listTransactions);
router.get('/trend', authenticate, carbonTransactionController.getEmissionsTrend);

module.exports = router;
