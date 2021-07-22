const express = require('express');
const router = express.Router();

router.get('/test', (req, res, next) => {
	res.json({
		message: 'Secure route opened',
		user: req.user,
		token: req.query.secret_token,
	});
});

module.exports = router;
