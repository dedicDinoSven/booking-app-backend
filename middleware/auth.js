const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

// handle user registration with passport middleware
passport.use(
  'register',
  new localStrategy(
    { usernameField: 'email', passwordField: 'password', passReqToCallback: true },
    async (req, email, password, done) => {
      try {
        let fullName = req.body.fullName;
        
        const user = await User.findOne({ email });
        if (user) {
          return done(null, false, { message: 'Email already in use.' }); // if user doesn't match any users in db return error
        }

        const newUser = await User.create({ fullName, email, password }); // save data provided by the user to the db

        return done(null, newUser, { message: 'Registered successfully.' }); // send user info to the next middleware if successful
      } catch (err) {
        done(err); // otherwise report error
      }
    }
  )
);

// handle user login with passport middleware
passport.use(
  'login',
  new localStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email }); // find one user associated with provided email
        if (!user) {
          return done(null, false, {
            message: 'User with given email does not exist.',
          }); // if user doesn't match any users in db return error
        }

        const validate = await user.isValidPassword(password);
        if (!validate) {
          return done(null, false, { message: 'Incorrect password.' }); // if pw doesn't match pw associated with user in db return error
        }

        return done(null, user, { message: 'Logged in successfully.' }); // if user and pw match, return success message, and user info is sent to next middleware.
      } catch (err) {
        return done(err); // otherwise report error
      }
    }
  )
);

// if we need extra or sensitive details about user, which are not available in token, we could use _id available on token to retreive them from db
passport.use(
  new JWTstrategy(
    {
      secretOrKey: 'TOP_SECRET', //verify that token has been signed with the secret or key set during login (hasn't been manipulated and is valid)
      jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token'), //extract JWT from query parameter
    },
    async (token, done) => {
      try {
        return done(null, token.user); // if token is valid user details are passed to next middleware
      } catch (err) {
        done(err); // otherwise report error
      }
    }
  )
);
