const Reservation = require('../models/reservation');
const Property = require('../models/property');

exports.createReservation = async (req, res) => {
	const propertyId = res.app.get('propertyId');
	try {
		const today = new Date().toLocaleDateString();
		const reservation = new Reservation({
			dateStart: req.body.dateStart || today,
			dateEnd: req.body.dateEnd || today,
			guest: req.user.id,
			numberOfGuests: req.body.numberOfGuests,
			property: propertyId
		});
		await reservation.save();

		const property = await Property.findByIdAndUpdate(
			propertyId,
			{ $push: { reservations: reservation._id } },
			{ new: true }
		)
			.lean()
			.exec();

		res.status(201).json({ reservation, property });
	} catch (err) {
		res.status(409).json({ message: err.message });
	}
};

exports.createReservationById = async (req, res) => {
	try {
		const today = new Date().toLocaleDateString();
		const reservation = new Reservation({
			dateStart: req.body.dateStart || today,
			dateEnd: req.body.dateEnd || today,
			guest: req.user.id,
			numberOfGuests: req.body.numberOfGuests,
			property: req.params.id
		});

		await reservation.save();

		const property = await Property.findByIdAndUpdate(
			req.params.id,
			{ $push: { reservations: reservation._id } },
			{ new: true }
		)
			.lean()
			.exec();
		console.log(today);
		console.log(typeof today)
		res.status(201).json({ reservation, property });
	} catch (err) {
		res.status(409).json({ message: err.message });
	}
};
exports.getSingleReservation = async (req, res) => {
	try {
		const reservation = await Reservation.findById(req.params.id)
			.populate({
				path: 'property guest',
				populate: {
					path: 'amenities propertyType',
					select: '-__v -_id -properties'
				}
			})
			.lean()
			.exec();

		res.status(200).json(reservation);
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
};
exports.updateReservation = async (req, res) => {
	try {
		const today = new Date().toLocaleDateString();

		const reservation = await Reservation.findByIdAndUpdate(
			req.params.id,
			{
				dateStart: req.body.dateStart || today,
				dateEnd: req.body.dateEnd || today,
				numberOfGuests: req.body.numberOfGuests
			},
			{ new: true }
		)
			.lean()
			.exec();

		res.status(200).json(reservation);
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
};

exports.deleteReservation = async (req, res) => {
	try {
		const id = req.params.id;

		const reservation = await Reservation.findById(id).lean().exec();

		const property = await Property.findByIdAndUpdate(reservation.property, { $pull: { reservations: id}}).lean().exec();

		await Reservation.deleteOne({ _id: id }).lean().exec();

		res.json({ message: 'Reservation deleted successfully.' });
	} catch (err) {
		res.status(409).json({ message: err.message });
	}
};
