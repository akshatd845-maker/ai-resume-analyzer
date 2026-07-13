const { body } = require('express-validator');

const jobCategories = [
  'engineering',
  'design',
  'product',
  'marketing',
  'sales',
  'operations',
  'finance',
  'hr',
  'other',
];

const experienceLevels = ['entry', 'mid', 'senior', 'lead', 'executive'];

const employmentTypes = ['full-time', 'part-time', 'contract', 'internship', 'freelance'];

const createJobValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Job title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),

  body('category')
    .notEmpty()
    .withMessage('Job category is required')
    .isIn(jobCategories)
    .withMessage(`Category must be one of: ${jobCategories.join(', ')}`),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Job description is required'),

  body('requiredSkills')
    .optional()
    .isArray()
    .withMessage('requiredSkills must be an array'),

  body('preferredSkills')
    .optional()
    .isArray()
    .withMessage('preferredSkills must be an array'),

  body('experienceLevel')
    .notEmpty()
    .withMessage('Experience level is required')
    .isIn(experienceLevels)
    .withMessage(`Experience level must be one of: ${experienceLevels.join(', ')}`),

  body('location')
    .optional()
    .trim(),

  body('employmentType')
    .optional()
    .isIn(employmentTypes)
    .withMessage(`Employment type must be one of: ${employmentTypes.join(', ')}`),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
];

const updateJobValidator = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Job title cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),

  body('category')
    .optional()
    .isIn(jobCategories)
    .withMessage(`Category must be one of: ${jobCategories.join(', ')}`),

  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Job description cannot be empty'),

  body('requiredSkills')
    .optional()
    .isArray()
    .withMessage('requiredSkills must be an array'),

  body('preferredSkills')
    .optional()
    .isArray()
    .withMessage('preferredSkills must be an array'),

  body('experienceLevel')
    .optional()
    .isIn(experienceLevels)
    .withMessage(`Experience level must be one of: ${experienceLevels.join(', ')}`),

  body('employmentType')
    .optional()
    .isIn(employmentTypes)
    .withMessage(`Employment type must be one of: ${employmentTypes.join(', ')}`),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
];

module.exports = {
  createJobValidator,
  updateJobValidator,
};
