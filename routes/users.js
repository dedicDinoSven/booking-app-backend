const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

// handle post request for registration, when user sends post request to this route, passport authenticates user based on middleware in config/auth.js
router.post(
  '/register',
  passport.authenticate('register', { session: false }),
  async (req, res, next) => {
    res.json({
      message: 'Registration successful',
      user: req.user,
    });
  }
);

// handle post request for login
router.post(
  '/login', 
  async (req, res, next) => {
    passport.authenticate(
      'login', 
      async (err, user, info) => {
        try {
          if (err || !user) {
          const error = new Error('An error occurred.');
        
          return next(error);
      }
      // when user logs in, user data is passed to custom callback, which creates a secure token with user data
      // session: false because we don't want to store user details in session. We expect user to send token on each request to secure routes
      req.login(
        user, 
        { session: false }, 
        async (error) => {
        if (error) return next(error);

        const body = {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          dateJoined: user.dateJoined,
        };
        const token = jwt.sign({ user: body }, 'TOP_SECRET'); // store user info in payload of JWT, and then sign token with secret or key

        return res.json({ token }); // send token back to user
      });
    } catch (err) {
      return next(err);
    }
  })(req, res, next);
});

module.exports = router;
