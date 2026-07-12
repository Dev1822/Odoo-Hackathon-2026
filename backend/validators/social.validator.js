const { body, param, query } = require('express-validator');

const validateCSRActivity = [
  body('title').notEmpty().withMessage('Title is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
];

const validateParticipation = [
  body('employee_id').notEmpty().withMessage('Employee ID is required'),
  body('employee_name').notEmpty().withMessage('Employee name is required'),
];

const validateId = [
  param('id').notEmpty().withMessage('ID is required'),
];

module.exports = {
  validateCSRActivity,
  validateParticipation,
  validateId,
};
