const passport = require('passport');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const User = require('../models/user');
const Property = require('../models/property');
const Reservation = require('../models/reservation');

// handle post request for registration, when user sends post request to this route,
// passport authenticates user based on middleware in config/auth.js
exports.register = async (req, res, next) => {
	passport.authenticate(
		'register',
		{ session: false },
		async (err, user, info) => {
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
		}
	)(req, res, next);
};

exports.login = async (req, res, next) => {
	passport.authenticate(
		'login',
		{ session: false },
		async (err, user, info) => {
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
		}
	)(req, res, next);
};

exports.getUserProfile = async (req, res) => {
	try {
		const id = req.params.id;

		const user = await User.findOne({ _id: id }, '-__v').lean().exec();

		const properties = await Property.find({ host: id }, '-host -__v')
			.populate('propertyType', '-__v -_id')
			.populate('amenities', '-__v -_id -properties')
			.populate('reservations', '-__v')
			.lean()
			.exec();

		const reservations = await Reservation.find({ guest: id }, '-__v -guest')
			.populate({
				path: 'property',
				populate: {
					path: 'amenities propertyType',
					select: '-__v -_id -properties',
				},
			})
			.lean()
			.exec();

		res
			.status(200)
			.json({ user: user, properties: properties, reservations: reservations });
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
};

exports.updateUserProfile = async (req, res) => {
	try {
		const user = await User.findByIdAndUpdate(
			{ _id: req.params.id },
			req.body,
			{ new: true }
		)
			.lean()
			.exec();

		res.status(200).json(user);
	} catch (err) {
		res.status(409).json({ message: err.message });
	}
};

exports.deleteUserProfile = async (req, res) => {
	try {
		await User.deleteOne({ _id: req.params.id }).lean().exec();

		await Property.deleteMany({ host: req.params.id }).lean().exec();

		await Reservation.deleteMany({ guest: req.params. id }).lean().exec();

		res.status(200).json({ message: 'User deleted successfully.' });
	} catch (err) {
		res.status(409).json({ message: err.message });
	}
};
