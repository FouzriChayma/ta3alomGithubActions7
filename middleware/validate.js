const yup = require("yup");

// Middleware for validating student data
const validate = async (req, res, next) => {
  try {
    const schema = yup.object().shape({
      name: yup.string().required('Name is required'),
      email: yup.string().email('Invalid email format').required('Email is required'),
      code: yup.number().required('Code is required'),
    });

    // Validate the incoming request body
    await schema.validate(req.body, { abortEarly: false });

    // If validation passes, move to the next middleware
    next();
  } catch (error) {
    // If validation fails, return a 400 error with validation errors
    res.status(400).json({
      error: error.errors,
    });
  }
};

module.exports = validate;
