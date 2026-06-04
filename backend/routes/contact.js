const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { sendMessage } = require('../controllers/contactController');

const validate = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be 2–100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address'),
  body('subject')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Subject must be under 200 characters'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be 10–2000 characters')
];

router.post('/', validate, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }
  next();
}, sendMessage);

module.exports = router;
