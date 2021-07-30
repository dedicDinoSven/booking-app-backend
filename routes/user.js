const express = require('express');
const router = express.Router();
const {
	registrationValidator,
	loginValidator,
} = require('../middleware/formValidators');
const user = require('../controllers/user');

router.post('/register', registrationValidator, user.register);

router.post('/login', loginValidator, user.login);

router.get('/:id', user.getUserProfile);

router.patch('/:id', user.updateUserProfile);

router.delete('/:id', user.deleteUserProfile);

router.get('/logout', (req, res) => {
	req.logout();
	res.json({ message: 'Logged out successfully.' });
});

module.exports = router;
