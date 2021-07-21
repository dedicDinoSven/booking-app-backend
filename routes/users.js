const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const {
  registrationValidator,
  loginValidator,
} = require('../middleware/formValidators');
const router = express.Router();

// handle post request for registration, when user sends post request to this route, passport authenticates user based on middleware in config/auth.js
router.post('/register', registrationValidator, async (req, res, next) => {
  passport.authenticate('register', { session: false }, async (err, user, info) => {
    try {
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).jsonp(errors.array());
      } else {
        if (err) {
          return next(err);
        }

        return res.json({ user: user, message: info.message });
      }
    } catch (err) {
      return next(err);
    }
  })(req, res, next);
});

// handle post request for login
router.post('/login', loginValidator, async (req, res, next) => {
  passport.authenticate('login', { session: false }, async (err, user, info) => {
    try {
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).jsonp(errors.array());
      }

      if (err) {
        return next(err);
      }
      if (!user) {
        return res.send({ message: info.message });
      }
      // when user logs in, user data is passed to custom callback, which creates a secure token with user data
      // session: false because we don't want to store user details in session. We expect user to send token on each request to secure routes
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const body = {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          dateJoined: user.dateJoined,
        };
        const token = jwt.sign({ user: body }, 'TOP_SECRET'); // store user info in payload of JWT, and then sign token with secret or key

        return res.json({ message: info.message, token }); // send token back to user
      });
    } catch (err) {
      return next(err);
    }
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout();
  res.json({ message: 'Logged out successfully.'});
});

module.exports = router;
