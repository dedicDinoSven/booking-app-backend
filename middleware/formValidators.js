const { check } = require('express-validator');

module.exports = {
  registrationValidator: [
    check('fullName', 'Full name is required.').notEmpty(),
    check('email', 'Email is required.')
      .notEmpty()
      .bail()
      .isEmail()
      .withMessage('Invalid email.')
      .normalizeEmail(),
    check('password', 'Password is required.')
      .notEmpty()
      .bail()
      .isLength({ min: 8 })
      .withMessage('Password omust be at least 8 characters long.'),
    check('password2', 'Confirmed password is required.')
      .notEmpty()
      .bail()
      .custom((value, { req }) => value === req.body.password)
      .withMessage('Passwords do not match.'),
  ],
  loginValidator: [
    check('email', 'Email is required.')
      .notEmpty()
      .bail()
      .isEmail()
      .withMessage('Invalid email.')
      .normalizeEmail(),
    check('password', 'Password is required.')
      .notEmpty()
      .bail()
      .isLength({ min: 8 })
      .withMessage('Password omust be at least 8 characters long.'),
  ],
};
