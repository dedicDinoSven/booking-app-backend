const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
	registrationValidator,
	loginValidator
} = require('../middleware/formValidators');
const user = require('../controllers/user');

router.post('/register', registrationValidator, user.register);

router.post('/login', loginValidator, user.login);

router.get(
	'/:id',
	passport.authenticate('jwt', { session: false }),
	user.getUserProfile
);

router.patch(
	'/:id',
	passport.authenticate('jwt', { session: false }),
	user.updateUserProfile
);

router.delete(
	'/:id',
	passport.authenticate('jwt', { session: false }),
	user.deleteUserProfile
);

router.get(
	'/logout',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		req.logout();
		res.json({ message: 'Logged out successfully.' });
	}
);

module.exports = router;
