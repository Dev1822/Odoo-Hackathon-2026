const { ZodError } = require('zod');
const { ApiError } = require('./errorHandler');

const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      const data = req[source];
      const validatedData = schema.parse(data);
      req[source] = validatedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.errors || error.issues || [];
        const errorMessages = issues.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        throw new ApiError(400, 'Validation failed', true, JSON.stringify(errorMessages));
      }
      next(error);
    }
  };
};

module.exports = validate;
